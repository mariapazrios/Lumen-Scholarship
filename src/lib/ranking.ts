import { useEffect, useState } from "react"

/**
 * Where each scholar stands inside their own cohort.
 *
 * Like grades and journals, none of this is in `src/data/`: it names real
 * students and says plainly how they are doing, so it lives in
 * `lumen_documents` under `kind = 'scholar-ranking'` and comes back through
 * `/api/documents`, behind the session cookie. One row per generation.
 *
 * Cohorts are ranked separately and never merged. A 2025 scholar is two terms
 * into a degree and a 2024 scholar is five; putting them in one list would
 * rank seniority and call it performance.
 */
export type RankSignals = {
  growth: number
  insight: number
  potential: number
  grades: number
  extracurricular: number
}

export type ScholarRank = {
  slug: string
  /** 1 is strongest, within this generation only. */
  rank: number
  /** green: thriving. yellow: something to watch. red: act now. */
  bucket: "green" | "yellow" | "red"
  note: { es: string; en: string }
  signals: RankSignals
  /**
   * Set when the record is too thin to score honestly, i.e. no journal on
   * file. The axes the journal is the only evidence for are then hidden
   * rather than drawn as low scores: absence of evidence is not a 1 out of 5,
   * and rendering it as one would put a number on something nobody read.
   */
  sparse?: boolean
}

/** ranking[generation] = that cohort, already ordered by rank. */
export type RankingByGeneration = Record<string, ScholarRank[]>

export function useScholarRanking(): RankingByGeneration | null {
  const [ranking, setRanking] = useState<RankingByGeneration | null>(null)

  useEffect(() => {
    let live = true
    fetch("/api/documents?kind=scholar-ranking")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { documents?: Array<{ subject: string; body: string }> } | null) => {
        if (!live) return
        const out: RankingByGeneration = {}
        for (const d of data?.documents ?? []) {
          try {
            out[d.subject] = JSON.parse(d.body) as ScholarRank[]
          } catch {
            // A malformed row should cost that one cohort, not the whole panel.
          }
        }
        setRanking(out)
      })
      .catch(() => live && setRanking({}))
    return () => {
      live = false
    }
  }, [])

  return ranking
}
