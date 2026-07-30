import type { L } from "./i18n"

/**
 * The Lumen essay rubric, rebuilt from "Lumen Rubric (12.15.23).xlsx".
 *
 * Step 1 scores the four Lumen values (REII) from 1 to 5. Step 2 is free-form
 * commentary plus a recommendation on the same 5 point scale. A weighted blend
 * of the two produces the score the board ranks on, with the weights and the
 * "maybe" margin adjustable in the control center.
 *
 * The original workbook blended the values *rank* with the free-form *score*,
 * which pushed weaker cohorts up the table. This blends the values average with
 * the recommendation so both inputs run the same direction.
 */

export const VALUES = [
  { key: "resilience", label: { en: "Resilience", es: "Resiliencia" } },
  { key: "excellence", label: { en: "Excellence", es: "Excelencia" } },
  { key: "integrity", label: { en: "Integrity", es: "Integridad" } },
  { key: "impact", label: { en: "Impact", es: "Impacto" } },
] as const

export type ValueKey = (typeof VALUES)[number]["key"]

/** Step 2 recommendation scale, verbatim from the workbook. */
export const RECOMMENDATIONS: Array<{ score: number; label: L }> = [
  { score: 5, label: { en: "5 · Exceptional", es: "5 · Excepcional" } },
  { score: 4, label: { en: "4 · Outstanding", es: "4 · Sobresaliente" } },
  { score: 3, label: { en: "3 · Strong / Solid", es: "3 · Fuerte / Sólido" } },
  { score: 2, label: { en: "2 · Adequate", es: "2 · Adecuado" } },
  { score: 1, label: { en: "1 · Uninteresting", es: "1 · Sin interés" } },
]

export const COMMENT_PLACEHOLDER: L = {
  en: "What you liked or did not, and why. Key strengths. Reservations. What you would want to know more about.",
  es: "Qué te gustó o no, y por qué. Fortalezas clave. Reservas. Qué querrías conocer mejor.",
}

/** A value is 1 to 5, or "na" when the essay gives nothing to judge it on. */
export type Score = number | "na"

export type Rating = {
  values: Record<ValueKey, Score>
  recommendation: number
  comments: string
  updatedAt: string
}

/** N/A counts as a 3, per the original workbook's instruction. */
export const NA_AS = 3
export const scoreValue = (s: Score) => (s === "na" ? NA_AS : s)

export type Weights = { values: number; freeForm: number; maybeMargin: number }

/** Fixed: values and free form count equally, with a 20% band for "maybe". */
export const WEIGHTS: Weights = { values: 0.5, freeForm: 0.5, maybeMargin: 0.2 }

/** ratings[candidateSlug][memberSlug] */
export type RatingStore = Record<string, Record<string, Rating>>

const RATINGS_KEY = "lumen-board-ratings"
const MEMBER_KEY = "lumen-board-member"

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const loadRatings = () => read<RatingStore>(RATINGS_KEY, {})
export const loadMember = () => read<string>(MEMBER_KEY, "")

export function saveRating(candidate: string, member: string, rating: Rating) {
  const all = loadRatings()
  all[candidate] = { ...(all[candidate] ?? {}), [member]: rating }
  localStorage.setItem(RATINGS_KEY, JSON.stringify(all))
  return all
}

export function saveMember(member: string) {
  localStorage.setItem(MEMBER_KEY, JSON.stringify(member))
}

export const emptyRating = (): Rating => ({
  values: { resilience: 3, excellence: 3, integrity: 3, impact: 3 },
  recommendation: 3,
  comments: "",
  updatedAt: "",
})

/** Mean of the four value scores, with N/A entering as a 3. */
export function valuesAverage(r: Rating) {
  const v = VALUES.map((x) => scoreValue(r.values[x.key]))
  return v.reduce((a, b) => a + b, 0) / v.length
}

/** Values average and recommendation, blended by the control center weights. */
export function blended(r: Rating, w: Weights) {
  const total = w.values + w.freeForm || 1
  return (valuesAverage(r) * w.values + r.recommendation * w.freeForm) / total
}

