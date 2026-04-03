import axios from 'axios';
import { getAccessToken, setAccessToken } from './tokenStore';

/**
 * Helper to ensure the API URL is always correctly formatted.
 * It handles the common mistake of forgetting the '/api' suffix in Render settings.
 */
const getBaseURL = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Remove trailing slash if present
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

const BASE_URL = getBaseURL();

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the Access Token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiration (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        /**
         * SILENT REFRESH
         * We use a standard axios call here to avoid the interceptor loop.
         * We use POST to match your authService implementation.
         */
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          withCredentials: true,
        });
        
        const { accessToken } = response.data;
        
        // Save the new token to memory
        setAccessToken(accessToken);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails, the session is truly dead. Wipe everything.
        setAccessToken(null);
        
        // Redirect to login only if in a browser environment
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;