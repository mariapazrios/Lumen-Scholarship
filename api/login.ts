import { issue, json, readSession, safeEqual, unauthorized, type Role } from "./_session"

export const config = { runtime: "edge" }

/**
 * Exchange a role passcode for a session cookie.
 *
 * The codes live in BOARD_PASSCODE and SPONSOR_PASSCODE on the server. Failures
 * are deliberately slow and identical, so this cannot be used to probe which
 * codes exist.
 *
 * GET reports the role the caller's cookie carries. The gate needs this because
 * the cookie is httpOnly: the browser cannot read it, so a reload has no other
 * way to tell an active session from an expired one.
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") {
    const role = await readSession(req)
    return role ? json({ role }) : unauthorized()
  }

  if (req.method !== "POST") return json({ error: "method not allowed" }, { status: 405 })

  let body: { role?: string; passcode?: string }
  try {
    body = await req.json()
  } catch {
    return json({ error: "bad request" }, { status: 400 })
  }

  const role = body.role === "board" || body.role === "sponsor" ? (body.role as Role) : null
  const supplied = (body.passcode ?? "").trim()
  if (!role || !supplied) return json({ error: "bad request" }, { status: 400 })

  const expected =
    role === "board" ? process.env.BOARD_PASSCODE : process.env.SPONSOR_PASSCODE
  if (!expected) return json({ error: "server not configured" }, { status: 500 })

  // Case-insensitive, matching the browser gate this route replaced. The codes
  // are spoken aloud and pasted around, and the board had been typing them in
  // whatever case for months; an exact match locked everyone out on arrival.
  // Folding costs one character class of entropy, which a shared passcode
  // behind a 12 hour session does not depend on.
  if (!safeEqual(supplied.toUpperCase(), expected.trim().toUpperCase())) {
    await new Promise((r) => setTimeout(r, 400 + Math.floor(Math.random() * 200)))
    return json({ error: "invalid code" }, { status: 401 })
  }

  return json({ ok: true, role }, { headers: { "set-cookie": await issue(role) } })
}
