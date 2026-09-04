import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services"
      ADD COLUMN IF NOT EXISTS "active" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 100;
  `);
  await db.execute(sql`
    ALTER TABLE "services_features_locales"
      ADD COLUMN IF NOT EXISTS "description" varchar;
  `);
  await db.execute(sql`
    UPDATE "services" SET "active" = true WHERE "active" IS NULL;
    UPDATE "services" SET "sort_order" = 100 WHERE "sort_order" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services_features_locales" DROP COLUMN IF EXISTS "description";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "sort_order";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "active";
  `);
}
