import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Reference: blueprint:javascript_openai_ai_integrations
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function generateLyrics(
  mantraText: string, 
  genre: string, 
  useExactLyrics: boolean = false
): Promise<string> {
  // If user wants exact lyrics, return the mantra with song structure
  if (useExactLyrics) {
    // Format the mantra as repeating lyrics with verse/chorus structure
    const lines = mantraText.split(/[.!?]/).filter(line => line.trim());
    
    if (lines.length === 0) {
      return mantraText;
    }
    
    // Create a simple song structure with the exact mantra words
    const verse = lines.join('\n').trim();
    return `[Verse]\n${verse}\n\n[Chorus]\n${verse}\n\n[Verse]\n${verse}\n\n[Chorus]\n${verse}`;
  }

  // Otherwise, transform into song lyrics using AI
  try {
    console.log(`Generating lyrics for ${genre} song from mantra: "${mantraText.substring(0, 50)}..."`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
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
    
    if (!lyrics || lyrics.trim().length === 0) {
      console.error("OpenAI returned empty lyrics");
      throw new Error("OpenAI returned empty lyrics");
    }
    
    console.log(`Generated lyrics (${lyrics.length} chars)`);
    return lyrics.trim();
  } catch (error) {
    console.error("Error generating lyrics:", error);
    throw new Error(`Failed to generate song lyrics: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateSongTitle(mantraText: string): Promise<string> {
  try {
    console.log(`Generating title for mantra: "${mantraText.substring(0, 50)}..."`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    const cleanTitle = title.trim().replace(/['"]/g, ''); // Remove quotes if present
    
    if (!cleanTitle || cleanTitle.length === 0) {
      console.warn("OpenAI returned empty title, using fallback");
      const words = mantraText.split(' ').slice(0, 4);
      return words.join(' ');
    }
    
    console.log(`Generated title: "${cleanTitle}"`);
    return cleanTitle;
  } catch (error) {
    console.error("Error generating title:", error);
    // Fallback: use first few words of mantra
    const words = mantraText.split(' ').slice(0, 4);
    const fallbackTitle = words.join(' ');
    console.log(`Using fallback title: "${fallbackTitle}"`);
    return fallbackTitle;
  }
}
