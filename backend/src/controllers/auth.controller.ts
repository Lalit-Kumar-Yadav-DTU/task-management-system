import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';
import prisma from '../config/db.js';

const cookieOptions = {
  httpOnly: true,
  secure: true, 
  sameSite: 'none' as const, 
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ 
      error: validation.error.issues[0]?.message || 'Invalid data' 
    });
  }

  try {
    const user = await authService.registerUser(validation.data);
    
    // Generate tokens for the new user
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
      message: 'User registered successfully',
      user, // Contains id, fullName, email
      accessToken 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ 
      error: validation.error.issues[0]?.message || 'Invalid data' 
    });
  }

  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(validation.data);

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user // Contains id, fullName, email
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const newAccessToken = await authService.refreshSession(token);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ error: 'Session expired, please login again' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Optional: If you have auth middleware, you can clear DB token too:
    // if (req.user) await authService.logoutUser(req.user.id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};





////////////////////////////////



// // Deployment Fix - April 2026
// // Optimized for Cross-Origin (Render) Deployment

// import { Request, Response } from 'express';
// import * as authService from '../services/auth.service.js';
// import { registerSchema, loginSchema } from '../validators/auth.validator.js';
// import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils.js';

// /**
//  * Common Cookie Options for Cross-Origin Production
//  * sameSite: 'none' is required because frontend and backend are on different URLs
//  * secure: true is required by browsers whenever sameSite is 'none'
//  */
// const cookieOptions = {
//   httpOnly: true,
//   secure: true, // Always true in production for Cross-Origin cookies
//   sameSite: 'none' as const, // Cast as const for TypeScript
//   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// };

// export const register = async (req: Request, res: Response) => {
//   const validation = registerSchema.safeParse(req.body);

//   if (!validation.success) {
//     return res.status(400).json({ 
//       success: false,
//       error: validation.error.issues[0]?.message || 'Invalid data' 
//     });
//   }

//   try {
//     // 1. Create the user in the DB
//     const user = await authService.registerUser(validation.data);
    
//     // 2. Generate Tokens
//     const accessToken = generateAccessToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);

//     // 3. Set the Refresh Token in a secure cross-origin cookie
//     res.cookie('refreshToken', refreshToken, cookieOptions);

//     // 4. Return response
//     res.status(201).json({
//       success: true,
//       message: 'User registered and logged in successfully',
//       user,
//       accessToken 
//     });

//   } catch (error: any) {
//     res.status(400).json({ success: false, error: error.message || 'Registration failed' });
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const validation = loginSchema.safeParse(req.body);

//   if (!validation.success) {
//     return res.status(400).json({ 
//       error: validation.error.issues[0]?.message || 'Invalid data' 
//     });
//   }

//   try {
//     const { accessToken, refreshToken, user } = await authService.loginUser(validation.data);

//     // Set the Refresh Token in a secure cross-origin cookie
//     res.cookie('refreshToken', refreshToken, cookieOptions);

//     res.status(200).json({
//       message: 'Login successful',
//       accessToken,
//       user
//     });
//   } catch (error: any) {
//     res.status(401).json({ error: error.message || 'Invalid credentials' });
//   }
// };

// export const refresh = async (req: Request, res: Response) => {
//   try {
//     const token = req.cookies?.refreshToken;

//     if (!token) {
//       return res.status(401).json({ error: 'Refresh token missing' });
//     }

//     const newAccessToken = await authService.refreshSession(token);
//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error: any) {
//     res.status(401).json({ error: 'Session expired, please login again' });
//   }
// };

// export const logout = async (req: Request, res: Response) => {
//   try {
//     // When clearing, use the same sameSite/secure options to ensure browser compliance
//     res.clearCookie('refreshToken', {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'none',
//     });
//     res.status(200).json({ message: 'Logged out successfully' });
//   } catch (error: any) {
//     res.status(500).json({ error: 'Logout failed' });
//   }
// };

// export const getProfile = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user?.id;

//     res.status(200).json({
//       success: true,
//       message: "Authenticated route accessed",
//       data: { userId }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };