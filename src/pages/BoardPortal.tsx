import { useMemo, useState } from "react"
import PasscodeGate, { PrototypeNotice } from "../components/PasscodeGate"
import Reveal from "../components/primitives/Reveal"
import { BOARD } from "../data/team"
import { SAMPLE_APPLICANTS } from "../data/sampleApplicants"
import { useLang } from "../lib/i18n"
import {
  COMMENT_PLACEHOLDER,
  RECOMMENDATIONS,
  VALUES,
  WEIGHTS,
  blended,
  consolidate,
  emptyRating,
  loadMember,
  loadRatings,
  readOfScores,
  saveMember,
  saveRating,
  valuesAverage,
  type Rating,
  type Score,
  type ValueKey,
} from "../lib/rubric"

const VERDICT_STYLE: Record<string, string> = {
  yes: "bg-primary text-white",
  maybe: "bg-accent/15 text-accent",
  no: "bg-ink/10 text-muted",
  unrated: "bg-ink/5 text-muted",
}

function Portal() {
  const { lang, t } = useLang()
  const [member, setMember] = useState(loadMember)
  const [store, setStore] = useState(loadRatings)
  const [active, setActive] = useState(SAMPLE_APPLICANTS[0].slug)
  const [draft, setDraft] = useState<Rating>(
    () => loadRatings()[SAMPLE_APPLICANTS[0].slug]?.[loadMember()] ?? emptyRating(),
  )
  const [saved, setSaved] = useState(false)
  const [filters, setFilters] = useState({ department: "", major: "", gender: "" })

  const applicant = SAMPLE_APPLICANTS.find((a) => a.slug === active)!
  const rows = useMemo(
    () => consolidate(SAMPLE_APPLICANTS.map((a) => a.slug), store, WEIGHTS),
    [store],
  )
  const labelOf = (slug: string) =>
    SAMPLE_APPLICANTS.find((a) => a.slug === slug)?.label ?? slug

  /** Filter options come from the applicants themselves, so they stay in sync. */
  const options = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs)].sort()
    return {
      departments: uniq(SAMPLE_APPLICANTS.map((a) => a.department)),
      majors: uniq(SAMPLE_APPLICANTS.map((a) => a.major.en)),
      genders: uniq(SAMPLE_APPLICANTS.map((a) => a.gender)),
    }
  }, [])

  const visible = SAMPLE_APPLICANTS.filter(
    (a) =>
      (!filters.department || a.department === filters.department) &&
      (!filters.major || a.major.en === filters.major) &&
      (!filters.gender || a.gender === filters.gender),
  )

  const pick = (slug: string) => {
    setActive(slug)
    setDraft(store[slug]?.[member] ?? emptyRating())
    setSaved(false)
  }

  const chooseMember = (slug: string) => {
    setMember(slug)
    saveMember(slug)
    setDraft(store[active]?.[slug] ?? emptyRating())
    setSaved(false)
  }

  const commit = () => {
    if (!member) return
    const rating = { ...draft, updatedAt: new Date().toISOString() }
    setStore(saveRating(active, member, rating))
    setSaved(true)
  }

  const myRating = store[active]?.[member]

  return (
    <>
      <PrototypeNotice scope="board" />

      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
            {lang === "es" ? "Junta de admisiones" : "Board of admissions"}
          </div>
          <h1 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Lee, califica, <em className="italic font-light">decide.</em>
              </>
            ) : (
              <>
                Read, score, <em className="italic font-light">decide.</em>
              </>
            )}
          </h1>

          {/* Who is rating */}
          <div className="mt-8">
            <label className="text-meta uppercase tracking-widest text-primary-foreground/60">
              {lang === "es" ? "Estás calificando como" : "You are rating as"}
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {BOARD.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => chooseMember(m.slug)}
                  className={`text-body rounded-sm px-4 py-2 cursor-pointer transition-colors duration-200 border ${
                    member === m.slug
                      ? "bg-white text-primary border-white font-semibold"
                      : "border-primary-foreground/25 text-primary-foreground/80 hover:text-white"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            {!member && (
              <p className="text-body text-primary-foreground/70 mt-3">
                {lang === "es"
                  ? "Elige tu nombre para empezar a guardar calificaciones."
                  : "Pick your name to start saving ratings."}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Candidate list + rating form */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8 lg:gap-12">
            <div>
              <div className="text-meta uppercase tracking-widest text-muted mb-3">
                {lang === "es" ? "Candidatos" : "Candidates"} ({visible.length})
              </div>

              {/* Filters */}
              <div className="space-y-2 mb-5">
                {[
                  {
                    key: "department" as const,
                    label: lang === "es" ? "Departamento" : "Department",
                    opts: options.departments,
                  },
                  {
                    key: "major" as const,
                    label: lang === "es" ? "Carrera" : "Major",
                    opts: options.majors,
                  },
                  {
                    key: "gender" as const,
                    label: lang === "es" ? "Género" : "Gender",
                    opts: options.genders,
                  },
                ].map((f) => (
                  <label key={f.key} className="block">
                    <span className="sr-only">{f.label}</span>
                    <select
                      value={filters[f.key]}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))
                      }
                      className="w-full bg-white border border-ink/15 rounded-sm px-3 py-2 text-meta text-ink cursor-pointer focus:outline-none focus:border-accent"
                    >
                      <option value="">
                        {lang === "es" ? `Todo: ${f.label}` : `All: ${f.label}`}
                      </option>
                      {f.opts.map((o) => (
                        <option key={o} value={o}>
                          {f.key === "gender"
                            ? o === "F"
                              ? lang === "es"
                                ? "Femenino"
                                : "Female"
                              : lang === "es"
                                ? "Masculino"
                                : "Male"
                            : o}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <ul className="space-y-2">
                {visible.map((a) => {
                  const mine = store[a.slug]?.[member]
                  return (
                    <li key={a.slug}>
                      <button
                        type="button"
                        onClick={() => pick(a.slug)}
                        className={`w-full text-left rounded-sm px-4 py-3 border transition-colors duration-200 cursor-pointer ${
                          active === a.slug
                            ? "border-primary bg-surface"
                            : "border-ink/10 hover:border-primary/40"
                        }`}
                      >
                        <div className="text-body font-semibold text-primary flex items-center justify-between gap-2">
                          {a.label}
                          {mine && (
                            <span className="text-[10px] uppercase tracking-widest text-accent">
                              {lang === "es" ? "Calificado" : "Rated"}
                            </span>
                          )}
                        </div>
                        <div className="text-meta text-muted mt-0.5">
                          {t(a.major)} · {a.city}
                        </div>
                      </button>
                    </li>
                  )
                })}
                {visible.length === 0 && (
                  <li className="text-body text-muted">
                    {lang === "es"
                      ? "Ningún candidato con esos filtros."
                      : "No candidates match those filters."}
                  </li>
                )}
              </ul>
            </div>

            <div>
              {/* Submission */}
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-h3 font-semibold text-primary">{applicant.label}</h2>
                <div className="text-meta uppercase tracking-widest text-muted">
                  {t(applicant.major)} · {applicant.city}
                </div>
              </div>
              <div className="text-meta uppercase tracking-widest text-accent mt-2">
                {t(applicant.prompt)}
              </div>

              {/* Academic record, as sent by Uniandes */}
              <div className="mt-6 bg-surface rounded-sm p-6">
                <div className="text-meta uppercase tracking-widest text-muted mb-4">
                  {lang === "es" ? "Registro académico" : "Academic record"}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4">
                  {[
                    {
                      k: lang === "es" ? "Saber 11" : "Saber 11",
                      v: `${applicant.academic.saber11}/500`,
                      strong: true,
                    },
                    { k: lang === "es" ? "Lectura crítica" : "Critical reading", v: applicant.academic.plc },
                    { k: lang === "es" ? "Matemáticas" : "Mathematics", v: applicant.academic.pma },
                    { k: lang === "es" ? "Sociales" : "Social studies", v: applicant.academic.psc },
                    { k: lang === "es" ? "Ciencias" : "Sciences", v: applicant.academic.pcn },
                    { k: lang === "es" ? "Inglés" : "English", v: applicant.academic.pin },
                  ].map((cell) => (
                    <div key={cell.k}>
                      <div className="text-meta uppercase tracking-widest text-muted">
                        {cell.k}
                      </div>
                      <div
                        className={`tabular-nums mt-1 ${
                          cell.strong
                            ? "text-h3 font-bold text-primary"
                            : "text-body font-semibold text-ink/80"
                        }`}
                      >
                        {cell.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 mt-5 pt-5 border-t border-ink/10">
                  {[
                    { k: lang === "es" ? "Colegio" : "School", v: applicant.academic.school },
                    { k: lang === "es" ? "Tipo" : "Type", v: t(applicant.academic.schoolType) },
                    { k: lang === "es" ? "Grado" : "Graduated", v: applicant.academic.graduated },
                    { k: "Estrato", v: applicant.academic.estrato },
                    { k: "Sisbén", v: applicant.academic.sisben },
                    {
                      k: lang === "es" ? "Hogar" : "Household",
                      v: `${t(applicant.academic.housing)} · ${applicant.academic.siblings} ${lang === "es" ? "herm." : "sibs"} · ${applicant.academic.age} ${lang === "es" ? "años" : "yrs"}`,
                    },
                  ].map((cell) => (
                    <div key={cell.k}>
                      <div className="text-meta uppercase tracking-widest text-muted">
                        {cell.k}
                      </div>
                      <div className="text-meta text-ink/80 mt-1">{cell.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submitted in Spanish: shown verbatim, with the English marked as a translation */}
              <div className="text-meta uppercase tracking-widest text-muted mt-8">
                {lang === "es"
                  ? "Ensayo, tal como fue enviado"
                  : "Essay, translated from the Spanish original"}
              </div>
              <div className="mt-3 space-y-4 max-w-3xl">
                {t(applicant.essay)
                  .split("\n\n")
                  .map((p) => (
                    <p key={p.slice(0, 24)} className="text-body text-ink/80">
                      {p}
                    </p>
                  ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-3xl">
                {applicant.shortAnswers.map((s) => (
                  <div key={s.q.en} className="bg-surface rounded-sm p-5">
                    <div className="text-meta uppercase tracking-widest text-muted">
                      {t(s.q)}
                    </div>
                    <p className="text-body text-ink/80 mt-1.5">{t(s.a)}</p>
                  </div>
                ))}
              </div>

              {/* Steps 1 and 2, side by side */}
              <div className="mt-12 border-t border-ink/10 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                  <div className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Paso 1 · Valores Lumen" : "Step 1 · Lumen values"}
                  </div>
                  <p className="text-body text-ink/70 mt-2">
                    {lang === "es"
                      ? "Califica de 1 a 5, o N/A si el ensayo no da con qué juzgarlo."
                      : "Score 1 to 5, or N/A when the essay gives nothing to judge it on."}
                  </p>
                  {/* 2x2 */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    {VALUES.map((v) => (
                      <div key={v.key}>
                        <div className="text-body font-semibold text-primary">
                          {t(v.label)}
                        </div>
                        <div className="mt-2 flex gap-1.5">
                          {([1, 2, 3, 4, 5, "na"] as Score[]).map((n) => {
                            const on = draft.values[v.key as ValueKey] === n
                            return (
                              <button
                                key={String(n)}
                                type="button"
                                aria-pressed={on}
                                aria-label={`${t(v.label)}: ${n === "na" ? "N/A" : n}`}
                                onClick={() => {
                                  setDraft((d) => ({
                                    ...d,
                                    values: { ...d.values, [v.key]: n },
                                  }))
                                  setSaved(false)
                                }}
                                className={`h-10 rounded-sm border text-meta tabular-nums cursor-pointer transition-colors duration-200 ${
                                  n === "na" ? "px-2.5" : "w-9"
                                } ${
                                  on
                                    ? "bg-primary text-white border-primary font-semibold"
                                    : "border-ink/15 text-ink/70 hover:border-primary/50"
                                }`}
                              >
                                {n === "na" ? "N/A" : n}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-body text-muted mt-6">
                    {lang === "es" ? "Promedio de valores" : "Values average"}:{" "}
                    <strong className="text-primary tabular-nums">
                      {valuesAverage(draft).toFixed(2)}
                    </strong>
                    <span className="text-meta">
                      {" "}
                      {lang === "es" ? "(N/A cuenta como 3)" : "(N/A counts as 3)"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es"
                      ? "Paso 2 · Comentario y recomendación"
                      : "Step 2 · Commentary and recommendation"}
                  </div>
                  <textarea
                    value={draft.comments}
                    onChange={(e) => {
                      const comments = e.target.value
                      setDraft((d) => ({ ...d, comments }))
                      setSaved(false)
                    }}
                    rows={5}
                    placeholder={t(COMMENT_PLACEHOLDER)}
                    className="mt-4 w-full bg-white border border-ink/15 rounded-sm px-4 py-3 text-body text-ink focus:outline-none focus:border-accent"
                  />
                  <div className="mt-5">
                    <div className="text-meta uppercase tracking-widest text-muted mb-2">
                      {lang === "es" ? "Recomendación" : "Recommendation"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RECOMMENDATIONS.map((r) => (
                        <button
                          key={r.score}
                          type="button"
                          aria-pressed={draft.recommendation === r.score}
                          onClick={() => {
                            setDraft((d) => ({ ...d, recommendation: r.score }))
                            setSaved(false)
                          }}
                          className={`text-meta rounded-sm px-3 py-2 border cursor-pointer transition-colors duration-200 ${
                            draft.recommendation === r.score
                              ? "bg-primary text-white border-primary font-semibold"
                              : "border-ink/15 text-ink/70 hover:border-primary/50"
                          }`}
                        >
                          {t(r.label)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={commit}
                    disabled={!member}
                    className="text-body font-semibold rounded-sm px-6 py-3 bg-primary text-white cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {lang === "es" ? "Guardar calificación" : "Save rating"}
                  </button>
                  <span className="text-body text-muted">
                    {lang === "es" ? "Puntaje mezclado" : "Blended score"}:{" "}
                    <strong className="text-primary tabular-nums">
                      {blended(draft, WEIGHTS).toFixed(2)}
                    </strong>
                  </span>
                  {saved && (
                    <span role="status" className="text-body text-accent">
                      {lang === "es" ? "Guardado." : "Saved."}
                    </span>
                  )}
                  {myRating?.updatedAt && !saved && (
                    <span className="text-meta text-muted">
                      {lang === "es" ? "Última vez" : "Last saved"}:{" "}
                      {new Date(myRating.updatedAt).toLocaleDateString(lang)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consolidated */}
      <section className="bg-surface-soft">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-3">
              {lang === "es" ? "Consolidado" : "Consolidated"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es"
                ? "La lectura de la junta, en conjunto."
                : "The board's read, taken together."}
            </h2>
            <p className="text-body text-ink/70 mt-3">
              {lang === "es"
                ? "Valores y free form pesan igual. El puntaje mezclado ordena la lista y define sí, maybe o no."
                : "Values and free form count equally. The blended score orders the list and sets yes, maybe or no."}
            </p>
          </Reveal>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/15">
                  {[
                    lang === "es" ? "Puesto" : "Rank",
                    lang === "es" ? "Candidato" : "Candidate",
                    lang === "es" ? "Valores" : "Values",
                    lang === "es" ? "Free form" : "Free form",
                    lang === "es" ? "Mezclado" : "Blended",
                    lang === "es" ? "Lecturas" : "Reads",
                    lang === "es" ? "¿Siguiente ronda?" : "Next round?",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-meta uppercase tracking-widest text-muted font-semibold py-3 pr-4"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.candidate} className="border-b border-ink/5">
                    <td className="py-3 pr-4 text-body tabular-nums text-muted">
                      {row.raters ? i + 1 : "·"}
                    </td>
                    <td className="py-3 pr-4 text-body font-semibold text-primary">
                      {labelOf(row.candidate)}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums text-ink/80">
                      {row.raters ? row.valuesAvg.toFixed(2) : "·"}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums text-ink/80">
                      {row.raters ? row.freeFormAvg.toFixed(2) : "·"}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums font-bold text-primary">
                      {row.raters ? row.score.toFixed(2) : "·"}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums text-muted">
                      {row.raters}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest font-semibold rounded-full px-2.5 py-1 ${VERDICT_STYLE[row.recommendation]}`}
                      >
                        {row.recommendation === "unrated"
                          ? lang === "es"
                            ? "Sin calificar"
                            : "Unrated"
                          : row.recommendation === "yes"
                            ? lang === "es"
                              ? "Sí"
                              : "Yes"
                            : row.recommendation === "no"
                              ? "No"
                              : "Maybe"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Read of the scores */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {rows.map((row) => (
              <div key={row.candidate} className="bg-white border border-ink/10 rounded-sm p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-body font-semibold text-primary">
                    {labelOf(row.candidate)}
                  </div>
                  <div className="text-meta tabular-nums text-muted">
                    {row.raters ? row.score.toFixed(2) : "·"}
                  </div>
                </div>
                <p className="text-body text-ink/75 mt-2">{readOfScores(row, lang)}</p>
                {row.raters > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {Object.entries(store[row.candidate] ?? {}).map(([slug, r]) => (
                      <li key={slug} className="text-meta text-muted">
                        <span className="font-semibold text-ink/70">
                          {BOARD.find((m) => m.slug === slug)?.name ?? slug}
                        </span>{" "}
                        · {valuesAverage(r).toFixed(1)} / {r.recommendation}
                        {r.comments && <>: {r.comments}</>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <p className="text-meta text-muted mt-8 max-w-3xl">
            {lang === "es"
              ? "El puesto y la lectura se calculan con las calificaciones ingresadas. Un análisis que lea los ensayos requiere una llamada a un modelo desde el servidor, que este prototipo no tiene."
              : "Rank and read are computed from the ratings entered. An analysis that reads the essays themselves needs a model call from a server, which this prototype does not have."}
          </p>
        </div>
      </section>
    </>
  )
}

export default function BoardPortal() {
  return (
    <PasscodeGate
      passcode="Lumen-Board!"
      storageKey="lumen-board-unlocked"
      eyebrow={{ en: "Board login", es: "Acceso junta" }}
      heading={{
        en: "Enter the board access code.",
        es: "Ingresa el código de acceso de la junta.",
      }}
    >
      <Portal />
    </PasscodeGate>
  )
}
