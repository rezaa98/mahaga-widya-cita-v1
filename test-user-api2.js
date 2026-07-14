import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.error) {
    console.log("Error:", data.error.message);
  } else {
    console.log(data.models.map(m => m.name).slice(0, 10));
  }
}
run();
