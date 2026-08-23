import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/** 'YYYY-MM-DDTHH:MM' — one hour slot on the calendar grid, Bogotá wall clock. */
const SLOT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

/**
 * The board's interview-scheduling poll, shared across members, same shape as
 * `api/ratings.ts`. GET returns every member's marked slots; POST replaces one
 * member's full set of free slots with whatever the client just sent.
 *
 * Replace-the-whole-set rather than toggle-one-slot: the client already holds
 * the member's complete draft, so a finer-grained add/remove endpoint would buy
 * nothing, and dragging across a calendar grid produces a whole set anyway.
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!allows(role, "board")) return unauthorized()

  if (req.method === "GET") {
    const { rows } = await sql`
      SELECT member, slot FROM lumen_availability ORDER BY slot
    `
    const store: Record<string, string[]> = {}
    for (const r of rows) {
      const member = r.member as string
      store[member] ??= []
      store[member].push(r.slot as string)
    }
    return json({ availability: store })
  }

  if (req.method === "POST") {
    let body: { member?: string; slots?: string[] }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }

    const { member, slots } = body
    if (!member || !Array.isArray(slots)) return json({ error: "bad request" }, { status: 400 })
    const clean = [...new Set(slots.filter((s) => SLOT_RE.test(s)))]

    await sql`DELETE FROM lumen_availability WHERE member = ${member}`
    await Promise.all(
      clean.map(
        (slot) => sql`
          INSERT INTO lumen_availability (member, slot, updated_at)
          VALUES (${member}, ${slot}, NOW())
          ON CONFLICT (member, slot) DO NOTHING
        `,
      ),
    )
    return json({ ok: true })
  }

  return json({ error: "method not allowed" }, { status: 405 })
}
