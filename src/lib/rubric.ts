import type { L } from "./i18n"

/**
 * The Lumen essay rubric, rebuilt from "Lumen Rubric (12.15.23).xlsx".
 *
 * Step 1 scores the four Lumen values from 1 to 5. Step 2 is free-form
 * commentary plus an overall recommendation on the same 5 point scale.
 *
 * The board ranks on the values average, full stop. Earlier versions blended
 * the values with the recommendation behind a set of weights, which meant the
 * number ordering the table was one nobody had actually given. The three things
 * a reader needs are the values average, what people wrote, and the
 * recommendation, so those are the three things shown.
 */

export const VALUES = [
  { key: "resilience", label: { en: "Resilience", es: "Resiliencia" } },
  { key: "excellence", label: { en: "Excellence", es: "Excelencia" } },
  { key: "integrity", label: { en: "Integrity", es: "Integridad" } },
  // Community, matching the values published on the landing page. The workbook
  // called this one Impact and the two had drifted apart.
  { key: "community", label: { en: "Community", es: "Comunidad" } },
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

/** Width of the band around the median that reads as "maybe", as a share of the range. */
export const MAYBE_MARGIN = 0.2

/** ratings[candidateSlug][memberSlug] */
export type RatingStore = Record<string, Record<string, Rating>>

const MEMBER_KEY = "lumen-board-member"

/**
 * Which board member you are rating as. This stays in the browser on purpose:
 * one shared passcode means the server cannot tell members apart, so the client
 * names itself on every save. It is a convenience, not a credential.
 */
export function loadMember(): string {
  try {
    const raw = localStorage.getItem(MEMBER_KEY)
    return raw ? (JSON.parse(raw) as string) : ""
  } catch {
    return ""
  }
}

export function saveMember(member: string) {
  localStorage.setItem(MEMBER_KEY, JSON.stringify(member))
}

/** Thrown when the session cookie is missing or expired, so the gate can reappear. */
export class SessionExpired extends Error {
  constructor() {
    super("session expired")
  }
}

/**
 * Every member's ratings, from the server. This is the whole reason the backend
 * exists: a consolidated view needs scores that one browser cannot hold.
 */
export async function fetchRatings(): Promise<RatingStore> {
  const res = await fetch("/api/ratings")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`ratings fetch failed: ${res.status}`)
  const data = (await res.json()) as { ratings?: RatingStore }
  return data.ratings ?? {}
}

/** Upsert one member's rating for one candidate. */
export async function saveRating(candidate: string, member: string, rating: Rating) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      candidate,
      member,
      values: rating.values,
      recommendation: rating.recommendation,
      comments: rating.comments,
    }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`rating save failed: ${res.status}`)
}

/**
 * Clear one member's rating for one candidate. Scoped to the pair on both
 * sides of the wire: a member removes their own read, not the board's.
 */
export async function deleteRating(candidate: string, member: string) {
  const res = await fetch("/api/ratings", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ candidate, member }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`rating delete failed: ${res.status}`)
}

// (emptyRating, the all-3s default, is gone: a pre-filled form let one stray
// Save record a complete rating nobody chose. Drafts now start unset — see
// BoardPortal's Draft type.)

/** Mean of the four value scores, with N/A entering as a 3. */
export function valuesAverage(r: Rating) {
  const v = VALUES.map((x) => scoreValue(r.values[x.key]))
  return v.reduce((a, b) => a + b, 0) / v.length
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
export function consolidate(candidates: string[], store: RatingStore): Consolidated[] {
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
    // The ranking number is the values average and nothing else.
    const scores = byMember.map(valuesAverage)
    const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
    return {
      candidate,
      raters: byMember.length,
      valuesAvg: mean(scores),
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
  const band = ((Math.max(...sorted) - Math.min(...sorted)) * MAYBE_MARGIN) / 2

  for (const row of rows) {
    if (row.raters === 0) continue
    if (row.score > mid + band) row.recommendation = "yes"
    else if (row.score < mid - band) row.recommendation = "no"
    else row.recommendation = "maybe"
  }

  return rows.sort((a, b) => b.score - a.score || a.candidate.localeCompare(b.candidate))
}

