'use client';

import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { setAccessToken, getAccessToken } from '@/lib/tokenStore';
import { User } from '@/types'; 
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  isLoading: boolean;
  token: string | null;
  user: User | null;
  syncToken: (token: string | null, user: User | null) => void;
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
  const [user, setUser] = useState<User | null>(null);

  const syncToken = useCallback((newToken: string | null, newUser: User | null) => {
    setAccessToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const initAuth = async () => {
      try {
        // 1. Check LocalStorage first (Hybrid Persistence)
        const storedToken = getAccessToken();
        
        if (storedToken) {
          // Immediately set the token so the UI knows we have a session
          if (isSubscribed) setTokenState(storedToken);
          
          try {
            // Verify token and fetch full user details (fullName, email)
            const profileResponse = await authService.getProfile();
            if (isSubscribed) {
              // Adjust based on your API response structure (usually response.user)
              setUser(profileResponse.user || (profileResponse as any).data?.user);
            }
          } catch (profileErr) {
            // If profile fetch fails (e.g., 401), our Axios interceptor 
            // in axios.ts will handle the silent refresh automatically.
            console.log("Token verification failed, axios interceptor will attempt refresh.");
          }
        } else {
          // 2. No token in storage? Try a one-time Silent Refresh via Cookie
          const refreshResponse: any = await authService.refresh();
          
          if (isSubscribed && refreshResponse?.accessToken) {
            syncToken(refreshResponse.accessToken, refreshResponse.user || null);
          }
        }
      } catch (err) {
        // Everything failed, clear state
        if (isSubscribed) syncToken(null, null);
      } finally {
        // 3. Only now do we stop the global loader
        if (isSubscribed) setIsLoading(false);
      }
    };

    initAuth();

    return () => { isSubscribed = false; };
  }, [syncToken]);

  // Prevent app from rendering protected routes until we know the auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoading, token, user, syncToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);





///////////////////////////////////////





// 'use client';

// import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
// import { authService } from '@/services/auth.service';
// import { setAccessToken } from '@/lib/tokenStore';
// import { User } from '@/types'; 
// import { Loader2 } from 'lucide-react';

// interface AuthContextType {
//   isLoading: boolean;
//   token: string | null;
//   user: User | null;
//   syncToken: (token: string | null, user: User | null) => void;
// }

// const AuthContext = createContext<AuthContextType>({ 
//   isLoading: true, 
//   token: null, 
//   user: null, 
//   syncToken: () => {} 
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [token, setTokenState] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);

//   const syncToken = useCallback((newToken: string | null, newUser: User | null) => {
//     setAccessToken(newToken);
//     setTokenState(newToken);
//     setUser(newUser);
//   }, []);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         // We use 'any' here to prevent the 'Property does not exist on type string' error
//         // during the Render build process.
//         const response: any = await authService.refresh();
        
//         if (response && typeof response === 'object' && response.accessToken) {
//           // Case 1: Response is an object { accessToken, user }
//           syncToken(response.accessToken, response.user || null);
//         } else if (typeof response === 'string') {
//           // Case 2: Response is just the token string
//           syncToken(response, null);
//         } else {
//           syncToken(null, null);
//         }
//       } catch (err) {
//         syncToken(null, null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     initAuth();
//   }, [syncToken]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{ isLoading, token, user, syncToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);