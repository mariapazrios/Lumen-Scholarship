import { SessionExpired } from "./rubric"

/**
 * A candidate as the board sees them: the roster row Uniandes sent, plus
 * whatever the candidate has actually submitted.
 *
 * Everything is nullable on purpose. The 2026 intake arrived without real Saber
 * results, two people submitted who were never on the invited list, and on
 * deadline day most rows have no essay yet. The portal has to render all three
 * of those states without inventing anything.
 */
export type Applicant = {
  slug: string
  name: string
  program: string
  gender: string
  city: string
  department: string
  age: number | null
  siblings: string
  housing: string
  estrato: string
  sisben: string
  school: string
  school_type: string
  graduated: string
  saber11: number | null
  plc: number | null
  pma: number | null
  psc: number | null
  pcn: number | null
  pin: number | null
  /**
   * National percentile for each score, read off the candidate's own ICFES
   * report rather than computed: null whenever `icfes_report` is false, since
   * there is no source document to have read it from.
   */
  saber11_pct: number | null
  plc_pct: number | null
  pma_pct: number | null
  psc_pct: number | null
  pcn_pct: number | null
  pin_pct: number | null
  invited: boolean
  essay: string | null
  answers: string | null
  submitted_at: string | null
  /** Whether the candidate's own Saber 11 report is on file, verifying the roster's number. */
  icfes_report: boolean
  /** Whether their school transcript is on file. */
  transcript: boolean
  /**
   * School-leaving results as the school reported them, newest first. Most run
   * 0 to 5, but the two IB schools in this cohort (Colegio Mayor de los Andes,
   * Gimnasio del Norte) report 0 to 7, hence `scale`. Each school also grades
   * on its own scale in the literal sense, which is why rank travels with the
   * average wherever the source stated one: a 4.15 says little on its own,
   * first of thirty-six says a great deal. Some rows are a school year, others
   * a single term where that is the finest-grained figure the school gave.
   */
  school_grades:
    | Array<{
        year: string
        grade: { es: string; en: string }
        average: number
        /** Denominator the average is out of. Omitted means the standard 5. */
        scale?: number
        rank: number | null
        of: number | null
      }>
    | null
}

export async function fetchApplicants(): Promise<Applicant[]> {
  const res = await fetch("/api/applicants")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`applicants fetch failed: ${res.status}`)
  const data = (await res.json()) as { applicants?: Applicant[] }
  return data.applicants ?? []
}

export async function signOut() {
  await fetch("/api/login", { method: "DELETE" })
}

/** Housing and school type arrive as single letters in the Uniandes export. */
export const HOUSING: Record<string, { en: string; es: string }> = {
  F: { en: "Family", es: "Familiar" },
  A: { en: "Rented", es: "Arrendada" },
  P: { en: "Owned", es: "Propia" },
}

export const SCHOOL_TYPE: Record<string, { en: string; es: string }> = {
  O: { en: "Public", es: "Oficial" },
  N: { en: "Private", es: "No oficial" },
}
