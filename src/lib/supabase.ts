import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * A single, shared Supabase client for the whole app.
 *
 * We use the service_role key here because this code only ever runs on the
 * server. The service_role key bypasses Row Level Security, so inserts work
 * without writing extra policies for this task. It must never be shipped to a
 * browser/client.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
  auth: { persistSession: false },
});
