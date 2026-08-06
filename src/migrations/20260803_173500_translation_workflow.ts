import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "policy_reviews_locales"
      ADD COLUMN "title" varchar,
      ADD COLUMN "summary" jsonb,
      ADD COLUMN "excerpt" varchar;
    INSERT INTO "policy_reviews_locales" ("title", "summary", "excerpt", "_locale", "_parent_id")
      SELECT "title", "summary", "excerpt", 'id'::"_locales", "id" FROM "policy_reviews"
      ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET
        "title" = EXCLUDED."title",
        "summary" = EXCLUDED."summary",
        "excerpt" = EXCLUDED."excerpt";
    -- Keep the legacy columns during the rollout. The currently deployed app
    -- still reads them, while the new Payload config reads localized rows.
    -- A later cleanup migration may drop them after the new release is stable.

    ALTER TABLE "_policy_reviews_v_locales"
      ADD COLUMN "version_title" varchar,
      ADD COLUMN "version_summary" jsonb,
      ADD COLUMN "version_excerpt" varchar;
    INSERT INTO "_policy_reviews_v_locales" (
      "version_title", "version_summary", "version_excerpt", "_locale", "_parent_id"
    )
      SELECT "version_title", "version_summary", "version_excerpt", 'id'::"_locales", "id"
      FROM "_policy_reviews_v"
      ON CONFLICT ("_locale", "_parent_id") DO UPDATE SET
        "version_title" = EXCLUDED."version_title",
        "version_summary" = EXCLUDED."version_summary",
        "version_excerpt" = EXCLUDED."version_excerpt";

    CREATE TYPE "public"."enum_translation_records_resource_type" AS ENUM('collection', 'global');
    CREATE TYPE "public"."enum_translation_records_target_locale" AS ENUM('en');
    CREATE TYPE "public"."enum_translation_records_status" AS ENUM(
      'not_generated', 'queued', 'translating', 'needs_update', 'needs_review', 'approved', 'failed'
    );
    CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'translate-resource');
    CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
    CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'translate-resource');

    CREATE TABLE "translation_records" (
      "id" serial PRIMARY KEY NOT NULL,
      "resource_key" varchar NOT NULL,
      "resource_type" "enum_translation_records_resource_type" NOT NULL,
      "identifier" varchar NOT NULL,
      "resource_id" varchar,
      "target_locale" "enum_translation_records_target_locale" DEFAULT 'en' NOT NULL,
      "status" "enum_translation_records_status" DEFAULT 'not_generated' NOT NULL,
      "source_hash" varchar,
      "source_updated_at" timestamp(3) with time zone,
      "candidate_data" jsonb,
      "generated_fields" jsonb,
      "manual_locks" jsonb DEFAULT '[]'::jsonb,
      "translated_at" timestamp(3) with time zone,
      "provider" varchar,
      "model" varchar,
      "metrics" jsonb,
      "last_error" varchar,
      "approved_at" timestamp(3) with time zone,
      "approved_by_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "payload_jobs" (
      "id" serial PRIMARY KEY NOT NULL,
      "input" jsonb,
      "completed_at" timestamp(3) with time zone,
      "total_tried" numeric DEFAULT 0,
      "has_error" boolean DEFAULT false,
      "error" jsonb,
      "task_slug" "enum_payload_jobs_task_slug",
      "queue" varchar DEFAULT 'default',
      "wait_until" timestamp(3) with time zone,
      "processing" boolean DEFAULT false,
      "concurrency_key" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE TABLE "payload_jobs_log" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "executed_at" timestamp(3) with time zone NOT NULL,
      "completed_at" timestamp(3) with time zone NOT NULL,
      "task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
      "task_i_d" varchar NOT NULL,
      "input" jsonb,
      "output" jsonb,
      "state" "enum_payload_jobs_log_state" NOT NULL,
      "error" jsonb
    );

    ALTER TABLE "translation_records"
      ADD CONSTRAINT "translation_records_approved_by_id_users_id_fk"
      FOREIGN KEY ("approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_jobs_log"
      ADD CONSTRAINT "payload_jobs_log_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "translation_records_id" integer;
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_translation_records_fk"
      FOREIGN KEY ("translation_records_id") REFERENCES "public"."translation_records"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "translation_records_resource_key_idx" ON "translation_records" USING btree ("resource_key");
    CREATE INDEX "translation_records_identifier_idx" ON "translation_records" USING btree ("identifier");
    CREATE INDEX "translation_records_resource_id_idx" ON "translation_records" USING btree ("resource_id");
    CREATE INDEX "translation_records_status_idx" ON "translation_records" USING btree ("status");
    CREATE INDEX "translation_records_source_hash_idx" ON "translation_records" USING btree ("source_hash");
    CREATE INDEX "translation_records_approved_by_idx" ON "translation_records" USING btree ("approved_by_id");
    CREATE INDEX "translation_records_updated_at_idx" ON "translation_records" USING btree ("updated_at");
    CREATE INDEX "translation_records_created_at_idx" ON "translation_records" USING btree ("created_at");
    CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
    CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
    CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
    CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
    CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
    CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
    CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
    CREATE INDEX "payload_jobs_concurrency_key_idx" ON "payload_jobs" USING btree ("concurrency_key");
    CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
    CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
    CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
    CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
    CREATE INDEX "payload_locked_documents_rels_translation_records_id_idx"
      ON "payload_locked_documents_rels" USING btree ("translation_records_id");

    ALTER TABLE "translation_records" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "payload_jobs" ENABLE ROW LEVEL SECURITY;
    ALTER TABLE "payload_jobs_log" ENABLE ROW LEVEL SECURITY;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_translation_records_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_translation_records_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "translation_records_id";
    DROP TABLE IF EXISTS "payload_jobs_log" CASCADE;
    DROP TABLE IF EXISTS "payload_jobs" CASCADE;
    DROP TABLE IF EXISTS "translation_records" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_task_slug";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_state";
    DROP TYPE IF EXISTS "public"."enum_payload_jobs_log_task_slug";
    DROP TYPE IF EXISTS "public"."enum_translation_records_status";
    DROP TYPE IF EXISTS "public"."enum_translation_records_target_locale";
    DROP TYPE IF EXISTS "public"."enum_translation_records_resource_type";

    UPDATE "policy_reviews" AS document SET
      "title" = localized."title",
      "summary" = localized."summary",
      "excerpt" = localized."excerpt"
    FROM "policy_reviews_locales" AS localized
    WHERE localized."_parent_id" = document."id" AND localized."_locale" = 'id'::"_locales";
    ALTER TABLE "policy_reviews_locales"
      DROP COLUMN "title",
      DROP COLUMN "summary",
      DROP COLUMN "excerpt";

    UPDATE "_policy_reviews_v" AS version SET
      "version_title" = localized."version_title",
      "version_summary" = localized."version_summary",
      "version_excerpt" = localized."version_excerpt"
    FROM "_policy_reviews_v_locales" AS localized
    WHERE localized."_parent_id" = version."id" AND localized."_locale" = 'id'::"_locales";
    ALTER TABLE "_policy_reviews_v_locales"
      DROP COLUMN "version_title",
      DROP COLUMN "version_summary",
      DROP COLUMN "version_excerpt";
  `);
}
