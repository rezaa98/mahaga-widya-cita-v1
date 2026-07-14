import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(apiKey);

async function test(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("hello");
    console.log(modelName, "SUCCESS");
  } catch(e) {
    console.log(modelName, "FAILED:", e.message);
  }
}
async function run() {
  await test("gemini-2.5-flash");
  await test("gemini-2.5-pro");
  await test("gemma-4-26b-a4b-it");
  await test("gemini-pro");
}
run();
