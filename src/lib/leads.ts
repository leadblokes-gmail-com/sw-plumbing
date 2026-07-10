/**
 * Quote-request storage (Neon Postgres).
 *
 * The database is provisioned in the Vercel dashboard (Storage → Create Database
 * → Postgres/Neon). That injects a connection string as an env var — we read the
 * common names so it works whichever the integration sets.
 *
 * The table is created on first use (`ensureSchema`) so there's no manual SQL to
 * run — the first quote submission (or the first cron run) sets it up.
 */
import { neon } from '@neondatabase/serverless';

export interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  suburb: string | null;
  service: string | null;
  message: string | null;
}

function db() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error(
      'No Postgres connection string found. Set DATABASE_URL (or POSTGRES_URL) — ' +
        'the Vercel Postgres/Neon integration adds this automatically.'
    );
  }
  return neon(url);
}

/** Create the table on first use — no manual migration needed. */
export async function ensureSchema(): Promise<void> {
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id          SERIAL PRIMARY KEY,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      name        TEXT NOT NULL,
      phone       TEXT NOT NULL,
      suburb      TEXT,
      service     TEXT,
      message     TEXT,
      ip          TEXT,
      user_agent  TEXT
    )
  `;
}

export async function insertLead(l: {
  name: string;
  phone: string;
  suburb?: string;
  service?: string;
  message?: string;
  ip?: string;
  userAgent?: string;
}): Promise<{ id: number; created_at: string }> {
  const sql = db();
  const rows = (await sql`
    INSERT INTO quote_requests (name, phone, suburb, service, message, ip, user_agent)
    VALUES (
      ${l.name}, ${l.phone}, ${l.suburb || null}, ${l.service || null},
      ${l.message || null}, ${l.ip || null}, ${l.userAgent || null}
    )
    RETURNING id, created_at
  `) as { id: number; created_at: string }[];
  return rows[0];
}

/** All leads submitted within the last `days` days, newest first. */
export async function getLeadsSince(days: number): Promise<Lead[]> {
  const sql = db();
  const rows = (await sql`
    SELECT id, created_at, name, phone, suburb, service, message
    FROM quote_requests
    WHERE created_at >= now() - (${days} * INTERVAL '1 day')
    ORDER BY created_at DESC
  `) as Lead[];
  return rows;
}
