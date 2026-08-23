import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * Essays and other restricted documents, served only to a valid session.
 *
 * This is the route that lets sensitive material stop living in the client
 * bundle: nothing here is reachable without a cookie, so a document is not
 * fetchable by guessing a URL.
 *
 *   GET /api/documents?kind=scholar-essay&subject=juan-angel-aicardy
 *   GET /api/documents?kind=applicant-essay            (board only, list)
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!role) return unauthorized()
  if (req.method !== "GET") return json({ error: "method not allowed" }, { status: 405 })

  const url = new URL(req.url)
  const kind = url.searchParams.get("kind") ?? ""
  const subject = url.searchParams.get("subject")

  // applicant material and the board's own minutes are board-only; scholar
  // material is visible to sponsors too. Prefix-gated rather than an explicit
  // allowlist so a new applicant-* or board-* kind cannot be added without
  // inheriting the right gate.
  const needed = kind.startsWith("applicant") || kind.startsWith("board") ? "board" : "sponsor"
  if (!allows(role, needed)) return unauthorized()

  if (subject) {
    const { rows } = await sql`
      SELECT subject, kind, title, body, submitted_at
      FROM lumen_documents
      WHERE kind = ${kind} AND subject = ${subject}
      LIMIT 1
    `
    if (rows.length === 0) return json({ error: "not found" }, { status: 404 })
    return json({ document: rows[0] })
  }

  const { rows } = await sql`
    SELECT subject, kind, title, body, submitted_at
    FROM lumen_documents
    WHERE kind = ${kind}
    ORDER BY subject
  `
  return json({ documents: rows })
}
