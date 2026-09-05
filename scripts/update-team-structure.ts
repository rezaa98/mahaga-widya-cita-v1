import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";

const shouldApply = process.argv.includes("--apply");
const removableNames = ["sari dewi purnama", "ningrum aja"];
const managementNames = ["shellahvalsi", "brianldjumaty", "sikinmnor", "ramonaakhadiyah", "thatadebora"];
const canonicalNames = [
  { match: "shellahvalsi", id: "Shella H. Valsi, S.AP., M.AP", en: "Shella H. Valsi, S.AP., M.AP" },
  {
    match: "brianldjumaty",
    id: "Dr.(C) Brian L. Djumaty, S.Si., M.Si., C.Ed",
    en: "Dr.(C) Brian L. Djumaty, S.Si., M.Si., C.Ed",
  },
  { match: "sikinmnor", id: "Sikin M. Nor, SP., MM", en: "Sikin M. Nor, SP., MM" },
  { match: "ramonaakhadiyah", id: "Ramona Akhadiyah, S.AP", en: "Ramona Akhadiyah, S.AP" },
  { match: "thatadebora", id: "Thata Debora Agnesia, S.H.", en: "Thata Debora Agnesia, S.H." },
] as const;

const deboraProfile = {
  category: "management" as const,
  role: "Operations Manager",
  institution: "PT Mahaga Widya Cita",
  bio: "Thata Debora Agnesia serves as the Operations Manager of PT Mahaga Widya Cita, overseeing project operations, corporate administration, and organizational coordination. With a legal background, she ensures effective operational management, regulatory compliance, and seamless execution of consulting and research projects while supporting the company's commitment to professional and high-quality services.",
  order: 5,
};

const normalize = (value: unknown) => (typeof value === "string" ? value.trim().toLocaleLowerCase("id-ID") : "");
const identityKey = (value: unknown) => normalize(value).replace(/[^a-z0-9]/g, "");

async function run() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "team-members",
    locale: "id",
    fallbackLocale: "none",
    limit: 100,
    depth: 1,
    sort: "order",
  });

  const ramona = result.docs.find((member) => identityKey(member.name).includes("ramonaakhadiyah"));
  const debora = result.docs.find((member) => identityKey(member.name).includes("thatadebora"));
  const removals = result.docs.filter((member) => removableNames.some((name) => normalize(member.name).includes(name)));

  if (!ramona || !debora) {
    throw new Error(
      `Target validation failed: Ramona=${Boolean(ramona)}, Debora=${Boolean(debora)}, removals=${removals.length}`,
    );
  }

  const backupPath = join(tmpdir(), `mahaga-team-records-before-cleanup-${Date.now()}.json`);
  await writeFile(backupPath, JSON.stringify({ createdAt: new Date().toISOString(), docs: result.docs }, null, 2));
  console.log(
    JSON.stringify(
      {
        mode: shouldApply ? "apply" : "dry-run",
        backupPath,
        removals: removals.map((d) => ({ id: d.id, name: d.name })),
      },
      null,
      2,
    ),
  );

  if (!shouldApply) {
    await payload.destroy();
    return;
  }

  await payload.update({
    collection: "team-members",
    id: ramona.id,
    locale: "id",
    data: { category: "management", role: "Manager Operasional", order: 4 },
    context: { skipAutoTranslate: true },
  });
  await payload.update({
    collection: "team-members",
    id: ramona.id,
    locale: "en",
    data: { category: "management", role: "Operational Manager", order: 4 },
    context: { skipAutoTranslate: true },
  });
  await payload.update({
    collection: "team-members",
    id: debora.id,
    locale: "id",
    data: deboraProfile,
    context: { skipAutoTranslate: true },
  });
  await payload.update({
    collection: "team-members",
    id: debora.id,
    locale: "en",
    data: deboraProfile,
    context: { skipAutoTranslate: true },
  });

  for (const member of result.docs.filter(
    (item) =>
      item.id !== ramona.id &&
      item.id !== debora.id &&
      !removals.some((removal) => removal.id === item.id) &&
      !managementNames.some((name) => identityKey(item.name).includes(name)),
  )) {
    await payload.update({
      collection: "team-members",
      id: member.id,
      data: { category: "expert" },
      context: { skipAutoTranslate: true },
    });
  }

  for (const canonical of canonicalNames) {
    const member = result.docs.find((item) => identityKey(item.name).includes(canonical.match));
    if (!member) throw new Error(`Unable to find team member for canonical name: ${canonical.match}`);
    await payload.update({
      collection: "team-members",
      id: member.id,
      locale: "id",
      data: { name: canonical.id },
      context: { skipAutoTranslate: true },
    });
    await payload.update({
      collection: "team-members",
      id: member.id,
      locale: "en",
      data: { name: canonical.en },
      context: { skipAutoTranslate: true },
    });
  }

  for (const member of removals) {
    await payload.delete({ collection: "team-members", id: member.id });
  }

  const verification = await payload.find({
    collection: "team-members",
    locale: "id",
    fallbackLocale: "none",
    limit: 100,
    depth: 0,
    sort: "order",
  });
  console.log(
    JSON.stringify(
      {
        updated: true,
        total: verification.totalDocs,
        management: verification.docs
          .filter((member) => member.category === "management")
          .map((member) => ({ name: member.name, role: member.role })),
        experts: verification.docs
          .filter((member) => member.category === "expert")
          .map((member) => ({ name: member.name, role: member.role })),
      },
      null,
      2,
    ),
  );
  await payload.destroy();
}

await run();
