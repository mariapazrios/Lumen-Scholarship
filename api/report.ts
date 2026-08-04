import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * The annual reports, as PDFs, served only to a valid session.
 *
 * These cannot live in `public/`: everything there is served unauthenticated at
 * its own URL, no matter who can see the repository, and both reports carry
 * per-scholar averages and the fund's financial position. So they sit in
 * `lumen_documents` as base64 under `kind = 'report'`, and come back through here.
 *
 * A plain <a href> is enough to reach this: the session cookie rides along on a
 * top-level navigation, so the browser opens the PDF in its own viewer and an
 * unauthenticated visitor gets a 401 instead.
 *
 *   GET /api/report?year=2025
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!role) return unauthorized()
  if (!allows(role, "sponsor")) return unauthorized()
  if (req.method !== "GET") return json({ error: "method not allowed" }, { status: 405 })

  const year = new URL(req.url).searchParams.get("year") ?? ""
  if (!/^\d{4}$/.test(year)) return json({ error: "bad year" }, { status: 400 })

  const { rows } = await sql`
    SELECT body FROM lumen_documents
    WHERE kind = 'report' AND subject = ${year}
    LIMIT 1
  `
  if (rows.length === 0) return json({ error: "not found" }, { status: 404 })

  const binary = atob(rows[0].body as string)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

  return new Response(bytes, {
    headers: {
      "content-type": "application/pdf",
      // inline so it opens in the browser's viewer rather than landing in
      // Downloads; the sponsor can still save it from there.
      "content-disposition": `inline; filename="Lumen-informe-anual-${year}.pdf"`,
      // Restricted material: never let a shared proxy or the browser cache keep
      // a copy that outlives the session.
      "cache-control": "private, no-store",
    },
  })
}
