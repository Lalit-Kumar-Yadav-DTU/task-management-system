// frontend/src/lib/tokenStore.ts

/**
 * Persists the access token in localStorage so it survives page refreshes.
 * We check if 'window' is defined to avoid errors during Next.js server-side rendering.
 */

export const setAccessToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};




////////////////////////




// let accessToken: string | null = null;

// export const setAccessToken = (token: string | null) => {
//   accessToken = token;
// };

// export const getAccessToken = () => {
//   return accessToken;
// };