# Mahaga Widya Cita

Corporate website and bilingual Payload CMS built with Next.js.

## Development

Copy `.env.example` to `.env`, fill the required values, install dependencies, then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Translation workflow

Indonesian (`id`) is the source of truth. Saving localized Indonesian content queues an ID-to-EN translation job. AI output is stored as a review candidate and never overwrites live English content until an authorized reviewer approves it in the English editor.

Required server variables:

- `GEMINI_API_KEY`
- `GEMINI_TRANSLATION_MODEL` (defaults to `gemini-3.6-flash`)
- `CRON_SECRET` for the Vercel recovery runner
- `TRANSLATION_GLOSSARY_JSON` for optional corporate terminology

Before deploying the translation workflow to an existing production database, run the checked-in migration once against that database:

```bash
npx payload migrate
```

The migration preserves existing Policy Review content as Indonesian localized data and creates the translation/job tables. `vercel.json` runs a daily recovery pass; explicit editor actions process their job immediately.

Useful verification commands:

```bash
npm run generate:types
npx tsc --noEmit
node --import tsx --test src/translation/schema.test.ts src/utils/translate.test.ts
npm run build
```

## Deploy on Vercel

Set the variables from `.env.example` for Production and Preview. Database migrations are intentionally separate from the serverless build; apply them before promoting the deployment.
