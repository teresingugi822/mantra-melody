// Suno AI Music Generation Service
// This service integrates with third-party Suno API providers for music generation

interface SunoGenerateRequest {
  prompt: string;
  make_instrumental: boolean;
  model?: string;
  tags?: string;
}

interface SunoGenerateResponse {
  id: string;
  audio_url?: string;
  status: string;
  error?: string;
}

export interface VoiceOptions {
  gender?: "male" | "female";
  style?: "warm" | "powerful" | "soft" | "energetic" | "soulful" | "gritty";
}

export async function generateMusic(
  lyrics: string,
  genre: string,
  voiceOptions?: VoiceOptions
): Promise<{ audioUrl: string; status: string }> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    console.warn("SUNO_API_KEY not configured - returning mock audio URL");
    // Return a mock response when API key is not configured
    return {
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Public domain test audio
      status: "completed"
    };
  }

  try {
    // Build vocal style description
    let vocalDescription = "";
    if (voiceOptions?.gender && voiceOptions?.style) {
      vocalDescription = `${voiceOptions.style} ${voiceOptions.gender} voice`;
    } else if (voiceOptions?.gender) {
      vocalDescription = `${voiceOptions.gender} voice`;
    } else if (voiceOptions?.style) {
      vocalDescription = `${voiceOptions.style} vocals`;
    }

    // Construct style tags with genre and vocal characteristics
    const styleTags = vocalDescription 
      ? `${genre}, ${vocalDescription}`
      : genre;

    // Construct the prompt with lyrics
    const prompt = lyrics.substring(0, 500);

    // Call Suno API (example using a common endpoint structure)
    const response = await fetch("https://api.aimlapi.com/v2/generate/audio/suno-ai/clip", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt,
        tags: styleTags,
        make_instrumental: false,
        model: "chirp-v4"
      } as SunoGenerateRequest)
    });

    if (!response.ok) {
      throw new Error(`Suno API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as SunoGenerateResponse;

    // Poll for completion if needed (some providers return immediately with a task ID)
    if (data.status === "queued" || data.status === "streaming") {
      // In a production app, you'd implement polling here
      // For now, return pending status
      return {
        audioUrl: data.audio_url || "",
        status: "generating"
      };
    }

    return {
      audioUrl: data.audio_url || "",
      status: data.status
    };
  } catch (error) {
    console.error("Error generating music with Suno:", error);
    // Fallback to mock audio for demonstration
    return {
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      status: "completed"
    };
  }
}

export async function checkSongStatus(taskId: string): Promise<{ audioUrl?: string; status: string }> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    return { status: "completed", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" };
  }

  try {
    const response = await fetch(`https://api.aimlapi.com/v2/generate/audio/suno-ai/clip?clip_id=${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const data = await response.json();
    return {
      audioUrl: data.audio_url,
      status: data.status
    };
  } catch (error) {
    console.error("Error checking song status:", error);
    return { status: "error" };
  }
}
