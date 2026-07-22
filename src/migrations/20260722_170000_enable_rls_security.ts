import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
        END LOOP;
    END $$;

    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon, authenticated;

    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon, authenticated;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Down migration optional if RLS is permanently desired
  `);
}
