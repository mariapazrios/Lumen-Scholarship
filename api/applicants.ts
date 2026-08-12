import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"

export const config = { runtime: "edge" }

/**
 * The admissions roster: every invited candidate, joined to whatever they have
 * actually submitted. Board only, because this carries emails, estrato and
 * Sisbén status alongside the essays.
 *
 * One call rather than three, so opening the portal is a single round trip.
 * Candidates who have not submitted still come back, with null essay and
 * answers: knowing who is missing is half of what the board needs before a
 * deadline.
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!allows(role, "board")) return unauthorized()
  if (req.method !== "GET") return json({ error: "method not allowed" }, { status: 405 })

  const { rows } = await sql`
    SELECT a.slug, a.name, a.program, a.gender, a.city, a.department, a.age,
           a.siblings, a.housing, a.estrato, a.sisben, a.school, a.school_type,
           a.graduated, a.saber11, a.plc, a.pma, a.psc, a.pcn, a.pin, a.invited,
           a.saber11_pct, a.plc_pct, a.pma_pct, a.psc_pct, a.pcn_pct, a.pin_pct,
           a.school_grades,
           e.body AS essay, e.submitted_at,
           q.body AS answers,
           (i.subject IS NOT NULL) AS icfes_report,
           (s.subject IS NOT NULL) AS transcript
    FROM lumen_applicants a
    LEFT JOIN lumen_documents e
      ON e.kind = 'applicant-essay'   AND e.subject = a.slug
    LEFT JOIN lumen_documents q
      ON q.kind = 'applicant-answers' AND q.subject = a.slug
    LEFT JOIN lumen_documents i
      ON i.kind = 'applicant-icfes'   AND i.subject = a.slug
    LEFT JOIN lumen_documents s
      ON s.kind = 'applicant-transcript' AND s.subject = a.slug
    ORDER BY (e.body IS NULL), e.submitted_at, a.name
  `

  return json({ applicants: rows })
}
