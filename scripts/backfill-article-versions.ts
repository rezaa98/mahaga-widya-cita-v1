import { getPayload } from "payload";
import config from "../src/payload.config";

const apply = process.argv.includes("--apply");
const payload = await getPayload({ config });

const articles = await payload.find({
  collection: "articles",
  depth: 0,
  fallbackLocale: false,
  limit: 500,
  locale: "all",
  overrideAccess: true,
  pagination: false,
});

let created = 0;
let skipped = 0;

for (const article of articles.docs) {
  const versions = await payload.findVersions({
    collection: "articles",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { parent: { equals: article.id } },
  });

  if (versions.totalDocs > 0) {
    skipped += 1;
    continue;
  }

  if (apply) {
    // A no-op published update lets Payload serialize the complete document,
    // including every locale, into its version schema. Translation hooks are
    // explicitly disabled so this maintenance task cannot enqueue AI work.
    await payload.update({
      collection: "articles",
      context: { skipAutoTranslate: true },
      data: {},
      draft: false,
      id: article.id,
      locale: "id",
      overrideAccess: true,
    });
  }

  created += 1;
}

const versions = await payload.findVersions({
  collection: "articles",
  depth: 0,
  limit: 1,
  overrideAccess: true,
});

console.log(
  JSON.stringify(
    {
      apply,
      articleCount: articles.totalDocs,
      created: apply ? created : 0,
      pending: apply ? 0 : created,
      skipped,
      versionCount: versions.totalDocs,
    },
    null,
    2,
  ),
);

process.exit(0);
