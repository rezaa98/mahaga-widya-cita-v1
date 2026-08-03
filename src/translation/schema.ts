import { createHash } from "node:crypto";
import type { Field, Payload } from "payload";
import type { TranslationCandidate, TranslationPatch, TranslationResourceType } from "./types";

type PathPart = number | string;

export type TranslationUnit = {
  fieldPath: string;
  lexicalRootPath?: PathPart[];
  path: PathPart[];
  value: string;
};

function getAtPath(value: unknown, path: PathPart[]): unknown {
  let current = value as any;
  for (const part of path) {
    if (current == null) return undefined;
    current = current[part];
  }
  return current;
}

function setAtPath(target: any, path: PathPart[], value: unknown): void {
  if (!path.length) throw new Error("Cannot write an empty translation path.");
  let current = target;
  for (let index = 0; index < path.length - 1; index += 1) {
    const part = path[index];
    const nextPart = path[index + 1];
    if (current[part] == null || typeof current[part] !== "object") {
      current[part] = typeof nextPart === "number" ? [] : {};
    }
    current = current[part];
  }
  current[path[path.length - 1]] = value;
}

function formatPath(path: PathPart[]): string {
  return path.reduce<string>((result, part) => {
    if (typeof part === "number") return `${result}[${part}]`;
    return result ? `${result}.${part}` : part;
  }, "");
}

function containsHumanText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && /\p{L}/u.test(value);
}

function extractLexicalText(value: unknown, rootPath: PathPart[], units: TranslationUnit[]): void {
  const walk = (node: unknown, relativePath: PathPart[]): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, [...relativePath, index]));
      return;
    }
    if (!node || typeof node !== "object") return;

    for (const [key, child] of Object.entries(node)) {
      if (key === "text" && containsHumanText(child)) {
        units.push({
          fieldPath: formatPath(rootPath),
          lexicalRootPath: rootPath,
          path: [...rootPath, ...relativePath, key],
          value: child,
        });
      } else if (typeof child === "object") {
        walk(child, [...relativePath, key]);
      }
    }
  };

  walk(value, []);
}

function subFields(field: any): Field[] {
  return Array.isArray(field?.fields) ? field.fields : [];
}

function resolvedLocalized(field: any, inherited: boolean): boolean {
  if (field?.localized === false) return false;
  return inherited || field?.localized === true;
}

function walkFields(
  fields: Field[],
  document: unknown,
  units: TranslationUnit[],
  basePath: PathPart[] = [],
  inheritedLocalized = false,
): void {
  for (const field of fields as any[]) {
    if (!field || typeof field !== "object") continue;

    if (field.type === "tabs") {
      for (const tab of field.tabs || []) {
        const tabPath = tab.name ? [...basePath, tab.name] : basePath;
        walkFields(tab.fields || [], document, units, tabPath, resolvedLocalized(tab, inheritedLocalized));
      }
      continue;
    }

    if (field.type === "row" || field.type === "collapsible") {
      walkFields(subFields(field), document, units, basePath, inheritedLocalized);
      continue;
    }

    if (field.type === "blocks" && field.name) {
      const blocks = getAtPath(document, [...basePath, field.name]);
      if (!Array.isArray(blocks)) continue;
      blocks.forEach((block, index) => {
        const blockConfig = (field.blocks || []).find((candidate: any) => candidate.slug === block?.blockType);
        if (blockConfig) {
          walkFields(
            blockConfig.fields || [],
            document,
            units,
            [...basePath, field.name, index],
            resolvedLocalized(field, inheritedLocalized),
          );
        }
      });
      continue;
    }

    if (!field.name) continue;
    const path = [...basePath, field.name];
    const localized = resolvedLocalized(field, inheritedLocalized);

    if (field.type === "group") {
      walkFields(subFields(field), document, units, path, localized);
      continue;
    }

    if (field.type === "array") {
      const rows = getAtPath(document, path);
      if (!Array.isArray(rows)) continue;
      rows.forEach((_, index) => walkFields(subFields(field), document, units, [...path, index], localized));
      continue;
    }

    const value = getAtPath(document, path);
    if (!localized) continue;

    if ((field.type === "text" || field.type === "textarea") && containsHumanText(value)) {
      units.push({ fieldPath: formatPath(path), path, value });
    } else if (field.type === "richText" && value) {
      extractLexicalText(value, path, units);
    }
  }
}

export function extractTranslationUnits(fields: Field[], document: unknown): TranslationUnit[] {
  const units: TranslationUnit[] = [];
  walkFields(fields, document, units);
  return units;
}

export function sourceHash(units: TranslationUnit[]): string {
  const stable = units.map(({ fieldPath, path, value }) => ({ fieldPath, path, value }));
  return createHash("sha256").update(JSON.stringify(stable)).digest("hex");
}

export function changedLocalizedFields(previous: TranslationUnit[], current: TranslationUnit[]): string[] {
  const group = (units: TranslationUnit[]) => {
    const values = new Map<string, string[]>();
    for (const unit of units) values.set(unit.fieldPath, [...(values.get(unit.fieldPath) || []), unit.value]);
    return values;
  };
  const before = group(previous);
  const after = group(current);
  return [...new Set([...before.keys(), ...after.keys()])].filter(
    (path) => JSON.stringify(before.get(path) || []) !== JSON.stringify(after.get(path) || []),
  );
}

export function createCandidate(
  sourceDocument: unknown,
  units: TranslationUnit[],
  translations: string[],
): TranslationCandidate {
  if (units.length !== translations.length) throw new Error("Translation output count does not match source units.");

  const patches: TranslationPatch[] = [];
  const lexicalDocuments = new Map<string, { path: PathPart[]; value: any }>();

  units.forEach((unit, index) => {
    if (!unit.lexicalRootPath) {
      patches.push({ fieldPath: unit.fieldPath, path: unit.path, value: translations[index] });
      return;
    }

    let lexical = lexicalDocuments.get(unit.fieldPath);
    if (!lexical) {
      lexical = {
        path: unit.lexicalRootPath,
        value: structuredClone(getAtPath(sourceDocument, unit.lexicalRootPath)),
      };
      lexicalDocuments.set(unit.fieldPath, lexical);
    }
    setAtPath(lexical.value, unit.path.slice(unit.lexicalRootPath.length), translations[index]);
  });

  for (const [fieldPath, lexical] of lexicalDocuments) {
    patches.push({ fieldPath, path: lexical.path, value: lexical.value });
  }
  return { patches };
}

function containerFor(next: PathPart | undefined): any {
  return typeof next === "number" ? [] : {};
}

export function mergeCandidateIntoTarget(
  targetDocument: any,
  candidate: TranslationCandidate,
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {};
  const initialized = new Set<string>();

  for (const patch of candidate.patches) {
    const root = String(patch.path[0]);
    if (!initialized.has(root)) {
      const targetRoot = targetDocument?.[root];
      updateData[root] = targetRoot == null ? containerFor(patch.path[1]) : structuredClone(targetRoot);
      initialized.add(root);
    }
    if (patch.path.length === 1) updateData[root] = patch.value;
    else setAtPath(updateData, patch.path, patch.value);
  }

  return updateData;
}

export function fieldsForResource(
  payload: Payload,
  resourceType: TranslationResourceType,
  identifier: string,
): Field[] {
  const config =
    resourceType === "global"
      ? payload.config.globals?.find((global) => global.slug === identifier)
      : payload.config.collections?.find((collection) => collection.slug === identifier);
  if (!config) throw new Error(`Unknown ${resourceType} translation resource: ${identifier}`);
  return config.fields;
}
