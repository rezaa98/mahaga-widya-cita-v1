fetch('http://localhost:3000/api/globals/beranda?locale=id').then(r => r.json()).then(async d => {
  const { id, createdAt, updatedAt, ...docToTranslate } = d;
  console.log("Stats array:", JSON.stringify(docToTranslate.stats, null, 2));
  
  const updateRes = await fetch('http://localhost:3000/api/globals/beranda?locale=en', {
    method: 'PATCH', // Wait, Payload REST API uses PATCH, not POST, but wait, globals might be POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(docToTranslate)
  });
  console.log("Update status:", updateRes.status);
  const text = await updateRes.text();
  console.log("Update response:", text);
});
