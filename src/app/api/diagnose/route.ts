import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { sql } from "drizzle-orm";
import { requireAdminAuth } from "@/utils/adminAuth";

export async function GET(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;
  const payload = await getPayload({ config: configPromise });
  const db = payload.db as any;
  const drizzle = db.drizzle;
  const run = (q: string) => drizzle.execute(sql.raw(q));
  const e = (s: string) => s.replace(/'/g, "''");
  const log: string[] = [];

  try {
    // ============================================================
    // FIX 1: beranda_locales EN - update remaining Indonesian fields
    // ============================================================
    await run(`
      UPDATE beranda_locales SET
        hero_badge = 'Trusted Education & Governance Platform Since 2015',
        hero_title = 'Education &',
        hero_title_highlight = 'Governance',
        hero_title_suffix = 'Platform for Indonesian Professionals',
        hero_description = 'Enhance your institution''s human resource competency and governance through high-quality education programs, consulting, and webinars with Indonesia''s top experts.',
        partners_title = 'Trusted by More Than 200 Institutions and Strategic Partners'
      WHERE "_locale" = 'en' AND "_parent_id" = 1
    `);
    log.push("✅ beranda_locales EN: hero fields updated");

    // ============================================================
    // FIX 2: beranda_stats_locales EN - update Indonesian labels
    // ============================================================
    const berandaStats = await run(`SELECT id, _order FROM beranda_stats ORDER BY _order ASC`);
    const statsRows = berandaStats.rows as any[];
    const statsEnLabels = ["Webinar Sessions", "Registered Participants", "Partner Institutions", "Strategic Partners"];
    for (let i = 0; i < statsRows.length && i < statsEnLabels.length; i++) {
      await run(
        `UPDATE beranda_stats_locales SET label = '${e(statsEnLabels[i])}' WHERE "_locale" = 'en' AND "_parent_id" = '${statsRows[i].id}'`,
      );
    }
    log.push(`✅ beranda_stats_locales EN: ${statsRows.length} labels updated`);

    // ============================================================
    // FIX 3: beranda_hero_features_locales EN - update Indonesian text
    // ============================================================
    const heroFeatures = await run(`SELECT id FROM beranda_hero_features ORDER BY _order ASC`);
    const heroFeatRows = heroFeatures.rows as any[];
    const heroFeatEnData = ["Official Digital Certificate", "Free Monthly Webinar", "500+ Educational Materials"];
    for (let i = 0; i < heroFeatRows.length && i < heroFeatEnData.length; i++) {
      await run(
        `UPDATE beranda_hero_features_locales SET text = '${e(heroFeatEnData[i])}' WHERE "_locale" = 'en' AND "_parent_id" = '${heroFeatRows[i].id}'`,
      );
    }
    log.push(`✅ beranda_hero_features_locales EN: ${heroFeatRows.length} items updated`);

    // ============================================================
    // FIX 4: beranda_partners_list_locales EN - update remaining Indonesian names
    // ============================================================
    const partnersList = await run(`SELECT id, _order FROM beranda_partners_list ORDER BY _order ASC`);
    const partnersRows = partnersList.rows as any[];
    const partnersEnData = [
      { id_name: "Kementerian PAN-RB", en_name: "Ministry of Administrative Reform (PAN-RB)" },
      { id_name: "BKN", en_name: "National Civil Service Agency (BKN)" },
      { id_name: "BPKP", en_name: "Financial and Development Supervisory Board (BPKP)" },
      { id_name: "LAN RI", en_name: "National Institute of Public Administration (LAN RI)" },
      { id_name: "Setjen DPR RI", en_name: "Secretariat General of DPR RI" },
      { id_name: "Bappenas", en_name: "National Development Planning Agency (Bappenas)" },
      { id_name: "Kemendagri", en_name: "Ministry of Home Affairs" },
      { id_name: "Kemenkeu", en_name: "Ministry of Finance" },
      { id_name: "KemenPUPR", en_name: "Ministry of Public Works and Housing" },
      { id_name: "Ombudsman RI", en_name: "Ombudsman of the Republic of Indonesia" },
    ];
    // Check current EN names and update only the Indonesian ones
    for (let i = 0; i < partnersRows.length && i < partnersEnData.length; i++) {
      const enName = partnersEnData[i].en_name;
      await run(
        `UPDATE beranda_partners_list_locales SET name = '${e(enName)}' WHERE "_locale" = 'en' AND "_parent_id" = '${partnersRows[i].id}'`,
      );
    }
    log.push(`✅ beranda_partners_list_locales EN: ${partnersRows.length} items updated`);

    // ============================================================
    // FIX 5: beranda_cta_features_locales EN - update if Indonesian
    // ============================================================
    const ctaFeatures = await run(`SELECT id FROM beranda_cta_features ORDER BY _order ASC`);
    const ctaFeatRows = ctaFeatures.rows as any[];
    const ctaFeatEnData = ["Response within 24 Hours", "Free Initial Consultation", "Experienced Team 10+ Years"];
    for (let i = 0; i < ctaFeatRows.length && i < ctaFeatEnData.length; i++) {
      // Insert if not exists, else update
      const existing = await run(
        `SELECT id FROM beranda_cta_features_locales WHERE "_locale" = 'en' AND "_parent_id" = '${ctaFeatRows[i].id}'`,
      );
      if ((existing.rows as any[]).length > 0) {
        await run(
          `UPDATE beranda_cta_features_locales SET text = '${e(ctaFeatEnData[i])}' WHERE "_locale" = 'en' AND "_parent_id" = '${ctaFeatRows[i].id}'`,
        );
      } else {
        await run(
          `INSERT INTO beranda_cta_features_locales (text, "_locale", "_parent_id") VALUES ('${e(ctaFeatEnData[i])}', 'en', '${ctaFeatRows[i].id}')`,
        );
      }
    }
    log.push(`✅ beranda_cta_features_locales EN: ${ctaFeatRows.length} items upserted`);

    // ============================================================
    // FIX 6: tentang_kami_stats_locales EN - update labels
    // ============================================================
    const tkStats = await run(`SELECT id FROM tentang_kami_stats ORDER BY _order ASC`);
    const tkStatsRows = tkStats.rows as any[];
    const tkStatsEnLabels = [
      "Clients & Partners",
      "Experts",
      "Projects & Studies",
      "Service Coverage",
      "Trusted by Government & Private",
    ];
    for (let i = 0; i < tkStatsRows.length && i < tkStatsEnLabels.length; i++) {
      await run(
        `UPDATE tentang_kami_stats_locales SET label = '${e(tkStatsEnLabels[i])}' WHERE "_locale" = 'en' AND "_parent_id" = '${tkStatsRows[i].id}'`,
      );
    }
    log.push(`✅ tentang_kami_stats_locales EN: ${tkStatsRows.length} labels updated`);

    // ============================================================
    // FIX 7: beranda_hero_features_locales EN - insert if missing
    // ============================================================
    // Check if they exist at all
    const heroFeatCount = await run(`SELECT COUNT(*) as cnt FROM beranda_hero_features_locales WHERE "_locale" = 'en'`);
    log.push(`beranda_hero_features_locales EN count: ${(heroFeatCount.rows[0] as any).cnt}`);

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error("[diagnose] Error:", error);
    return NextResponse.json({ error: "Internal server error", log }, { status: 500 });
  }
}
