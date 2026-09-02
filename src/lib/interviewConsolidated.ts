import { SessionExpired } from "./rubric"
import type { Interview } from "./interviews"

/**
 * One consolidated read of everything the board wrote about a candidate after
 * interviewing them.
 *
 * Five members write up the same conversation in five formats: Chris in
 * fragments, Lola in transcript outlines, Oscar and Cipriano in prose, MPR in
 * one-line verdicts, all of it mixed Spanish and English. Reading five of
 * those and holding the shape of the candidate in your head is the work this
 * removes; the raw notes stay underneath it, unchanged, because the summary is
 * a way into them and not a replacement for them.
 *
 * Deliberately NOT written by a board member, and the card says so. It is
 * derived text, generated from the notes below it, and the board should be
 * able to see at a glance that no colleague signed their name to it.
 *
 * `kind` starts with `board-` on purpose. `api/documents.ts` gates on the kind
 * prefix (`applicant*` and `board*` are board-only, everything else is served
 * to a sponsor session too), so a kind named `interview-consolidated` would
 * hand the board's live reads on named applicants to any sponsor with the
 * passcode. Do not rename this without reading that gate.
 */
export type InterviewConsolidated = {
  /** Candidate slug, mirroring the row's `subject`. */
  candidate: string
  summary: { es: string; en: string }
  /** Who the summary was written from, and what they had scored at the time. */
  sources: Array<{ member: string; rating: number | null }>
  /**
   * The newest `updated_at` across the notes this was written from. The card
   * compares it against the live notes and marks itself out of date when
   * somebody has written since, rather than presenting a stale synthesis as
   * current. A summary that quietly lags the evidence is worse than none.
   */
  latestNoteAt: string
  generatedAt: string
}

export type ConsolidatedBySlug = Record<string, InterviewConsolidated>

export const CONSOLIDATED_KIND = "board-interview-consolidated"

export async function fetchInterviewConsolidated(): Promise<ConsolidatedBySlug> {
  const res = await fetch(`/api/documents?kind=${CONSOLIDATED_KIND}`)
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`interview consolidations fetch failed: ${res.status}`)
  const data = (await res.json()) as { documents?: Array<{ subject: string; body: string }> }
  const out: ConsolidatedBySlug = {}
  for (const d of data?.documents ?? []) {
    try {
      out[d.subject] = { candidate: d.subject, ...(JSON.parse(d.body) as Omit<InterviewConsolidated, "candidate">) }
    } catch {
      // A malformed row should cost that one candidate their summary, not
      // blank the consolidated view for everybody else.
    }
  }
  return out
}

/**
 * Whether a note has landed since the summary was written. Compared as
 * instants rather than strings: `updated_at` comes back from Postgres with
 * microsecond precision and the stored stamp is whatever the generator
 * rounded to, so a lexicographic compare reports drift that isn't there.
 */
export function isStale(summary: InterviewConsolidated, rows: Interview[]): boolean {
  const written = rows.filter((r) => r.feedback_text?.trim())
  if (written.length === 0) return false
  const newest = Math.max(...written.map((r) => new Date(r.updated_at).getTime()))
  return newest - new Date(summary.latestNoteAt).getTime() > 1000
}

/**
 * How far apart the board's ratings are, on the 1-4 scale. Only meaningful
 * once two people have rated: one read cannot disagree with itself, and
 * rendering a lone 4 as "aligned" would claim a consensus nobody reached.
 */
export function ratingSpread(rows: Interview[]): number | null {
  const rated = rows.map((r) => r.feedback_rating).filter((r): r is number => r != null)
  if (rated.length < 2) return null
  return Math.max(...rated) - Math.min(...rated)
}
