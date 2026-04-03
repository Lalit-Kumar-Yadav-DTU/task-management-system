import api from '@/lib/axios';
import { AuthResponse } from '@/types';
import { setAccessToken } from '@/lib/tokenStore';

export const authService = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    setAccessToken(response.data.accessToken); // Save to memory
    return response.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    setAccessToken(response.data.accessToken); // Save to memory
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null); // Wipe memory
      window.location.href = '/login';
    }
  },

  // Used by AuthProvider for silent refresh on page load
  refresh: async (): Promise<string> => {
    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
    return response.data; // Should return { accessToken: '...' }
  }
};