export type Consolidated = {
  candidate: string
  raters: number
  valuesAvg: number
  freeFormAvg: number
  score: number
  spread: number
  recommendation: "yes" | "maybe" | "no" | "unrated"
}

/**
 * Consolidated view across every board member who has rated. Candidates are
 * bucketed against the median, with the "maybe" margin widening the band that
 * needs discussion rather than a decision.
 */
export function consolidate(
  candidates: string[],
  store: RatingStore,
  w: Weights,
): Consolidated[] {
  const rows = candidates.map((candidate) => {
    const byMember = Object.values(store[candidate] ?? {})
    if (byMember.length === 0) {
      return {
        candidate,
        raters: 0,
        valuesAvg: 0,
        freeFormAvg: 0,
        score: 0,
        spread: 0,
        recommendation: "unrated" as const,
      }
    }
    const scores = byMember.map((r) => blended(r, w))
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    return {
      candidate,
      raters: byMember.length,
      valuesAvg: mean(byMember.map(valuesAverage)),
      freeFormAvg: mean(byMember.map((r) => r.recommendation)),
      score: mean(scores),
      spread: Math.max(...scores) - Math.min(...scores),
      recommendation: "maybe" as Consolidated["recommendation"],
    }
  })

  const rated = rows.filter((r) => r.raters > 0)
  if (rated.length === 0) return rows

  const sorted = [...rated].map((r) => r.score).sort((a, b) => a - b)
  const mid = sorted.length % 2
    ? sorted[(sorted.length - 1) / 2]
    : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
  const band = ((Math.max(...sorted) - Math.min(...sorted)) * w.maybeMargin) / 2

  for (const row of rows) {
    if (row.raters === 0) continue
    if (row.score > mid + band) row.recommendation = "yes"
    else if (row.score < mid - band) row.recommendation = "no"
    else row.recommendation = "maybe"
  }

  return rows.sort((a, b) => b.score - a.score || a.candidate.localeCompare(b.candidate))
}

/**
 * A read of the scores as they stand: where the candidate is strong, where the
 * board disagrees, and what to probe in the interview. Derived from the rubric
 * numbers, not from reading the essay, which needs a model call on a server.
 */
export function readOfScores(row: Consolidated, lang: "en" | "es"): string {
  if (row.raters === 0) {
    return lang === "es" ? "Sin calificaciones todavía." : "No ratings yet."
  }
  const parts: string[] = []
  const strong = row.valuesAvg >= 4
  const weak = row.valuesAvg <= 2.5
  if (lang === "es") {
    parts.push(
      strong
        ? `Valores fuertes (${row.valuesAvg.toFixed(1)}/5).`
        : weak
          ? `Valores por debajo del umbral (${row.valuesAvg.toFixed(1)}/5).`
          : `Valores en el medio (${row.valuesAvg.toFixed(1)}/5).`,
    )
    parts.push(`Recomendación media de ${row.freeFormAvg.toFixed(1)}/5 sobre ${row.raters} lectura${row.raters === 1 ? "" : "s"}.`)
    if (row.spread >= 1.5) parts.push("La junta está dividida: vale discutirlo antes de decidir.")
    else if (row.raters > 1) parts.push("La junta está alineada.")
  } else {
    parts.push(
      strong
        ? `Strong on values (${row.valuesAvg.toFixed(1)}/5).`
        : weak
          ? `Values below the bar (${row.valuesAvg.toFixed(1)}/5).`
          : `Middle of the pack on values (${row.valuesAvg.toFixed(1)}/5).`,
    )
    parts.push(`Average recommendation of ${row.freeFormAvg.toFixed(1)}/5 across ${row.raters} read${row.raters === 1 ? "" : "s"}.`)
    if (row.spread >= 1.5) parts.push("The board is split, so this one is worth discussing before deciding.")
    else if (row.raters > 1) parts.push("The board agrees.")
  }
  return parts.join(" ")
}
