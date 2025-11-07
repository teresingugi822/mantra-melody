import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { mantras, songs, playlists } from "@shared/schema";
import { generateLyrics, generateSongTitle } from "./lib/openai";
import { generateMusic } from "./lib/suno";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication middleware
  await setupAuth(app);

  // Auth route to get current user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
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

  // Get all songs (protected)
  app.get("/api/songs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const allSongs = await storage.getAllSongs(userId);
      res.json(allSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ error: "Failed to fetch songs" });
    }
  });

  // Get songs by playlist type (protected)
  app.get("/api/playlists/:type/songs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type } = req.params;
      const playlistSongs = await storage.getSongsByPlaylistType(userId, type);
      res.json(playlistSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      res.status(500).json({ error: "Failed to fetch playlist songs" });
    }
  });

  // Generate a new song from mantra (protected)
  app.post("/api/songs/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const mantra = await storage.createMantra({ text }, userId);

      // 2. Generate song title
      const title = await generateSongTitle(text);

      // 3. Generate lyrics using OpenAI (exact or transformed)
      const lyrics = await generateLyrics(text, genre, useExactLyrics || false);

      // 4. Create song record (initially pending)
      const song = await storage.createSong({
        mantraId: mantra.id,
        title,
        genre,
        lyrics,
        status: "generating",
        playlistType: playlistType || null,
        vocalGender: vocalGender || null,
        vocalStyle: vocalStyle || null,
        useExactLyrics: useExactLyrics || false,
      }, userId);

      // 5. Generate music using Suno (async)
      try {
        const { audioUrl, status } = await generateMusic(
          lyrics, 
          genre, 
          { gender: vocalGender, style: vocalStyle },
          title
        );
        
        // Update song with audio URL and completed status
        const updatedSong = await storage.updateSong(song.id, userId, {
          audioUrl: audioUrl,
          status: status, // Will be "completed" if we reach here
        });

        res.json(updatedSong);
      } catch (musicError) {
        console.error("Error generating music:", musicError);
        
        // Update song status to error
        await storage.updateSong(song.id, userId, {
          status: "error",
        });

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

  // Get specific song (protected)
  app.get("/api/songs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const song = await storage.getSong(id, userId);
      
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

  // Update song title (protected)
  app.patch("/api/songs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const bodySchema = z.object({
        title: z.string().min(1, "Title cannot be empty"),
      });

      const { title } = bodySchema.parse(req.body);

      const updatedSong = await storage.updateSong(id, userId, { title });

      if (!updatedSong) {
        res.status(404).json({ error: "Song not found" });
        return;
      }

      res.json(updatedSong);
    } catch (error) {
      console.error("Error updating song:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update song" });
      }
    }
  });

  // Delete song (protected)
  app.delete("/api/songs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      const wasDeleted = await storage.deleteSong(id, userId);

      if (!wasDeleted) {
        res.status(404).json({ error: "Song not found" });
        return;
      }

      res.json({ success: true, message: "Song deleted successfully" });
    } catch (error) {
      console.error("Error deleting song:", error);
      res.status(500).json({ error: "Failed to delete song" });
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
