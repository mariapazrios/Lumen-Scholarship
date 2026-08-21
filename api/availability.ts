import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * The board's interview-scheduling poll, shared across members, same shape as
 * `api/ratings.ts`. GET returns every member's marked days; POST replaces one
 * member's full set of available days with whatever the client just sent.
 *
 * Replace-the-whole-set rather than toggle-one-day: the client already holds
 * the member's complete draft (a set of day strings), so there is nothing to
 * gain from a finer-grained add/remove endpoint, and it keeps this route as
 * small as ratings.ts's POST.
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!allows(role, "board")) return unauthorized()

  if (req.method === "GET") {
    const { rows } = await sql`
      SELECT member, day FROM lumen_availability ORDER BY day
    `
    const store: Record<string, string[]> = {}
    for (const r of rows) {
      const member = r.member as string
      store[member] ??= []
      store[member].push(r.day as string)
    }
    return json({ availability: store })
  }

  if (req.method === "POST") {
    let body: { member?: string; days?: string[] }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }

    const { member, days } = body
    if (!member || !Array.isArray(days)) return json({ error: "bad request" }, { status: 400 })
    const clean = [...new Set(days.filter((d) => DAY_RE.test(d)))]

    await sql`DELETE FROM lumen_availability WHERE member = ${member}`
    await Promise.all(
      clean.map(
        (day) => sql`
          INSERT INTO lumen_availability (member, day, updated_at)
          VALUES (${member}, ${day}, NOW())
          ON CONFLICT (member, day) DO NOTHING
        `,
      ),
    )
    return json({ ok: true })
  }

  return json({ error: "method not allowed" }, { status: 405 })
}
