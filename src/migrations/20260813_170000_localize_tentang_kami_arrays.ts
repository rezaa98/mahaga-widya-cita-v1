import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tentang_kami_stats"
      ADD COLUMN "_locale" "_locales",
      ADD COLUMN "label" varchar;
    ALTER TABLE "tentang_kami_misi"
      ADD COLUMN "_locale" "_locales",
      ADD COLUMN "title" varchar,
      ADD COLUMN "text" varchar;
    ALTER TABLE "tentang_kami_core_values"
      ADD COLUMN "_locale" "_locales",
      ADD COLUMN "letter" varchar,
      ADD COLUMN "name" varchar,
      ADD COLUMN "desc" varchar;

    UPDATE "tentang_kami_stats" parent
    SET "_locale" = 'id', "label" = COALESCE(id_text.label, en_text.label)
    FROM "tentang_kami_stats_locales" en_text
    LEFT JOIN "tentang_kami_stats_locales" id_text
      ON id_text."_parent_id" = en_text."_parent_id" AND id_text."_locale" = 'id'
    WHERE en_text."_parent_id" = parent.id AND en_text."_locale" = 'en';

    INSERT INTO "tentang_kami_stats" ("_order", "_parent_id", "_locale", "id", "value", "icon", "label")
    SELECT parent."_order", parent."_parent_id", 'en', parent.id || '-en', parent.value, parent.icon, en_text.label
    FROM "tentang_kami_stats" parent
    JOIN "tentang_kami_stats_locales" en_text ON en_text."_parent_id" = parent.id AND en_text."_locale" = 'en'
    WHERE parent."_locale" = 'id';

    UPDATE "tentang_kami_misi" parent
    SET "_locale" = 'id',
        "title" = COALESCE(id_text.title, en_text.title),
        "text" = COALESCE(id_text.text, en_text.text)
    FROM "tentang_kami_misi_locales" en_text
    LEFT JOIN "tentang_kami_misi_locales" id_text
      ON id_text."_parent_id" = en_text."_parent_id" AND id_text."_locale" = 'id'
    WHERE en_text."_parent_id" = parent.id AND en_text."_locale" = 'en';

    INSERT INTO "tentang_kami_misi" ("_order", "_parent_id", "_locale", "id", "title", "text")
    SELECT parent."_order", parent."_parent_id", 'en', parent.id || '-en', en_text.title, en_text.text
    FROM "tentang_kami_misi" parent
    JOIN "tentang_kami_misi_locales" en_text ON en_text."_parent_id" = parent.id AND en_text."_locale" = 'en'
    WHERE parent."_locale" = 'id';

    UPDATE "tentang_kami_core_values" parent
    SET "_locale" = 'id',
        "letter" = COALESCE(id_text.letter, en_text.letter),
        "name" = COALESCE(id_text.name, en_text.name),
        "desc" = COALESCE(id_text."desc", en_text."desc")
    FROM "tentang_kami_core_values_locales" en_text
    LEFT JOIN "tentang_kami_core_values_locales" id_text
      ON id_text."_parent_id" = en_text."_parent_id" AND id_text."_locale" = 'id'
    WHERE en_text."_parent_id" = parent.id AND en_text."_locale" = 'en';

    INSERT INTO "tentang_kami_core_values" ("_order", "_parent_id", "_locale", "id", "letter", "name", "desc")
    SELECT parent."_order", parent."_parent_id", 'en', parent.id || '-en', en_text.letter, en_text.name, en_text."desc"
    FROM "tentang_kami_core_values" parent
    JOIN "tentang_kami_core_values_locales" en_text ON en_text."_parent_id" = parent.id AND en_text."_locale" = 'en'
    WHERE parent."_locale" = 'id';

    ALTER TABLE "tentang_kami_stats" ALTER COLUMN "_locale" SET NOT NULL, ALTER COLUMN "label" SET NOT NULL;
    ALTER TABLE "tentang_kami_misi" ALTER COLUMN "_locale" SET NOT NULL, ALTER COLUMN "title" SET NOT NULL, ALTER COLUMN "text" SET NOT NULL;
    ALTER TABLE "tentang_kami_core_values" ALTER COLUMN "_locale" SET NOT NULL, ALTER COLUMN "letter" SET NOT NULL, ALTER COLUMN "name" SET NOT NULL, ALTER COLUMN "desc" SET NOT NULL;

    CREATE INDEX "tentang_kami_stats_locale_idx" ON "tentang_kami_stats" USING btree ("_locale");
    CREATE INDEX "tentang_kami_misi_locale_idx" ON "tentang_kami_misi" USING btree ("_locale");
    CREATE INDEX "tentang_kami_core_values_locale_idx" ON "tentang_kami_core_values" USING btree ("_locale");

    DROP TABLE "tentang_kami_stats_locales";
    DROP TABLE "tentang_kami_misi_locales";
    DROP TABLE "tentang_kami_core_values_locales";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "tentang_kami_stats_locales" (
      "label" varchar NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );
    CREATE TABLE "tentang_kami_misi_locales" (
      "title" varchar NOT NULL, "text" varchar NOT NULL, "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );
    CREATE TABLE "tentang_kami_core_values_locales" (
      "letter" varchar NOT NULL, "name" varchar NOT NULL, "desc" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL, "_locale" "_locales" NOT NULL, "_parent_id" varchar NOT NULL
    );

    INSERT INTO "tentang_kami_stats_locales" ("label", "_locale", "_parent_id")
      SELECT label, "_locale", CASE WHEN "_locale" = 'en' THEN regexp_replace(id, '-en$', '') ELSE id END FROM "tentang_kami_stats";
    INSERT INTO "tentang_kami_misi_locales" ("title", "text", "_locale", "_parent_id")
      SELECT title, text, "_locale", CASE WHEN "_locale" = 'en' THEN regexp_replace(id, '-en$', '') ELSE id END FROM "tentang_kami_misi";
    INSERT INTO "tentang_kami_core_values_locales" ("letter", "name", "desc", "_locale", "_parent_id")
      SELECT letter, name, "desc", "_locale", CASE WHEN "_locale" = 'en' THEN regexp_replace(id, '-en$', '') ELSE id END FROM "tentang_kami_core_values";

    DELETE FROM "tentang_kami_stats" WHERE "_locale" = 'en';
    DELETE FROM "tentang_kami_misi" WHERE "_locale" = 'en';
    DELETE FROM "tentang_kami_core_values" WHERE "_locale" = 'en';

    DROP INDEX "tentang_kami_stats_locale_idx";
    DROP INDEX "tentang_kami_misi_locale_idx";
    DROP INDEX "tentang_kami_core_values_locale_idx";
    ALTER TABLE "tentang_kami_stats" DROP COLUMN "_locale", DROP COLUMN "label";
    ALTER TABLE "tentang_kami_misi" DROP COLUMN "_locale", DROP COLUMN "title", DROP COLUMN "text";
    ALTER TABLE "tentang_kami_core_values" DROP COLUMN "_locale", DROP COLUMN "letter", DROP COLUMN "name", DROP COLUMN "desc";

    CREATE UNIQUE INDEX "tentang_kami_stats_locales_locale_parent_id_unique" ON "tentang_kami_stats_locales" USING btree ("_locale", "_parent_id");
    CREATE UNIQUE INDEX "tentang_kami_misi_locales_locale_parent_id_unique" ON "tentang_kami_misi_locales" USING btree ("_locale", "_parent_id");
    CREATE UNIQUE INDEX "tentang_kami_core_values_locales_locale_parent_id_unique" ON "tentang_kami_core_values_locales" USING btree ("_locale", "_parent_id");
    ALTER TABLE "tentang_kami_stats_locales" ADD CONSTRAINT "tentang_kami_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_stats"("id") ON DELETE cascade;
    ALTER TABLE "tentang_kami_misi_locales" ADD CONSTRAINT "tentang_kami_misi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_misi"("id") ON DELETE cascade;
    ALTER TABLE "tentang_kami_core_values_locales" ADD CONSTRAINT "tentang_kami_core_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_core_values"("id") ON DELETE cascade;
  `);
}
