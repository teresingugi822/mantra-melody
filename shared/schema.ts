import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Replit Auth - Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Replit Auth - User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mantras table - user's written goals and affirmations
export const mantras = pgTable("mantras", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Songs table - generated mantra songs
export const songs = pgTable("songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mantraId: varchar("mantra_id").references(() => mantras.id),
  title: text("title").notNull(),
  genre: text("genre").notNull(), // soul, blues, hip-hop, reggae, pop, acoustic
  lyrics: text("lyrics").notNull(),
  audioUrl: text("audio_url"),
  status: text("status").notNull().default("pending"), // pending, generating, completed, error
  playlistType: text("playlist_type"), // morning, daytime, bedtime, null for custom
  vocalGender: text("vocal_gender"), // male, female
  vocalStyle: text("vocal_style"), // warm, powerful, soft, energetic, soulful, gritty
  useExactLyrics: boolean("use_exact_lyrics").default(false), // use exact mantra words vs transformed lyrics
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Playlists table - curated and custom playlists
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // morning, daytime, bedtime, custom
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertMantraSchema = createInsertSchema(mantras).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertMantra = z.infer<typeof insertMantraSchema>;
export type Mantra = typeof mantras.$inferSelect;

export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

// Genre options
export const GENRES = ["soul", "blues", "hip-hop", "reggae", "pop", "acoustic"] as const;
export type Genre = typeof GENRES[number];

// Playlist types
export const PLAYLIST_TYPES = ["morning", "daytime", "bedtime", "custom"] as const;
export type PlaylistType = typeof PLAYLIST_TYPES[number];

// Vocal options
export const VOCAL_GENDERS = ["male", "female"] as const;
export type VocalGender = typeof VOCAL_GENDERS[number];

export const VOCAL_STYLES = ["warm", "powerful", "soft", "energetic", "soulful", "gritty"] as const;
export type VocalStyle = typeof VOCAL_STYLES[number];
