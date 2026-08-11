import { useEffect, useState } from "react"

/**
 * Half-year journal entries the scholars write in their own words. Same reason
 * as the grades: this is a named student writing about their marks, their
 * setbacks and their family, so it cannot live in `src/data/` where Vite would
 * compile it into the public bundle. It sits in `lumen_documents` under
 * `kind = 'scholar-journal'` and comes back only to an authenticated session.
 */
export type ScholarJournal = {
  title: string
  /** The academic term the entry covers, e.g. "2026-1" */
  term: string
  /** ISO date the scholar sent it in */
  submittedAt: string
  words: number
  /** Paragraphs separated by a blank line, as the scholar wrote them */
  body: string
}

/**
 * Fetched once for the whole page, keyed by scholar slug.
 *
 * `null` means still in flight and `{}` means loaded with nothing on file. The
 * distinction matters: without it, "no journal yet" flashes on every card open
 * and reads as a scholar who never wrote one.
 */
export function useScholarJournals(): Record<string, ScholarJournal> | null {
  const [journals, setJournals] = useState<Record<string, ScholarJournal> | null>(null)

  useEffect(() => {
    let live = true
    fetch("/api/documents?kind=scholar-journal")
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            documents?: Array<{ subject: string; title: string; body: string }>
          } | null,
        ) => {
          if (!live) return
          const parsed: Record<string, ScholarJournal> = {}
          for (const d of data?.documents ?? []) {
            try {
              parsed[d.subject] = { ...JSON.parse(d.body), title: d.title }
            } catch {
              // one malformed row should not take the whole page down
            }
          }
          setJournals(parsed)
        },
      )
      .catch(() => live && setJournals({}))
    return () => {
      live = false
    }
  }, [])

  return journals
}
