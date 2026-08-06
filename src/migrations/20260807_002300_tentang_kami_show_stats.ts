import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tentang_kami"
      ADD COLUMN IF NOT EXISTS "visibility_show_stats" boolean DEFAULT false;
  `);

  await db.execute(sql`
    UPDATE "tentang_kami"
    SET "visibility_show_stats" = false
    WHERE "visibility_show_stats" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tentang_kami"
      DROP COLUMN IF EXISTS "visibility_show_stats";
  `);
}
