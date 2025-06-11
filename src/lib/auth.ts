// src/lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { CleanUser } from '../types/user';
import env from '../config/env';
import connectDB from './mongodb';
import UserModel, { IUser } from '../../models/User';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Convert Mongoose IUser to clean User type
 */
function convertToCleanUser(user: IUser): CleanUser {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    isEmailVerified: user.isEmailVerified,
    enrolledCourses: user.enrolledCourses?.map(id => id.toString()),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Authenticate user from request token
 */
export async function authenticateToken(request: NextRequest): Promise<CleanUser | null> {
  try {
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    
    await connectDB();
    const user: IUser | null = await UserModel.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return null;
    }

    return convertToCleanUser(user);
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<CleanUser> {
  const user = await authenticateToken(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<CleanUser> {
  const user = await requireAuth(request);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

/**
 * Generate JWT token for user
 */
export function generateAuthToken(user: IUser | CleanUser | any): string {
  return jwt.sign(
    { 
      userId: user._id || user.id, 
      email: user.email, 
      role: user.role 
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE }
  );
}