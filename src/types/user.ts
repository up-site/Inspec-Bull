// src/types/user.ts
import { Types } from 'mongoose';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  isEmailVerified?: boolean;
  enrolledCourses?: Types.ObjectId[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  token: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
  isActive?: boolean;
  role?: 'user' | 'admin' | 'moderator';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: Date;
}

export interface UserProfile extends User {
  enrolledCoursesCount?: number;
  completedCoursesCount?: number;
  certificatesCount?: number;
}

// Clean user type for frontend (with string IDs)
export interface CleanUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  isEmailVerified?: boolean;
  enrolledCourses?: string[];
  createdAt: Date;
  updatedAt: Date;
}