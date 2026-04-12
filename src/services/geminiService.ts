import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getDailyQuote() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give me an inspiring quote about learning or perseverance, preferably from a Chinese philosopher. Provide it in Chinese characters, Pinyin, and English translation. Format as JSON: { \"chinese\": \"...\", \"pinyin\": \"...\", \"english\": \"...\" }",
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error fetching quote:", error);
    return {
      chinese: "学而不思则罔，思而不学则殆。",
      pinyin: "Xué ér bù sī zé wǎng, sī ér bù xué zé dài.",
      english: "Learning without thought is labor lost; thought without learning is perilous."
    };
  }
}
