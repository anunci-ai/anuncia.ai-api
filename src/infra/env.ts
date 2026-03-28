import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().optional().default(8080),
  NODE_ENV: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string(),
});

export const env = envSchema.parse(process.env);
