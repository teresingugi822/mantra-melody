import { 
  type Mantra, 
  type InsertMantra, 
  type Song, 
  type InsertSong, 
  type Playlist, 
  type InsertPlaylist,
  type User,
  mantras,
  songs,
  playlists,
  users
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations - Username/Password Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(username: string, password: string, email?: string): Promise<User>;
  verifyUserPassword(username: string, password: string): Promise<User | undefined>;

  // Mantra operations
  createMantra(mantra: InsertMantra, userId: string): Promise<Mantra>;
  getMantra(id: string): Promise<Mantra | undefined>;
  getAllMantras(userId: string): Promise<Mantra[]>;

  // Song operations
  createSong(song: InsertSong, userId: string): Promise<Song>;
  getSong(id: string, userId: string): Promise<Song | undefined>;
  getAllSongs(userId: string): Promise<Song[]>;
  getSongsByPlaylistType(userId: string, type: string): Promise<Song[]>;
  updateSong(id: string, userId: string, updates: Partial<Song>): Promise<Song | undefined>;
  deleteSong(id: string, userId: string): Promise<boolean>;

  // Playlist operations
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  getPlaylist(id: string): Promise<Playlist | undefined>;
  getAllPlaylists(): Promise<Playlist[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Username/Password Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(username: string, password: string, email?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        email: email || null,
      })
      .returning();
    return user;
  }

  async verifyUserPassword(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return undefined;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return undefined;
    }
    return user;
  }

  // Mantra operations
  async createMantra(insertMantra: InsertMantra, userId: string): Promise<Mantra> {
    const [mantra] = await db
      .insert(mantras)
      .values({ ...insertMantra, userId })
      .returning();
    return mantra;
  }

  async getMantra(id: string): Promise<Mantra | undefined> {
    const [mantra] = await db.select().from(mantras).where(eq(mantras.id, id));
    return mantra;
  }

  async getAllMantras(userId: string): Promise<Mantra[]> {
    return await db
      .select()
      .from(mantras)
      .where(eq(mantras.userId, userId))
      .orderBy(mantras.createdAt);
  }

  // Song operations
  async createSong(insertSong: InsertSong, userId: string): Promise<Song> {
    const [song] = await db
      .insert(songs)
      .values({ ...insertSong, userId })
      .returning();
    return song;
  }

  async getSong(id: string, userId: string): Promise<Song | undefined> {
    const [song] = await db
      .select()
      .from(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)));
    return song;
  }

  async getAllSongs(userId: string): Promise<Song[]> {
    return await db
      .select()
      .from(songs)
      .where(eq(songs.userId, userId))
      .orderBy(songs.createdAt);
  }

  async getSongsByPlaylistType(userId: string, type: string): Promise<Song[]> {
    return await db
      .select()
      .from(songs)
      .where(and(eq(songs.userId, userId), eq(songs.playlistType, type)))
      .orderBy(songs.createdAt);
  }

  async updateSong(id: string, userId: string, updates: Partial<Song>): Promise<Song | undefined> {
    const [song] = await db
      .update(songs)
      .set(updates)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning();
    return song;
  }

  async deleteSong(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(songs)
      .where(and(eq(songs.id, id), eq(songs.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Playlist operations
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const [playlist] = await db
      .insert(playlists)
      .values(insertPlaylist)
      .returning();
    return playlist;
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .orderBy(playlists.createdAt);
  }
}

export const storage = new DatabaseStorage();
