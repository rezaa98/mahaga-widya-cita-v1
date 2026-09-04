import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import configPromise from "@payload-config";
import { getPayload } from "payload";

const shouldApply = process.argv.includes("--apply");
const removableNames = ["sari dewi purnama", "ningrum aja"];
const managementNames = ["shella h. valsi", "brian l.djumaty", "sikin m.nor", "ramona akhadiyah"];

const normalize = (value: unknown) => (typeof value === "string" ? value.trim().toLocaleLowerCase("id-ID") : "");

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

  const ramona = result.docs.find((member) => normalize(member.name).includes("ramona akhadiyah"));
  const debora = result.docs.find((member) => normalize(member.name).includes("thata debora"));
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
    data: { category: "expert", role: "Supervisor", order: 5 },
    context: { skipAutoTranslate: true },
  });
  await payload.update({
    collection: "team-members",
    id: debora.id,
    locale: "en",
    data: { category: "expert", role: "Supervisor", order: 5 },
    context: { skipAutoTranslate: true },
  });

  for (const member of result.docs.filter(
    (item) =>
      item.id !== ramona.id &&
      item.id !== debora.id &&
      !removals.some((removal) => removal.id === item.id) &&
      !managementNames.some((name) => normalize(item.name).includes(name)),
  )) {
    await payload.update({
      collection: "team-members",
      id: member.id,
      data: { category: "expert" },
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
