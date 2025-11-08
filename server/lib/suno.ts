// Suno AI Music Generation Service
// This service integrates with SunoAPI.org for music generation

interface SunoGenerateRequest {
  prompt: string; // In custom mode, this is the LYRICS text to be sung
  style: string; // Music genre/style description
  title?: string;
  customMode: boolean;
  instrumental: boolean;
  vocalGender?: "m" | "f";
  model?: string;
  callBackUrl?: string;
}

interface SunoGenerateResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface SunoStatusResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    status: "PENDING" | "TEXT_SUCCESS" | "FIRST_SUCCESS" | "SUCCESS" | "CREATE_TASK_FAILED" | "GENERATE_AUDIO_FAILED" | "CALLBACK_EXCEPTION" | "SENSITIVE_WORD_ERROR";
    response?: {
      sunoData?: Array<{
        id: string;
        audioUrl: string;
        streamAudioUrl: string;
        imageUrl: string;
        title: string;
        tags: string;
        duration: number;
      }>;
    };
  };
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
    console.error("SUNO_API_KEY not configured - cannot generate music");
    throw new Error("Suno API key not configured");
  }

  try {
    // Build style description with vocal characteristics
    let styleDescription = genre;
    if (voiceOptions?.style) {
      styleDescription = `${genre}, ${voiceOptions.style}`;
    }

    // Map gender to API format (m/f)
    const vocalGender = voiceOptions?.gender === "male" ? "m" : 
                       voiceOptions?.gender === "female" ? "f" : 
                       undefined;

    console.log(`Generating music - Style: ${styleDescription}, Gender: ${vocalGender || 'unspecified'}, Lyrics length: ${lyrics.length} chars`);

    const sunoPayload = {
      prompt: lyrics, // In custom mode, prompt = the lyrics to sing
      style: styleDescription, // Genre/style description
      title: title || "Mantra Song",
      customMode: true,
      instrumental: false,
      vocalGender: vocalGender,
      model: "V4",
      callBackUrl: `${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000'}/api/suno/callback`
    };

    console.log(`Suno API payload - Lyrics to sing: ${lyrics.substring(0, 100)}..., Style: ${styleDescription}, Instrumental: false`);

    // Call SunoAPI.org generate endpoint
    const generateResponse = await fetch("https://api.sunoapi.org/api/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sunoPayload)
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

    // Poll for completion (retry up to 120 times with 3 second intervals = 360 seconds / 6 minutes max)
    // Suno can take 3-6 minutes for complex songs
    let attempts = 0;
    const maxAttempts = 120;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between polls
      
      const statusResponse = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        console.warn(`Status check failed: ${statusResponse.status}`);
        attempts++;
        continue;
      }

      const statusData = await statusResponse.json() as SunoStatusResponse;

      if (statusData.code === 200) {
        const taskStatus = statusData.data.status;
        
        if (taskStatus === "SUCCESS" && statusData.data.response?.sunoData?.[0]?.audioUrl) {
          const audioUrl = statusData.data.response.sunoData[0].audioUrl;
          console.log(`Song generation completed: ${audioUrl}`);
          return {
            audioUrl: audioUrl,
            status: "completed"
          };
        } else if (taskStatus === "CREATE_TASK_FAILED" || taskStatus === "GENERATE_AUDIO_FAILED" || taskStatus === "SENSITIVE_WORD_ERROR") {
          throw new Error(`Song generation failed with status: ${taskStatus}`);
        }
        
        console.log(`Song status: ${taskStatus}, attempt ${attempts + 1}/${maxAttempts}`);
      }

      attempts++;
    }

    // If we get here, polling timed out
    console.error(`Song generation timed out after ${maxAttempts * 3} seconds (${maxAttempts} attempts)`);
    throw new Error("Music generation is taking longer than expected. This can happen with complex songs. Please try again or try a simpler mantra.");

  } catch (error) {
    console.error("Error generating music with Suno:", error);
    // Re-throw the error to propagate to route handler
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate music. Please try again.");
  }
}

export async function checkSongStatus(taskId: string): Promise<{ audioUrl?: string; status: string }> {
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiKey) {
    return { status: "error" };
  }

  try {
    const response = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.status}`);
    }

    const data = await response.json() as SunoStatusResponse;

    if (data.code === 200) {
      const taskStatus = data.data.status;
      
      if (taskStatus === "SUCCESS" && data.data.response?.sunoData?.[0]?.audioUrl) {
        return {
          status: "completed",
          audioUrl: data.data.response.sunoData[0].audioUrl
        };
      } else if (taskStatus === "CREATE_TASK_FAILED" || taskStatus === "GENERATE_AUDIO_FAILED" || taskStatus === "SENSITIVE_WORD_ERROR") {
        return {
          status: "error"
        };
      }
      
      return {
        status: "generating"
      };
    }

    return { status: "error" };
  } catch (error) {
    console.error("Error checking song status:", error);
    return { status: "error" };
  }
}
