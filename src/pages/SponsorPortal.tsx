import { useState } from "react"
import PasscodeGate, { PrototypeNotice } from "../components/PasscodeGate"
import Reveal from "../components/primitives/Reveal"
import { SCHOLARS } from "../data/scholars"
import { useLang, type L } from "../lib/i18n"

import { SCHOLAR_ESSAYS } from "../data/scholarEssays"
import { SCHOLAR_GRADES } from "../data/scholarGrades"

type ScholarRecord = {
  essay?: string
  grades?: { program: string; asOf: string; cumulative: number; semesters: string[] }
}

/**
 * Real essays and grades live in src/data/private/, which is gitignored, so they
 * are present locally and absent from the public deploy. import.meta.glob keeps
 * the build working either way; swap this for an authenticated fetch once the
 * portal sits behind real auth.
 */
const RECORDS: Record<string, ScholarRecord> = Object.values(
  import.meta.glob<{ SCHOLAR_RECORDS?: Record<string, ScholarRecord> }>(
    "../data/private/scholarRecords.ts",
    { eager: true },
  ),
)[0]?.SCHOLAR_RECORDS ?? {}

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
  const [essayOpen, setEssayOpen] = useState<string | null>(null)

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
              const record = {
                ...RECORDS[s.slug],
                grades: SCHOLAR_GRADES[s.slug],
                essay: SCHOLAR_ESSAYS[s.slug] ?? RECORDS[s.slug]?.essay,
              }
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

                          {/* Grades */}
                          <div className="mt-6 bg-surface rounded-sm p-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Desempeño académico" : "Academic performance"}
                            </div>
                            {record?.grades ? (
                              <>
                                <div className="flex flex-wrap items-baseline gap-x-3 mt-2">
                                  <div className="text-h3 font-bold text-primary tabular-nums">
                                    {record.grades.cumulative.toFixed(2)}
                                    <span className="text-body font-normal text-muted">
                                      /5.00
                                    </span>
                                  </div>
                                  <div className="text-meta uppercase tracking-widest text-muted">
                                    {lang === "es" ? "acumulado a" : "cumulative as of"}{" "}
                                    {record.grades.asOf}
                                  </div>
                                </div>
                                <div className="text-meta text-muted mt-2">
                                  {record.grades.program}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {record.grades.semesters.map((s) => (
                                    <span
                                      key={s}
                                      className="text-[11px] uppercase tracking-widest text-ink/70 border border-ink/15 rounded-full px-2 py-1 tabular-nums"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-body text-ink/70 mt-2">
                                {lang === "es"
                                  ? "Sin registro de notas importado."
                                  : "No grade record imported."}
                              </p>
                            )}
                          </div>

                          {/* Admissions essay */}
                          <div className="mt-4 bg-surface rounded-sm p-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es"
                                ? "Ensayo de admisión, tal como fue enviado"
                                : "Admissions essay, as submitted"}
                            </div>
                            {record?.essay ? (
                              <>
                                <div
                                  className={`mt-3 space-y-3 ${essayOpen === s.slug ? "" : "max-h-40 overflow-hidden relative"}`}
                                >
                                  {record.essay.split("\n\n").map((p) => (
                                    <p key={p.slice(0, 24)} className="text-body text-ink/80">
                                      {p}
                                    </p>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEssayOpen(essayOpen === s.slug ? null : s.slug)
                                  }
                                  className="text-meta uppercase tracking-widest text-accent mt-3 cursor-pointer"
                                >
                                  {essayOpen === s.slug
                                    ? lang === "es"
                                      ? "Contraer"
                                      : "Collapse"
                                    : lang === "es"
                                      ? "Leer completo"
                                      : "Read in full"}
                                </button>
                              </>
                            ) : (
                              <p className="text-body text-ink/70 mt-2">
                                {lang === "es"
                                  ? "Ensayo no importado en este entorno."
                                  : "Essay not imported in this environment."}
                              </p>
                            )}
                          </div>

                          {/* Board rubric from their own admissions round */}
                          <div className="mt-4 bg-surface rounded-sm p-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es"
                                ? "Rúbrica consolidada de su proceso"
                                : "Consolidated rubric from their round"}
                            </div>
                            <p className="text-body text-ink/70 mt-2">
                              {lang === "es"
                                ? "Pendiente: las rúbricas diligenciadas de 2023 y 2024 no se han importado todavía."
                                : "Pending: the completed 2023 and 2024 rubrics have not been imported yet."}
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
