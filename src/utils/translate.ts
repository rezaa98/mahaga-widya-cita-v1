import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
// Using Gemma as fallback because Gemini has quota limit 0 for this key
const model = genAI.getGenerativeModel({ model: "gemma-4-26b-a4b-it" });

export async function translateText(text: string, targetLanguage: string = "English"): Promise<string> {
  if (!text) return text;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Translation skipped.");
    return text;
  }

  try {
    const prompt = `Translate the following text from Indonesian to ${targetLanguage}. Provide ONLY the translation without any quotes, markdown formatting, or explanations.\n\nText:\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini Translation Error:", error);
    return text;
  }
}

export async function translateLexicalJSON(jsonObj: any, targetLanguage: string = "English"): Promise<any> {
  if (!jsonObj) return jsonObj;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Translation skipped.");
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
      let startIdx = responseText.indexOf("{");
      while (startIdx !== -1) {
        let braces = 0;
        for (let i = startIdx; i < responseText.length; i++) {
          if (responseText[i] === "{") braces++;
          if (responseText[i] === "}") braces--;
          if (braces === 0) {
            try {
              return JSON.parse(responseText.substring(startIdx, i + 1));
            } catch (err) {
              break;
            }
          }
        }
        startIdx = responseText.indexOf("{", startIdx + 1);
      }
      throw new Error("Could not extract valid JSON from response");
    }
  } catch (error) {
    console.error("Gemini Lexical Translation Error:", error);
    return jsonObj;
  }
}

// Helper to check if a string contains any letters (needs translation)
function needsTranslation(str: string) {
  return typeof str === "string" && /[a-zA-Z]/.test(str) && str.trim().length > 0;
}

export async function translateDocumentJSON(
  jsonObj: any,
  targetLanguage: string = "English",
  sourceLanguage: string = "Indonesian",
): Promise<any> {
  if (!jsonObj) return jsonObj;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Translation skipped.");
    return jsonObj;
  }

  // To prevent the AI from removing necessary fields, we send the entire object.

  // 1. Extract all strings from the JSON object while keeping their paths
  const stringsToTranslate: string[] = [];
  const paths: any[][] = [];

  function traverseAndExtract(obj: any, currentPath: any[] = []) {
    if (!obj) return;
    if (typeof obj === "string") {
      if (needsTranslation(obj)) {
        stringsToTranslate.push(obj);
        paths.push(currentPath);
      }
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => traverseAndExtract(item, [...currentPath, index]));
      return;
    }
    if (typeof obj === "object") {
      for (const key in obj) {
        // Skip some system or technical fields
        if (
          key === "url" ||
          key === "href" ||
          key === "id" ||
          key === "blockType" ||
          key === "mimeType" ||
          key === "filename" ||
          key === "platform" ||
          key === "icon"
        )
          continue;
        traverseAndExtract(obj[key], [...currentPath, key]);
      }
    }
  }

  traverseAndExtract(jsonObj);

  if (stringsToTranslate.length === 0) return jsonObj;

  // 2. Translate the strings in batches to avoid overwhelming the model
  const translatedStrings: string[] = [];
  const batchSize = 30; // Small batch size for Gemma

  for (let i = 0; i < stringsToTranslate.length; i += batchSize) {
    const batch = stringsToTranslate.slice(i, i + batchSize);
    const prompt = `Translate the following array of strings from ${sourceLanguage} to ${targetLanguage}. 
IMPORTANT RULES:
1. You MUST return ONLY a valid JSON array of strings.
2. The returned array MUST have exactly ${batch.length} elements.
3. Keep the exact same order as the input.
4. Do NOT include markdown code blocks. Output the raw JSON array.

INPUT ARRAY:
${JSON.stringify(batch)}`;

    try {
      const result = await model.generateContent(prompt);
      let responseText = await result.response.text();

      let parsedArray: string[] = [];
      let jsonStr = responseText.trim();

      try {
        parsedArray = JSON.parse(jsonStr);
      } catch (e) {
        // Robust extraction
        let startIdx = responseText.indexOf("[");
        let braces = 0;
        let found = false;
        if (startIdx !== -1) {
          for (let j = startIdx; j < responseText.length; j++) {
            if (responseText[j] === "[") braces++;
            if (responseText[j] === "]") braces--;
            if (braces === 0) {
              try {
                parsedArray = JSON.parse(responseText.substring(startIdx, j + 1));
                found = true;
                break;
              } catch (err) {}
            }
          }
        }
        if (!found) throw new Error("Could not extract valid JSON array");
      }

      if (Array.isArray(parsedArray) && parsedArray.length === batch.length) {
        translatedStrings.push(...parsedArray);
      } else {
        // Fallback to original strings for this batch if length mismatches
        translatedStrings.push(...batch);
      }
    } catch (error) {
      console.error("Batch translation error:", error);
      translatedStrings.push(...batch);
    }
  }

  // 3. Reconstruct the object with translated strings
  // Deep clone to avoid mutating original
  const resultObj = JSON.parse(JSON.stringify(jsonObj));

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const translatedText = translatedStrings[i] || stringsToTranslate[i];

    // Navigate and set
    let current = resultObj;
    for (let j = 0; j < path.length - 1; j++) {
      current = current[path[j]];
    }
    current[path[path.length - 1]] = translatedText;
  }

  return resultObj;
}
