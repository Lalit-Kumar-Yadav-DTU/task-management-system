import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.js";

// Optional: define type of decoded token
interface JwtPayload {
  userId: number;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check if header exists and follows "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token missing or malformed",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // 4. Verify token
    const decoded = verifyAccessToken(token) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "Invalid access token payload",
      });
    }

    // 5. Attach user to request
    req.user = { id: decoded.userId };

    // 6. Proceed
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};