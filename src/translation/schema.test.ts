import assert from "node:assert/strict";
import test from "node:test";
import type { Field } from "payload";
import { changedLocalizedFields, createCandidate, extractTranslationUnits, mergeCandidateIntoTarget } from "./schema";

const fields: Field[] = [
  { name: "title", type: "text", localized: true },
  { name: "slug", type: "text" },
  { name: "status", type: "select", localized: true, options: ["draft", "published"] },
  { name: "content", type: "richText", localized: true },
  {
    name: "items",
    type: "array",
    localized: true,
    fields: [
      { name: "label", type: "text" },
      { name: "href", type: "text", localized: false },
    ],
  },
];

const source = {
  title: "Judul Indonesia",
  slug: "judul-indonesia",
  status: "published",
  content: {
    root: {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [{ type: "text", text: "Isi artikel", format: 0 }],
        },
      ],
    },
  },
  items: [{ id: "row-1", label: "Baca selengkapnya", href: "/artikel" }],
};

test("extracts only localized human text and Lexical text nodes", () => {
  const units = extractTranslationUnits(fields, source);
  assert.deepEqual(
    units.map(({ path, value }) => ({ path, value })),
    [
      { path: ["title"], value: "Judul Indonesia" },
      { path: ["content", "root", "children", 0, "children", 0, "text"], value: "Isi artikel" },
      { path: ["items", 0, "label"], value: "Baca selengkapnya" },
    ],
  );
  assert.equal(
    units.some((unit) => unit.path.includes("slug")),
    false,
  );
  assert.equal(
    units.some((unit) => unit.path.includes("status")),
    false,
  );
  assert.equal(
    units.some((unit) => unit.path.includes("type")),
    false,
  );
});

test("candidate merge preserves non-localized fields and Lexical structure", () => {
  const units = extractTranslationUnits(fields, source);
  const candidate = createCandidate(source, units, ["English title", "Article body", "Read more"]);
  const update = mergeCandidateIntoTarget(
    {
      ...source,
      title: "Existing manual title",
      slug: "judul-indonesia",
      items: [{ id: "row-1", label: "Existing label", href: "/artikel" }],
    },
    candidate,
  );

  assert.equal(update.title, "English title");
  assert.equal((update.content as typeof source.content).root.type, "root");
  assert.equal((update.content as typeof source.content).root.children[0].type, "paragraph");
  assert.equal((update.content as typeof source.content).root.children[0].children[0].text, "Article body");
  assert.equal((update.items as typeof source.items)[0].id, "row-1");
  assert.equal("slug" in update, false);
  assert.equal("status" in update, false);
});

test("detects changed localized field groups for manual locks", () => {
  const before = extractTranslationUnits(fields, source);
  const after = extractTranslationUnits(fields, { ...source, title: "Edited English title" });
  assert.deepEqual(changedLocalizedFields(before, after), ["title"]);
});
