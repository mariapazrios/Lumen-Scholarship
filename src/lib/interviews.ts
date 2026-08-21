import { SessionExpired } from "./rubric"

export type Verdict = "yes" | "no" | "maybe"

export type Interview = {
  id: number
  candidate: string
  member: string
  /** ISO instant. Format with formatInterviewTime() for a Bogotá-local display. */
  scheduled_at: string
  duration_min: number
  location: string
  status: "scheduled" | "canceled"
  feedback_text: string
  feedback_verdict: Verdict | null
  created_by: string
  updated_at: string
}

export async function fetchInterviews(): Promise<Interview[]> {
  const res = await fetch("/api/interviews")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`interviews fetch failed: ${res.status}`)
  const data = (await res.json()) as { interviews?: Interview[] }
  return data.interviews ?? []
}

/**
 * Books an interview and (best-effort, server-side) emails calendar invites
 * to the candidate and the board member. `scheduledAtBogota` is the raw
 * `datetime-local` input value ('YYYY-MM-DDTHH:MM'), always interpreted as
 * Bogotá time by the server — the booking form labels the field that way so
 * a board member scheduling from Madrid or New York isn't guessing whose
 * clock it means.
 *
 * Returns any non-fatal warnings (e.g. a missing email address) so the
 * caller can surface them: the interview is booked either way.
 */
export async function bookInterview(input: {
  candidate: string
  member: string
  memberName: string
  scheduledAtBogota: string
  durationMin: number
  location: string
  createdBy: string
}): Promise<{ interview: Interview; warnings: string[] }> {
  const res = await fetch("/api/interviews", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`interview booking failed: ${res.status}`)
  const data = (await res.json()) as { interview: Interview; warnings?: string[] }
  return { interview: data.interview, warnings: data.warnings ?? [] }
}

export async function saveInterviewFeedback(
  id: number,
  feedbackText: string,
  feedbackVerdict: Verdict | null,
) {
  const res = await fetch("/api/interviews", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, feedback_text: feedbackText, feedback_verdict: feedbackVerdict }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`feedback save failed: ${res.status}`)
}

export async function cancelInterview(id: number) {
  const res = await fetch("/api/interviews", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`interview cancel failed: ${res.status}`)
}

/** Renders an ISO instant as a Bogotá-local date and time, regardless of the reader's own timezone. */
export function formatInterviewTime(iso: string, lang: "en" | "es"): string {
  return new Date(iso).toLocaleString(lang === "es" ? "es-CO" : "en-US", {
    timeZone: "America/Bogota",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  })
}
