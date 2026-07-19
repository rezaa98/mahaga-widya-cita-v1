import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'admin', 'editor', 'reviewer', 'member');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_journals_language" AS ENUM('id', 'en', 'bilingual');
  CREATE TYPE "public"."enum_journals_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journals_v_version_language" AS ENUM('id', 'en', 'bilingual');
  CREATE TYPE "public"."enum__journals_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journals_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_policy_reviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policy_reviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__policy_reviews_v_published_locale" AS ENUM('id', 'en');
  CREATE TYPE "public"."enum_team_members_category" AS ENUM('management', 'expert');
  CREATE TYPE "public"."enum_beranda_stats_icon" AS ENUM('Mic2', 'Users', 'Building2', 'Globe', 'Target', 'CheckCircle2');
  CREATE TYPE "public"."enum_tentang_kami_stats_icon" AS ENUM('CheckCircle2', 'Award', 'Target', 'Eye', 'Users', 'Building2', 'Globe', 'BookOpen');
  CREATE TYPE "public"."enum_footer_social_media_platform" AS ENUM('instagram', 'youtube', 'linkedin', 'twitter');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"featured_image_credit" varchar,
  	"image_url" varchar,
  	"slug" varchar,
  	"author_id" integer,
  	"category_id" integer,
  	"status" "enum_articles_status" DEFAULT 'draft',
  	"review_notes" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"excerpt" varchar,
  	"featured_image_caption" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_featured_image_id" integer,
  	"version_featured_image_credit" varchar,
  	"version_image_url" varchar,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_category_id" integer,
  	"version_status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"version_review_notes" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"version_excerpt" varchar,
  	"version_featured_image_caption" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journals_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar
  );
  
  CREATE TABLE "journals_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"affiliation" varchar,
  	"email" varchar,
  	"public_profile" varchar
  );
  
  CREATE TABLE "journals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cover_image_id" integer,
  	"document_id" integer,
  	"language" "enum_journals_language" DEFAULT 'id',
  	"publication_year" numeric,
  	"volume" varchar,
  	"issue" varchar,
  	"pages" varchar,
  	"doi" varchar,
  	"issn" varchar,
  	"canonical_url" varchar,
  	"og_image_id" integer,
  	"slug" varchar,
  	"author_id" integer,
  	"category_id" integer,
  	"status" "enum_journals_status" DEFAULT 'draft',
  	"review_notes" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journals_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journals_locales" (
  	"title" varchar,
  	"abstract" jsonb,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journals_v_version_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"keyword" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journals_v_version_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"affiliation" varchar,
  	"email" varchar,
  	"public_profile" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_journals_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_cover_image_id" integer,
  	"version_document_id" integer,
  	"version_language" "enum__journals_v_version_language" DEFAULT 'id',
  	"version_publication_year" numeric,
  	"version_volume" varchar,
  	"version_issue" varchar,
  	"version_pages" varchar,
  	"version_doi" varchar,
  	"version_issn" varchar,
  	"version_canonical_url" varchar,
  	"version_og_image_id" integer,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_category_id" integer,
  	"version_status" "enum__journals_v_version_status" DEFAULT 'draft',
  	"version_review_notes" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journals_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__journals_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_journals_v_locales" (
  	"version_title" varchar,
  	"version_abstract" jsonb,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "policy_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" jsonb,
  	"excerpt" varchar,
  	"document_id" integer,
  	"slug" varchar,
  	"author_id" integer,
  	"status" "enum_policy_reviews_status" DEFAULT 'draft',
  	"published_at" timestamp(3) with time zone,
  	"review_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_policy_reviews_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "policy_reviews_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_policy_reviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" jsonb,
  	"version_excerpt" varchar,
  	"version_document_id" integer,
  	"version_slug" varchar,
  	"version_author_id" integer,
  	"version_status" "enum__policy_reviews_v_version_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_review_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__policy_reviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__policy_reviews_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_policy_reviews_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"institution" varchar,
  	"subject" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_features_locales" (
  	"feature" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_benefits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_benefits_locales" (
  	"title" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services_target_audience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "services_target_audience_locales" (
  	"audience" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"color" varchar DEFAULT 'var(--color-primary-600)' NOT NULL,
  	"gradient" varchar DEFAULT 'linear-gradient(135deg, #1E6FD9, #0B2D6B)' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"initials" varchar NOT NULL,
  	"category" "enum_team_members_category" DEFAULT 'expert' NOT NULL,
  	"color" varchar DEFAULT 'linear-gradient(135deg, #1E6FD9, #0B2D6B)' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"name" varchar NOT NULL,
  	"bio" varchar,
  	"role" varchar,
  	"expertise" varchar NOT NULL,
  	"institution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"articles_id" integer,
  	"journals_id" integer,
  	"policy_reviews_id" integer,
  	"contact_submissions_id" integer,
  	"subscribers_id" integer,
  	"services_id" integer,
  	"team_members_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "beranda_hero_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "beranda_hero_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "beranda_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL,
  	"icon" "enum_beranda_stats_icon" DEFAULT 'Mic2'
  );
  
  CREATE TABLE "beranda_stats_locales" (
  	"suffix" varchar,
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "beranda_partners_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_url" varchar
  );
  
  CREATE TABLE "beranda_partners_list_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "beranda_cta_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "beranda_cta_features_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "beranda" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"visibility_show_hero" boolean DEFAULT true,
  	"visibility_show_stats" boolean DEFAULT true,
  	"visibility_show_partners" boolean DEFAULT true,
  	"visibility_show_services" boolean DEFAULT true,
  	"visibility_show_articles" boolean DEFAULT true,
  	"visibility_show_team" boolean DEFAULT true,
  	"visibility_show_c_t_a" boolean DEFAULT true,
  	"cta_wa_number" varchar DEFAULT '6221123456789' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "beranda_locales" (
  	"hero_badge" varchar DEFAULT 'Platform Edukasi & Tata Kelola Terpercaya Sejak 2015' NOT NULL,
  	"hero_title" varchar DEFAULT 'Platform Edukasi &' NOT NULL,
  	"hero_title_highlight" varchar DEFAULT 'Tata Kelola' NOT NULL,
  	"hero_title_suffix" varchar DEFAULT 'untuk Profesional Indonesia' NOT NULL,
  	"hero_description" varchar DEFAULT 'Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda melalui program edukasi, konsultasi, dan webinar berkualitas tinggi bersama para pakar terbaik Indonesia.' NOT NULL,
  	"partners_title" varchar DEFAULT 'Dipercaya oleh Lebih dari 200 Instansi dan Mitra Strategis' NOT NULL,
  	"services_intro_badge" varchar DEFAULT 'Layanan Kami' NOT NULL,
  	"services_intro_title" varchar DEFAULT 'Solusi Lengkap untuk Penguatan Kapasitas Instansi' NOT NULL,
  	"services_intro_description" varchar DEFAULT 'Enam pilar layanan terintegrasi yang dirancang khusus untuk memenuhi kebutuhan transformasi instansi pemerintah dan profesional Indonesia.' NOT NULL,
  	"cta_title" varchar DEFAULT 'Siap Melakukan Transformasi
  Instansi Anda Bersama Kami?' NOT NULL,
  	"cta_description" varchar DEFAULT 'Lebih dari 200 instansi pemerintah dan swasta telah mempercayakan pengembangan SDM dan tata kelola mereka kepada PT Mahaga Widya Cita.' NOT NULL,
  	"cta_wa_message" varchar DEFAULT 'Halo, saya ingin konsultasi mengenai layanan PT Mahaga Widya Cita' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "beranda_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer,
  	"articles_id" integer,
  	"team_members_id" integer
  );
  
  CREATE TABLE "tentang_kami_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"icon" "enum_tentang_kami_stats_icon" DEFAULT 'Target' NOT NULL
  );
  
  CREATE TABLE "tentang_kami_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tentang_kami_misi" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tentang_kami_misi_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tentang_kami_core_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tentang_kami_core_values_locales" (
  	"letter" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"desc" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "tentang_kami" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_background_image_id" integer,
  	"ceo_message_ceo_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "tentang_kami_locales" (
  	"hero_badge" varchar DEFAULT 'TENTANG KAMI' NOT NULL,
  	"hero_title" varchar DEFAULT 'Building Better Decisions.' NOT NULL,
  	"hero_title_highlight" varchar DEFAULT 'Creating Sustainable Impact.' NOT NULL,
  	"hero_description" varchar DEFAULT 'Your One-Stop Consulting Partner' NOT NULL,
  	"profil_paragraph1" varchar DEFAULT 'PT Mahaga Widya Cita merupakan perusahaan konsultan multidisiplin Indonesia yang berkomitmen menghadirkan solusi yang terintegrasi, inovatif, dan berkelanjutan bagi instansi pemerintah, BUMN, perusahaan swasta, institusi pendidikan, serta organisasi pembangunan.' NOT NULL,
  	"profil_paragraph2" varchar DEFAULT 'Kami menyediakan layanan konsultasi yang mencakup konsultasi pemerintahan, bisnis dan investasi, perpajakan, riset strategis, solusi penyediaan tenaga profesional (workforce solutions), konsultasi teknologi, serta pengembangan sumber daya manusia. Dengan menggabungkan keahlian multidisiplin, pendekatan berbasis data, dan pemanfaatan teknologi, kami membantu organisasi menghadapi tantangan yang kompleks, meningkatkan kinerja, serta menciptakan nilai yang berkelanjutan.' NOT NULL,
  	"profil_paragraph3" varchar DEFAULT 'Dilandasi integritas, profesionalisme, dan inovasi, PT Mahaga Widya Cita berkomitmen menjadi mitra strategis terpercaya yang mendukung pembangunan berkelanjutan serta mendorong keunggulan organisasi di seluruh Indonesia.' NOT NULL,
  	"visi" varchar DEFAULT 'Menjadi perusahaan konsultan multidisiplin terdepan di Indonesia yang menghadirkan solusi inovatif, berbasis data, dan berkelanjutan untuk mendorong kemajuan organisasi serta berkontribusi terhadap pembangunan nasional.' NOT NULL,
  	"ceo_message_quote" varchar DEFAULT 'Kami percaya bahwa kualitas tata kelola suatu bangsa dimulai dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "kontak_form_subjects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "kontak_form_subjects_locales" (
  	"subject" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "kontak" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar DEFAULT 'mwidyacita@gmail.com' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "kontak_locales" (
  	"hero_title" varchar DEFAULT 'Mari Berkolaborasi Bersama Kami' NOT NULL,
  	"hero_subtitle" varchar DEFAULT 'Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda. Respons dalam 1×24 jam kerja.' NOT NULL,
  	"phone" varchar DEFAULT '082 332 567 816' NOT NULL,
  	"address" varchar DEFAULT 'Jalan Iskandar RT 008 RW 000 Madurejo, Arut Selatan, Kab Kotawaringin Barat, Kalimantan Tengah' NOT NULL,
  	"working_hours" varchar DEFAULT 'Senin – Jumat, 08.00 – 17.00 WIB' NOT NULL,
  	"location_tag" varchar DEFAULT 'Pangkalan Bun, Kalimantan Tengah' NOT NULL,
  	"whatsapp_cta_title" varchar DEFAULT 'Chat via WhatsApp' NOT NULL,
  	"whatsapp_cta_subtitle" varchar DEFAULT 'Respons lebih cepat, langsung ke tim kami' NOT NULL,
  	"whatsapp_cta_default_message" varchar DEFAULT 'Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_social_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_social_media_platform" NOT NULL
  );
  
  CREATE TABLE "footer_social_media_locales" (
  	"url" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_links_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_links_company_locales" (
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_links_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_links_services_locales" (
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"company_description" varchar DEFAULT 'Platform terdepan untuk edukasi profesional dan penguatan tata kelola bagi ASN dan profesional Indonesia.' NOT NULL,
  	"copyright_text" varchar DEFAULT 'PT Mahaga Widya Cita. Hak Cipta Dilindungi.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navbar_links_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navbar_links_children_locales" (
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navbar_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navbar_links_locales" (
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navbar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journals_keywords" ADD CONSTRAINT "journals_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journals_authors" ADD CONSTRAINT "journals_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journals" ADD CONSTRAINT "journals_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals" ADD CONSTRAINT "journals_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals" ADD CONSTRAINT "journals_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals" ADD CONSTRAINT "journals_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals" ADD CONSTRAINT "journals_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals_locales" ADD CONSTRAINT "journals_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journals_locales" ADD CONSTRAINT "journals_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journals_v_version_keywords" ADD CONSTRAINT "_journals_v_version_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journals_v_version_authors" ADD CONSTRAINT "_journals_v_version_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_parent_id_journals_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v" ADD CONSTRAINT "_journals_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v_locales" ADD CONSTRAINT "_journals_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journals_v_locales" ADD CONSTRAINT "_journals_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policy_reviews" ADD CONSTRAINT "policy_reviews_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "policy_reviews" ADD CONSTRAINT "policy_reviews_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "policy_reviews_locales" ADD CONSTRAINT "policy_reviews_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "policy_reviews_locales" ADD CONSTRAINT "policy_reviews_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policy_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_policy_reviews_v" ADD CONSTRAINT "_policy_reviews_v_parent_id_policy_reviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."policy_reviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policy_reviews_v" ADD CONSTRAINT "_policy_reviews_v_version_document_id_media_id_fk" FOREIGN KEY ("version_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policy_reviews_v" ADD CONSTRAINT "_policy_reviews_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policy_reviews_v_locales" ADD CONSTRAINT "_policy_reviews_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_policy_reviews_v_locales" ADD CONSTRAINT "_policy_reviews_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_policy_reviews_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features" ADD CONSTRAINT "services_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_features_locales" ADD CONSTRAINT "services_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits" ADD CONSTRAINT "services_benefits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_benefits_locales" ADD CONSTRAINT "services_benefits_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_benefits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_target_audience" ADD CONSTRAINT "services_target_audience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_target_audience_locales" ADD CONSTRAINT "services_target_audience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_target_audience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journals_fk" FOREIGN KEY ("journals_id") REFERENCES "public"."journals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policy_reviews_fk" FOREIGN KEY ("policy_reviews_id") REFERENCES "public"."policy_reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_hero_features" ADD CONSTRAINT "beranda_hero_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_hero_features_locales" ADD CONSTRAINT "beranda_hero_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda_hero_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_stats" ADD CONSTRAINT "beranda_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_stats_locales" ADD CONSTRAINT "beranda_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_partners_list" ADD CONSTRAINT "beranda_partners_list_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "beranda_partners_list" ADD CONSTRAINT "beranda_partners_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_partners_list_locales" ADD CONSTRAINT "beranda_partners_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda_partners_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_cta_features" ADD CONSTRAINT "beranda_cta_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_cta_features_locales" ADD CONSTRAINT "beranda_cta_features_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda_cta_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_locales" ADD CONSTRAINT "beranda_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_rels" ADD CONSTRAINT "beranda_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."beranda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_rels" ADD CONSTRAINT "beranda_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_rels" ADD CONSTRAINT "beranda_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "beranda_rels" ADD CONSTRAINT "beranda_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_stats" ADD CONSTRAINT "tentang_kami_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_stats_locales" ADD CONSTRAINT "tentang_kami_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_misi" ADD CONSTRAINT "tentang_kami_misi_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_misi_locales" ADD CONSTRAINT "tentang_kami_misi_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_misi"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_core_values" ADD CONSTRAINT "tentang_kami_core_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami_core_values_locales" ADD CONSTRAINT "tentang_kami_core_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami_core_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tentang_kami" ADD CONSTRAINT "tentang_kami_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tentang_kami" ADD CONSTRAINT "tentang_kami_ceo_message_ceo_id_team_members_id_fk" FOREIGN KEY ("ceo_message_ceo_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tentang_kami_locales" ADD CONSTRAINT "tentang_kami_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tentang_kami"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kontak_form_subjects" ADD CONSTRAINT "kontak_form_subjects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kontak"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kontak_form_subjects_locales" ADD CONSTRAINT "kontak_form_subjects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kontak_form_subjects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "kontak_locales" ADD CONSTRAINT "kontak_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."kontak"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_media" ADD CONSTRAINT "footer_social_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_social_media_locales" ADD CONSTRAINT "footer_social_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_social_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_company" ADD CONSTRAINT "footer_links_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_company_locales" ADD CONSTRAINT "footer_links_company_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_services" ADD CONSTRAINT "footer_links_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links_services_locales" ADD CONSTRAINT "footer_links_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_links_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_links_children" ADD CONSTRAINT "navbar_links_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_links_children_locales" ADD CONSTRAINT "navbar_links_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_links_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_links" ADD CONSTRAINT "navbar_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navbar_links_locales" ADD CONSTRAINT "navbar_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navbar_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_featured_image_idx" ON "articles" USING btree ("featured_image_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_featured_image_idx" ON "_articles_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "journals_keywords_order_idx" ON "journals_keywords" USING btree ("_order");
  CREATE INDEX "journals_keywords_parent_id_idx" ON "journals_keywords" USING btree ("_parent_id");
  CREATE INDEX "journals_keywords_locale_idx" ON "journals_keywords" USING btree ("_locale");
  CREATE INDEX "journals_authors_order_idx" ON "journals_authors" USING btree ("_order");
  CREATE INDEX "journals_authors_parent_id_idx" ON "journals_authors" USING btree ("_parent_id");
  CREATE INDEX "journals_cover_image_idx" ON "journals" USING btree ("cover_image_id");
  CREATE INDEX "journals_document_idx" ON "journals" USING btree ("document_id");
  CREATE INDEX "journals_og_image_idx" ON "journals" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "journals_slug_idx" ON "journals" USING btree ("slug");
  CREATE INDEX "journals_author_idx" ON "journals" USING btree ("author_id");
  CREATE INDEX "journals_category_idx" ON "journals" USING btree ("category_id");
  CREATE INDEX "journals_updated_at_idx" ON "journals" USING btree ("updated_at");
  CREATE INDEX "journals_created_at_idx" ON "journals" USING btree ("created_at");
  CREATE INDEX "journals__status_idx" ON "journals" USING btree ("_status");
  CREATE INDEX "journals_meta_meta_image_idx" ON "journals_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "journals_locales_locale_parent_id_unique" ON "journals_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journals_v_version_keywords_order_idx" ON "_journals_v_version_keywords" USING btree ("_order");
  CREATE INDEX "_journals_v_version_keywords_parent_id_idx" ON "_journals_v_version_keywords" USING btree ("_parent_id");
  CREATE INDEX "_journals_v_version_keywords_locale_idx" ON "_journals_v_version_keywords" USING btree ("_locale");
  CREATE INDEX "_journals_v_version_authors_order_idx" ON "_journals_v_version_authors" USING btree ("_order");
  CREATE INDEX "_journals_v_version_authors_parent_id_idx" ON "_journals_v_version_authors" USING btree ("_parent_id");
  CREATE INDEX "_journals_v_parent_idx" ON "_journals_v" USING btree ("parent_id");
  CREATE INDEX "_journals_v_version_version_cover_image_idx" ON "_journals_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_journals_v_version_version_document_idx" ON "_journals_v" USING btree ("version_document_id");
  CREATE INDEX "_journals_v_version_version_og_image_idx" ON "_journals_v" USING btree ("version_og_image_id");
  CREATE INDEX "_journals_v_version_version_slug_idx" ON "_journals_v" USING btree ("version_slug");
  CREATE INDEX "_journals_v_version_version_author_idx" ON "_journals_v" USING btree ("version_author_id");
  CREATE INDEX "_journals_v_version_version_category_idx" ON "_journals_v" USING btree ("version_category_id");
  CREATE INDEX "_journals_v_version_version_updated_at_idx" ON "_journals_v" USING btree ("version_updated_at");
  CREATE INDEX "_journals_v_version_version_created_at_idx" ON "_journals_v" USING btree ("version_created_at");
  CREATE INDEX "_journals_v_version_version__status_idx" ON "_journals_v" USING btree ("version__status");
  CREATE INDEX "_journals_v_created_at_idx" ON "_journals_v" USING btree ("created_at");
  CREATE INDEX "_journals_v_updated_at_idx" ON "_journals_v" USING btree ("updated_at");
  CREATE INDEX "_journals_v_snapshot_idx" ON "_journals_v" USING btree ("snapshot");
  CREATE INDEX "_journals_v_published_locale_idx" ON "_journals_v" USING btree ("published_locale");
  CREATE INDEX "_journals_v_latest_idx" ON "_journals_v" USING btree ("latest");
  CREATE INDEX "_journals_v_autosave_idx" ON "_journals_v" USING btree ("autosave");
  CREATE INDEX "_journals_v_version_meta_version_meta_image_idx" ON "_journals_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_journals_v_locales_locale_parent_id_unique" ON "_journals_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "policy_reviews_document_idx" ON "policy_reviews" USING btree ("document_id");
  CREATE UNIQUE INDEX "policy_reviews_slug_idx" ON "policy_reviews" USING btree ("slug");
  CREATE INDEX "policy_reviews_author_idx" ON "policy_reviews" USING btree ("author_id");
  CREATE INDEX "policy_reviews_updated_at_idx" ON "policy_reviews" USING btree ("updated_at");
  CREATE INDEX "policy_reviews_created_at_idx" ON "policy_reviews" USING btree ("created_at");
  CREATE INDEX "policy_reviews__status_idx" ON "policy_reviews" USING btree ("_status");
  CREATE INDEX "policy_reviews_meta_meta_image_idx" ON "policy_reviews_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "policy_reviews_locales_locale_parent_id_unique" ON "policy_reviews_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_policy_reviews_v_parent_idx" ON "_policy_reviews_v" USING btree ("parent_id");
  CREATE INDEX "_policy_reviews_v_version_version_document_idx" ON "_policy_reviews_v" USING btree ("version_document_id");
  CREATE INDEX "_policy_reviews_v_version_version_slug_idx" ON "_policy_reviews_v" USING btree ("version_slug");
  CREATE INDEX "_policy_reviews_v_version_version_author_idx" ON "_policy_reviews_v" USING btree ("version_author_id");
  CREATE INDEX "_policy_reviews_v_version_version_updated_at_idx" ON "_policy_reviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_policy_reviews_v_version_version_created_at_idx" ON "_policy_reviews_v" USING btree ("version_created_at");
  CREATE INDEX "_policy_reviews_v_version_version__status_idx" ON "_policy_reviews_v" USING btree ("version__status");
  CREATE INDEX "_policy_reviews_v_created_at_idx" ON "_policy_reviews_v" USING btree ("created_at");
  CREATE INDEX "_policy_reviews_v_updated_at_idx" ON "_policy_reviews_v" USING btree ("updated_at");
  CREATE INDEX "_policy_reviews_v_snapshot_idx" ON "_policy_reviews_v" USING btree ("snapshot");
  CREATE INDEX "_policy_reviews_v_published_locale_idx" ON "_policy_reviews_v" USING btree ("published_locale");
  CREATE INDEX "_policy_reviews_v_latest_idx" ON "_policy_reviews_v" USING btree ("latest");
  CREATE INDEX "_policy_reviews_v_autosave_idx" ON "_policy_reviews_v" USING btree ("autosave");
  CREATE INDEX "_policy_reviews_v_version_meta_version_meta_image_idx" ON "_policy_reviews_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_policy_reviews_v_locales_locale_parent_id_unique" ON "_policy_reviews_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "services_features_order_idx" ON "services_features" USING btree ("_order");
  CREATE INDEX "services_features_parent_id_idx" ON "services_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_features_locales_locale_parent_id_unique" ON "services_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_benefits_order_idx" ON "services_benefits" USING btree ("_order");
  CREATE INDEX "services_benefits_parent_id_idx" ON "services_benefits" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_benefits_locales_locale_parent_id_unique" ON "services_benefits_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_target_audience_order_idx" ON "services_target_audience" USING btree ("_order");
  CREATE INDEX "services_target_audience_parent_id_idx" ON "services_target_audience" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_target_audience_locales_locale_parent_id_unique" ON "services_target_audience_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services_meta_meta_image_idx" ON "services_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_journals_id_idx" ON "payload_locked_documents_rels" USING btree ("journals_id");
  CREATE INDEX "payload_locked_documents_rels_policy_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("policy_reviews_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "beranda_hero_features_order_idx" ON "beranda_hero_features" USING btree ("_order");
  CREATE INDEX "beranda_hero_features_parent_id_idx" ON "beranda_hero_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "beranda_hero_features_locales_locale_parent_id_unique" ON "beranda_hero_features_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "beranda_stats_order_idx" ON "beranda_stats" USING btree ("_order");
  CREATE INDEX "beranda_stats_parent_id_idx" ON "beranda_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "beranda_stats_locales_locale_parent_id_unique" ON "beranda_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "beranda_partners_list_order_idx" ON "beranda_partners_list" USING btree ("_order");
  CREATE INDEX "beranda_partners_list_parent_id_idx" ON "beranda_partners_list" USING btree ("_parent_id");
  CREATE INDEX "beranda_partners_list_logo_idx" ON "beranda_partners_list" USING btree ("logo_id");
  CREATE UNIQUE INDEX "beranda_partners_list_locales_locale_parent_id_unique" ON "beranda_partners_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "beranda_cta_features_order_idx" ON "beranda_cta_features" USING btree ("_order");
  CREATE INDEX "beranda_cta_features_parent_id_idx" ON "beranda_cta_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "beranda_cta_features_locales_locale_parent_id_unique" ON "beranda_cta_features_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "beranda_locales_locale_parent_id_unique" ON "beranda_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "beranda_rels_order_idx" ON "beranda_rels" USING btree ("order");
  CREATE INDEX "beranda_rels_parent_idx" ON "beranda_rels" USING btree ("parent_id");
  CREATE INDEX "beranda_rels_path_idx" ON "beranda_rels" USING btree ("path");
  CREATE INDEX "beranda_rels_services_id_idx" ON "beranda_rels" USING btree ("services_id");
  CREATE INDEX "beranda_rels_articles_id_idx" ON "beranda_rels" USING btree ("articles_id");
  CREATE INDEX "beranda_rels_team_members_id_idx" ON "beranda_rels" USING btree ("team_members_id");
  CREATE INDEX "tentang_kami_stats_order_idx" ON "tentang_kami_stats" USING btree ("_order");
  CREATE INDEX "tentang_kami_stats_parent_id_idx" ON "tentang_kami_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tentang_kami_stats_locales_locale_parent_id_unique" ON "tentang_kami_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tentang_kami_misi_order_idx" ON "tentang_kami_misi" USING btree ("_order");
  CREATE INDEX "tentang_kami_misi_parent_id_idx" ON "tentang_kami_misi" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tentang_kami_misi_locales_locale_parent_id_unique" ON "tentang_kami_misi_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tentang_kami_core_values_order_idx" ON "tentang_kami_core_values" USING btree ("_order");
  CREATE INDEX "tentang_kami_core_values_parent_id_idx" ON "tentang_kami_core_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "tentang_kami_core_values_locales_locale_parent_id_unique" ON "tentang_kami_core_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tentang_kami_hero_hero_background_image_idx" ON "tentang_kami" USING btree ("hero_background_image_id");
  CREATE INDEX "tentang_kami_ceo_message_ceo_message_ceo_idx" ON "tentang_kami" USING btree ("ceo_message_ceo_id");
  CREATE UNIQUE INDEX "tentang_kami_locales_locale_parent_id_unique" ON "tentang_kami_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "kontak_form_subjects_order_idx" ON "kontak_form_subjects" USING btree ("_order");
  CREATE INDEX "kontak_form_subjects_parent_id_idx" ON "kontak_form_subjects" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "kontak_form_subjects_locales_locale_parent_id_unique" ON "kontak_form_subjects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "kontak_locales_locale_parent_id_unique" ON "kontak_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_social_media_order_idx" ON "footer_social_media" USING btree ("_order");
  CREATE INDEX "footer_social_media_parent_id_idx" ON "footer_social_media" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_social_media_locales_locale_parent_id_unique" ON "footer_social_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_links_company_order_idx" ON "footer_links_company" USING btree ("_order");
  CREATE INDEX "footer_links_company_parent_id_idx" ON "footer_links_company" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_links_company_locales_locale_parent_id_unique" ON "footer_links_company_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_links_services_order_idx" ON "footer_links_services" USING btree ("_order");
  CREATE INDEX "footer_links_services_parent_id_idx" ON "footer_links_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_links_services_locales_locale_parent_id_unique" ON "footer_links_services_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navbar_links_children_order_idx" ON "navbar_links_children" USING btree ("_order");
  CREATE INDEX "navbar_links_children_parent_id_idx" ON "navbar_links_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navbar_links_children_locales_locale_parent_id_unique" ON "navbar_links_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navbar_links_order_idx" ON "navbar_links" USING btree ("_order");
  CREATE INDEX "navbar_links_parent_id_idx" ON "navbar_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navbar_links_locales_locale_parent_id_unique" ON "navbar_links_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "journals_keywords" CASCADE;
  DROP TABLE "journals_authors" CASCADE;
  DROP TABLE "journals" CASCADE;
  DROP TABLE "journals_locales" CASCADE;
  DROP TABLE "_journals_v_version_keywords" CASCADE;
  DROP TABLE "_journals_v_version_authors" CASCADE;
  DROP TABLE "_journals_v" CASCADE;
  DROP TABLE "_journals_v_locales" CASCADE;
  DROP TABLE "policy_reviews" CASCADE;
  DROP TABLE "policy_reviews_locales" CASCADE;
  DROP TABLE "_policy_reviews_v" CASCADE;
  DROP TABLE "_policy_reviews_v_locales" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "services_features" CASCADE;
  DROP TABLE "services_features_locales" CASCADE;
  DROP TABLE "services_benefits" CASCADE;
  DROP TABLE "services_benefits_locales" CASCADE;
  DROP TABLE "services_target_audience" CASCADE;
  DROP TABLE "services_target_audience_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "beranda_hero_features" CASCADE;
  DROP TABLE "beranda_hero_features_locales" CASCADE;
  DROP TABLE "beranda_stats" CASCADE;
  DROP TABLE "beranda_stats_locales" CASCADE;
  DROP TABLE "beranda_partners_list" CASCADE;
  DROP TABLE "beranda_partners_list_locales" CASCADE;
  DROP TABLE "beranda_cta_features" CASCADE;
  DROP TABLE "beranda_cta_features_locales" CASCADE;
  DROP TABLE "beranda" CASCADE;
  DROP TABLE "beranda_locales" CASCADE;
  DROP TABLE "beranda_rels" CASCADE;
  DROP TABLE "tentang_kami_stats" CASCADE;
  DROP TABLE "tentang_kami_stats_locales" CASCADE;
  DROP TABLE "tentang_kami_misi" CASCADE;
  DROP TABLE "tentang_kami_misi_locales" CASCADE;
  DROP TABLE "tentang_kami_core_values" CASCADE;
  DROP TABLE "tentang_kami_core_values_locales" CASCADE;
  DROP TABLE "tentang_kami" CASCADE;
  DROP TABLE "tentang_kami_locales" CASCADE;
  DROP TABLE "kontak_form_subjects" CASCADE;
  DROP TABLE "kontak_form_subjects_locales" CASCADE;
  DROP TABLE "kontak" CASCADE;
  DROP TABLE "kontak_locales" CASCADE;
  DROP TABLE "footer_social_media" CASCADE;
  DROP TABLE "footer_social_media_locales" CASCADE;
  DROP TABLE "footer_links_company" CASCADE;
  DROP TABLE "footer_links_company_locales" CASCADE;
  DROP TABLE "footer_links_services" CASCADE;
  DROP TABLE "footer_links_services_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "navbar_links_children" CASCADE;
  DROP TABLE "navbar_links_children_locales" CASCADE;
  DROP TABLE "navbar_links" CASCADE;
  DROP TABLE "navbar_links_locales" CASCADE;
  DROP TABLE "navbar" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_journals_language";
  DROP TYPE "public"."enum_journals_status";
  DROP TYPE "public"."enum__journals_v_version_language";
  DROP TYPE "public"."enum__journals_v_version_status";
  DROP TYPE "public"."enum__journals_v_published_locale";
  DROP TYPE "public"."enum_policy_reviews_status";
  DROP TYPE "public"."enum__policy_reviews_v_version_status";
  DROP TYPE "public"."enum__policy_reviews_v_published_locale";
  DROP TYPE "public"."enum_team_members_category";
  DROP TYPE "public"."enum_beranda_stats_icon";
  DROP TYPE "public"."enum_tentang_kami_stats_icon";
  DROP TYPE "public"."enum_footer_social_media_platform";`)
}
