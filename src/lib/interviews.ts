import { SessionExpired } from "./rubric"

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
  /** 1 to 4, or null when the member hasn't rated the interview yet. */
  feedback_rating: number | null
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
 * Pairs a board member with a candidate they're speaking with. `scheduledAtBogota`
 * is optional and, when supplied, must be the raw `datetime-local` input value
 * ('YYYY-MM-DDTHH:MM') — always interpreted as Bogotá time by the server. The
 * Interview Notes tab never sends one: it only records who is speaking with
 * whom, not when, since scheduling itself happens off-site. Supplying a time
 * is what triggers the (best-effort) calendar invite emails.
 *
 * Returns any non-fatal warnings (e.g. a missing email address) so the
 * caller can surface them: the pairing is recorded either way.
 */
export async function bookInterview(input: {
  candidate: string
  member: string
  memberName: string
  scheduledAtBogota?: string
  durationMin?: number
  location?: string
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
  feedbackRating: number | null,
) {
  const res = await fetch("/api/interviews", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, feedback_text: feedbackText, feedback_rating: feedbackRating }),
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
