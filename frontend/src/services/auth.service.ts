import api from '@/lib/axios';
import { AuthResponse } from '@/types';
import { setAccessToken } from '@/lib/tokenStore';

export const authService = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    setAccessToken(response.data.accessToken); 
    return response.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    setAccessToken(response.data.accessToken); 
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null); 
      window.location.href = '/login';
    }
  },

  // Updated to Promise<any> to allow AuthProvider to handle the object/string logic
  refresh: async (): Promise<any> => {
    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
    return response.data; 
  }
};