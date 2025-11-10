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

// User storage table - Username/Password authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email"),
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
  rhythm: text("rhythm"), // rhythm/tempo style (e.g., smooth, groovy, boom-bap, etc.)
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

// Rhythm options by genre
export const RHYTHM_OPTIONS = {
  soul: [
    { value: "smooth", label: "Smooth", description: "Silky, flowing groove with gentle momentum" },
    { value: "groovy", label: "Groovy", description: "Funky, syncopated rhythm that makes you move" },
    { value: "slow-jam", label: "Slow Jam", description: "Intimate, relaxed tempo for deep feeling" },
    { value: "upbeat-soul", label: "Upbeat", description: "Energetic soul with driving momentum" },
  ],
  blues: [
    { value: "slow-blues", label: "Slow Blues", description: "Deep, emotional 12-bar with space to breathe" },
    { value: "shuffle", label: "Shuffle", description: "Lively swung 12/8 feel with bounce" },
    { value: "swing", label: "Swing", description: "Jazz-influenced with smooth walking bass" },
    { value: "jump-blues", label: "Jump Blues", description: "Upbeat, danceable with horn-driven energy" },
  ],
  "hip-hop": [
    { value: "boom-bap", label: "Boom Bap", description: "Classic hard-hitting drums with punch" },
    { value: "trap", label: "Trap", description: "Modern hi-hat rolls with deep 808 bass" },
    { value: "old-school", label: "Old School", description: "Vintage 90s groove with funk samples" },
    { value: "lo-fi", label: "Lo-Fi", description: "Relaxed, jazzy beats with vinyl texture" },
  ],
  reggae: [
    { value: "one-drop", label: "One Drop", description: "Classic roots feel with emphasis on 3rd beat" },
    { value: "rockers", label: "Rockers", description: "Driving four-on-the-floor reggae groove" },
    { value: "steppers", label: "Steppers", description: "Militant marching rhythm with heavy bass" },
    { value: "dancehall", label: "Dancehall", description: "Fast-paced digital riddim for movement" },
  ],
  pop: [
    { value: "upbeat-pop", label: "Upbeat Pop", description: "Energetic radio-friendly with catchy hooks" },
    { value: "mid-tempo", label: "Mid-Tempo", description: "Comfortable groove between fast and slow" },
    { value: "ballad", label: "Ballad", description: "Slow, emotional with space for vocals" },
    { value: "dance-pop", label: "Dance Pop", description: "Four-on-the-floor club-ready beat" },
  ],
  acoustic: [
    { value: "fingerstyle", label: "Fingerstyle", description: "Intricate picked patterns with melody" },
    { value: "strumming", label: "Strumming", description: "Rhythmic chord progression with flow" },
    { value: "folk", label: "Folk", description: "Traditional storytelling with gentle pace" },
    { value: "singer-songwriter", label: "Singer-Songwriter", description: "Intimate, vocal-focused with subtle backing" },
  ],
} as const;

export type RhythmOption = typeof RHYTHM_OPTIONS[keyof typeof RHYTHM_OPTIONS][number];
export type Rhythm = RhythmOption["value"];
