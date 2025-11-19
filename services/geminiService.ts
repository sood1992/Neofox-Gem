import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// Note: In a real production app, backend proxying is better to hide keys, 
// but for a cPanel client-side app, we assume the key is injected via env or user input.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const GeminiService = {
  /**
   * Suggests a detailed breakdown of subtasks based on the main task title and role.
   */
  suggestSubtasks: async (taskTitle: string, role: string): Promise<string[]> => {
    if (!process.env.API_KEY) return [];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `I am a project manager at a creative agency called Neofox Media. 
        Create a list of 4-6 concrete, actionable subtasks for a "${role}" who has been assigned the task: "${taskTitle}".
        Return ONLY the subtasks as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const jsonStr = response.text;
      if (!jsonStr) return [];
      return JSON.parse(jsonStr) as string[];
    } catch (error) {
      console.error("Gemini API Error:", error);
      return [];
    }
  },

  /**
   * Improves a rough task description to be more professional and clear.
   */
  enhanceDescription: async (roughDraft: string): Promise<string> => {
    if (!process.env.API_KEY) return roughDraft;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Rewrite the following task description to be professional, clear, and motivating for a creative professional: "${roughDraft}"`,
      });
      return response.text || roughDraft;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return roughDraft;
    }
  }
};