import { sql } from "@vercel/postgres"

/**
 * Idempotent provisioning for the two scheduling tables.
 *
 * `schema.sql` is still the canonical definition, but relying on a human to
 * have run it made the whole portal fail closed: a missing relation threw a
 * 500, which rejected the client's initial Promise.all, which left every tab
 * blank, including the three that predate scheduling entirely. Creating the
 * table on first use costs one cheap no-op DDL per cold start and means board
 * availability and interviews persist for everyone without a manual step.
 *
 * Memoised per isolate. A failed attempt clears the memo so the next request
 * retries rather than caching a rejected promise forever.
 */
function once(run: () => Promise<void>) {
  let inflight: Promise<void> | null = null
  return () => {
    inflight ??= run().catch((e) => {
      inflight = null
      throw e
    })
    return inflight
  }
}

export const ensureAvailabilityTable = once(async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS lumen_availability (
      member     TEXT        NOT NULL,
      slot       TEXT        NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (member, slot)
    )
  `
})

export const ensureInterviewsTable = once(async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS lumen_interviews (
      id               BIGSERIAL PRIMARY KEY,
      candidate        TEXT        NOT NULL,
      member           TEXT        NOT NULL,
      scheduled_at     TIMESTAMPTZ NOT NULL,
      duration_min     INTEGER     NOT NULL DEFAULT 30,
      location         TEXT        NOT NULL DEFAULT '',
      status           TEXT        NOT NULL DEFAULT 'scheduled',
      feedback_text    TEXT        NOT NULL DEFAULT '',
      feedback_verdict TEXT,
      created_by       TEXT        NOT NULL DEFAULT '',
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS lumen_interviews_scheduled_at ON lumen_interviews (scheduled_at)`
  // Added when the Interviews tab became a notes tab: a 1-4 read on how the
  // interview went, alongside the existing free-text feedback. ALTER ...
  // IF NOT EXISTS rather than a one-time migration script, same reasoning as
  // the CREATE TABLE above — a no-op on every cold start after the first.
  await sql`ALTER TABLE lumen_interviews ADD COLUMN IF NOT EXISTS feedback_rating SMALLINT`
})
