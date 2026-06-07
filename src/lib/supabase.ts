import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import type { Database } from '../types/database';

/**
 * A single, shared Supabase client for the whole app, typed with our
 * `Database` schema so every query is checked against the real table shapes.
 *
 * We use the service_role key because this code only ever runs on the server.
 * It bypasses Row Level Security, so inserts work without extra policies, and
 * it must never be shipped to a browser/client.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_KEY,
  {
    auth: { persistSession: false },
  },
);
