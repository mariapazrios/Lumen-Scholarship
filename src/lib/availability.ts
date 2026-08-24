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

/** How many days forward the poll runs, starting tomorrow. */
export const WINDOW_DAYS = 10

/**
 * The next ten days, starting tomorrow, weekends included, as 'YYYY-MM-DD'
 * strings. Built from local date components (never `toISOString`, which
 * converts to UTC first and can push a day back by one for anyone west of it)
 * so the poll always lines up with the board's own calendar.
 */
export function interviewWindowDays(): string[] {
  const now = new Date()
  const days: string[] = []
  for (let i = 1; i <= WINDOW_DAYS; i++) {
    days.push(fmtDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)))
  }
  return days
}

const fmtDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

/**
 * Half an hour is the atomic unit of the poll, whichever granularity the grid
 * is showing. A 60 minute cell is simply the two half-hour slots inside it, so
 * switching the toggle re-renders the same stored data at a different
 * resolution rather than converting (and losing) anything.
 */
export type Granularity = 30 | 60

const pad = (n: number) => String(n).padStart(2, "0")

/** The stored key for one atomic (half-hour) slot. */
export const slotKey = (day: string, hour: number, minute: number = 0) =>
  `${day}T${pad(hour)}:${pad(minute)}`

/** Every atomic slot inside one grid cell: one when 30, two when 60. */
export const slotsInCell = (
  day: string,
  hour: number,
  minute: number,
  granularity: Granularity,
): string[] =>
  granularity === 60
    ? [slotKey(day, hour, 0), slotKey(day, hour, 30)]
    : [slotKey(day, hour, minute)]

/** The rows the grid renders, top to bottom. */
export const gridRows = (granularity: Granularity): Array<{ hour: number; minute: number }> =>
  granularity === 60
    ? INTERVIEW_HOURS.map((hour) => ({ hour, minute: 0 }))
    : INTERVIEW_HOURS.flatMap((hour) => [
        { hour, minute: 0 },
        { hour, minute: 30 },
      ])

/**
 * The atomic slot a booking falls in, so the Interviews tab can tell whether
 * the interviewer actually marked that time free. Floors to the half hour: a
 * 14:45 booking sits in the 14:30 slot, a 14:20 in the 14:00 one.
 */
export const slotOfDateTime = (localDateTime: string) => {
  const minute = Number(localDateTime.slice(14, 16))
  return `${localDateTime.slice(0, 14)}${minute < 30 ? "00" : "30"}`
}

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

/** Renders a time as a compact clock label, e.g. "9am" / "9:30am" / "09:30". */
export function formatHourLabel(hour: number, lang: "en" | "es", minute = 0): string {
  if (lang === "es") return `${pad(hour)}:${pad(minute)}`
  const suffix = hour < 12 ? "am" : "pm"
  const h = hour % 12 === 0 ? 12 : hour % 12
  return minute === 0 ? `${h}${suffix}` : `${h}:${pad(minute)}${suffix}`
}

/** Weekend columns are kept in the grid, just marked so they read differently. */
export const isWeekend = (day: string) => {
  const [y, m, d] = day.split("-").map(Number)
  const wd = new Date(y, m - 1, d).getDay()
  return wd === 0 || wd === 6
}
