import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().or(z.number()).default(3001),
  ADMIN_PASSWORD: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : 'dev-admin-password')),
  JWT_SECRET: z
    .string()
    .optional()
    .transform((val) => (val && val.trim().length > 0 ? val.trim() : 'dev-super-secret-jwt-key-2026')),
  MONGODB_URI: z.string().optional().default(''),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CONTACT_RECEIVER_EMAIL: z.string().optional().default(''),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.string().or(z.number()).optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  ALLOWED_ORIGINS: z.string().optional().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment configuration.');
}

const isProduction = _env.data.NODE_ENV === 'production';
const insecureDevelopmentDefaults = new Set(['dev-admin-password', 'dev-super-secret-jwt-key-2026']);

// Critical Security Assertions for Production Deployments
if (isProduction) {
  if (!_env.data.ADMIN_PASSWORD || _env.data.ADMIN_PASSWORD.length < 12 || insecureDevelopmentDefaults.has(_env.data.ADMIN_PASSWORD)) {
    throw new Error(
      'SECURITY ERROR: Set a unique ADMIN_PASSWORD of at least 12 characters for production.'
    );
  }
  if (!_env.data.JWT_SECRET || _env.data.JWT_SECRET.length < 32 || insecureDevelopmentDefaults.has(_env.data.JWT_SECRET)) {
    throw new Error(
      'SECURITY ERROR: Set a unique random JWT_SECRET of at least 32 characters for production.'
    );
  }
}

export const env = {
  NODE_ENV: _env.data.NODE_ENV,
  PORT: Number(_env.data.PORT),
  ADMIN_PASSWORD: _env.data.ADMIN_PASSWORD,
  JWT_SECRET: _env.data.JWT_SECRET,
  MONGODB_URI: _env.data.MONGODB_URI,
  CLOUDINARY_CLOUD_NAME: _env.data.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: _env.data.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: _env.data.CLOUDINARY_API_SECRET,
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.RECIPIENT_EMAIL || 'cocdhruv4444@gmail.com',
  SMTP_HOST: _env.data.SMTP_HOST,
  SMTP_PORT: Number(_env.data.SMTP_PORT),
  SMTP_USER: _env.data.SMTP_USER,
  SMTP_PASS: _env.data.SMTP_PASS,
  ALLOWED_ORIGINS: _env.data.ALLOWED_ORIGINS,
  IS_PROD: isProduction,
};
