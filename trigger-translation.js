async function run() {
  console.log("Fetching beranda id...");
  let res = await fetch('http://localhost:3000/api/globals/beranda?locale=id');
  let data = await res.json();
  
  console.log("Patching beranda id...");
  await fetch('http://localhost:3000/api/globals/beranda?locale=id', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log("Triggered beranda auto-translate");

  console.log("Fetching footer id...");
  res = await fetch('http://localhost:3000/api/globals/footer?locale=id');
  data = await res.json();
  
  console.log("Patching footer id...");
  await fetch('http://localhost:3000/api/globals/footer?locale=id', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  console.log("Triggered footer auto-translate");
}
run();
