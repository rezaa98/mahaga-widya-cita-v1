import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

const newServices = [
  {
    title: 'GOVERNMENT CONSULTING',
    slug: 'government-consulting',
    tagline: 'Mendukung instansi pemerintah dalam perumusan kebijakan, perencanaan pembangunan, penguatan kelembagaan, dan tata kelola.',
    description: 'Mendukung instansi pemerintah dalam perumusan kebijakan, perencanaan pembangunan, penguatan kelembagaan, dan tata kelola.',
    features: [
      { feature: 'Public Policy' },
      { feature: 'Regional Planning' },
      { feature: 'Institutional Development' },
      { feature: 'RPJMD & Renstra' },
      { feature: 'AMDAL & Environmental Studies' },
      { feature: 'Socio-economic Assessment' },
    ]
  },
  {
    title: 'BUSINESS & INVESTMENT ADVISORY',
    slug: 'business-investment-advisory',
    tagline: 'Membantu bisnis mengidentifikasi peluang, mengevaluasi investasi dan mengembangkan strategi pertumbuhan berkelanjutan.',
    description: 'Membantu bisnis mengidentifikasi peluang, mengevaluasi investasi dan mengembangkan strategi pertumbuhan berkelanjutan.',
    features: [
      { feature: 'Feasibility Study' },
      { feature: 'Investment Analysis' },
      { feature: 'Business Planning' },
      { feature: 'Market Research' },
      { feature: 'Financial Feasibility' },
      { feature: 'Project Development' },
    ]
  },
  {
    title: 'TAX & FINANCIAL ADVISORY',
    slug: 'tax-financial-advisory',
    tagline: 'Memberikan solusi keuangan dan perpajakan praktis untuk meningkatkan kepatuhan dan kinerja bisnis.',
    description: 'Memberikan solusi keuangan dan perpajakan praktis untuk meningkatkan kepatuhan dan kinerja bisnis.',
    features: [
      { feature: 'Tax Compliance' },
      { feature: 'Tax Planning' },
      { feature: 'Financial Analysis' },
      { feature: 'Budget Planning' },
      { feature: 'Cost Analysis' },
      { feature: 'Financial Advisory' },
    ]
  },
  {
    title: 'RESEARCH & STRATEGIC STUDIES',
    slug: 'research-strategic-studies',
    tagline: 'Menyediakan riset dan kajian strategis yang andal sebagai dasar pengambilan keputusan yang tepat.',
    description: 'Menyediakan riset dan kajian strategis yang andal sebagai dasar pengambilan keputusan yang tepat.',
    features: [
      { feature: 'Policy Research' },
      { feature: 'Social Research' },
      { feature: 'Economic Studies' },
      { feature: 'Environmental Research' },
      { feature: 'Survey & Data Collection' },
      { feature: 'Impact Assessment' },
    ]
  },
  {
    title: 'HUMAN CAPITAL DEVELOPMENT',
    slug: 'human-capital-development',
    tagline: 'Mengembangkan kompetensi SDM melalui pelatihan, sertifikasi, pengembangan organisasi, dan pembangunan kapasitas.',
    description: 'Mengembangkan kompetensi SDM melalui pelatihan, sertifikasi, pengembangan organisasi, dan pembangunan kapasitas.',
    features: [
      { feature: 'Professional Training' },
      { feature: 'Certification Programs' },
      { feature: 'Leadership Development' },
      { feature: 'Capacity Building' },
      { feature: 'Organizational Development' },
      { feature: 'Competency Assessment' },
    ]
  },
  {
    title: 'TECHNOLOGY & DIGITAL SOLUTIONS',
    slug: 'technology-digital-solutions',
    tagline: 'Mendorong transformasi organisasi melalui teknologi dan solusi digital berbasis data.',
    description: 'Mendorong transformasi organisasi melalui teknologi dan solusi digital berbasis data.',
    features: [
      { feature: 'GIS & Remote Sensing' },
      { feature: 'Information Systems' },
      { feature: 'Business Digitalization' },
      { feature: 'Data Analytics' },
      { feature: 'AI Solutions' },
      { feature: 'Dashboard Development' },
    ]
  },
  {
    title: 'WORKFORCE SOLUTIONS',
    slug: 'workforce-solutions',
    tagline: 'Menyediakan tenaga profesional berkualitas untuk mendukung operasional instansi dan perusahaan.',
    description: 'Menyediakan tenaga profesional berkualitas untuk mendukung operasional instansi dan perusahaan.',
    features: [
      { feature: 'Professional Staffing' },
      { feature: 'Project-Based Personnel' },
      { feature: 'Technical Expert Supply' },
      { feature: 'Recruitment Services' },
      { feature: 'Outsourcing Solutions' },
      { feature: 'Workforce Management' },
    ]
  },
];

export async function GET() {
  const payload = await getPayload({ config: configPromise });

  try {
    const existingServices = await payload.find({
      collection: 'services',
      limit: 100,
    });

    // Delete existing
    for (const service of existingServices.docs) {
      await payload.delete({
        collection: 'services',
        id: service.id,
      });
    }

    // Insert new
    for (const service of newServices) {
      await payload.create({
        collection: 'services',
        data: service,
        context: { skipAutoTranslate: false }, // trigger translation in webhook!
      });
    }

    return NextResponse.json({ success: true, message: 'Services updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
