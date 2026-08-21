/**
 * Minimal RFC 5545 calendar-invite builder, just enough for a one-off
 * interview appointment with two attendees. No recurring events, no
 * timezone tables: every timestamp goes out as UTC (`...Z`), which is what
 * lets a Bogotá interviewer's and a Madrid board member's calendar apps each
 * render the same instant in their own local time with zero timezone code
 * on our side.
 */

type Attendee = { name: string; email: string }

export type IcsEvent = {
  uid: string
  /** Sequence number: bump this on every re-send of an updated event (0 for new). */
  sequence: number
  method: "REQUEST" | "CANCEL"
  start: Date
  end: Date
  summary: string
  description: string
  location: string
  organizer: Attendee
  attendees: Attendee[]
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")

/**
 * Escapes text per RFC 5545 §3.3.11: backslash, comma, and semicolon are
 * literal-escaped, and a real newline becomes the two-character sequence
 * `\n` (calendar apps render that back as a line break in the description).
 */
const escapeText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n")

/** Folds a line to the 75-octet limit RFC 5545 §3.1 requires, continuation lines lead with one space. */
function foldLine(line: string): string {
  const enc = new TextEncoder()
  if (enc.encode(line).length <= 75) return line
  const out: string[] = []
  let rest = line
  let first = true
  while (enc.encode(rest).length > (first ? 75 : 74)) {
    let cut = first ? 75 : 74
    // Back off until the slice is valid UTF-8 (never split a multi-byte char).
    while (enc.encode(rest.slice(0, cut)).length > (first ? 75 : 74)) cut--
    out.push((first ? "" : " ") + rest.slice(0, cut))
    rest = rest.slice(cut)
    first = false
  }
  out.push(" " + rest)
  return out.join("\r\n")
}

export function buildIcs(ev: IcsEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "PRODID:-//Lumen//Interview Scheduler//ES",
    "VERSION:2.0",
    `METHOD:${ev.method}`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `SEQUENCE:${ev.sequence}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(ev.start)}`,
    `DTEND:${stamp(ev.end)}`,
    `SUMMARY:${escapeText(ev.summary)}`,
    `DESCRIPTION:${escapeText(ev.description)}`,
    `LOCATION:${escapeText(ev.location)}`,
    `ORGANIZER;CN=${escapeText(ev.organizer.name)}:mailto:${ev.organizer.email}`,
    ...ev.attendees.map(
      (a) =>
        `ATTENDEE;CN=${escapeText(a.name)};ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:${a.email}`,
    ),
    `STATUS:${ev.method === "CANCEL" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return lines.map(foldLine).join("\r\n") + "\r\n"
}
