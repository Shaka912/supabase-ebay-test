import 'dotenv/config';
import { z } from 'zod';

/**
 * Validates and exposes the environment configuration.
 *
 * This runs once when the module is first imported (at server startup).
 * If anything is missing or malformed we fail fast with a clear message,
 * rather than crashing later with a cryptic Supabase error.
 */
const envSchema = z.object({
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_KEY: z.string().min(1, 'SUPABASE_KEY is required'),
  PORT: z.coerce.number().int().positive().default(3000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  console.error(
    `\n❌ Invalid environment configuration:\n${issues}\n\n` +
      `Copy .env.example to .env and fill in your Supabase credentials.\n`,
  );
  process.exit(1);
}

export const env = parsed.data;
