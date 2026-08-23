import { SessionExpired } from "./rubric"

/**
 * One set of board meeting minutes, stored as a `board-notes` row in
 * `lumen_documents` rather than in `src/data/`.
 *
 * That is deliberate and not negotiable: minutes name candidates alongside
 * rejection reasons, financial circumstances and, in the August 2026 set, a
 * scholar's medical diagnosis. Anything under `src/data/` compiles into the
 * public bundle and this repository is public, so the passcode would gate the
 * page and not the payload. Same reasoning that moved the scholar essays and
 * grades out on 2026-08-05.
 */
export type BoardNote = {
  subject: string
  title: string
  body: string
  submitted_at: string | null
}

export async function fetchBoardNotes(): Promise<BoardNote[]> {
  const res = await fetch("/api/documents?kind=board-notes")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`board notes fetch failed: ${res.status}`)
  const data = (await res.json()) as { documents?: BoardNote[] }
  // Newest meeting first: `subject` is the meeting date, so a plain reverse
  // lexicographic sort on 'YYYY-MM-DD' is chronological.
  return (data.documents ?? []).sort((a, b) => b.subject.localeCompare(a.subject))
}
