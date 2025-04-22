// Environment configuration for Next.js

export const env = {
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  ENV: process.env.NODE_ENV || 'development',
} as const;

export type EnvConfig = typeof env;

// Helper function to get environment variables in a type-safe way
export const getEnvVar = (key: keyof EnvConfig): string => {
  const value = env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return String(value);
};