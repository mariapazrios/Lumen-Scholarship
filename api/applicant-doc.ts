import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * A candidate's own supporting documents, as issued, board-only.
 *
 * The roster's numbers came from Uniandes's spreadsheet, not from the
 * candidate. These are the source documents behind them, for a board member
 * who wants to check rather than take a figure on faith. Same shape as
 * `api/report.ts` for the annual reports: base64 in `lumen_documents`, keyed by
 * candidate slug, streamed back only to a session that satisfies the board
 * role.
 *
 * `kind` is allowlisted rather than passed through, so this cannot be turned
 * into a reader for `applicant-essay` or anything else that happens to be
 * keyed by the same slug.
 *
 *   GET /api/applicant-doc?kind=applicant-icfes&subject=saul-orjuela
 *   GET /api/applicant-doc?kind=applicant-transcript&subject=jesus-ceballos
 */
const KINDS: Record<string, string> = {
  "applicant-icfes": "icfes",
  "applicant-transcript": "notas",
}

export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!role) return unauthorized()
  if (!allows(role, "board")) return unauthorized()
  if (req.method !== "GET") return json({ error: "method not allowed" }, { status: 405 })

  const url = new URL(req.url)
  const kind = url.searchParams.get("kind") ?? "applicant-icfes"
  const subject = url.searchParams.get("subject") ?? ""
  if (!KINDS[kind]) return json({ error: "bad kind" }, { status: 400 })
  if (!/^[a-z0-9-]+$/.test(subject)) return json({ error: "bad subject" }, { status: 400 })

  const { rows } = await sql`
    SELECT body FROM lumen_documents
    WHERE kind = ${kind} AND subject = ${subject}
    LIMIT 1
  `
  if (rows.length === 0) return json({ error: "not found" }, { status: 404 })

  const binary = atob(rows[0].body as string)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  return new Response(bytes, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${KINDS[kind]}-${subject}.pdf"`,
      "cache-control": "private, no-store",
    },
  })
}
