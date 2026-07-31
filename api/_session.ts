/**
 * Session helpers for the Lumen portals.
 *
 * A session is an HMAC-signed, httpOnly cookie carrying a role and an expiry.
 * The passcodes live in environment variables on the server, so unlike the
 * client-side gates they are never shipped to the browser.
 */

export type Role = "board" | "sponsor"

const COOKIE = "lumen_session"
const TTL_HOURS = 12

const enc = new TextEncoder()

async function key(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error("SESSION_SECRET is not set")
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

async function sign(payload: string) {
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload))
  return `${payload}.${b64url(sig)}`
}

/** Constant-time-ish comparison, to avoid leaking the passcode by timing. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function issue(role: Role): Promise<string> {
  const expires = Date.now() + TTL_HOURS * 3600_000
  const token = await sign(`${role}:${expires}`)
  return (
    `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; ` +
    `Max-Age=${TTL_HOURS * 3600}`
  )
}

export async function readSession(req: Request): Promise<Role | null> {
  const raw = req.headers.get("cookie") ?? ""
  const match = raw.match(new RegExp(`${COOKIE}=([^;]+)`))
  if (!match) return null
  const token = match[1]
  const dot = token.lastIndexOf(".")
  if (dot < 0) return null
  const payload = token.slice(0, dot)
  const expected = await sign(payload)
  if (!safeEqual(token, expected)) return null

  const [role, expires] = payload.split(":")
  if (!role || !expires || Number(expires) < Date.now()) return null
  return role === "board" || role === "sponsor" ? role : null
}

/** Board members can see everything a sponsor can. */
export function allows(role: Role | null, needed: Role) {
  if (!role) return false
  return role === "board" || role === needed
}

export const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers ?? {}) },
  })

export const unauthorized = () => json({ error: "unauthorized" }, { status: 401 })
