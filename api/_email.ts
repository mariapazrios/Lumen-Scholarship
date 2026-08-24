/**
 * Transactional email over the Resend HTTP API. Resend, not because it is the
 * only option, but because it needs nothing beyond one API key and it is the
 * default for Vercel-hosted projects like this one.
 *
 * Requires two env vars, same "set it in Vercel, redeploy" pattern as
 * SESSION_SECRET etc. (see README):
 *   RESEND_API_KEY — from resend.com
 *   EMAIL_FROM     — e.g. "Lumen <hq@lumenedu.org>". Sending to real
 *                    candidate and board addresses needs a verified sending
 *                    domain in Resend; the sandbox address only delivers to
 *                    the Resend account's own verified email.
 */

/** UTF-8 safe base64: `btoa` alone throws on the accented Spanish names/text here. */
function b64(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

// Resend infers the MIME type from the filename extension; there is no
// separate content-type field in its send API, so the attachment shape
// below only carries what actually gets sent.
export type MailAttachment = { filename: string; content: string }

export async function sendMail(opts: {
  to: string[]
  subject: string
  html: string
  attachments?: MailAttachment[]
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from) throw new Error("RESEND_API_KEY or EMAIL_FROM is not set")

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      attachments: opts.attachments?.map((a) => ({
        filename: a.filename,
        content: b64(a.content),
      })),
    }),
  })

  if (!res.ok) {
    // Truncated per external-api-safety: enough to debug, not enough to leak
    // whatever Resend echoes back.
    const body = await res.text().catch(() => "")
    throw new Error(`email send failed: ${res.status} ${body.slice(0, 200)}`)
  }
}

/** Pulls the bare address out of EMAIL_FROM ("Lumen <admisiones@x.com>" or a plain address). */
export function fromAddress(): string {
  const raw = process.env.EMAIL_FROM ?? ""
  const match = raw.match(/<([^>]+)>/)
  return match ? match[1] : raw
}

/** Parses BOARD_EMAILS, a JSON object of board slug -> email, set directly in Vercel. */
export function boardEmail(memberSlug: string): string | null {
  const raw = process.env.BOARD_EMAILS
  if (!raw) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== "object" || parsed === null) return null
  const email = (parsed as Record<string, unknown>)[memberSlug]
  return typeof email === "string" && email ? email : null
}
