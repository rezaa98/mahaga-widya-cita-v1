import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';
console.log("Found API Key length:", apiKey.length);

async function run() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.error) {
    console.log("Error:", data.error.message);
  } else {
    console.log("Models found:", data.models.length);
    console.log("Has 1.5 flash:", data.models.some(m => m.name === 'models/gemini-1.5-flash'));
  }
}
run();
