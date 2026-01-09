
import { GoogleGenAI, Type } from "@google/genai";
import { KidProfile, WorksheetData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Helper to extract JSON from a string that might contain markdown or trailing text.
 */
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown blocks if present
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:json)?([\s\S]*?)```/);
    if (match) cleaned = match[1].trim();
  }
  // Find the first '{' and last '}' to handle trailing conversational text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

export const generateWorksheet = async (profile: KidProfile, request: string): Promise<WorksheetData> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `You are an elite 1st-grade educational content creator. Your goal is to create fun, high-engagement worksheets.
  
  CRITICAL MATH RULES:
  1. ALL math questions MUST be purely numerical equations.
  2. FORMAT: "Number [Operator] Number". Example: "10 + 5" or "12 - 3".
  3. STRICTLY NO text or currency names (like V-Bucks) inside the 'question' field.
  4. Each math section MUST contain exactly 12 problems.
  
  MAZE RULES:
  1. For 'maze' sections, provide a 'mazeConfig'. 
  2. Width and Height MUST be small integers between 10 and 20. DO NOT use scientific notation or large numbers.
  
  RESPONSE RULES:
  1. Return ONLY the JSON object. No preamble or post-text.`;

  const prompt = `Create a worksheet for ${profile.name} (Age: ${profile.age}, Grade: ${profile.grade}).
  Interests: ${profile.interests.join(', ')}.
  Focus: ${profile.struggles}.
  Request: ${request}
  Ensure math is 1st-grade level and strictly numerical.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          theme: { type: Type.STRING },
          heroMessage: { type: Type.STRING },
          funFact: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['math', 'reading', 'writing', 'puzzle', 'drawing', 'maze'] },
                mazeConfig: {
                  type: Type.OBJECT,
                  properties: {
                    width: { type: Type.INTEGER, description: "Width of maze, max 20" },
                    height: { type: Type.INTEGER, description: "Height of maze, max 20" },
                    seed: { type: Type.INTEGER }
                  }
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      instruction: { type: Type.STRING },
                      answerPlaceholder: { type: Type.STRING }
                    },
                    required: ['id', 'question']
                  }
                }
              },
              required: ['title', 'type', 'items']
            }
          }
        },
        required: ['title', 'theme', 'sections', 'heroMessage']
      }
    }
  });

  try {
    const rawText = response.text || '{}';
    const cleanedJson = cleanJsonResponse(rawText);
    const data = JSON.parse(cleanedJson);
    
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      kidName: profile.name
    };
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error("The worksheet data was malformed. Please try again!");
  }
};
