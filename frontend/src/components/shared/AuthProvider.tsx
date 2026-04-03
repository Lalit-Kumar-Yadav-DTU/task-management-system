'use client';

import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { setAccessToken } from '@/lib/tokenStore';
import { User } from '@/types'; // Ensure User is imported
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isLoading: boolean;
  token: string | null;
  user: User | null; // Added user to context
  syncToken: (token: string | null, user: User | null) => void; // Updated signature
}

const AuthContext = createContext<AuthContextType>({ 
  isLoading: true, 
  token: null, 
  user: null, 
  syncToken: () => {} 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // State for user data

  const syncToken = useCallback((newToken: string | null, newUser: User | null) => {
    setAccessToken(newToken);
    setTokenState(newToken);
    setUser(newUser); // Store the user object
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authService.refresh();
        if (response?.accessToken) {
          // Pass both token and user from the refresh response
          syncToken(response.accessToken, response.user);
        }
      } catch (err) {
        syncToken(null, null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [syncToken]);

  return (
    <AuthContext.Provider value={{ isLoading, token, user, syncToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);