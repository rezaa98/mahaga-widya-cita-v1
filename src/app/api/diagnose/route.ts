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
    // ============================================================
    // 1. tentang_kami_stats_locales - only has "label" column
    // ============================================================
    const tkStats = await run(`SELECT id FROM tentang_kami_stats ORDER BY _order ASC`);
    const tkStatsRows = tkStats.rows as any[];
    const tkStatsLabels = ['Klien & Mitra', 'Tenaga Ahli', 'Proyek dan Studi', 'Cakupan Layanan', 'Dipercaya Pemerintah & Swasta'];
    await run(`DELETE FROM tentang_kami_stats_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < tkStatsRows.length && i < tkStatsLabels.length; i++) {
      await run(`INSERT INTO tentang_kami_stats_locales (label, "_locale", "_parent_id") VALUES ('${e(tkStatsLabels[i])}', 'id', '${tkStatsRows[i].id}')`);
    }
    log.push(`✅ tentang_kami_stats_locales: ${tkStatsRows.length} rows`);

    // ============================================================
    // 2. tentang_kami_misi_locales
    // ============================================================
    const tkMisi = await run(`SELECT id FROM tentang_kami_misi ORDER BY _order ASC`);
    const tkMisiRows = tkMisi.rows as any[];
    const tkMisiData = [
      { title: 'Memberikan Solusi Strategis', text: 'Menyediakan layanan konsultasi terintegrasi yang menghasilkan solusi praktis, terukur, dan berkelanjutan bagi pemerintah, dunia usaha, dan berbagai institusi.' },
      { title: 'Mendorong Pengambilan Keputusan Berbasis Data', text: 'Mendukung penyusunan kebijakan dan strategi bisnis melalui riset berkualitas, analisis data, serta kajian strategis yang komprehensif.' },
      { title: 'Mengembangkan Sumber Daya Manusia', text: 'Meningkatkan kapasitas organisasi melalui pengembangan kompetensi, pelatihan profesional, konsultasi SDM, dan penyediaan tenaga profesional.' },
      { title: 'Mempercepat Transformasi Digital', text: 'Mendorong peningkatan efisiensi, tata kelola, dan kualitas layanan melalui penerapan teknologi dan inovasi digital.' },
      { title: 'Membangun Kemitraan Jangka Panjang', text: 'Menjalin hubungan kerja yang dilandasi integritas, profesionalisme, akuntabilitas, dan kolaborasi untuk menciptakan keberhasilan bersama.' },
      { title: 'Menciptakan Dampak Berkelanjutan', text: 'Menghasilkan solusi yang memberikan manfaat ekonomi, sosial, dan lingkungan secara berkelanjutan bagi klien dan masyarakat.' },
    ];
    await run(`DELETE FROM tentang_kami_misi_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < tkMisiRows.length && i < tkMisiData.length; i++) {
      const d = tkMisiData[i];
      await run(`INSERT INTO tentang_kami_misi_locales (title, text, "_locale", "_parent_id") VALUES ('${e(d.title)}', '${e(d.text)}', 'id', '${tkMisiRows[i].id}')`);
    }
    log.push(`✅ tentang_kami_misi_locales: ${tkMisiRows.length} rows`);

    // ============================================================
    // 3. tentang_kami_core_values_locales
    // ============================================================
    const tkCV = await run(`SELECT id FROM tentang_kami_core_values ORDER BY _order ASC`);
    const tkCVRows = tkCV.rows as any[];
    const tkCVData = [
      { letter: 'F', name: 'Foresight', desc: 'Berpikir Jauh Ke Depan, Merancang Masa Depan Pembangunan.' },
      { letter: 'U', name: 'Unit', desc: 'Mengutamakan Kerja Sama Lintas Sektor Dan Pemangku Kepentingan.' },
      { letter: 'T', name: 'Transformation', desc: 'Mendorong Perubahan Nyata Melalui Pemberdayaan Dan Pengembangan.' },
      { letter: 'U', name: 'Understanding', desc: 'Memahami Kebutuhan Masyarakat Dan Dinamika Daerah Secara Mendalam.' },
      { letter: 'R', name: 'Responsibility', desc: 'Bertindak Dengan Tanggung Jawab Dan Komitmen Terhadap Hasil.' },
      { letter: 'I', name: 'Integrity', desc: 'Menjaga Kejujuran, Etika, Dan Akuntabilitas Dalam Setiap Langkah.' },
      { letter: 'S', name: 'Sustainability', desc: 'Berorientasi Pada Dampak Jangka Panjang Dan Berkelanjutan.' },
      { letter: 'T', name: 'Technology', desc: 'Memanfaatkan Teknologi Untuk Tata Kelola Dan Perencanaan Yang Lebih Baik.' },
      { letter: 'I', name: 'Innovation', desc: 'Terus Berinovasi Untuk Menjawab Tantangan Masa Kini Dan Mendatang.' },
      { letter: 'C', name: 'Collaboration', desc: 'Membangun Sinergi Dengan Masyarakat, Pemerintah, Dan Mitra Profesional.' },
    ];
    await run(`DELETE FROM tentang_kami_core_values_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < tkCVRows.length && i < tkCVData.length; i++) {
      const d = tkCVData[i];
      await run(`INSERT INTO tentang_kami_core_values_locales (letter, name, "desc", "_locale", "_parent_id") VALUES ('${e(d.letter)}', '${e(d.name)}', '${e(d.desc)}', 'id', '${tkCVRows[i].id}')`);
    }
    log.push(`✅ tentang_kami_core_values_locales: ${tkCVRows.length} rows`);

    // ============================================================
    // 4. kontak_locales - Indonesian version
    // ============================================================
    await run(`DELETE FROM kontak_locales WHERE "_locale" = 'id'`);
    await run(`INSERT INTO kontak_locales (
      hero_title, hero_subtitle, phone, address, working_hours, location_tag,
      whatsapp_cta_title, whatsapp_cta_subtitle, whatsapp_cta_default_message,
      "_locale", "_parent_id"
    ) VALUES (
      'Mari Berkolaborasi Bersama Kami',
      'Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda. Respons dalam 1×24 jam kerja.',
      '082 332 567 816',
      'Jalan Iskandar RT 008 RW 000 Madurejo, Arut Selatan, Kab Kotawaringin Barat, Kalimantan Tengah',
      'Senin – Jumat, 08.00 – 17.00 WIB',
      'Pangkalan Bun, Kalimantan Tengah',
      'Chat via WhatsApp',
      'Respons lebih cepat, langsung ke tim kami',
      'Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.',
      'id',
      1
    )`);
    log.push(`✅ kontak_locales: 1 row`);

    // ============================================================
    // 5. footer_social_media_locales - url for id locale
    // ============================================================
    const fsm = await run(`SELECT id FROM footer_social_media ORDER BY _order ASC`);
    const fsmRows = fsm.rows as any[];
    await run(`DELETE FROM footer_social_media_locales WHERE "_locale" = 'id'`);
    for (const row of fsmRows as any[]) {
      await run(`INSERT INTO footer_social_media_locales (url, "_locale", "_parent_id") VALUES ('#', 'id', '${row.id}')`);
    }
    log.push(`✅ footer_social_media_locales: ${fsmRows.length} rows`);

    // ============================================================
    // 6. beranda_stats_locales
    // ============================================================
    const berandaStatsSchema = await run(`SELECT column_name FROM information_schema.columns WHERE table_name = 'beranda_stats_locales'`);
    const berandaStatsCols = berandaStatsSchema.rows.map((r: any) => r.column_name);
    log.push(`beranda_stats_locales cols: ${berandaStatsCols.join(', ')}`);
    
    const berandaStats = await run(`SELECT id FROM beranda_stats ORDER BY _order ASC`);
    const berandaStatsRows = berandaStats.rows as any[];
    const berandaStatsIdData = [
      { suffix: '+', label: 'Sesi Webinar' },
      { suffix: '+', label: 'Peserta Terdaftar' },
      { suffix: '+', label: 'Instansi Mitra' },
      { suffix: '+', label: 'Mitra Strategis' },
    ];
    await run(`DELETE FROM beranda_stats_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < berandaStatsRows.length && i < berandaStatsIdData.length; i++) {
      const d = berandaStatsIdData[i];
      const hasSuffix = berandaStatsCols.includes('suffix');
      if (hasSuffix) {
        await run(`INSERT INTO beranda_stats_locales (suffix, label, "_locale", "_parent_id") VALUES ('${e(d.suffix)}', '${e(d.label)}', 'id', '${berandaStatsRows[i].id}')`);
      } else {
        await run(`INSERT INTO beranda_stats_locales (label, "_locale", "_parent_id") VALUES ('${e(d.label)}', 'id', '${berandaStatsRows[i].id}')`);
      }
    }
    log.push(`✅ beranda_stats_locales: ${berandaStatsRows.length} rows`);

    // ============================================================
    // 7. beranda_hero_features_locales
    // ============================================================
    const heroFeatures = await run(`SELECT id FROM beranda_hero_features ORDER BY _order ASC`);
    const heroFeatRows = heroFeatures.rows as any[];
    const heroFeatData = ['Konsultan Berpengalaman', 'Solusi Berbasis Data', 'Dukungan Penuh'];
    await run(`DELETE FROM beranda_hero_features_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < heroFeatRows.length && i < heroFeatData.length; i++) {
      await run(`INSERT INTO beranda_hero_features_locales (text, "_locale", "_parent_id") VALUES ('${e(heroFeatData[i])}', 'id', '${heroFeatRows[i].id}')`);
    }
    log.push(`✅ beranda_hero_features_locales: ${heroFeatRows.length} rows`);

    // ============================================================
    // 8. beranda_cta_features_locales
    // ============================================================
    const ctaFeatures = await run(`SELECT id FROM beranda_cta_features ORDER BY _order ASC`);
    const ctaFeatRows = ctaFeatures.rows as any[];
    const ctaFeatData = ['Respons dalam 24 Jam', 'Konsultasi Awal Gratis', 'Tim Berpengalaman 10+ Tahun'];
    await run(`DELETE FROM beranda_cta_features_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < ctaFeatRows.length && i < ctaFeatData.length; i++) {
      await run(`INSERT INTO beranda_cta_features_locales (text, "_locale", "_parent_id") VALUES ('${e(ctaFeatData[i])}', 'id', '${ctaFeatRows[i].id}')`);
    }
    log.push(`✅ beranda_cta_features_locales: ${ctaFeatRows.length} rows`);

    // ============================================================
    // 9. beranda_partners_list_locales
    // ============================================================
    const partnersList = await run(`SELECT id FROM beranda_partners_list ORDER BY _order ASC`);
    const partnersRows = partnersList.rows as any[];
    const partnersData = [
      'Kementerian PAN-RB', 'BKN', 'BPKP', 'LAN RI', 'Setjen DPR RI',
      'Bappenas', 'Kemendagri', 'Kemenkeu', 'KemenPUPR', 'Ombudsman RI'
    ];
    await run(`DELETE FROM beranda_partners_list_locales WHERE "_locale" = 'id'`);
    for (let i = 0; i < partnersRows.length && i < partnersData.length; i++) {
      await run(`INSERT INTO beranda_partners_list_locales (name, "_locale", "_parent_id") VALUES ('${e(partnersData[i])}', 'id', '${partnersRows[i].id}')`);
    }
    log.push(`✅ beranda_partners_list_locales: ${partnersRows.length} rows`);

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, log, stack: error.stack?.slice(0, 500) });
  }
}
