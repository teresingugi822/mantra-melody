import { type Mantra, type InsertMantra, type Song, type InsertSong, type Playlist, type InsertPlaylist } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Mantra operations
  createMantra(mantra: InsertMantra): Promise<Mantra>;
  getMantra(id: string): Promise<Mantra | undefined>;
  getAllMantras(): Promise<Mantra[]>;

  // Song operations
  createSong(song: InsertSong): Promise<Song>;
  getSong(id: string): Promise<Song | undefined>;
  getAllSongs(): Promise<Song[]>;
  getSongsByPlaylistType(type: string): Promise<Song[]>;
  updateSong(id: string, updates: Partial<Song>): Promise<Song | undefined>;

  // Playlist operations
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  getPlaylist(id: string): Promise<Playlist | undefined>;
  getAllPlaylists(): Promise<Playlist[]>;
}

export class MemStorage implements IStorage {
  private mantras: Map<string, Mantra>;
  private songs: Map<string, Song>;
  private playlists: Map<string, Playlist>;

  constructor() {
    this.mantras = new Map();
    this.songs = new Map();
    this.playlists = new Map();
  }

  async createMantra(insertMantra: InsertMantra): Promise<Mantra> {
    const id = randomUUID();
    const mantra: Mantra = { 
      ...insertMantra, 
      id,
      createdAt: new Date()
    };
    this.mantras.set(id, mantra);
    return mantra;
  }

  async getMantra(id: string): Promise<Mantra | undefined> {
    return this.mantras.get(id);
  }

  async getAllMantras(): Promise<Mantra[]> {
    return Array.from(this.mantras.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = randomUUID();
    const song: Song = { 
      ...insertSong, 
      id,
      createdAt: new Date()
    };
    this.songs.set(id, song);
    return song;
  }

  async getSong(id: string): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSongsByPlaylistType(type: string): Promise<Song[]> {
    return Array.from(this.songs.values())
      .filter(song => song.playlistType === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateSong(id: string, updates: Partial<Song>): Promise<Song | undefined> {
    const song = this.songs.get(id);
    if (!song) return undefined;
    
    const updated = { ...song, ...updates };
    this.songs.set(id, updated);
    return updated;
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      createdAt: new Date()
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
