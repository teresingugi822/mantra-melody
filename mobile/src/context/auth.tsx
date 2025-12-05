import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Try to restore session from secure storage
      try {
        const sessionToken = await SecureStore.getItemAsync('sessionToken');
        if (sessionToken) {
          const response = await api.getUser();
          setUser(response.data.user);
        }
      } catch (storageError) {
        // SecureStore might fail in development - this is OK
        console.log('Session restoration skipped (development)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.data.user);
    await SecureStore.setItemAsync('sessionToken', response.data.sessionId);
  };

  const signup = async (email: string, password: string) => {
    const response = await api.signup(email, password);
    setUser(response.data.user);
    await SecureStore.setItemAsync('sessionToken', response.data.sessionId);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    await SecureStore.deleteItemAsync('sessionToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSignedIn: user !== null,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
