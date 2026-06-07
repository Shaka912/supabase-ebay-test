import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Client } from 'pg';

/**
 * Applies the database schema to Supabase.
 *
 * DDL (CREATE TABLE, etc.) cannot run through the Supabase REST key, so this
 * connects directly to Postgres with the connection string and executes
 * `supabase/schema.sql`. The script is idempotent — the SQL uses
 * `create table if not exists`, so it is safe to run repeatedly.
 *
 * Requires DATABASE_URL in .env (Supabase Dashboard -> Project Settings ->
 * Database -> Connection string).
 */
async function migrate(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not set.');
    console.error('   Add your Supabase Postgres connection string to .env:');
    console.error('   Dashboard -> Project Settings -> Database -> Connection string (URI).');
    process.exit(1);
  }

  const schemaPath = resolve(__dirname, '..', 'supabase', 'schema.sql');
  const sql = readFileSync(schemaPath, 'utf8');

  // Supabase requires SSL.
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  console.log('→ Connecting to the database...');
  await client.connect();

  try {
    console.log(`→ Applying ${schemaPath}`);
    await client.query(sql);
    console.log('✅ Migration complete — the "products" table is ready.');
  } finally {
    await client.end();
  }
}

migrate().catch((err: unknown) => {
  console.error('❌ Migration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
