import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().or(z.number()).default(3001),
  ADMIN_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(8),
  MONGODB_URI: z.string().optional().default(''),
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

// Critical Security Assertions for Production Deployments
if (isProduction) {
  if (!_env.data.ADMIN_PASSWORD || _env.data.ADMIN_PASSWORD.length < 8) {
    throw new Error(
      '❌ SECURITY ERROR: You must configure a unique and secure "ADMIN_PASSWORD" environment variable of at least 8 characters for production deployment.'
    );
  }
  if (!_env.data.JWT_SECRET || _env.data.JWT_SECRET.length < 16) {
    throw new Error(
      '❌ SECURITY ERROR: You must configure a unique, high-entropy "JWT_SECRET" environment variable of at least 16 characters for production deployment.'
    );
  }
}

export const env = {
  NODE_ENV: _env.data.NODE_ENV,
  PORT: Number(_env.data.PORT),
  ADMIN_PASSWORD: _env.data.ADMIN_PASSWORD,
  JWT_SECRET: _env.data.JWT_SECRET,
  MONGODB_URI: _env.data.MONGODB_URI,
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || process.env.RECIPIENT_EMAIL || 'cocdhruv4444@gmail.com',
  SMTP_HOST: _env.data.SMTP_HOST,
  SMTP_PORT: Number(_env.data.SMTP_PORT),
  SMTP_USER: _env.data.SMTP_USER,
  SMTP_PASS: _env.data.SMTP_PASS,
  ALLOWED_ORIGINS: _env.data.ALLOWED_ORIGINS,
  IS_PROD: isProduction,
};
