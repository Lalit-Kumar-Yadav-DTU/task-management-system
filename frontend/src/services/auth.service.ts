// frontend/src/services/auth.service.ts
import api from '@/lib/axios';
import { AuthResponse, User } from '@/types';
import { setAccessToken } from '@/lib/tokenStore';

export const authService = {
  /**
   * Register a new user. 
   * The backend returns { user, accessToken }.
   */
  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    const authData: AuthResponse = response.data;
    
    // Save to localStorage immediately
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  /**
   * Login existing user.
   * The backend returns { user, accessToken } and sets the refreshToken cookie.
   */
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    const authData: AuthResponse = response.data;

    // Save to localStorage immediately
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    return authData;
  },

  /**
   * Logout user.
   * Clears the backend cookie and the frontend localStorage.
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // Always clear local state even if the network request fails
      setAccessToken(null); 
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },

  /**
   * Silent Refresh.
   * Called by AuthProvider when no token is found in localStorage.
   */
  refresh: async (): Promise<AuthResponse> => {
    // Note: withCredentials is true by default in our api instance, 
    // but we'll be explicit here for safety.
    const response = await api.post('/auth/refresh', {}, { withCredentials: true });
    return response.data; 
  },

  /**
   * Verify Session / Get User Profile.
   * This is the CRITICAL method for keeping users logged in after a refresh.
   * It fetches the latest fullName and email from the database.
   */
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};






//////////////////////////










// import api from '@/lib/axios';
// import { AuthResponse } from '@/types';
// import { setAccessToken } from '@/lib/tokenStore';

// export const authService = {
//   register: async (data: any): Promise<AuthResponse> => {
//     const response = await api.post('/auth/register', data);
//     setAccessToken(response.data.accessToken); 
//     return response.data;
//   },

//   login: async (data: any): Promise<AuthResponse> => {
//     const response = await api.post('/auth/login', data);
//     setAccessToken(response.data.accessToken); 
//     return response.data;
//   },

//   logout: async () => {
//     try {
//       await api.post('/auth/logout');
//     } finally {
//       setAccessToken(null); 
//       window.location.href = '/login';
//     }
//   },

//   // Updated to Promise<any> to allow AuthProvider to handle the object/string logic
//   refresh: async (): Promise<any> => {
//     const response = await api.post('/auth/refresh', {}, { withCredentials: true });
//     return response.data; 
//   }
// };