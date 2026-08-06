import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "translation_records"
      ADD COLUMN IF NOT EXISTS "candidate_history" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS "reviewed_fields" jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS "audit_log" jsonb DEFAULT '[]'::jsonb;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "translation_records"
      DROP COLUMN IF EXISTS "audit_log",
      DROP COLUMN IF EXISTS "reviewed_fields",
      DROP COLUMN IF EXISTS "candidate_history";
  `);
}
