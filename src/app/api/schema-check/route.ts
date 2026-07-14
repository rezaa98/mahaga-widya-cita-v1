import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';

export async function GET() {
  const payload = await getPayload({ config: configPromise });
  const db = payload.db as any;
  const drizzle = db.drizzle;
  const run = (q: string) => drizzle.execute(sql.raw(q));
  const e = (s: string) => s.replace(/'/g, "''");
  const log: string[] = [];

  try {
    const servicesEnTranslations = [
      {
        id: 1, // konsultasi
        description: 'Strategic management consulting services designed to help government and private institutions design, implement, and evaluate effective and accountable governance systems.',
        tagline: 'Strategic Solutions for World-Class Government Governance',
      },
      {
        id: 2, // edukasi
        description: 'Executive education programs specifically designed for institution leaders and future leaders with active learning approaches, real case studies, and facilitation from top experts.',
        tagline: 'Exclusive Training Programs for Impactful Leaders',
      },
      {
        id: 3, // software
        description: 'Development of management information systems, applications, and digital infrastructure tailored to the specific needs of institutions, following government security and interoperability standards.',
        tagline: 'Adaptive Technology for Your Institution\'s Digital Transformation',
      },
      {
        id: 4, // governance-review
        description: 'Comprehensive review services for governance systems, regulatory compliance, and institutional risk management. Produces evidence-based recommendations for continuous improvement.',
        tagline: 'In-Depth Review for Transparent and Accountable Governance',
      },
      {
        id: 5, // online-course
        description: 'Interactive online course platform with hundreds of relevant educational material modules for civil servants and professionals. Equipped with quizzes, progress tracking, and automatic digital certificate issuance.',
        tagline: 'Learn Anytime, Anywhere, with Official Certification',
      },
      {
        id: 6, // digital-conference
        description: 'Organization of professional digital conferences, seminars, and discussion forums connecting experts, policy makers, and practitioners on one interactive platform.',
        tagline: 'High-Quality Discussion Forums, Reaching Thousands of Participants',
      },
    ];

    for (const s of servicesEnTranslations) {
      await run(`
        UPDATE services_locales 
        SET description = '${e(s.description)}', tagline = '${e(s.tagline)}'
        WHERE "_locale" = 'en' AND "_parent_id" = ${s.id}
      `);
      log.push(`✅ services EN id=${s.id} updated`);
    }

    // Also fix services_features and benefits EN locales if still in Indonesian
    const featuresEnCount = await run(`SELECT COUNT(*) as cnt FROM services_features_locales WHERE "_locale" = 'en'`);
    const benefitsEnCount = await run(`SELECT COUNT(*) as cnt FROM services_benefits_locales WHERE "_locale" = 'en'`);
    const targetAudienceEnCount = await run(`SELECT COUNT(*) as cnt FROM services_target_audience_locales WHERE "_locale" = 'en'`);
    
    log.push(`services_features EN: ${(featuresEnCount.rows[0] as any).cnt} rows`);
    log.push(`services_benefits EN: ${(benefitsEnCount.rows[0] as any).cnt} rows`);
    log.push(`services_target_audience EN: ${(targetAudienceEnCount.rows[0] as any).cnt} rows`);

    // Check sample of features EN to see if they're in Indonesian
    const sampleFeatures = await run(`SELECT title, "_parent_id" FROM services_features_locales WHERE "_locale" = 'en' LIMIT 5`);
    log.push(`features EN sample: ${JSON.stringify(sampleFeatures.rows)}`);

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, log, stack: error.stack?.slice(0, 500) });
  }
}
