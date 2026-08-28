import { sql } from "@vercel/postgres"
import { allows, json, readSession, unauthorized } from "./_session"
import { buildIcs } from "./_ics"
import { boardEmail, fromAddress, sendMail } from "./_email"
import { ensureInterviewsTable } from "./_ensure"

export const config = { runtime: "edge" }

/**
 * Interview notes, board only: pair a member with a candidate they're
 * speaking with, list everyone's pairings, add post-interview feedback, or
 * remove a pairing.
 *
 * POST creates the pairing first and only then tries to email calendar
 * invites when a time was actually supplied — a Resend outage or a board
 * member with no email on file must not stop the pairing from being
 * recorded. Any send failures come back in the response as warnings, not a
 * request failure, same as audit logging never blocking the operation it is
 * logging.
 */
export default async function handler(req: Request): Promise<Response> {
  const role = await readSession(req)
  if (!allows(role, "board")) return unauthorized()
  await ensureInterviewsTable()

  if (req.method === "GET") {
    const { rows } = await sql`
      SELECT id, candidate, member, scheduled_at, duration_min, location, status,
             feedback_text, feedback_verdict, feedback_rating, created_by, updated_at
      FROM lumen_interviews
      ORDER BY scheduled_at ASC
    `
    return json({ interviews: rows })
  }

  if (req.method === "POST") {
    let body: {
      candidate?: string
      member?: string
      memberName?: string
      scheduledAtBogota?: string // 'YYYY-MM-DDTHH:MM', interpreted as America/Bogota (UTC-5, no DST)
      durationMin?: number
      location?: string
      createdBy?: string
    }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }

    const { candidate, member, memberName, scheduledAtBogota, createdBy } = body
    if (!candidate || !member || !memberName) {
      return json({ error: "bad request" }, { status: 400 })
    }
    // A time is optional now: the Interview Notes tab only records who is
    // speaking with whom, not when — actual scheduling happens off-site. When
    // a caller does supply one (e.g. a future booking flow), it's still
    // validated and still triggers calendar invites below.
    let start = new Date()
    if (scheduledAtBogota != null) {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(scheduledAtBogota)) {
        return json({ error: "bad datetime" }, { status: 400 })
      }
      start = new Date(`${scheduledAtBogota}:00-05:00`)
      if (Number.isNaN(start.getTime())) return json({ error: "bad datetime" }, { status: 400 })
    }

    const durationMin = Number.isFinite(body.durationMin) ? Number(body.durationMin) : 30
    const location = (body.location ?? "").slice(0, 500)
    const end = new Date(start.getTime() + durationMin * 60_000)

    const { rows: found } = await sql`
      SELECT name, email FROM lumen_applicants WHERE slug = ${candidate} LIMIT 1
    `
    if (found.length === 0) return json({ error: "candidate not found" }, { status: 404 })
    const candidateName = found[0].name as string
    const candidateEmail = found[0].email as string

    const { rows: inserted } = await sql`
      INSERT INTO lumen_interviews
        (candidate, member, scheduled_at, duration_min, location, created_by, updated_at)
      VALUES
        (${candidate}, ${member}, ${start.toISOString()}, ${durationMin}, ${location},
         ${createdBy ?? ""}, NOW())
      RETURNING id, candidate, member, scheduled_at, duration_min, location, status,
                feedback_text, feedback_verdict, feedback_rating, created_by, updated_at
    `
    const interview = inserted[0]

    // Best-effort invites, and only when a caller actually supplied a time —
    // the Interview Notes tab doesn't collect one, and an ICS invite for the
    // moment the pairing happened to be added would be actively wrong.
    const warnings: string[] = []
    const memberMail = boardEmail(member)
    const summary = `Entrevista Beca Lumen: ${candidateName} con ${memberName}`
    const description = [
      `Entrevista de admisión para la Beca Lumen.`,
      `Candidato: ${candidateName}`,
      `Entrevistador: ${memberName}`,
      location ? `Enlace o lugar: ${location}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const attendees =
      scheduledAtBogota == null
        ? []
        : [
            candidateEmail ? { name: candidateName, email: candidateEmail } : null,
            memberMail ? { name: memberName, email: memberMail } : null,
          ].filter((a): a is { name: string; email: string } => a !== null)

    if (scheduledAtBogota != null && !candidateEmail) {
      warnings.push("candidate has no email on file, no invite sent to them")
    }
    if (scheduledAtBogota != null && !memberMail) {
      warnings.push(`no email on file for board member "${member}" (set BOARD_EMAILS)`)
    }

    if (attendees.length > 0 && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
      const ics = buildIcs({
        uid: `interview-${interview.id}@lumenedu.org`,
        sequence: 0,
        method: "REQUEST",
        start,
        end,
        summary,
        description,
        location,
        organizer: { name: "Lumen", email: fromAddress() || attendees[0].email },
        attendees,
      })
      try {
        await sendMail({
          to: attendees.map((a) => a.email),
          subject: summary,
          html: `<p>${description.replace(/\n/g, "<br>")}</p>`,
          attachments: [{ filename: "entrevista.ics", content: ics }],
        })
      } catch (e) {
        warnings.push(e instanceof Error ? e.message : "email send failed")
      }
    } else if (attendees.length > 0) {
      warnings.push("RESEND_API_KEY or EMAIL_FROM is not set, no invite emails sent")
    }

    return json({ interview, warnings })
  }

  if (req.method === "PATCH") {
    let body: { id?: number; feedback_text?: string; feedback_rating?: number | null }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }
    const { id } = body
    if (!id) return json({ error: "bad request" }, { status: 400 })
    if (
      body.feedback_rating != null &&
      (!Number.isInteger(body.feedback_rating) || body.feedback_rating < 1 || body.feedback_rating > 4)
    ) {
      return json({ error: "bad rating" }, { status: 400 })
    }
    const feedbackText = (body.feedback_text ?? "").slice(0, 4000)

    await sql`
      UPDATE lumen_interviews
      SET feedback_text = ${feedbackText},
          feedback_rating = ${body.feedback_rating ?? null},
          updated_at = NOW()
      WHERE id = ${id}
    `
    return json({ ok: true })
  }

  if (req.method === "DELETE") {
    let body: { id?: number }
    try {
      body = await req.json()
    } catch {
      return json({ error: "bad request" }, { status: 400 })
    }
    if (!body.id) return json({ error: "bad request" }, { status: 400 })

    // Cancel rather than hard-delete: a real appointment that already went
    // out as a calendar invite should leave a record that it existed and was
    // called off, not vanish from the group calendar with no trace.
    const { rows } = await sql`
      UPDATE lumen_interviews SET status = 'canceled', updated_at = NOW()
      WHERE id = ${body.id}
      RETURNING id
    `
    return json({ ok: true, canceled: rows.length })
  }

  return json({ error: "method not allowed" }, { status: 405 })
}
