import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
  companyId?: string;
}

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Middleware to authenticate requests
export function authenticateRequest(request: NextRequest): JWTPayload | null {
  const token = extractTokenFromHeader(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// Check if user has required role
export function hasRole(user: JWTPayload, requiredRole: 'admin' | 'user'): boolean {
  if (requiredRole === 'user') {
    return user.role === 'admin' || user.role === 'user';
  }
  return user.role === 'admin';
}
