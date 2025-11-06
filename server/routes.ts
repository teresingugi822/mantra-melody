import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { mantras, songs, playlists } from "@shared/schema";
import { generateLyrics, generateSongTitle } from "./lib/openai";
import { generateMusic } from "./lib/suno";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Suno callback endpoint - receives updates when songs are ready
  app.post("/api/suno/callback", async (req, res) => {
    try {
      console.log("Suno callback received:", JSON.stringify(req.body, null, 2));
      // Acknowledge the callback
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error handling Suno callback:", error);
      res.status(500).json({ error: "Failed to process callback" });
    }
  });

  // Get all songs
  app.get("/api/songs", async (req, res) => {
    try {
      const allSongs = await db.select().from(songs).orderBy(songs.createdAt);
      res.json(allSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ error: "Failed to fetch songs" });
    }
  });

  // Get songs by playlist type
  app.get("/api/playlists/:type/songs", async (req, res) => {
    try {
      const { type } = req.params;
      const playlistSongs = await db
        .select()
        .from(songs)
        .where(eq(songs.playlistType, type))
        .orderBy(songs.createdAt);
      res.json(playlistSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      res.status(500).json({ error: "Failed to fetch playlist songs" });
    }
  });

  // Generate a new song from mantra
  app.post("/api/songs/generate", async (req, res) => {
    try {
      const bodySchema = z.object({
        text: z.string().min(1),
        genre: z.enum(["soul", "blues", "hip-hop", "reggae", "pop", "acoustic"]),
        playlistType: z.enum(["morning", "daytime", "bedtime"]).optional(),
        vocalGender: z.enum(["male", "female"]).optional(),
        vocalStyle: z.enum(["warm", "powerful", "soft", "energetic", "soulful", "gritty"]).optional(),
        useExactLyrics: z.boolean().optional(),
      });

      const { text, genre, playlistType, vocalGender, vocalStyle, useExactLyrics } = bodySchema.parse(req.body);

      // 1. Create mantra record
      const [mantra] = await db.insert(mantras).values({
        text,
      }).returning();

      // 2. Generate song title
      const title = await generateSongTitle(text);

      // 3. Generate lyrics using OpenAI (exact or transformed)
      const lyrics = await generateLyrics(text, genre, useExactLyrics || false);

      // 4. Create song record (initially pending)
      const [song] = await db.insert(songs).values({
        mantraId: mantra.id,
        title,
        genre,
        lyrics,
        status: "generating",
        playlistType: playlistType || null,
        vocalGender: vocalGender || null,
        vocalStyle: vocalStyle || null,
        useExactLyrics: useExactLyrics || false,
      }).returning();

      // 5. Generate music using Suno (async)
      try {
        const { audioUrl, status } = await generateMusic(
          lyrics, 
          genre, 
          { gender: vocalGender, style: vocalStyle },
          title
        );
        
        // Update song with audio URL and completed status
        const [updatedSong] = await db
          .update(songs)
          .set({
            audioUrl: audioUrl,
            status: status, // Will be "completed" if we reach here
          })
          .where(eq(songs.id, song.id))
          .returning();

        res.json(updatedSong);
      } catch (musicError) {
        console.error("Error generating music:", musicError);
        
        // Update song status to error
        await db
          .update(songs)
          .set({
            status: "error",
          })
          .where(eq(songs.id, song.id));

        const errorMessage = musicError instanceof Error ? musicError.message : "Music generation failed. Please try again.";
        res.status(500).json({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error generating song:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to generate song" });
      }
    }
  });

  // Get specific song
  app.get("/api/songs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [song] = await db.select().from(songs).where(eq(songs.id, id)).limit(1);
      
      if (!song) {
        res.status(404).json({ error: "Song not found" });
        return;
      }

      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ error: "Failed to fetch song" });
    }
  });

  // Get all playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const allPlaylists = await db.select().from(playlists).orderBy(playlists.createdAt);
      res.json(allPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  });

  // Create playlist
  app.post("/api/playlists", async (req, res) => {
    try {
      const bodySchema = z.object({
        name: z.string().min(1),
        type: z.enum(["morning", "daytime", "bedtime", "custom"]),
        description: z.string().optional(),
      });

      const data = bodySchema.parse(req.body);
      const [playlist] = await db.insert(playlists).values(data).returning();

      res.json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create playlist" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
