import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { sql } from 'drizzle-orm';

export async function GET() {
  const payload = await getPayload({ config: configPromise });
  const db = payload.db as any;
  const drizzle = db.drizzle;
  const run = (q: string) => drizzle.execute(sql.raw(q));

  const tables = ['tentang_kami_stats_locales', 'tentang_kami_misi_locales', 'tentang_kami_core_values_locales', 'kontak_locales', 'footer_social_media_locales'];
  const schemas: Record<string, any> = {};

  for (const t of tables) {
    const s = await run(`SELECT column_name FROM information_schema.columns WHERE table_name = '${t}' ORDER BY ordinal_position`);
    schemas[t] = s.rows.map((r: any) => r.column_name);
    const sample = await run(`SELECT * FROM "${t}" LIMIT 1`);
    schemas[`${t}_sample`] = sample.rows;
  }
  return NextResponse.json(schemas);
}
