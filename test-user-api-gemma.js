import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : '';

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemma-4-26b-a4b-it" });

const testObj = {
  title: "Platform Edukasi & Tata Kelola",
  description: "Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda."
};

async function run() {
  const prompt = `You are a professional JSON translator. Translate ALL Indonesian text inside this JSON to English. Return ONLY valid JSON without markdown codeblocks.

${JSON.stringify(testObj)}`;
  
  const res = await model.generateContent(prompt);
  console.log(res.response.text());
}
run();
