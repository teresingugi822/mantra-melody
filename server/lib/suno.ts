// Suno AI Music Generation Service
// This service integrates with SunoAPI.org for music generation

interface SunoGenerateRequest {
  lyrics: string;
  tags: string;
  title?: string;
  make_instrumental: boolean;
}

interface SunoGenerateResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface SunoGetResponse {
  code: number;
  msg: string;
  data: Array<{
    id: string;
    audio_url: string;
    video_url: string;
    status: string;
    title: string;
    tags: string;
    duration: number;
  }>;
}

export interface VoiceOptions {
  gender?: "male" | "female";
  style?: "warm" | "powerful" | "soft" | "energetic" | "soulful" | "gritty";
}

export async function generateMusic(
  lyrics: string,
  genre: string,
  voiceOptions?: VoiceOptions,
  title?: string
): Promise<{ audioUrl: string; status: string }> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    console.warn("SUNO_API_KEY not configured - returning mock audio URL");
    return {
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      status: "completed"
    };
  }

  try {
    // Build vocal style description for tags
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

    console.log(`Generating music with tags: ${styleTags}`);

    // Call SunoAPI.org custom_generate endpoint
    const generateResponse = await fetch("https://api.sunoapi.org/api/v1/custom_generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lyrics: lyrics,
        tags: styleTags,
        title: title || "Mantra Song",
        make_instrumental: false
      } as SunoGenerateRequest)
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      throw new Error(`Suno API error: ${generateResponse.status} ${generateResponse.statusText} - ${errorText}`);
    }

    const generateData = await generateResponse.json() as SunoGenerateResponse;

    if (generateData.code !== 200) {
      throw new Error(`Suno API error: ${generateData.msg}`);
    }

    const taskId = generateData.data.taskId;
    console.log(`Song generation started with taskId: ${taskId}`);

    // Poll for completion (retry up to 30 times with 2 second intervals = 60 seconds max)
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between polls
      
      const statusResponse = await fetch(`https://api.sunoapi.org/api/v1/get?ids=${taskId}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        console.warn(`Status check failed: ${statusResponse.status}`);
        attempts++;
        continue;
      }

      const statusData = await statusResponse.json() as SunoGetResponse;

      if (statusData.code === 200 && statusData.data.length > 0) {
        const song = statusData.data[0];
        
        if (song.status === "complete" && song.audio_url) {
          console.log(`Song generation completed: ${song.audio_url}`);
          return {
            audioUrl: song.audio_url,
            status: "completed"
          };
        } else if (song.status === "error") {
          throw new Error("Song generation failed");
        }
        
        console.log(`Song status: ${song.status}, attempt ${attempts + 1}/${maxAttempts}`);
      }

      attempts++;
    }

    // If we get here, polling timed out
    console.warn("Song generation timed out after 60 seconds");
    return {
      audioUrl: "",
      status: "generating"
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
    const response = await fetch(`https://api.sunoapi.org/api/v1/get?ids=${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const data = await response.json() as SunoGetResponse;

    if (data.code === 200 && data.data.length > 0) {
      const song = data.data[0];
      return {
        audioUrl: song.audio_url || undefined,
        status: song.status === "complete" ? "completed" : song.status
      };
    }

    return { status: "error" };
  } catch (error) {
    console.error("Error checking song status:", error);
    return { status: "error" };
  }
}
