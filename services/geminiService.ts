
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
    return "AI Service Error: API Key is not configured. Please check your application setup.";
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    if (!response.text) {
        console.warn("Gemini API returned a successful response but with no text content.", response);
        return "AI did not return any content. This might be due to safety settings or an empty response.";
    }
    return response.text;
  } catch (error) {
    console.error("Error generating insights from Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "AI Error: The API key is not valid. Please check your configuration.";
        }
        if (error.message.match(/4\d\d/)) { // Catches 4xx client errors
             return `AI Error: There was an issue with the request (${error.message}). This could be due to invalid input or permissions.`;
        }
        if (error.message.match(/5\d\d/)) { // Catches 5xx server errors
            return "AI Error: The AI service is currently experiencing issues. Please try again later.";
        }
        return `AI Communication Error: ${error.message}. Check console for details.`;
    }
    return "An unknown error occurred while generating insights. Please check the application console for more details.";
  }
};

export const getStrategicInsights = async (prompt: string): Promise<string> => {
  if (!ai) {
    return "AI Service Error: API Key is not configured. Please check your application setup.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    if (!response.text) {
        console.warn("Gemini API returned a successful response but with no text content.", response);
        return "AI did not return any strategic content. This might be due to safety settings or an empty response.";
    }
    return response.text;
  } catch (error) {
    console.error("Error generating strategic insights from Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "AI Error: The API key is not valid. Please check your configuration.";
        }
        if (error.message.match(/4\d\d/)) { // Catches 4xx client errors
             return `AI Error: There was an issue with the request (${error.message}). This could be due to invalid input or permissions.`;
        }
        if (error.message.match(/5\d\d/)) { // Catches 5xx server errors
            return "AI Error: The AI service is currently experiencing issues. Please try again later.";
        }
        return `AI Communication Error: ${error.message}. Check console for details.`;
    }
    return "An unknown error occurred while generating strategic insights. Please check the application console for more details.";
  }
};
