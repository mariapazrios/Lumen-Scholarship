import { useState } from "react"
import Reveal from "./primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

type Props = {
  /** Compared case-insensitively against the typed code */
  passcode: string
  storageKey: string
  eyebrow: L
  heading: L
  children: React.ReactNode
}

/**
 * Client-side gate. The passcode ships in the bundle, so this keeps a page out
 * of casual sight, nothing more. Never put anything behind it that would matter
 * if it leaked.
 */
export default function PasscodeGate({
  passcode,
  storageKey,
  eyebrow,
  heading,
  children,
}: Props) {
  const { lang, t } = useLang()
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(storageKey) === "1",
  )
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === passcode.toUpperCase()) {
      sessionStorage.setItem(storageKey, "1")
      setUnlocked(true)
    } else {
      setError(true)
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
                  setError(false)
                }}
                placeholder={lang === "es" ? "Código de acceso" : "Access code"}
                aria-label={lang === "es" ? "Código de acceso" : "Access code"}
                className="bg-white border border-ink/15 rounded-sm px-4 py-3 text-body text-ink w-full sm:w-64 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="text-body font-semibold text-primary border border-primary/25 rounded-sm px-6 py-3 cursor-pointer transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                {lang === "es" ? "Entrar" : "Enter"}
              </button>
            </div>
            {error && (
              <p role="alert" className="text-body text-accent mt-4">
                {lang === "es" ? "Ese código no es correcto." : "That code isn't right."}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

/** States plainly what this prototype does and does not do. */
export function PrototypeNotice({ scope }: { scope: "board" | "sponsor" }) {
  const { lang } = useLang()
  return (
    <div className="bg-accent text-white">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-4">
        <p className="text-body">
          {lang === "es" ? (
            <>
              <strong>Prototipo.</strong> Este código vive en el navegador, así que no
              protege nada de verdad.{" "}
              {scope === "board"
                ? "Los candidatos son inventados y tus calificaciones se guardan solo en este navegador."
                : "Los ensayos y los informes reales se adjuntan cuando exista autenticación en el servidor."}
            </>
          ) : (
            <>
              <strong>Prototype.</strong> This code lives in the browser, so it protects
              nothing in earnest.{" "}
              {scope === "board"
                ? "The candidates are invented and your ratings save to this browser only."
                : "Real essays and reports attach once server-side authentication is in place."}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
