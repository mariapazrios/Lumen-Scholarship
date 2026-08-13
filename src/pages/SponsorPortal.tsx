import { useEffect, useState } from "react"
import PasscodeGate from "../components/PasscodeGate"
import ArrowButton from "../components/primitives/ArrowButton"
import Reveal from "../components/primitives/Reveal"
import { signOut } from "../lib/applicants"
import { SCHOLARS } from "../data/scholars"
import { COHORT_AVERAGES, SCHOLAR_COHORT } from "../data/cohortAverages"
import { useLang, type L } from "../lib/i18n"

import GpaTrend from "../components/GpaTrend"
import IcfesGpaScatter from "../components/IcfesGpaScatter"
import CohortRanking from "../components/CohortRanking"
import { useScholarGrades } from "../lib/grades"
import { achievementTerm, useScholarJournals } from "../lib/journals"
import { useScholarRanking } from "../lib/ranking"

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
  const { lang, t } = useLang()
  // Cards start closed: the grid is the overview now, and defaulting one open
  // buried the other ten under a full detail panel.
  const [open, setOpen] = useState<string | null>(null)
  const [essayOpen, setEssayOpen] = useState<string | null>(null)
  const [journalOpen, setJournalOpen] = useState<string | null>(null)
  // Term code highlighted across the chart and the extracurricular list. One
  // piece of state for both, since only one scholar card is open at a time and
  // the whole point is that the two halves agree on which term you are on.
  const [activeTerm, setActiveTerm] = useState<string | null>(null)
  const essays = useScholarEssays()
  const grades = useScholarGrades()
  const journals = useScholarJournals()
  const ranking = useScholarRanking()

  return (
    <>
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16 relative">
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
                Tomándole el pulso a las{" "}
                <em className="italic font-light">generaciones Lumen.</em>
              </>
            ) : (
              <>
                Keeping a pulse on the{" "}
                <em className="italic font-light">Lumen generations.</em>
              </>
            )}
          </h1>
          <p className="text-lead font-light text-primary-foreground/75 mt-5 max-w-2xl">
            {lang === "es"
              ? "Una lectura de las dos generaciones, y del desarrollo de cada estudiante semestre a semestre."
              : "Insights across both generations, and how every scholar is developing term by term."}
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
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

      {/* Cohort view, before the individual profiles: the question of whether
          the entrance score predicts the degree is about the group, and it
          reads badly one scholar at a time. */}
      <section className="bg-surface">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-4">
              {lang === "es" ? "La cohorte" : "The cohort"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es"
                ? "El puntaje de entrada no predice la carrera."
                : "The entrance score does not predict the degree."}
            </h2>
          </Reveal>

          {/* Two readings of the same cohort side by side. The scatter answers
              whether the entrance score bought anything, which is a question
              about the group. The ranking answers who needs a call this month,
              which is a question about people. They belong on one screen
              because the second is what you do about the first. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8 items-start">
            <Reveal>
              <div className="bg-surface-soft rounded-sm p-5 sm:p-8">
                <p className="text-body text-ink/75 mb-6">
                  {lang === "es"
                    ? "Saber 11 contra el promedio acumulado a 2026-1, un punto por estudiante."
                    : "Saber 11 against cumulative GPA as of 2026-1, one dot per scholar."}
                </p>
                <IcfesGpaScatter grades={grades} />
              </div>
            </Reveal>

            <Reveal delay={110}>
              <div className="bg-surface-soft rounded-sm p-5 sm:p-8">
                <p className="text-body text-ink/75 mb-2">
                  {lang === "es"
                    ? "Cada generación ordenada por crecimiento, reflexión, potencial, notas frente a sus pares de carrera y actividades extracurriculares."
                    : "Each generation ordered on growth, insight, potential, grades against their programme peers, and extracurricular record."}
                </p>
                <p className="text-meta text-muted mb-6">
                  {lang === "es"
                    ? "Las generaciones se ordenan por separado: una lista conjunta ordenaría antigüedad, no desempeño."
                    : "Generations are ranked separately: one combined list would be ranking seniority, not performance."}
                </p>
                <CohortRanking ranking={ranking} generations={GENERATIONS} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Scholar profiles */}
      <section className="bg-surface-soft">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
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
                  {/* A grid of cards, not a stack of rows: eleven scholars read as a
                      cohort you scan, and the one you pick expands in place to full
                      width rather than pushing the others off screen. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                    {cohort.map((s) => {
                      const isOpen = open === s.slug
              const record = {
                grades: grades?.[s.slug],
                essay: essays?.[s.slug],
                journal: journals?.[s.slug],
              }
              return (
                <div
                  key={s.slug}
                  id={`scholar-${s.slug}`}
                  className={`bg-white border rounded-sm overflow-hidden scroll-mt-24 transition-colors duration-200 ${
                    isOpen
                      ? "md:col-span-2 xl:col-span-3 border-accent/40"
                      : "border-ink/10 hover:border-accent/40"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`scholar-panel-${s.slug}`}
                    onClick={() => setOpen(isOpen ? null : s.slug)}
                    className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 cursor-pointer hover:bg-surface/60 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`/scholars/${s.slug}.jpg`}
                        alt=""
                        className="w-14 h-14 rounded-full object-cover object-[center_15%] shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-body font-semibold text-primary">{s.name}</div>
                        <div className="text-meta text-muted">{t(s.major)}</div>
                      </div>
                      <span className="text-meta uppercase tracking-widest text-accent ml-auto shrink-0">
                        {isOpen
                          ? lang === "es"
                            ? "Cerrar"
                            : "Close"
                          : lang === "es"
                            ? "Explorar"
                            : "Explore"}
                      </span>
                    </div>

                    {/* Collapsed face is deliberately thin: name, major, where
                        they are from, and the one number that matters. The
                        bio preview and the journal line were both restating
                        what opening the card shows in full. */}
                    {!isOpen && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-4 pt-3 border-t border-ink/10">
                        <span className="text-meta uppercase tracking-widest text-muted">
                          {lang === "es"
                            ? `Generación ${s.generation}`
                            : `${s.generation} Generation`}{" "}
                          · {s.hometown}
                        </span>
                        {record.grades?.cumulative && (
                          <span className="text-meta text-muted tabular-nums ml-auto">
                            {lang === "es" ? "PGA" : "GPA"}{" "}
                            <strong className="text-primary">
                              {record.grades.cumulative.toFixed(2)}
                            </strong>
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={`scholar-panel-${s.slug}`}
                      role="region"
                      className="px-4 sm:px-6 pb-6 pt-2 border-t border-ink/10"
                    >
                      {/* No overview here: the public scholars page already carries the
                          story and quote. This view is the detail sponsors cannot get
                          elsewhere. */}
                      {/* Trend first: this is the view sponsors come here for */}
                      {(record.grades || grades === null) && (
                        <div className="bg-surface rounded-sm p-4 sm:p-5 mb-6">
                          {/* The official cumulative is the single number a
                              sponsor is looking for, and it was set smaller
                              than the axis labels on the chart beside it.
                              Given the stat treatment the rest of the site
                              uses for its headline figures. */}
                          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mb-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Promedio por semestre" : "Average by term"}
                            </div>
                            {record.grades?.officialPga && (
                              <div className="sm:text-right">
                                <div className="text-meta uppercase tracking-widest text-muted">
                                  {lang === "es"
                                    ? "PGA acumulado oficial"
                                    : "Official cumulative PGA"}
                                </div>
                                <div className="text-stat font-semibold text-primary tabular-nums leading-none mt-1">
                                  {record.grades.officialPga.toFixed(2)}
                                  <span className="text-h3 font-light text-muted">/5.00</span>
                                </div>
                              </div>
                            )}
                          </div>
                          {record.grades ? (
                            <GpaTrend
                              record={record.grades}
                              cohort={COHORT_AVERAGES[SCHOLAR_COHORT[s.slug]]}
                              active={activeTerm}
                              onActive={setActiveTerm}
                            />
                          ) : (
                            <p role="status" className="text-body text-ink/70">
                              {lang === "es" ? "Cargando las notas." : "Loading the record."}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Extracurriculars sit directly under the chart, not
                          inside the journal: they are organised by semester,
                          which is what the rows above are, so the two read
                          together. This used to be two lists, one pinned to
                          the chart and one down here. The pinned one paired
                          highlights to terms in list order, which was an
                          invented mapping; these carry the scholar's own term
                          code, so hovering a term genuinely lights the term it
                          happened in, in both directions. */}
                      {record.journal &&
                        (record.journal.achievements.length > 0 ||
                          record.journal.achievementsNote) && (
                          <div className="bg-surface rounded-sm p-5 sm:p-8 mb-6">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
                              <div className="text-meta uppercase tracking-widest text-muted">
                                {lang === "es"
                                  ? "Logros y actividades extracurriculares"
                                  : "Extracurriculars and achievements"}
                              </div>
                              <div className="text-meta text-muted">
                                {lang === "es"
                                  ? record.journal.achievementsSource === "email"
                                    ? "Según su correo de envío"
                                    : "Según su journal"
                                  : record.journal.achievementsSource === "email"
                                    ? "As listed in their covering email"
                                    : "As listed in their journal"}
                              </div>
                            </div>
                            {record.journal.achievementsNote && (
                              <p className="text-body text-ink/70 italic mb-4">
                                {lang === "es"
                                  ? record.journal.achievementsNote.es
                                  : record.journal.achievementsNote.en}
                              </p>
                            )}
                            {record.journal.achievements.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
                                {record.journal.achievements.map((a) => {
                                  const term = achievementTerm(
                                    a,
                                    (record.grades?.terms ?? [])
                                      .filter((t) => t.average != null)
                                      .map((t) => t.term),
                                  )
                                  const isActive =
                                    term != null && activeTerm === term
                                  return (
                                    <div
                                      key={a.label.en + (a.code ?? "")}
                                      onMouseEnter={() => term && setActiveTerm(term)}
                                      onMouseLeave={() => term && setActiveTerm(null)}
                                      className={`border-l-2 pl-4 -ml-px rounded-r-sm transition-colors duration-200 ${
                                        isActive
                                          ? "border-accent bg-accent/5"
                                          : "border-accent/40"
                                      }`}
                                    >
                                      {/* The resolved term rides next to the
                                          scholar's own wording, so the row it
                                          lights on the chart is named rather
                                          than left to be inferred. */}
                                      <div className="text-meta uppercase tracking-widest text-primary font-semibold">
                                        {lang === "es" ? a.label.es : a.label.en}
                                        {term && (
                                          <span className="font-normal text-muted tabular-nums">
                                            {" "}
                                            {term}
                                          </span>
                                        )}
                                      </div>
                                      <ul className="mt-2 space-y-2">
                                        {a.items.map((it) => (
                                          <li
                                            key={it.en.slice(0, 24)}
                                            className="text-body text-ink/80"
                                          >
                                            {lang === "es" ? it.es : it.en}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}

                      {/* The journal sits above the essay on purpose: the essay is who
                          they were applying, the journal is who they are now.

                          It is set as a newspaper column rather than one long
                          measure. A thousand words across the full width of an
                          expanded card runs to about 200 characters a line, which
                          is roughly three times what anyone can track back to the
                          start of. Columns keep the measure honest and let the
                          whole entry sit in one screen. */}
                      <div className="bg-surface rounded-sm p-5 sm:p-8 mb-6">
                        {record.journal ? (
                          <>
                            <div className="border-b border-ink/15 pb-4 mb-6">
                              <div className="text-meta uppercase tracking-widest text-muted">
                                {lang === "es"
                                  ? "Journal, en sus propias palabras"
                                  : "Journal, in their own words"}
                              </div>
                              <h4 className="text-h3 font-semibold text-primary italic mt-2">
                                {record.journal.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-meta uppercase tracking-widest text-muted">
                                <span>{s.name}</span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">
                                  {record.journal.submittedAt}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums">
                                  {Math.max(1, Math.round(record.journal.words / 200))}{" "}
                                  {lang === "es" ? "min de lectura" : "min read"}
                                </span>
                              </div>
                            </div>

                            <div className="relative">
                              <div
                                className={`text-body text-ink/85 leading-relaxed lg:columns-2 2xl:columns-3 gap-10 [&>p]:mb-4 [&>p:first-of-type::first-letter]:float-left [&>p:first-of-type::first-letter]:mr-2 [&>p:first-of-type::first-letter]:mt-1 [&>p:first-of-type::first-letter]:text-[3.25rem] [&>p:first-of-type::first-letter]:leading-[0.8] [&>p:first-of-type::first-letter]:font-bold [&>p:first-of-type::first-letter]:text-primary ${
                                  journalOpen === s.slug
                                    ? ""
                                    : "max-h-72 overflow-hidden"
                                }`}
                              >
                                {record.journal.body.split("\n\n").map((p) => (
                                  <p key={p.slice(0, 24)}>{p}</p>
                                ))}
                              </div>
                              {/* Fade rather than a hard cut, so it reads as "there is
                                  more" instead of a sentence that broke. */}
                              {journalOpen !== s.slug && (
                                <div
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent"
                                />
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setJournalOpen(journalOpen === s.slug ? null : s.slug)
                              }
                              className="text-meta uppercase tracking-widest text-accent mt-4 cursor-pointer"
                            >
                              {journalOpen === s.slug
                                ? lang === "es"
                                  ? "Contraer"
                                  : "Collapse"
                                : lang === "es"
                                  ? `Leer completo, ${record.journal.words} palabras`
                                  : `Read in full, ${record.journal.words} words`}
                            </button>

                          </>
                        ) : journals === null ? (
                          <p role="status" className="text-body text-ink/70">
                            {lang === "es" ? "Cargando el journal." : "Loading the journal."}
                          </p>
                        ) : (
                          <>
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es"
                                ? "Journal, en sus propias palabras"
                                : "Journal, in their own words"}
                            </div>
                            <p className="text-body text-ink/70 mt-2">
                              {lang === "es"
                                ? "Todavía no ha enviado su journal de 2026."
                                : "Has not sent a 2026 journal yet."}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Achievements are not listed here: they appear as callouts
                            against the terms they happened in, on the chart above. */}
                        <div>
                          <div className="bg-surface rounded-sm p-4 sm:p-5">
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
                          <div className="bg-surface rounded-sm p-4 sm:p-5">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Desempeño académico" : "Academic performance"}
                            </div>
                            {record.grades ? (
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
                                {/* The programme, not a caption. Which degree
                                    this average was earned in is the thing
                                    that makes the number mean anything, so it
                                    is set at reading size. The per-term chips
                                    that used to sit under it are gone: the
                                    chart above already lists every term. */}
                                <div className="text-lead font-light text-ink/85 mt-3">
                                  {record.grades.program}
                                </div>
                              </>
                            ) : grades === null ? (
                              <p role="status" className="text-body text-ink/70 mt-2">
                                {lang === "es" ? "Cargando las notas." : "Loading the record."}
                              </p>
                            ) : (
                              <p className="text-body text-ink/70 mt-2">
                                {lang === "es"
                                  ? "Sin registro de notas importado."
                                  : "No grade record imported."}
                              </p>
                            )}
                            <div className="mt-4 pt-4 border-t border-ink/10">
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                              <div className="text-meta uppercase tracking-widest text-muted">
                                Saber 11
                              </div>
                              {record.grades?.saber11 ? (
                                <div className="text-body font-semibold text-primary tabular-nums">
                                  {record.grades.saber11.score}
                                  <span className="text-meta font-normal text-muted">/500</span>
                                  {record.grades.saber11.percentile !== undefined && (
                                    <span className="text-meta font-normal text-accent">
                                      {" "}
                                      ·{" "}
                                      {lang === "es"
                                        ? `percentil ${record.grades.saber11.percentile}`
                                        : `${record.grades.saber11.percentile}th percentile`}
                                    </span>
                                  )}
                                  {record.grades.saber11.selfReported && (
                                    <span className="text-meta font-normal text-muted">
                                      {" "}
                                      · {lang === "es" ? "autorreportado" : "self-reported"}
                                    </span>
                                  )}
                                </div>
                              ) : grades === null ? (
                                <div className="text-meta text-muted">
                                  {lang === "es" ? "Cargando." : "Loading."}
                                </div>
                              ) : (
                                <div className="text-meta text-muted">
                                  {lang === "es"
                                    ? "Admisión por desempeño escolar, sin puntaje en el registro"
                                    : "Admitted on school performance; no score on record"}
                                </div>
                              )}
                              </div>
                              {/* The five tests, read off the scholar's own ICFES
                                  report. Present only where the document is on
                                  file, so a self-reported global carries no
                                  breakdown it cannot support. */}
                              {record.grades?.saber11?.subjects && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-x-3 gap-y-2">
                                  {(
                                    [
                                      ["lecturaCritica", "Lectura crítica", "Critical reading"],
                                      ["matematicas", "Matemáticas", "Mathematics"],
                                      ["socialesCiudadanas", "Sociales", "Social studies"],
                                      ["cienciasNaturales", "Ciencias", "Natural sciences"],
                                      ["ingles", "Inglés", "English"],
                                    ] as const
                                  ).map(([key, es, en]) => {
                                    const test = record.grades!.saber11!.subjects![key]
                                    return (
                                      <div key={key}>
                                        <div className="text-meta uppercase tracking-widest text-muted leading-tight">
                                          {lang === "es" ? es : en}
                                        </div>
                                        <div className="text-body font-semibold text-primary tabular-nums">
                                          {test.score}
                                          <span className="text-meta font-normal text-muted">
                                            /100
                                          </span>
                                        </div>
                                        <div className="text-meta text-accent tabular-nums">
                                          {lang === "es"
                                            ? `p${test.percentile}`
                                            : `${test.percentile}th pct`}
                                        </div>
                                      </div>
                                    )
                                  })}
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
