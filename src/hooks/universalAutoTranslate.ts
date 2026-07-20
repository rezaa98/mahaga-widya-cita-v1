import { CollectionAfterChangeHook, GlobalAfterChangeHook } from "payload";

// Trigger the webhook in the background without awaiting it
function triggerTranslationWebhook(req: any, doc: any, identifier: string, isGlobal: boolean) {
  if (req.context?.skipAutoTranslate) {
    return;
  }

  // Determine source and target locales
  const sourceLocale = req.locale || "id";
  const targetLocale = sourceLocale === "id" ? "en" : "id";

  // Get the base URL (handles local dev, Vercel edge, and production)
  const baseUrl =
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    (req.headers && req.headers.get && req.headers.get("origin")) ||
    (req.headers && req.headers.origin) ||
    "http://localhost:3000";

  const webhookUrl = `${baseUrl}/api/auto-translate`;

  console.log(`[Auto-Translate] Triggering webhook for ${identifier}...`);

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": process.env.ADMIN_API_SECRET || "",
    },
    body: JSON.stringify({
      identifier,
      id: doc.id,
      isGlobal,
      sourceLocale,
      targetLocale,
    }),
  }).catch((err) => {
    console.error("[Auto-Translate] Webhook trigger failed:", err);
  });
}

export const universalCollectionAutoTranslate: CollectionAfterChangeHook = async ({ doc, req, collection }) => {
  triggerTranslationWebhook(req, doc, collection.slug, false);
  return doc;
};

export const universalGlobalAutoTranslate: GlobalAfterChangeHook = async ({ doc, req, global }) => {
  triggerTranslationWebhook(req, doc, global.slug, true);
  return doc;
};
