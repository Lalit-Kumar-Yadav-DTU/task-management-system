import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.utils.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  // Return the created user so the controller can use the ID for tokens
  return prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashedPassword,
    },
    select: { id: true, fullName: true, email: true }
  });
};


export const loginUser = async (data: LoginInput) => {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !(await comparePassword(data.password, user.password))) {
    throw new Error('Invalid email or password');
  }

  // 2. Generate Tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // 3. Save Refresh Token to DB (Requirement for secure logout/refresh logic)
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
};

export const refreshSession = async (token: string) => {
  // 1. Verify the token
  const payload = verifyRefreshToken(token);

  // 2. Check if token exists in DB (Security check)
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user || user.refreshToken !== token) {
    throw new Error('Invalid refresh token');
  }

  // 3. Generate new Access Token
  return generateAccessToken(user.id);
};

export const logoutUser = async (userId: number) => {
  // Clear the refresh token in the DB
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};