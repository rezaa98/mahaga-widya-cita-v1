import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
// Using Gemma as fallback because Gemini has quota limit 0 for this key
const model = genAI.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' });

export async function translateText(text: string, targetLanguage: string = 'English'): Promise<string> {
  if (!text) return text;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Translation skipped.');
    return text;
  }

  try {
    const prompt = `Translate the following text from Indonesian to ${targetLanguage}. Provide ONLY the translation without any quotes, markdown formatting, or explanations.\n\nText:\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini Translation Error:', error);
    return text; 
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
3. Return ONLY valid JSON, with NO markdown code blocks.

JSON to translate:
${JSON.stringify(jsonObj)}`;
    
    const result = await model.generateContent(prompt);
    let responseText = await result.response.text();
    
    let jsonStr = responseText.trim();
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      let startIdx = responseText.indexOf('{');
      while (startIdx !== -1) {
        let braces = 0;
        for (let i = startIdx; i < responseText.length; i++) {
          if (responseText[i] === '{') braces++;
          if (responseText[i] === '}') braces--;
          if (braces === 0) {
            try {
              return JSON.parse(responseText.substring(startIdx, i + 1));
            } catch (err) {
              break;
            }
          }
        }
        startIdx = responseText.indexOf('{', startIdx + 1);
      }
      throw new Error("Could not extract valid JSON from response");
    }
  } catch (error) {
    console.error('Gemini Lexical Translation Error:', error);
    return jsonObj;
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
    let responseText = await result.response.text();
    
    // Robust JSON extraction to handle chatty/duplicate outputs from Gemma
    let jsonStr = responseText.trim();
    
    // Try simple parse first
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      // Find all possible JSON-like blocks and try parsing them
      const potentialBlocks = responseText.match(/\{[\s\S]*?\}/g) || [];
      // Combine adjacent blocks if it's a nested structure, but it's safer to just find the largest valid block
      // Instead of regex, let's just find the first valid JSON by balancing braces
      let startIdx = responseText.indexOf('{');
      while (startIdx !== -1) {
        let braces = 0;
        for (let i = startIdx; i < responseText.length; i++) {
          if (responseText[i] === '{') braces++;
          if (responseText[i] === '}') braces--;
          if (braces === 0) {
            try {
              const extracted = responseText.substring(startIdx, i + 1);
              return JSON.parse(extracted);
            } catch (err) {
              break; // Not valid JSON, continue searching
            }
          }
        }
        startIdx = responseText.indexOf('{', startIdx + 1);
      }
      throw new Error("Could not extract valid JSON from response");
    }
  } catch (error) {
    console.error('Gemini Document Translation Error:', error);
    return jsonObj;
  }
}

