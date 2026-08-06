import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "beranda_locales"
      ADD COLUMN IF NOT EXISTS "team_intro_title" varchar DEFAULT 'Manajemen Perusahaan',
      ADD COLUMN IF NOT EXISTS "team_intro_description" varchar DEFAULT 'Profesional yang mengedepankan strategi, tata kelola, dan inovasi untuk menghadirkan nilai bagi setiap klien.';
  `);

  await db.execute(sql`
    UPDATE "beranda_locales"
    SET
      "team_intro_title" = COALESCE(NULLIF("team_intro_title", ''), 'Manajemen Perusahaan'),
      "team_intro_description" = COALESCE(
        NULLIF("team_intro_description", ''),
        'Profesional yang mengedepankan strategi, tata kelola, dan inovasi untuk menghadirkan nilai bagi setiap klien.'
      )
    WHERE "_locale" = 'id';
  `);

  // Column defaults are Indonesian; always overwrite the English locale row.
  await db.execute(sql`
    UPDATE "beranda_locales"
    SET
      "team_intro_title" = 'Company Management',
      "team_intro_description" = 'Professionals who prioritize strategy, governance, and innovation to deliver value for every client.'
    WHERE "_locale" = 'en';
  `);

  await db.execute(sql`
    ALTER TABLE "beranda_locales"
      ALTER COLUMN "team_intro_title" SET DEFAULT 'Manajemen Perusahaan',
      ALTER COLUMN "team_intro_title" SET NOT NULL,
      ALTER COLUMN "team_intro_description" SET DEFAULT 'Profesional yang mengedepankan strategi, tata kelola, dan inovasi untuk menghadirkan nilai bagi setiap klien.',
      ALTER COLUMN "team_intro_description" SET NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "beranda_locales"
      DROP COLUMN IF EXISTS "team_intro_description",
      DROP COLUMN IF EXISTS "team_intro_title";
  `);
}
