import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

// In-memory fallback if AsyncStorage native module fails
const memoryStore: Record<string, string> = {};

const safeGetItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    return memoryStore[key] || null;
  }
};

const safeSetItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    memoryStore[key] = value;
  }
};

const safeRemoveItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    delete memoryStore[key];
  }
};

export type UserData = {
  id?: string;
  mobileNo?: string;
  role?: string;
  profileCompleted?: boolean;
};

type AuthContextType = {
  user: UserData | null;
  accessToken: string | null;
  isLoading: boolean;
  loginSession: (token: string, refreshToken: string, userData: UserData) => Promise<void>;
  updateUserContext: (data: Partial<UserData>) => Promise<void>;
  refreshAuthTokens: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await safeGetItem('accessToken');
        const storedUser = await safeGetItem('userData');
        
        if (storedToken) {
          setAccessToken(storedToken);
          if (storedUser) setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load session auth data', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!accessToken && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (accessToken && inAuthGroup) {
      if (user && !user.profileCompleted) {
         router.replace('/(auth)/register');
      } else {
         router.replace('/(tabs)');
      }
    }
  }, [user, accessToken, segments, isLoading]);

  const loginSession = async (token: string, refreshToken: string, userData: UserData) => {
    setAccessToken(token);
    setUser(userData);
    await safeSetItem('accessToken', token);
    await safeSetItem('refreshToken', refreshToken);
    await safeSetItem('userData', JSON.stringify(userData));
  };

  const updateUserContext = async (data: Partial<UserData>) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await safeSetItem('userData', JSON.stringify(updatedUser));
  };

  const refreshAuthTokens = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = await safeGetItem('refreshToken');
      if (!storedRefreshToken) {
         await logout();
         return false;
      }
      
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || (require('react-native').Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');
      
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${storedRefreshToken}` }
      });
      
      if (!response.ok) {
        await logout();
        return false;
      }
      
      const parsedRes = await response.json();
      if (parsedRes?.tokenResponse) {
        const newAccess = parsedRes.tokenResponse.accessToken;
        const newRefresh = parsedRes.tokenResponse.refreshToken;
        setAccessToken(newAccess);
        await safeSetItem('accessToken', newAccess);
        await safeSetItem('refreshToken', newRefresh);
        return true;
      }
      return false;
    } catch(e) {
      return false;
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    await safeRemoveItem('accessToken');
    await safeRemoveItem('userData');
    await safeRemoveItem('refreshToken');
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, loginSession, updateUserContext, refreshAuthTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
