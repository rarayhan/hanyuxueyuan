import deepseekClient from "./deepseek";

export async function getDailyQuote() {
  try {
    const completion = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ 
        role: "user", 
        content: "Give me an inspiring quote about learning or perseverance, preferably from a Chinese philosopher. Provide it in Chinese characters, Pinyin, and English translation. Format as JSON: { \"chinese\": \"...\", \"pinyin\": \"...\", \"english\": \"...\" }" 
      }],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error("Error fetching quote:", error);
    return {
      chinese: "学而不思则罔，思而不学则殆。",
      pinyin: "Xué ér bù sī zé wǎng, sī ér bù xué zé dài.",
      english: "Learning without thought is labor lost; thought without learning is perilous."
    };
  }
}
