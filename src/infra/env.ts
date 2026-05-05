import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  PORT: z.coerce.number().optional().default(8080),
  NODE_ENV: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  QSTASH_URL: z.url(),
  QSTASH_TOKEN: z.string(),
  QSTASH_CURRENT_SIGNING_KEY: z.string(),
  QSTASH_NEXT_SIGNING_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
  API_URL: z.url(),
  AI_TEXT_MODEL: z.string(),
});

export const env = envSchema.parse(process.env);
