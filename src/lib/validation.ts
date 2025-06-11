// src/lib/validation.ts
import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Blog validation schemas
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  excerpt: z.string().min(1, 'Excerpt is required').max(200),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['inspection', 'equipment', 'safety', 'training', 'industry-news', 'case-studies']),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().url('Invalid image URL'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  isFeatured: z.boolean().optional(),
});

// Course validation schemas
export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(200),
  category: z.enum(['safety-inspection', 'equipment-training', 'certification', 'compliance', 'advanced-techniques']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration must be at least 1 hour'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  requirements: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
});

// Equipment validation schemas
export const equipmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  model: z.string().min(1, 'Model is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  category: z.enum(['ultrasonic', 'radiographic', 'magnetic-particle', 'dye-penetrant', 'eddy-current', 'visual', 'leak-testing', 'thermographic']),
  type: z.enum(['portable', 'stationary', 'handheld', 'automated']),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(200).optional(),
});

// Job validation schemas
export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum(['ndt-technician', 'quality-inspector', 'welding-inspector', 'project-manager', 'sales', 'engineering', 'training']),
  type: z.enum(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    remote: z.boolean().optional(),
  }),
  company: z.object({
    name: z.string().min(1, 'Company name is required'),
    description: z.string().optional(),
  }),
});

// Contact validation schemas
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required').max(1000),
  type: z.enum(['general', 'service-inquiry', 'support', 'partnership', 'complaint']).optional(),
});

// Newsletter validation schemas
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  preferences: z.object({
    categories: z.array(z.enum(['industry-news', 'equipment-updates', 'training', 'job-alerts', 'company-updates'])).optional(),
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  }).optional(),
});

