import { translateDocumentJSON } from './src/utils/translate.ts';

async function run() {
  const res = await fetch('http://localhost:3000/api/globals/tentang-kami?locale=id');
  const idData = await res.json();
  const { id, createdAt, updatedAt, ...docToTranslate } = idData;
  console.log("Translating tentang-kami...");
  const translated = await translateDocumentJSON(docToTranslate, 'English');
  console.log("Translation done.");
  
  const updateRes = await fetch('http://localhost:3000/api/globals/tentang-kami?locale=en', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(translated)
  });
  console.log("Update status:", updateRes.status);
  
  const err = await updateRes.text();
  console.log("Update response:", err);
  process.exit(0);
}
run();
