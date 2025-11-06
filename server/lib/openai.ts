import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Reference: blueprint:javascript_openai_ai_integrations
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function generateLyrics(mantraText: string, genre: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a skilled songwriter who transforms personal mantras and affirmations into powerful song lyrics. Create lyrics that are uplifting, emotionally resonant, and maintain the core message of the user's mantra. The lyrics should be appropriate for the ${genre} genre.`
        },
        {
          role: "user",
          content: `Transform this personal mantra into song lyrics for a ${genre} song:\n\n"${mantraText}"\n\nCreate 2-3 verses with a memorable chorus. Keep the core message and positive energy of the original mantra. Make it singable and emotionally moving.`
        }
      ],
      max_completion_tokens: 1000,
    });

    const lyrics = response.choices[0]?.message?.content || "";
    return lyrics.trim();
  } catch (error) {
    console.error("Error generating lyrics:", error);
    throw new Error("Failed to generate song lyrics");
  }
}

export async function generateSongTitle(mantraText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative songwriter. Generate short, inspiring song titles (3-6 words) based on the user's mantra. The title should capture the essence and emotion of their affirmation."
        },
        {
          role: "user",
          content: `Create an inspiring song title for this mantra: "${mantraText}"`
        }
      ],
      max_completion_tokens: 50,
    });

    const title = response.choices[0]?.message?.content || "";
    return title.trim().replace(/['"]/g, ''); // Remove quotes if present
  } catch (error) {
    console.error("Error generating title:", error);
    // Fallback: use first few words of mantra
    const words = mantraText.split(' ').slice(0, 4);
    return words.join(' ');
  }
}
