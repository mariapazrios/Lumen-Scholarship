import { useEffect, useState } from "react"
import PasscodeGate from "../components/PasscodeGate"
import ArrowButton from "../components/primitives/ArrowButton"
import Reveal from "../components/primitives/Reveal"
import { signOut } from "../lib/applicants"
import { SCHOLARS } from "../data/scholars"
import { useLang, type L } from "../lib/i18n"

import GpaTrend from "../components/GpaTrend"
import { SCHOLAR_GRADES, SCHOLAR_SABER11 } from "../data/scholarGrades"
import { SCHOLAR_TERMS } from "../data/scholarTerms"

/**
 * Admissions essays, served only to an authenticated session. Fetched once for
 * the whole page: eleven bodies is one small response, and it keeps opening a
 * profile instant.
 */
function useScholarEssays() {
  const [essays, setEssays] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    let live = true
    fetch("/api/documents?kind=scholar-essay")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { documents?: Array<{ subject: string; body: string }> } | null) => {
        if (!live) return
        setEssays(
          Object.fromEntries((data?.documents ?? []).map((d) => [d.subject, d.body])),
        )
      })
      .catch(() => live && setEssays({}))
    return () => {
      live = false
    }
  }, [])

  return essays
}

/**
 * The reports. The PDFs are not shipped with the site: anything under `public/`
 * is served unauthenticated at its own URL, and both reports carry per-scholar
 * averages and the fund's financial position. They live in
 * `lumen_documents` as base64 under `kind = 'report'` and come back through
 * `/api/report`, which requires the session cookie. A top-level navigation
 * carries that cookie, so a plain link is all this needs.
 */
const REPORTS: Array<{ year: string; title: L; note: L; pages: number; size: L }> = [
  {
    year: "2024",
    // The document calls itself a semiannual report, and it covers Enero–Junio.
    title: { en: "Semiannual report 2024", es: "Informe semestral 2024" },
    note: {
      en: "January to June 2024. First generation: six scholars, their own accounts of getting in, first-semester results, and the fund's position at close.",
      es: "Enero a junio de 2024. Primera generación: seis estudiantes, su relato de cómo entraron, resultados del primer semestre y la posición del fondo al cierre.",
    },
    pages: 10,
    size: { en: "PDF · 1.7 MB", es: "PDF · 1,7 MB" },
  },
  {
    year: "2025",
    title: { en: "Annual report 2025", es: "Informe anual 2025" },
    note: {
      en: "Both generations: eleven scholars, GPA against program averages, retention against every other aid route, the admissions funnel, and the board.",
      es: "Ambas generaciones: once estudiantes, promedios frente a sus carreras, retención frente a las demás vías de financiación, el embudo de admisión y la junta.",
    },
    pages: 17,
    size: { en: "PDF · 3.8 MB", es: "PDF · 3,8 MB" },
  },
]

/** Oldest cohort first, so the list reads in the order the program grew. */
const GENERATIONS = ["2024", "2025"] as const

