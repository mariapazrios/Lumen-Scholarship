import { SessionExpired } from "./rubric"

/** member slug -> the hour slots ('YYYY-MM-DDTHH:MM') they marked as free. */
export type AvailabilityStore = Record<string, string[]>

export async function fetchAvailability(): Promise<AvailabilityStore> {
  const res = await fetch("/api/availability")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`availability fetch failed: ${res.status}`)
  const data = (await res.json()) as { availability?: AvailabilityStore }
  return data.availability ?? {}
}

/** Replaces one member's full set of free hour slots. */
export async function saveAvailability(member: string, slots: string[]) {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ member, slots }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`availability save failed: ${res.status}`)
}

/**
 * The hours the grid offers, Bogotá wall clock. 8am to 7pm covers a Colombian
 * working day with room either side; interviews outside it are booked directly
 * in the Interviews tab, which takes any time rather than only a grid slot.
 */
export const INTERVIEW_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] as const

/**
 * Tomorrow through August 31 of the current year, as 'YYYY-MM-DD' strings.
 * Built from local date components (never `toISOString`, which converts to
 * UTC first and can push a day back by one for anyone west of it) so the poll
 * always lines up with the board's own calendar.
 */
export function interviewWindowDays(): string[] {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const end = new Date(now.getFullYear(), 7, 31) // August is month index 7
  const days: string[] = []
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(fmtDay(d))
  }
  return days
}

const fmtDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/** The stored key for one cell of the grid. */
export const slotKey = (day: string, hour: number) =>
  `${day}T${String(hour).padStart(2, "0")}:00`

/**
 * The grid cell a booking falls in, so the Interviews tab can tell whether the
 * interviewer actually marked that hour free. Floors to the hour: a 14:30
 * booking sits in the 14:00 slot.
 */
export const slotOfDateTime = (localDateTime: string) =>
  `${localDateTime.slice(0, 13)}:00`

/** Renders a 'YYYY-MM-DD' string as a short local-language day label. */
export function formatDayLabel(day: string, lang: "en" | "es"): string {
  const [y, m, d] = day.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

/** Renders an hour as a compact clock label, e.g. "9am" / "9:00". */
export function formatHourLabel(hour: number, lang: "en" | "es"): string {
  if (lang === "es") return `${String(hour).padStart(2, "0")}:00`
  const suffix = hour < 12 ? "am" : "pm"
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}${suffix}`
}

/** True when the day has no working hours left worth offering (weekend). */
export const isWeekend = (day: string) => {
  const [y, m, d] = day.split("-").map(Number)
  const wd = new Date(y, m - 1, d).getDay()
  return wd === 0 || wd === 6
}
