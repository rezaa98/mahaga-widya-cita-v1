import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { requireAdminAuth } from "@/utils/adminAuth";

export const dynamic = "force-dynamic";

const services = [
  {
    slug: "workforce-solutions",
    id: {
      title: "Manajemen Talenta",
      description:
        "Solusi strategis untuk pengelolaan talenta, pengembangan kompetensi, dan peningkatan kinerja organisasi.",
    },
    en: {
      title: "Talent Management",
      description:
        "Strategic solutions for talent management, competency development, and organizational performance improvement.",
    },
  },
  {
    slug: "technology-digital-solutions",
    id: {
      title: "Transformasi Digital",
      description:
        "Mendorong inovasi melalui digitalisasi proses bisnis dan implementasi solusi teknologi yang terintegrasi.",
    },
    en: {
      title: "Digital Transformation",
      description:
        "Driving innovation through business process digitalization and the implementation of integrated technology solutions.",
    },
  },
  {
    slug: "human-capital-development",
    id: {
      title: "Pengembangan SDM",
      description:
        "Membangun sumber daya manusia yang unggul melalui pelatihan, pendampingan, dan pengembangan kompetensi.",
    },
    en: {
      title: "Human Resource Development",
      description: "Building high-performing human resources through training, mentoring, and competency development.",
    },
  },
  {
    slug: "research-strategic-studies",
    id: {
      title: "Kajian Strategis",
      description: "Kajian berbasis data untuk mendukung kebijakan, perencanaan, dan keputusan strategis.",
    },
    en: {
      title: "Strategic Studies",
      description: "Data-driven studies to support policy formulation, planning, and strategic decision-making.",
    },
  },
  {
    slug: "tax-financial-advisory",
    id: {
      title: "Konsultasi Keuangan & Pajak",
      description: "Solusi keuangan dan perpajakan yang berorientasi pada kepatuhan, efisiensi, dan keberlanjutan.",
    },
    en: {
      title: "Financial & Tax Advisory",
      description: "Financial and tax solutions focused on compliance, efficiency, and sustainability.",
    },
  },
  {
    slug: "business-investment-advisory",
    id: {
      title: "Konsultasi Bisnis & Investasi",
      description: "Pendampingan profesional dalam perencanaan bisnis, investasi, dan pengembangan usaha.",
    },
    en: {
      title: "Business & Investment Advisory",
      description: "Professional guidance in business planning, investment, and business development.",
    },
  },
] as const;

export async function GET(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  const payload = await getPayload({ config: configPromise });

  try {
    const existing = await payload.find({ collection: "services", limit: 100, locale: "id" });
    const bySlug = new Map(existing.docs.map((service) => [service.slug, service]));
    const updated: string[] = [];

    for (const service of services) {
      const current = bySlug.get(service.slug);
      const idData = { title: service.id.title, tagline: service.id.description, description: service.id.description };

      const saved = current
        ? await payload.update({
            collection: "services",
            id: current.id,
            locale: "id",
            data: idData,
            context: { skipAutoTranslate: true },
          })
        : await payload.create({
            collection: "services",
            locale: "id",
            data: {
              slug: service.slug,
              ...idData,
              color: "var(--color-primary-600)",
              gradient: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
            },
            context: { skipAutoTranslate: true },
          });

      await payload.update({
        collection: "services",
        id: saved.id,
        locale: "en",
        data: {
          title: service.en.title,
          tagline: service.en.description,
          description: service.en.description,
        },
        context: { skipAutoTranslate: true },
      });
      updated.push(service.slug);
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