function Portal() {
  const { lang, t, tl } = useLang()
  const [open, setOpen] = useState<string | null>(SCHOLARS[0]?.slug ?? null)
  const [essayOpen, setEssayOpen] = useState<string | null>(null)
  const essays = useScholarEssays()

  return (
    <>
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16 relative">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
              {lang === "es" ? "Para patrocinadores" : "For sponsors"}
            </div>
            <button
              type="button"
              onClick={() => signOut().then(() => window.location.reload())}
              className="text-meta uppercase tracking-widest text-primary-foreground/70 border border-primary-foreground/25 rounded-sm px-4 py-2 cursor-pointer transition-colors duration-200 hover:text-white hover:border-primary-foreground/60"
            >
              {lang === "es" ? "Cerrar sesión" : "Sign out"}
            </button>
          </div>
          <h1 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Tus estudiantes, <em className="italic font-light">uno a uno.</em>
              </>
            ) : (
              <>
                Your scholars, <em className="italic font-light">one by one.</em>
              </>
            )}
          </h1>
          <p className="text-lead font-light text-primary-foreground/75 mt-5 max-w-2xl">
            {lang === "es"
              ? "Once estudiantes, dos generaciones, cinco más en camino. Los informes y el perfil de cada Lumen."
              : "Eleven scholars, two generations, five more incoming. The reports and a profile for every Lumen."}
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "Informes" : "Reports"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es" ? "El registro completo." : "The full record."}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {REPORTS.map((r, i) => (
              <Reveal key={r.year} delay={i * 110}>
                <div className="bg-surface rounded-sm p-8 h-full border-t-2 border-primary flex flex-col">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-h3 font-semibold text-primary">{t(r.title)}</h3>
                    <span className="text-meta uppercase tracking-widest text-muted shrink-0">
                      {r.pages} {lang === "es" ? "págs" : "pp"}
                    </span>
                  </div>
                  <p className="text-body text-ink/75 mt-3">{t(r.note)}</p>
                  {/* mt-auto so both cards land their link on the same line even
                      when one note runs a row longer than the other. */}
                  <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <ArrowButton
                      tone="cobalt"
                      href={`/api/report?year=${r.year}`}
                      target="_blank"
                      label={lang === "es" ? "Abrir el informe" : "Open the report"}
                    />
                    <span className="text-meta uppercase tracking-widest text-muted">
                      {t(r.size)}
                    </span>
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

          {/* On a phone the accordion is a lot of thumb travel; jump directly. */}
          <div className="lg:hidden mt-6">
            <label className="sr-only">
              {lang === "es" ? "Elige un estudiante" : "Pick a scholar"}
            </label>
            <select
              value={open ?? ""}
              onChange={(e) => {
                const slug = e.target.value || null
                setOpen(slug)
                if (slug)
                  setTimeout(
                    () =>
                      document
                        .getElementById(`scholar-${slug}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
                    60,
                  )
              }}
              className="w-full bg-white border border-ink/15 rounded-sm px-3 py-3 text-body text-ink cursor-pointer focus:outline-none focus:border-accent"
            >
              <option value="">
                {lang === "es" ? "Elige un estudiante…" : "Pick a scholar…"}
              </option>
              {GENERATIONS.map((gen) => (
                <optgroup
                  key={gen}
                  label={lang === "es" ? `Generación ${gen}` : `${gen} Generation`}
                >
                  {SCHOLARS.filter((s) => s.generation === gen).map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Split by cohort: the two generations are at different points in the
              degree, so comparing a 2025 scholar's terms against a 2024 one's
              without saying which is which invites the wrong conclusion. */}
          <div className="mt-8 space-y-12">
            {GENERATIONS.map((gen) => {
              const cohort = SCHOLARS.filter((s) => s.generation === gen)
              if (cohort.length === 0) return null
              return (
                <div key={gen}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-4">
                    <h3 className="text-meta uppercase tracking-widest font-semibold text-primary">
                      {lang === "es" ? `Generación ${gen}` : `${gen} Generation`}
                    </h3>
                    <span className="text-meta text-muted">
                      {cohort.length} {lang === "es" ? "estudiantes" : "scholars"}
                    </span>
                    <span aria-hidden="true" className="flex-1 h-px bg-ink/15 min-w-8" />
                  </div>
                  <div className="space-y-3">
                    {cohort.map((s) => {
                      const isOpen = open === s.slug
              const record = {
                grades: SCHOLAR_GRADES[s.slug],
                essay: essays?.[s.slug],
              }
              return (
                <div
                  key={s.slug}
                  id={`scholar-${s.slug}`}
                  className="bg-white border border-ink/10 rounded-sm overflow-hidden scroll-mt-24"
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
                      {/* No overview here: the public scholars page already carries the
                          story and quote. This view is the detail sponsors cannot get
                          elsewhere. */}
                      {/* Trend first: this is the view sponsors come here for */}
                      {SCHOLAR_TERMS[s.slug] && (
                        <div className="bg-surface rounded-sm p-5 mb-6">
                          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Promedio por semestre" : "Average by term"}
                            </div>
                            {SCHOLAR_TERMS[s.slug].officialPga && (
                              <div className="text-meta text-muted">
                                {lang === "es" ? "PGA acumulado oficial" : "Official cumulative PGA"}{" "}
                                <strong className="text-primary tabular-nums">
                                  {SCHOLAR_TERMS[s.slug].officialPga?.toFixed(2)}
                                </strong>
                              </div>
                            )}
                          </div>
                          <GpaTrend
                            record={SCHOLAR_TERMS[s.slug]}
                            achievements={tl(s.highlights)}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Achievements are not listed here: they appear as callouts
                            against the terms they happened in, on the chart above. */}
                        <div>
                          <div className="bg-surface rounded-sm p-5">
                            <div className="flex items-baseline justify-between gap-3">
                              <div className="text-meta uppercase tracking-widest text-muted">
                                {lang === "es"
                                  ? "Ensayo de admisión, tal como fue enviado"
                                  : "Admissions essay, as submitted"}
                              </div>
                              {/* An expanded essay pushes the bottom toggle a full
                                  screen away, which reads as "no way back". */}
                              {essayOpen === s.slug && (
                                <button
                                  type="button"
                                  onClick={() => setEssayOpen(null)}
                                  className="text-meta uppercase tracking-widest text-accent cursor-pointer shrink-0"
                                >
                                  {lang === "es" ? "Contraer" : "Collapse"}
                                </button>
                              )}
                            </div>
                            {record?.essay ? (
                              <>
                                <div
                                  className={`mt-3 space-y-3 ${essayOpen === s.slug ? "" : "max-h-72 overflow-hidden"}`}
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
                            ) : essays === null ? (
                              <p role="status" className="text-body text-ink/70 mt-2">
                                {lang === "es" ? "Cargando el ensayo." : "Loading the essay."}
                              </p>
                            ) : (
                              <p className="text-body text-ink/70 mt-2">
                                {lang === "es"
                                  ? "Sin ensayo registrado para este estudiante."
                                  : "No essay on file for this scholar."}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          {/* Grades */}
                          <div className="bg-surface rounded-sm p-5">
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
                            <div className="mt-4 pt-4 border-t border-ink/10 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <div className="text-meta uppercase tracking-widest text-muted">
                                Saber 11
                              </div>
                              {SCHOLAR_SABER11[s.slug] ? (
                                <div className="text-body font-semibold text-primary tabular-nums">
                                  {SCHOLAR_SABER11[s.slug]!.score}
                                  <span className="text-meta font-normal text-muted">/500</span>
                                  {SCHOLAR_SABER11[s.slug]!.selfReported && (
                                    <span className="text-meta font-normal text-muted">
                                      {" "}
                                      · {lang === "es" ? "autorreportado" : "self-reported"}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="text-meta text-muted">
                                  {lang === "es"
                                    ? "Admisión por desempeño escolar, sin puntaje en el registro"
                                    : "Admitted on school performance; no score on record"}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* No rubric card here: Lumen does not hold the scored
                              rubrics from the 2023 and 2024 rounds, so a placeholder
                              promising them was promising something that isn't coming. */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                      )
                    })}
                  </div>
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
      role="sponsor"
      eyebrow={{ en: "Sponsor login", es: "Acceso patrocinadores" }}
      heading={{
        en: "Enter the sponsor access code.",
        es: "Ingresa el código de acceso de patrocinadores.",
      }}
    >
      <Portal />
    </PasscodeGate>
  )
}
