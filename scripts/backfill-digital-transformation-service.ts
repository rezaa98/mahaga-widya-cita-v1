import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getPayload } from "payload";
import configPromise from "@payload-config";

const slug = "technology-digital-solutions";
const shouldApply = process.argv.includes("--apply") || process.env.MAHAGA_APPLY_SERVICE_BACKFILL === "1";

const content = {
  id: {
    title: "Transformasi Digital",
    tagline: "Mengubah proses, data, dan teknologi menjadi kapabilitas bisnis yang terintegrasi.",
    description:
      "Kami mendampingi organisasi merancang dan menerapkan transformasi digital secara end-to-end, mulai dari pemetaan kebutuhan, penyusunan roadmap, pengembangan solusi, hingga evaluasi dampak.",
    features: [
      { feature: "GIS & Penginderaan Jauh" },
      { feature: "Pengembangan Sistem Informasi Terintegrasi" },
      { feature: "Digitalisasi dan Otomasi Proses Bisnis" },
      { feature: "Analitik Data dan Business Intelligence" },
      { feature: "Solusi Kecerdasan Artifisial" },
      { feature: "Pengembangan Dashboard Eksekutif" },
    ],
    benefits: [
      {
        title: "Efisiensi operasional",
        desc: "Menyederhanakan proses kerja dan mengurangi aktivitas manual yang berulang melalui otomasi yang tepat guna.",
      },
      {
        title: "Keputusan berbasis data",
        desc: "Mengubah data yang tersebar menjadi informasi yang konsisten, mudah dipahami, dan siap digunakan oleh pengambil keputusan.",
      },
      {
        title: "Integrasi antar sistem",
        desc: "Menghubungkan aplikasi dan sumber data untuk menciptakan alur informasi yang lebih aman dan terpadu.",
      },
      {
        title: "Solusi yang skalabel",
        desc: "Membangun fondasi teknologi yang dapat berkembang mengikuti kebutuhan, kapasitas, dan prioritas organisasi.",
      },
    ],
    targetAudience: [
      { audience: "Perusahaan dan grup usaha" },
      { audience: "Instansi pemerintah" },
      { audience: "BUMN dan BUMD" },
      { audience: "Institusi pendidikan" },
      { audience: "Organisasi dan lembaga nirlaba" },
    ],
  },
  en: {
    title: "Digital Transformation",
    tagline: "Turning processes, data, and technology into integrated business capabilities.",
    description:
      "We support organizations through end-to-end digital transformation, from needs assessment and roadmap development to solution delivery and impact evaluation.",
    features: [
      { feature: "GIS & Remote Sensing" },
      { feature: "Integrated Information Systems Development" },
      { feature: "Business Process Digitalization and Automation" },
      { feature: "Data Analytics and Business Intelligence" },
      { feature: "Artificial Intelligence Solutions" },
      { feature: "Executive Dashboard Development" },
    ],
    benefits: [
      {
        title: "Operational efficiency",
        desc: "Streamline workflows and reduce repetitive manual work through purposeful automation.",
      },
      {
        title: "Data-driven decisions",
        desc: "Turn fragmented data into consistent, understandable, and decision-ready information.",
      },
      {
        title: "Connected systems",
        desc: "Connect applications and data sources to create a safer and more integrated flow of information.",
      },
      {
        title: "Scalable solutions",
        desc: "Build a technology foundation that can evolve with the organization’s needs, capacity, and priorities.",
      },
    ],
    targetAudience: [
      { audience: "Companies and business groups" },
      { audience: "Government institutions" },
      { audience: "State-owned and regional enterprises" },
      { audience: "Educational institutions" },
      { audience: "Organizations and nonprofit institutions" },
    ],
  },
};

async function run() {
  const payload = await getPayload({ config: configPromise });
  const [idResult, enResult] = await Promise.all([
    payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale: "id",
      fallbackLocale: "none",
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale: "en",
      fallbackLocale: "none",
      limit: 1,
      depth: 0,
    }),
  ]);
  const currentId = idResult.docs[0];
  const currentEn = enResult.docs[0];
  if (!currentId) throw new Error(`Service '${slug}' was not found.`);

  const backupPath = join(tmpdir(), `mahaga-service-${slug}-backup-${Date.now()}.json`);
  await writeFile(
    backupPath,
    JSON.stringify({ createdAt: new Date().toISOString(), id: currentId, en: currentEn }, null, 2),
    "utf8",
  );
  console.log(
    JSON.stringify({ mode: shouldApply ? "apply" : "dry-run", serviceId: currentId.id, slug, backupPath }, null, 2),
  );
  if (!shouldApply) return;

  await payload.update({
    collection: "services",
    id: currentId.id,
    locale: "id",
    data: content.id,
    context: { skipAutoTranslate: true },
  });
  await payload.update({
    collection: "services",
    id: currentId.id,
    locale: "en",
    data: content.en,
    context: { skipAutoTranslate: true },
  });

  const verification = await Promise.all(
    (["id", "en"] as const).map(async (locale) => {
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
        title: service?.title,
        features: service?.features?.length ?? 0,
        benefits: service?.benefits?.length ?? 0,
        targetAudience: service?.targetAudience?.length ?? 0,
      };
    }),
  );
  console.log(JSON.stringify({ updated: true, verification }, null, 2));
}

await run();
