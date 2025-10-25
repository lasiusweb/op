
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("Gemini API key not found in environment variables. AI features will not work.");
}

export const getGeminiInsights = async (prompt: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Unable to generate insights.";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights from Gemini:", error);
    if (error instanceof Error) {
        return `Failed to generate insights: ${error.message}`;
    }
    return "Failed to generate insights. Please check the console for details.";
  }
};

export const getStrategicInsights = async (prompt: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Unable to generate strategic insights.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating strategic insights from Gemini:", error);
    if (error instanceof Error) {
        return `Failed to generate insights: ${error.message}`;
    }
    return "Failed to generate strategic insights. Please check the console for details.";
  }
};
