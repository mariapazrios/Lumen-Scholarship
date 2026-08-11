import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * A candidate's own ICFES Saber 11 report, as issued, board-only.
 *
 * The roster's Saber 11 numbers came from Uniandes's own spreadsheet, not from
 * the candidate. When a board member wants to see the source document rather
 * than trust the number, this is that document. Same shape as `api/report.ts`
 * for the annual reports: base64 in `lumen_documents`, keyed by candidate slug
 * under `kind = 'applicant-icfes'`, streamed back only to a session that
 * satisfies the board role.
 *
 *   GET /api/applicant-icfes?subject=saul-orjuela
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!role) return unauthorized()
  if (!allows(role, "board")) return unauthorized()
  if (req.method !== "GET") return json({ error: "method not allowed" }, { status: 405 })

  const subject = new URL(req.url).searchParams.get("subject") ?? ""
  if (!/^[a-z0-9-]+$/.test(subject)) return json({ error: "bad subject" }, { status: 400 })

  const { rows } = await sql`
    SELECT body FROM lumen_documents
    WHERE kind = 'applicant-icfes' AND subject = ${subject}
    LIMIT 1
  `
  if (rows.length === 0) return json({ error: "not found" }, { status: 404 })

  const binary = atob(rows[0].body as string)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  return new Response(bytes, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="icfes-${subject}.pdf"`,
      "cache-control": "private, no-store",
    },
  })
}
