import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling authentication
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear stored session
      await SecureStore.deleteItemAsync('sessionToken');
      // Could trigger re-auth here
    }
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth
  signup: (email: string, password: string) =>
    apiClient.post('/auth/signup', { email, password }),
  
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  logout: () => apiClient.post('/auth/logout'),
  
  getUser: () => apiClient.get('/auth/user'),

  // Mantras
  createMantra: (mantra: string) =>
    apiClient.post('/mantras', { content: mantra }),
  
  getMantras: () => apiClient.get('/mantras'),

  // Songs
  generateSong: (mantraId: string, genre: string, rhythm?: string) =>
    apiClient.post('/songs/generate', { mantraId, genre, rhythm }),
  
  getSongs: () => apiClient.get('/songs'),
  
  getSong: (id: string) => apiClient.get(`/songs/${id}`),
  
  updateSong: (id: string, updates: any) =>
    apiClient.patch(`/songs/${id}`, updates),
  
  deleteSong: (id: string) => apiClient.delete(`/songs/${id}`),

  // Playlists
  getPlaylists: () => apiClient.get('/playlists'),
  
  createPlaylist: (name: string, songIds: string[]) =>
    apiClient.post('/playlists', { name, songIds }),
  
  updatePlaylist: (id: string, updates: any) =>
    apiClient.patch(`/playlists/${id}`, updates),

  // Generation status
  checkGenerationStatus: (songId: string) =>
    apiClient.get(`/songs/${songId}/status`),
};

export type ApiClient = typeof api;
