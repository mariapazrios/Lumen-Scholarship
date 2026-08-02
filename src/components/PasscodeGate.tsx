import { useEffect, useState } from "react"
import Reveal from "./primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

type Role = "board" | "sponsor"

type Props = {
  /** Which passcode the server checks the typed code against */
  role: Role
  eyebrow: L
  heading: L
  children: React.ReactNode
}

/**
 * Server-side gate. The typed code goes to /api/login, which compares it against
 * BOARD_PASSCODE or SPONSOR_PASSCODE and returns an HMAC-signed httpOnly cookie.
 * No passcode ships in the bundle, and the routes behind this gate require the
 * cookie themselves, so the boundary holds even if someone renders the page
 * without going through this form.
 */
export default function PasscodeGate({ role, eyebrow, heading, children }: Props) {
  const { lang, t } = useLang()
  // "checking" until the session probe answers, so a reload with a live cookie
  // does not flash the form
  const [state, setState] = useState<"checking" | "locked" | "unlocked">("checking")
  const [code, setCode] = useState("")
  const [error, setError] = useState<"none" | "code" | "server">("none")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let live = true
    fetch("/api/login")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { role?: Role } | null) => {
        if (!live) return
        // A board cookie satisfies a sponsor gate; the reverse is not true.
        const ok = data?.role === "board" || data?.role === role
        // Only ever resolve the initial "checking": a slow probe that lands
        // after a successful submit must not throw the form back up.
        setState((s) => (s === "checking" ? (ok ? "unlocked" : "locked") : s))
      })
      .catch(() => live && setState((s) => (s === "checking" ? "locked" : s)))
    return () => {
      live = false
    }
  }, [role])

  if (state === "unlocked") return <>{children}</>

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError("none")
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role, passcode: code.trim() }),
      })
      if (res.ok) setState("unlocked")
      else setError(res.status === 401 ? "code" : "server")
    } catch {
      setError("server")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bg-background">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <form
            onSubmit={submit}
            className="max-w-xl mx-auto bg-surface rounded-sm p-8 md:p-12 text-center"
          >
            <div className="text-meta uppercase tracking-widest text-muted">{t(eyebrow)}</div>
            <h2 className="text-h3 font-semibold text-primary mt-3">{t(heading)}</h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setError("none")
                }}
                placeholder={lang === "es" ? "Código de acceso" : "Access code"}
                aria-label={lang === "es" ? "Código de acceso" : "Access code"}
                className="bg-white border border-ink/15 rounded-sm px-4 py-3 text-body text-ink w-full sm:w-64 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                // Deliberately not disabled while the session probe is in
                // flight: if that request stalls, a disabled button is
                // indistinguishable from a rejected code.
                disabled={busy}
                className="text-body font-semibold text-primary border border-primary/25 rounded-sm px-6 py-3 cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busy
                  ? lang === "es"
                    ? "Entrando"
                    : "Entering"
                  : lang === "es"
                    ? "Entrar"
                    : "Enter"}
              </button>
            </div>
            {error === "code" && (
              <p role="alert" className="text-body text-accent mt-4">
                {lang === "es" ? "Ese código no es correcto." : "That code isn't right."}
              </p>
            )}
            {error === "server" && (
              <p role="alert" className="text-body text-accent mt-4">
                {lang === "es"
                  ? "No se pudo verificar el código. Intenta de nuevo."
                  : "The code could not be checked. Try again."}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
