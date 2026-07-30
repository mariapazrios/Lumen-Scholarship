import { useState } from "react"
import PasscodeGate, { PrototypeNotice } from "../components/PasscodeGate"
import Reveal from "../components/primitives/Reveal"
import { SCHOLARS } from "../data/scholars"
import { useLang, type L } from "../lib/i18n"

/**
 * Annual reports. The PDFs are not committed to this repo: anything in the
 * project is fetchable by URL, and the reports carry per-scholar grades. They
 * attach here once the portal is served behind real authentication.
 */
const REPORTS: Array<{ year: string; title: L; note: L; pages: number }> = [
  {
    year: "2024",
    title: { en: "Annual report 2024", es: "Informe anual 2024" },
    note: {
      en: "First generation: six scholars, first-semester results, and the founding cohort's profiles.",
      es: "Primera generación: seis estudiantes, resultados del primer semestre y los perfiles de la cohorte fundadora.",
    },
    pages: 10,
  },
  {
    year: "2025",
    title: { en: "Annual report 2025", es: "Informe anual 2025" },
    note: {
      en: "Both generations: eleven scholars, GPA against program averages, retention, and the fund's position.",
      es: "Ambas generaciones: once estudiantes, promedios frente a sus carreras, retención y la posición del fondo.",
    },
    pages: 17,
  },
]

function Portal() {
  const { lang, t, tl } = useLang()
  const [open, setOpen] = useState<string | null>(SCHOLARS[0]?.slug ?? null)

  return (
    <>
      <PrototypeNotice scope="sponsor" />

      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16 relative">
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
            {lang === "es" ? "Para patrocinadores" : "For sponsors"}
          </div>
          <h1 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Tu portafolio, <em className="italic font-light">estudiante por estudiante.</em>
              </>
            ) : (
              <>
                Your portfolio, <em className="italic font-light">scholar by scholar.</em>
              </>
            )}
          </h1>
          <p className="text-lead font-light text-primary-foreground/75 mt-5 max-w-2xl">
            {lang === "es"
              ? "Once estudiantes, dos generaciones, cinco más en camino. Los informes anuales y el perfil de cada Lumen."
              : "Eleven scholars, two generations, five more incoming. The annual reports and a profile for every Lumen."}
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "Informes anuales" : "Annual reports"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es" ? "El registro completo." : "The full record."}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {REPORTS.map((r, i) => (
              <Reveal key={r.year} delay={i * 110}>
                <div className="bg-surface rounded-sm p-8 h-full border-t-2 border-primary">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-h3 font-semibold text-primary">{t(r.title)}</h3>
                    <span className="text-meta uppercase tracking-widest text-muted">
                      {r.pages} {lang === "es" ? "págs" : "pp"}
                    </span>
                  </div>
                  <p className="text-body text-ink/75 mt-3">{t(r.note)}</p>
                  <div className="mt-5 text-meta uppercase tracking-widest text-accent">
                    {lang === "es"
                      ? "Se adjunta con autenticación"
                      : "Attaches with authentication"}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scholar profiles */}
      <section className="bg-surface-soft">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "Perfiles" : "Profiles"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es" ? "Un perfil por Lumen." : "A profile per Lumen."}
            </h2>
          </Reveal>

          <div className="mt-8 space-y-3">
            {SCHOLARS.map((s) => {
              const isOpen = open === s.slug
              return (
                <div
                  key={s.slug}
                  className="bg-white border border-ink/10 rounded-sm overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : s.slug)}
                    className="w-full text-left px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-2 cursor-pointer hover:bg-surface/60 transition-colors duration-200"
                  >
                    <img
                      src={`/scholars/${s.slug}.jpg`}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover object-[center_15%] shrink-0"
                      loading="lazy"
                    />
                    <span className="text-body font-semibold text-primary">{s.name}</span>
                    <span className="text-meta text-muted">{t(s.major)}</span>
                    <span className="text-meta uppercase tracking-widest text-muted ml-auto">
                      {lang === "es"
                        ? `Generación ${s.generation}`
                        : `${s.generation} Generation`}{" "}
                      · {s.hometown}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-ink/10">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <blockquote className="text-body italic text-primary border-l-2 border-accent pl-4">
                            &ldquo;{t(s.quote)}&rdquo;
                          </blockquote>
                          <div className="mt-5 space-y-3">
                            {tl(s.story).map((p) => (
                              <p key={p.slice(0, 24)} className="text-body text-ink/80">
                                {p}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-meta uppercase tracking-widest text-muted">
                            {lang === "es" ? "En el campus" : "On campus"}
                          </div>
                          <ul className="mt-3 space-y-2">
                            {tl(s.highlights).map((h) => (
                              <li key={h.slice(0, 24)} className="text-body text-ink/80 flex gap-3">
                                <span
                                  aria-hidden="true"
                                  className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0"
                                />
                                {h}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-6 bg-surface rounded-sm p-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es"
                                ? "Ensayo de admisión, rúbrica y notas"
                                : "Admissions essay, rubric and notes"}
                            </div>
                            <p className="text-body text-ink/70 mt-2">
                              {lang === "es"
                                ? "Contenido restringido. Se adjunta cuando el portal esté detrás de autenticación real, para que no quede accesible por URL."
                                : "Restricted content. It attaches once the portal sits behind real authentication, so it is never reachable by URL."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default function SponsorPortal() {
  return (
    <PasscodeGate
      passcode="LumenSponsor!"
      storageKey="lumen-sponsor-unlocked"
      eyebrow={{ en: "For sponsors", es: "Para patrocinadores" }}
      heading={{
        en: "Enter the sponsor access code.",
        es: "Ingresa el código de acceso de patrocinadores.",
      }}
    >
      <Portal />
    </PasscodeGate>
  )
}
