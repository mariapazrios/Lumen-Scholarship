import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * Board ratings, shared across members.
 *
 * This is the piece that could not work in the browser: a consolidated view
 * needs every member's scores in one place. GET returns all ratings for the
 * active cycle; POST upserts the caller's rating for one candidate.
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!allows(role, "board")) return unauthorized()

  if (req.method === "GET") {
    const { rows } = await sql`
      SELECT candidate, member, values, recommendation, comments, updated_at
      FROM lumen_ratings
      ORDER BY updated_at DESC
    `
    // shape it the way the client already expects: store[candidate][member]
    const store: Record<string, Record<string, unknown>> = {}
    for (const r of rows) {
      const candidate = r.candidate as string
      const member = r.member as string
      store[candidate] ??= {}
      store[candidate][member] = {
        values: r.values,
        recommendation: r.recommendation,
        comments: r.comments,
        updatedAt: r.updated_at,
      }
    }
    return json({ ratings: store })
  }

  if (req.method === "POST") {
    let body: {
      candidate?: string
      member?: string
      values?: Record<string, number | string>
      recommendation?: number
      comments?: string
    }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }

    const { candidate, member, values, recommendation } = body
    if (!candidate || !member || !values || typeof recommendation !== "number") {
      return json({ error: "bad request" }, { status: 400 })
    }
    if (recommendation < 1 || recommendation > 5) {
      return json({ error: "recommendation out of range" }, { status: 400 })
    }

    const comments = (body.comments ?? "").slice(0, 4000)
    await sql`
      INSERT INTO lumen_ratings (candidate, member, values, recommendation, comments, updated_at)
      VALUES (${candidate}, ${member}, ${JSON.stringify(values)}::jsonb,
              ${recommendation}, ${comments}, NOW())
      ON CONFLICT (candidate, member) DO UPDATE
        SET values = EXCLUDED.values,
            recommendation = EXCLUDED.recommendation,
            comments = EXCLUDED.comments,
            updated_at = NOW()
    `
    return json({ ok: true })
  }

  return json({ error: "method not allowed" }, { status: 405 })
}
