import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { officialServiceContent } from "@/data/officialServiceContent";

const shouldApply = process.argv.includes("--apply") || process.env.MAHAGA_APPLY_SERVICE_BACKFILL === "1";

async function run() {
  const payload = await getPayload({ config: configPromise });
  const existing = await payload.find({ collection: "services", limit: 100, locale: "all", depth: 0 });
  const targets = officialServiceContent.map((service) => {
    const record = existing.docs.find((item) => item.slug === service.slug || item.slug === service.previousSlug);
    if (!record) throw new Error(`Service '${service.slug}' was not found.`);
    return { service, record };
  });
  const backupPath = join(tmpdir(), `mahaga-official-services-backup-${Date.now()}.json`);
  await writeFile(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), records: targets.map(({ record }) => record) }, null, 2),
    "utf8",
  );
  console.log(
    JSON.stringify({ mode: shouldApply ? "apply" : "dry-run", services: targets.length, backupPath }, null, 2),
  );
  if (!shouldApply) {
    await payload.destroy();
    return;
  }

  for (const { service, record } of targets) {
    const shared = {
      slug: service.slug,
      active: true,
      sortOrder: service.sortOrder,
      color: service.color,
      gradient: service.gradient,
    };
    await payload.update({
      collection: "services",
      id: record.id,
      locale: "id",
      data: { ...shared, ...service.id },
      context: { skipAutoTranslate: true },
    });
    await payload.update({
      collection: "services",
      id: record.id,
      locale: "en",
      data: { ...shared, ...service.en },
      context: { skipAutoTranslate: true },
    });
    const localizedRows = await payload.findByID({
      collection: "services",
      id: record.id,
      locale: "en",
      fallbackLocale: "none",
      depth: 0,
    });
    const withRowIDs = <T extends Record<string, unknown>>(
      items: T[],
      rows: { id?: string | null }[] | null | undefined,
    ) => items.map((item, index) => ({ ...item, ...(rows?.[index]?.id ? { id: rows[index].id } : {}) }));
    await payload.update({
      collection: "services",
      id: record.id,
      locale: "id",
      data: {
        ...shared,
        ...service.id,
        features: withRowIDs(service.id.features, localizedRows.features),
        benefits: withRowIDs(service.id.benefits, localizedRows.benefits),
        targetAudience: withRowIDs(service.id.targetAudience, localizedRows.targetAudience),
      },
      context: { skipAutoTranslate: true },
    });
  }

  const verification = await Promise.all(
    (["id", "en"] as const).flatMap((locale) =>
      officialServiceContent.map(async ({ slug }) => {
        const result = await payload.find({
          collection: "services",
          where: { slug: { equals: slug } },
          locale,
          fallbackLocale: "none",
          limit: 1,
          depth: 0,
        });
        const service = result.docs[0];
        return {
          locale,
          slug,
          title: service?.title,
          features: service?.features?.length ?? 0,
          describedFeatures: service?.features?.filter((item) => item.description).length ?? 0,
          describedBenefits: service?.benefits?.filter((item) => item.desc).length ?? 0,
          targetAudience: service?.targetAudience?.length ?? 0,
          active: service?.active,
          sortOrder: service?.sortOrder,
        };
      }),
    ),
  );
  console.log(JSON.stringify({ updated: true, verification }, null, 2));
  await payload.destroy();
}

await run();
