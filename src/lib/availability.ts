import { SessionExpired } from "./rubric"

/** member slug -> the days ('YYYY-MM-DD') they marked as available. */
export type AvailabilityStore = Record<string, string[]>

export async function fetchAvailability(): Promise<AvailabilityStore> {
  const res = await fetch("/api/availability")
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`availability fetch failed: ${res.status}`)
  const data = (await res.json()) as { availability?: AvailabilityStore }
  return data.availability ?? {}
}

/** Replaces one member's full set of available days. */
export async function saveAvailability(member: string, days: string[]) {
  const res = await fetch("/api/availability", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ member, days }),
  })
  if (res.status === 401) throw new SessionExpired()
  if (!res.ok) throw new Error(`availability save failed: ${res.status}`)
}

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
