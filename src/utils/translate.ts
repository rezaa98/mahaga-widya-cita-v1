import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function translateText(text: string, targetLanguage: string = 'English'): Promise<string> {
  if (!text) return text;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Translation skipped.');
    return text;
  }

  try {
    const prompt = `Translate the following text from Indonesian to ${targetLanguage}. Provide ONLY the translation without any quotes, markdown formatting, or additional explanations.\n\nText:\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini Translation Error:', error);
    return text; // Fallback to original text if error
  }
}

export async function translateLexicalJSON(jsonObj: any, targetLanguage: string = 'English'): Promise<any> {
  if (!jsonObj) return jsonObj;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Translation skipped.');
    return jsonObj;
  }

  try {
    const prompt = `Translate all human-readable text values inside the following JSON from Indonesian to ${targetLanguage}. 
CRITICAL RULES:
1. ONLY translate the text content.
2. DO NOT change ANY JSON keys, structure, or non-text values (like numbers, booleans, IDs).
3. Return ONLY valid JSON, with NO markdown code blocks (do not wrap in \`\`\`json).
4. If there is a "text" key inside a node, translate its value.

JSON to translate:
${JSON.stringify(jsonObj)}
`;
    
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    // Clean up potential markdown formatting from the response
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    return JSON.parse(cleanJsonStr);
  } catch (error) {
    console.error('Gemini Lexical Translation Error:', error);
    return jsonObj; // Fallback to original if error
  }
}

export async function translateDocumentJSON(jsonObj: any, targetLanguage: string = 'English'): Promise<any> {
  if (!jsonObj) return jsonObj;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Translation skipped.');
    return jsonObj;
  }

  // To prevent the AI from removing necessary fields, we send the entire object.
  // The prompt must be very explicit.
  try {
    const prompt = `You are a professional JSON translator. Your task is to translate ALL human-readable Indonesian text inside the following JSON object to ${targetLanguage}.

CRITICAL RULES:
1. ONLY translate text strings that are meant for human reading (like titles, descriptions, content).
2. DO NOT translate keys, property names, IDs, dates, URLs, slugs, or internal codes.
3. DO NOT add, remove, or modify the structure of the JSON. Return the exact same JSON structure.
4. If a value is a number, boolean, array, or object, preserve it perfectly.
5. Return ONLY valid JSON. DO NOT include markdown code blocks (e.g. \`\`\`json) in your response, just the raw JSON text.

JSON to translate:
${JSON.stringify(jsonObj)}
`;
    
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```json')) {
      cleanJsonStr = cleanJsonStr.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    return JSON.parse(cleanJsonStr);
  } catch (error) {
    console.error('Gemini Document Translation Error:', error);
    return jsonObj; // Fallback to original
  }
}

