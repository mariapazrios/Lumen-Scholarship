import { useState } from "react"
import Reveal from "../components/primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

const PASSCODE = "LUMEN26!"
const STORAGE_KEY = "lumen-apply-unlocked"

const PROMPTS: Array<{ es: string; en: string; isNew?: boolean }> = [
  {
    es: "Algunos estudiantes tienen un interés, historia, actividad o contexto que es tan significativo que creen que su aplicación estaría incompleta sin eso. Si esto te describe, por favor comparte tu historia.",
    en: "Some students have an interest, story, activity, or context so meaningful that they believe their application would be incomplete without it. If this describes you, please share your story.",
  },
  {
    es: "Las lecciones que aprendemos de los obstáculos que enfrentamos pueden ser fundamentales para el éxito futuro. Narra un momento en el que enfrentaste un desafío, imprevisto o fracaso. ¿Cómo te afectó y qué aprendiste de la experiencia?",
    en: "The lessons we take from the obstacles we face can be fundamental to later success. Recount a time you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?",
  },
  {
    es: "Reflexiona sobre un momento en el que cuestionaste o desafiaste una creencia o idea. ¿Qué motivó tu pensamiento? ¿Cuál fue el resultado?",
    en: "Reflect on a time you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?",
  },
  {
    es: "La inteligencia artificial está cambiando cómo aprendemos, trabajamos y creamos. Cuenta una experiencia real en la que la IA cambió tu forma de pensar o de hacer algo. ¿Qué lugar quieres que tenga en tu futuro, y qué crees que nunca debería reemplazar?",
    en: "Artificial intelligence is changing how we learn, work, and create. Tell us about a real experience where AI changed how you think or how you do something. What role do you want it to play in your future, and what do you believe it should never replace?",
    isNew: true,
  },
]

const SHORTS: Array<{ q: L; hint: L }> = [
  {
    q: { en: "Who am I?", es: "¿Quién soy?" },
    hint: {
      en: "A few sentences, in your own voice.",
      es: "Unas pocas frases, con tu propia voz.",
    },
  },
  {
    q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
    hint: {
      en: "Where you are headed, and why.",
      es: "Hacia dónde vas, y por qué.",
    },
  },
]

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const { lang } = useLang()
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === PASSCODE) {
      sessionStorage.setItem(STORAGE_KEY, "1")
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <section className="bg-background">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <form onSubmit={submit} className="max-w-xl mx-auto bg-surface rounded-sm p-8 md:p-12 text-center">
            <div className="text-meta uppercase tracking-widest text-muted">
              {lang === "es" ? "Acceso para candidatos" : "Candidate access"}
            </div>
            <h2 className="text-h3 font-semibold text-primary mt-3">
              {lang === "es"
                ? "Ingresa el código de tu correo de invitación."
                : "Enter the code from your invitation email."}
            </h2>
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
                {lang === "es"
                  ? "Ese código no es correcto. Revisa tu correo de invitación."
                  : "That code isn't right. Check your invitation email."}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Prompts() {
  const { lang, t } = useLang()
  return (
    <>
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "El ensayo" : "The essay"}
            </div>
            <h2 className="text-h2 font-semibold text-primary">
              {lang === "es" ? (
                <>
                  Elige <em className="italic font-light">un tema.</em>
                </>
              ) : (
                <>
                  Choose <em className="italic font-light">one prompt.</em>
                </>
              )}
            </h2>
            <p className="text-body text-ink/75 mt-4 max-w-2xl">
              {lang === "es"
                ? "Máximo 650 palabras, en español. No buscamos el ensayo perfecto: buscamos tu historia, contada con honestidad."
                : "650 words maximum, in Spanish. We aren't looking for the perfect essay: we're looking for your story, told honestly."}
            </p>
          </Reveal>

          <ol className="mt-12 space-y-0 border-t border-ink/10 max-w-3xl">
            {PROMPTS.map((p, i) => (
              <Reveal key={p.es.slice(0, 24)} delay={i * 100} as="li">
                <div className="flex gap-6 md:gap-8 py-7 border-b border-ink/10">
                  <span className="text-h3 font-bold text-accent tabular-nums shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-body text-ink/85">{lang === "es" ? p.es : p.en}</p>
                    {p.isNew && (
                      <span className="inline-block mt-3 text-[11px] leading-none uppercase tracking-widest font-semibold text-accent border border-accent/30 rounded-full px-2.5 py-1.5">
                        {lang === "es" ? "Nuevo este año" : "New this year"}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-surface-soft">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "Dos preguntas cortas" : "Two short questions"}
            </div>
            <h2 className="text-h2 font-semibold text-primary">
              {lang === "es" ? (
                <>
                  Y en pocas palabras,{" "}
                  <em className="italic font-light">preséntate.</em>
                </>
              ) : (
                <>
                  And in a few words, <em className="italic font-light">introduce yourself.</em>
                </>
              )}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-3xl">
            {SHORTS.map((s, i) => (
              <Reveal key={s.q.en} delay={i * 120}>
                <div className="bg-white border border-ink/10 rounded-sm p-8 h-full">
                  <h3 className="text-h3 font-semibold text-primary">{t(s.q)}</h3>
                  <p className="text-body text-muted mt-2">{t(s.hint)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <div className="bg-surface rounded-sm p-8 mt-10 max-w-3xl">
              <div className="text-meta uppercase tracking-widest text-muted mb-3">
                {lang === "es" ? "Qué sigue" : "What comes next"}
              </div>
              <p className="text-body text-ink/80">
                {lang === "es"
                  ? "Después del ensayo vienen las entrevistas: una serie de conversaciones individuales de 30 minutos con los miembros de la Junta Lumen. Los criterios de selección son los de siempre: resiliencia, excelencia, integridad e impacto."
                  : "After the essay come the interviews: a series of 30-minute one-on-one conversations with the members of the Lumen Board. The selection values are the same as always: resilience, excellence, integrity, and impact."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default function Apply() {
  const { lang } = useLang()
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "1")

  return (
    <>
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
              {lang === "es" ? "Para candidatos" : "For candidates"}
            </div>
            <h1 className="text-display font-light">
              {lang === "es" ? (
                <>
                  Tu historia
                  <br />
                  <em className="italic font-semibold">empieza aquí.</em>
                </>
              ) : (
                <>
                  Your story
                  <br />
                  <em className="italic font-semibold">starts here.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6 max-w-2xl">
              {lang === "es"
                ? "Si llegaste a la ronda final de Quiero Estudiar y recibiste nuestra invitación, este es el siguiente paso."
                : "If you reached the final round of Quiero Estudiar and received our invitation, this is the next step."}
            </p>
          </Reveal>
        </div>
      </section>

      {unlocked ? <Prompts /> : <Gate onUnlock={() => setUnlocked(true)} />}
    </>
  )
}
