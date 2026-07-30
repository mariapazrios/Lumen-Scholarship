import { useMemo, useState } from "react"
import PasscodeGate, { PrototypeNotice } from "../components/PasscodeGate"
import Reveal from "../components/primitives/Reveal"
import { BOARD } from "../data/team"
import { SAMPLE_APPLICANTS } from "../data/sampleApplicants"
import { useLang } from "../lib/i18n"
import {
  COMMENT_PLACEHOLDER,
  DEFAULT_WEIGHTS,
  RECOMMENDATIONS,
  VALUES,
  blended,
  consolidate,
  emptyRating,
  loadMember,
  loadRatings,
  loadWeights,
  readOfScores,
  saveMember,
  saveRating,
  saveWeights,
  valuesAverage,
  type Rating,
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
  const [weights, setWeights] = useState(loadWeights)
  const [active, setActive] = useState(SAMPLE_APPLICANTS[0].slug)
  const [draft, setDraft] = useState<Rating>(
    () => loadRatings()[SAMPLE_APPLICANTS[0].slug]?.[loadMember()] ?? emptyRating(),
  )
  const [saved, setSaved] = useState(false)

  const applicant = SAMPLE_APPLICANTS.find((a) => a.slug === active)!
  const rows = useMemo(
    () => consolidate(SAMPLE_APPLICANTS.map((a) => a.slug), store, weights),
    [store, weights],
  )
  const labelOf = (slug: string) =>
    SAMPLE_APPLICANTS.find((a) => a.slug === slug)?.label ?? slug

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

  const setWeight = (patch: Partial<typeof weights>) => {
    const next = { ...weights, ...patch }
    setWeights(next)
    saveWeights(next)
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
                {lang === "es" ? "Candidatos" : "Candidates"}
              </div>
              <ul className="space-y-2">
                {SAMPLE_APPLICANTS.map((a) => {
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
                        <div className="text-meta text-muted mt-0.5">{t(a.major)}</div>
                      </button>
                    </li>
                  )
                })}
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
              <div className="mt-5 space-y-4 max-w-3xl">
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

              {/* Step 1: values */}
              <div className="mt-12 border-t border-ink/10 pt-8 max-w-3xl">
                <div className="text-meta uppercase tracking-widest text-muted">
                  {lang === "es" ? "Paso 1 · Valores Lumen" : "Step 1 · Lumen values"}
                </div>
                <p className="text-body text-ink/70 mt-2">
                  {lang === "es"
                    ? "Califica de 1 a 5. Si no aplica, deja 3 y explícalo en el comentario."
                    : "Score 1 to 5. If it does not apply, leave 3 and say so in the commentary."}
                </p>
                <div className="mt-6 space-y-6">
                  {VALUES.map((v) => (
                    <div key={v.key}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="text-body font-semibold text-primary">
                          {t(v.label)}
                        </div>
                        <div className="text-meta text-muted">{t(v.prompt)}</div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={draft.values[v.key as ValueKey] === n}
                            onClick={() => {
                              setDraft((d) => ({
                                ...d,
                                values: { ...d.values, [v.key]: n },
                              }))
                              setSaved(false)
                            }}
                            className={`w-11 h-11 rounded-sm border text-body tabular-nums cursor-pointer transition-colors duration-200 ${
                              draft.values[v.key as ValueKey] === n
                                ? "bg-primary text-white border-primary font-semibold"
                                : "border-ink/15 text-ink/70 hover:border-primary/50"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-body text-muted mt-6">
                  {lang === "es" ? "Promedio de valores" : "Values average"}:{" "}
                  <strong className="text-primary tabular-nums">
                    {valuesAverage(draft).toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Step 2: free form */}
              <div className="mt-10 border-t border-ink/10 pt-8 max-w-3xl">
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
                        className={`text-body rounded-sm px-4 py-2 border cursor-pointer transition-colors duration-200 ${
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

                <div className="mt-8 flex flex-wrap items-center gap-4">
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
                      {blended(draft, weights).toFixed(2)}
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
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "Consolidado" : "Consolidated"}
                </div>
                <h2 className="text-h3 font-semibold text-primary">
                  {lang === "es"
                    ? "La lectura de la junta, en conjunto."
                    : "The board's read, taken together."}
                </h2>
              </div>

              {/* Control center */}
              <div className="bg-white border border-ink/10 rounded-sm p-5 w-full sm:w-auto">
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "Centro de control" : "Control center"}
                </div>
                <div className="space-y-3">
                  {[
                    {
                      k: "values" as const,
                      label: lang === "es" ? "Peso valores" : "Values weight",
                    },
                    {
                      k: "freeForm" as const,
                      label: lang === "es" ? "Peso free form" : "Free form weight",
                    },
                    {
                      k: "maybeMargin" as const,
                      label: lang === "es" ? "Margen 'maybe'" : "'Maybe' margin",
                    },
                  ].map((row) => (
                    <label key={row.k} className="flex items-center gap-3 text-body">
                      <span className="text-muted w-36">{row.label}</span>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={weights[row.k]}
                        onChange={(e) => setWeight({ [row.k]: Number(e.target.value) })}
                        className="flex-1 accent-[var(--color-cobalt)]"
                      />
                      <span className="tabular-nums text-primary w-12 text-right">
                        {Math.round(weights[row.k] * 100)}%
                      </span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setWeight(DEFAULT_WEIGHTS)}
                  className="text-meta uppercase tracking-widest text-accent mt-3 cursor-pointer"
                >
                  {lang === "es" ? "Restablecer" : "Reset"}
                </button>
              </div>
            </div>
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
