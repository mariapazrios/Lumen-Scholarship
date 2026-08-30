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
 *   POST /api/documents  { kind: "board-notes", subject, url, title? }
 */

// Marks a board-notes body as awaiting extraction rather than real minutes.
// Duplicated in src/lib/boardNotes.ts (edge functions and the client bundle
// are compiled separately, so this isn't a shared import) — keep both in
// sync if this ever changes.
const PENDING_MARKER = "[PENDIENTE DE EXTRACCIÓN]"

export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!role) return unauthorized()

  if (req.method === "POST") {
    let body: { kind?: string; subject?: string; url?: string; title?: string; submittedBy?: string }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }

    // The only write this endpoint exposes is a board member dropping a
    // meeting-recording link onto a date. Hardcoding the kind, rather than
    // trusting whatever the client sends, means this can never become a way
    // to overwrite an essay or a report.
    if (body.kind !== "board-notes") return json({ error: "bad request" }, { status: 400 })
    if (!allows(role, "board")) return unauthorized()

    const subject = (body.subject ?? "").trim()
    const linkUrl = (body.url ?? "").trim()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(subject)) {
      return json({ error: "subject must be a YYYY-MM-DD date" }, { status: 400 })
    }
    if (!/^https:\/\//.test(linkUrl) || linkUrl.length > 2000) {
      return json({ error: "url must be an https link" }, { status: 400 })
    }
    const submittedBy = (body.submittedBy ?? "").trim().slice(0, 100)
    const title = (body.title ?? "").trim().slice(0, 200)

    const { rows: existing } = await sql`
      SELECT title, body FROM lumen_documents WHERE kind = 'board-notes' AND subject = ${subject} LIMIT 1
    `

    let finalTitle: string
    let finalBody: string
    if (existing.length > 0 && !existing[0].body.startsWith(PENDING_MARKER)) {
      // Real minutes already exist for this date: append the link rather
      // than clobber notes someone already wrote up.
      finalTitle = existing[0].title
      finalBody = `${existing[0].body}\n\n---\n\nEnlace adicional: ${linkUrl}${
        submittedBy ? ` (agregado por ${submittedBy})` : ""
      }`
    } else {
      finalTitle = title || "Notas pendientes"
      finalBody = [
        `${PENDING_MARKER} ${linkUrl}`,
        "",
        submittedBy
          ? `Agregado por ${submittedBy}. Estas notas se generarán a partir de la grabación pronto.`
          : "Estas notas se generarán a partir de la grabación pronto.",
      ].join("\n")
    }

    await sql`
      INSERT INTO lumen_documents (kind, subject, title, body, submitted_at)
      VALUES ('board-notes', ${subject}, ${finalTitle}, ${finalBody}, NOW())
      ON CONFLICT (kind, subject) DO UPDATE
        SET title = EXCLUDED.title, body = EXCLUDED.body
    `
    return json({ ok: true })
  }

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
