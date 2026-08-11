import { useEffect, useState } from "react"

/**
 * Scholar academic records: types and the one hook that fetches them.
 *
 * There is deliberately no data in this file. Grades used to sit in
 * `src/data/`, which meant Vite bundled every scholar's cumulative average,
 * term history and Saber 11 score into the public JavaScript. The sponsor
 * passcode gated the page, not the payload, so anyone could read the bundle
 * and get the lot. They now live in `lumen_documents` under
 * `kind = 'scholar-grades'` and come back through `/api/documents`, which
 * requires a session cookie.
 *
 * A term with `average: null` means the scholar registered but finished
 * nothing gradeable that semester (everything withdrawn or incomplete). The
 * chart draws it as an N/A gap and breaks the line, which is different from a
 * term nobody has recovered yet.
 */
export type ScholarTerm = { term: string; average: number | null; courses: number | null }

/** One of the five Saber 11 tests, scored 0-100 with its own national percentile. */
export type Saber11Test = { score: number; percentile: number }

/**
 * `percentile` and `subjects` come from the scholar's own ICFES report PDF, so
 * they are absent on a self-reported score: Daniel Álzate quotes his 432 in his
 * essay but has never sent the document, and a percentile nobody can check
 * should not render as though ICFES issued it.
 */
export type Saber11 = {
  score: number
  selfReported?: boolean
  percentile?: number
  /** ICFES registration number, the audit trail back to the source report. */
  registro?: string
  examDate?: string
  subjects?: {
    lecturaCritica: Saber11Test
    matematicas: Saber11Test
    socialesCiudadanas: Saber11Test
    cienciasNaturales: Saber11Test
    ingles: Saber11Test
  }
}

/** The slice GpaTrend needs. */
export type ScholarTermRecord = {
  terms: ScholarTerm[]
  officialPga: number | null
  complete: boolean
}

export type ScholarGrades = ScholarTermRecord & {
  program: string
  asOf: string
  cumulative: number
  semesters: string[]
  saber11: Saber11 | null
}

/**
 * Every scholar's record, fetched once for the page. `null` means still in
 * flight, so the UI can say "loading" rather than "no record on file", which
 * would otherwise flash on every open and read as missing data.
 *
 * Term averages are credit-weighted, the way Uniandes computes a PGA.
 * `officialPga` is the cumulative figure the university states in the report
 * and is authoritative where the two disagree by a hundredth: Uniandes
 * truncates where this rounds.
 */
export function useScholarGrades(): Record<string, ScholarGrades> | null {
  const [grades, setGrades] = useState<Record<string, ScholarGrades> | null>(null)

  useEffect(() => {
    let live = true
    fetch("/api/documents?kind=scholar-grades")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { documents?: Array<{ subject: string; body: string }> } | null) => {
        if (!live) return
        const parsed: Record<string, ScholarGrades> = {}
        for (const d of data?.documents ?? []) {
          try {
            parsed[d.subject] = JSON.parse(d.body) as ScholarGrades
          } catch {
            // one malformed row should not take the whole page down
          }
        }
        setGrades(parsed)
      })
      .catch(() => live && setGrades({}))
    return () => {
      live = false
    }
  }, [])

  return grades
}
