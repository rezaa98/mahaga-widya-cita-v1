import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import configPromise from "@payload-config";
import { getPayload } from "payload";

const shouldApply = process.argv.includes("--apply");
const content = {
  id: {
    badge: "Your Next Move",
    title:
      "Kami membantu Anda melihat peluang, mengambil langkah yang tepat, dan mengembangkan potensi menjadi sesuatu yang bernilai.",
    description: "LET’S SEE WHAT’S POSSIBLE.",
  },
  en: {
    badge: "Your Next Move",
    title: "We help you identify opportunities, take the right steps, and develop potential into something of value.",
    description: "LET’S SEE WHAT’S POSSIBLE.",
  },
} as const;

async function run() {
  const payload = await getPayload({ config: configPromise });
  const before = await payload.findGlobal({ slug: "beranda", locale: "all", depth: 0 });
  const backupPath = join(tmpdir(), `mahaga-home-services-intro-${Date.now()}.json`);
  await writeFile(backupPath, JSON.stringify({ createdAt: new Date().toISOString(), before }, null, 2), "utf8");

  console.log(JSON.stringify({ mode: shouldApply ? "apply" : "dry-run", backupPath, content }, null, 2));
  if (!shouldApply) {
    await payload.destroy();
    return;
  }

  for (const locale of ["id", "en"] as const) {
    await payload.updateGlobal({
      slug: "beranda",
      locale,
      data: { servicesIntro: content[locale] },
      context: { skipAutoTranslate: true },
    });
  }

  const verified = await Promise.all(
    (["id", "en"] as const).map(async (locale) => {
      const page = await payload.findGlobal({ slug: "beranda", locale, fallbackLocale: "none", depth: 0 });
      return { locale, servicesIntro: page.servicesIntro };
    }),
  );
  console.log(JSON.stringify({ verified }, null, 2));
  await payload.destroy();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
