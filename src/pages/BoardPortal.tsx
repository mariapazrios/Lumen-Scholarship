import { useCallback, useEffect, useMemo, useState } from "react"
import ApplicantsMap from "../components/ApplicantsMap"
import PasscodeGate from "../components/PasscodeGate"
import Reveal from "../components/primitives/Reveal"
import { BOARD } from "../data/team"
import { useLang } from "../lib/i18n"
import {
  HOUSING,
  SCHOOL_TYPE,
  fetchApplicants,
  signOut,
  type Applicant,
} from "../lib/applicants"
import {
  COMMENT_PLACEHOLDER,
  RECOMMENDATIONS,
  SessionExpired,
  VALUES,
  consolidate,
  fetchRatings,
  loadMember,
  readOfScores,
  saveMember,
  saveRating,
  scoreValue,
  valuesAverage,
  type Rating,
  type RatingStore,
  type Score,
  type ValueKey,
} from "../lib/rubric"

const VERDICT_STYLE: Record<string, string> = {
  yes: "bg-primary text-white",
  maybe: "bg-accent/15 text-accent",
  no: "bg-ink/10 text-muted",
  unrated: "bg-ink/5 text-muted",
}

/**
 * What a member is composing, as distinct from a saved Rating: everything
 * starts unset. The form used to arrive pre-filled with a complete all-3s
 * "Strong / Solid" rating, so one stray click on Save recorded a
 * legitimate-looking score the member never chose.
 */
type Draft = {
  values: Record<ValueKey, Score | null>
  recommendation: number | null
  comments: string
}

const emptyDraft = (): Draft => ({
  values: { resilience: null, excellence: null, integrity: null, community: null },
  recommendation: null,
  comments: "",
})

/** A draft is saveable only once all four values and the recommendation are set. */
function toRating(d: Draft): Rating | null {
  if (VALUES.some((v) => d.values[v.key] == null) || d.recommendation == null) return null
  return {
    values: d.values as Record<ValueKey, Score>,
    recommendation: d.recommendation,
    comments: d.comments,
    updatedAt: "",
  }
}

const draftValuesAvg = (d: Draft): number | null => {
  const vals = VALUES.map((v) => d.values[v.key])
  if (vals.some((s) => s == null)) return null
  const nums = vals.map((s) => scoreValue(s as Score))
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

/** Renders prose that arrived as plain text with blank lines between paragraphs. */
function Prose({ text }: { text: string }) {
  return (
    <div className="mt-3 space-y-4 max-w-3xl">
      {text.split("\n\n").map((p, i) => (
        <p key={`${i}-${p.slice(0, 16)}`} className="text-body text-ink/80">
          {p}
        </p>
      ))}
    </div>
  )
}

function Portal({ onSessionLost }: { onSessionLost: () => void }) {
  const { lang } = useLang()
  const [member, setMember] = useState(loadMember)
  const [people, setPeople] = useState<Applicant[]>([])
  const [store, setStore] = useState<RatingStore>({})
  const [active, setActive] = useState<string>("")
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saved, setSaved] = useState(false)
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading")
  const [filters, setFilters] = useState({ department: "", program: "", gender: "" })
  const [sort, setSort] = useState<"name" | "saber-desc" | "saber-asc">("name")

  const refresh = useCallback(async () => {
    try {
      setStore(await fetchRatings())
      setStatus("ready")
    } catch (e) {
      if (e instanceof SessionExpired) onSessionLost()
      else setStatus("error")
    }
  }, [onSessionLost])

  useEffect(() => {
    let live = true
    Promise.all([fetchApplicants(), fetchRatings()])
      .then(([roster, ratings]) => {
        if (!live) return
        setPeople(roster)
        setStore(ratings)
        const first = roster.find((a) => a.essay) ?? roster[0]
        if (first) {
          setActive(first.slug)
          setDraft(ratings[first.slug]?.[loadMember()] ?? emptyDraft())
        }
        setStatus("ready")
      })
      .catch((e) => {
        if (!live) return
        if (e instanceof SessionExpired) onSessionLost()
        else setStatus("error")
      })
    return () => {
      live = false
    }
  }, [onSessionLost])

  const submitted = people.filter((a) => a.essay)
  const applicant = people.find((a) => a.slug === active)

  // Only candidates with an essay can be scored, so the table ranks those.
  const rows = useMemo(
    () => consolidate(submitted.map((a) => a.slug), store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, people],
  )
  const nameOf = (slug: string) => people.find((a) => a.slug === slug)?.name ?? slug

  const ratedRows = rows.filter((r) => r.raters > 0)
  // The yes/maybe/no cut is relative to the board's median, so one early
  // rating silently re-labels everyone else. Hold the chips until every
  // submitted candidate has at least one read.
  const verdictsLive = rows.length > 0 && ratedRows.length === rows.length

  const options = useMemo(() => {
    const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))].sort()
    return {
      departments: uniq(people.map((a) => a.department)),
      programs: uniq(people.map((a) => a.program)),
      genders: uniq(people.map((a) => a.gender)),
    }
  }, [people])

  const matches = (f: typeof filters) => (a: Applicant) =>
    (!f.department || a.department === f.department) &&
    (!f.program || a.program === f.program) &&
    (!f.gender || a.gender === f.gender)

  /**
   * Candidates with no Saber 11 on record sink to the bottom in both
   * directions. Ascending order is for finding the bottom of the field, and a
   * missing score is not the bottom of the field, it is an unknown.
   */
  const ordered = (xs: Applicant[]) => {
    const by = [...xs]
    const byName = (a: Applicant, b: Applicant) => a.name.localeCompare(b.name)
    if (sort === "name") return by.sort(byName)
    const dir = sort === "saber-desc" ? -1 : 1
    return by.sort((a, b) => {
      if (a.saber11 == null && b.saber11 == null) return byName(a, b)
      if (a.saber11 == null) return 1
      if (b.saber11 == null) return -1
      return (a.saber11 - b.saber11) * dir || byName(a, b)
    })
  }

  const visible = ordered(people.filter(matches(filters)))

  /**
   * Changing a filter can hide the candidate being read, which left the detail
   * pane showing someone the list no longer contains. Reselect in the handler
   * so pane and list always agree.
   */
  const applyFilter = (key: keyof typeof filters, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const nextVisible = people.filter(matches(next))
    if (nextVisible.some((a) => a.slug === active)) return
    const first = nextVisible[0]
    setActive(first?.slug ?? "")
    setDraft(first ? (store[first.slug]?.[member] ?? emptyDraft()) : emptyDraft())
    setSaved(false)
  }

  const pick = (slug: string) => {
    setActive(slug)
    setDraft(store[slug]?.[member] ?? emptyDraft())
    setSaved(false)
  }

  const chooseMember = (slug: string) => {
    setMember(slug)
    saveMember(slug)
    setDraft(store[active]?.[slug] ?? emptyDraft())
    setSaved(false)
  }

  const commit = async () => {
    const rating = toRating(draft)
    if (!member || !rating || status === "saving" || !applicant?.essay) return
    setStatus("saving")
    try {
      await saveRating(active, member, rating)
      await refresh()
      setSaved(true)
    } catch (e) {
      if (e instanceof SessionExpired) onSessionLost()
      else setStatus("error")
    }
  }

  const myRating = store[active]?.[member]
  const t2 = (map: Record<string, { en: string; es: string }>, k: string) =>
    map[k] ? (lang === "es" ? map[k].es : map[k].en) : k

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
                {lang === "es" ? "Junta de admisiones" : "Board of admissions"}
              </div>
              <h1 className="text-h2 font-semibold">
                {lang === "es" ? (
                  <>
                    Centro de Admisiones <em className="italic font-light">Lumen.</em>
                  </>
                ) : (
                  <>
                    Lumen Admissions <em className="italic font-light">Center.</em>
                  </>
                )}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => signOut().then(onSessionLost)}
              className="text-meta uppercase tracking-widest text-primary-foreground/70 border border-primary-foreground/25 rounded-sm px-4 py-2 cursor-pointer transition-colors duration-200 hover:text-white hover:border-primary-foreground/60"
            >
              {lang === "es" ? "Cerrar sesión" : "Sign out"}
            </button>
          </div>

          <p className="text-body text-primary-foreground/70 mt-5 max-w-2xl">
            {lang === "es"
              ? `${submitted.length} de ${people.length} candidatos han enviado su ensayo. Las calificaciones se guardan en el servidor y las ve toda la junta.`
              : `${submitted.length} of ${people.length} candidates have submitted an essay. Ratings save to the server and the whole board sees them.`}
          </p>

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

      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          {status === "loading" && (
            <p role="status" className="text-body text-muted">
              {lang === "es" ? "Cargando candidatos." : "Loading candidates."}
            </p>
          )}

          {status !== "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-8 lg:gap-12">
              {/* On a phone the 17-row list means scrolling past everyone to
                  reach the essay; a dropdown jumps straight to a candidate. */}
              <div className="lg:hidden">
                <label className="text-meta uppercase tracking-widest text-muted">
                  {lang === "es" ? "Candidato" : "Candidate"} ({visible.length})
                </label>
                <select
                  value={active}
                  onChange={(e) => e.target.value && pick(e.target.value)}
                  className="mt-2 w-full bg-white border border-ink/15 rounded-sm px-3 py-3 text-body text-ink cursor-pointer focus:outline-none focus:border-accent"
                >
                  {!active && <option value="">—</option>}
                  {visible.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {a.name}
                      {a.essay ? "" : lang === "es" ? " — sin ensayo" : " — no essay"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden lg:block">
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "Candidatos" : "Candidates"} ({visible.length})
                </div>

                <div className="space-y-2 mb-5">
                  {/* Sort sits above the filters: it changes the reading order of
                      the whole field, where the filters change who is in it. */}
                  <label className="block">
                    <span className="sr-only">
                      {lang === "es" ? "Ordenar por" : "Sort by"}
                    </span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as typeof sort)}
                      className="w-full bg-white border border-ink/15 rounded-sm px-3 py-2 text-meta text-ink cursor-pointer focus:outline-none focus:border-accent"
                    >
                      <option value="name">
                        {lang === "es" ? "Orden: nombre (A-Z)" : "Sort: name (A-Z)"}
                      </option>
                      <option value="saber-desc">
                        {lang === "es"
                          ? "Orden: ICFES, mayor a menor"
                          : "Sort: ICFES, highest first"}
                      </option>
                      <option value="saber-asc">
                        {lang === "es"
                          ? "Orden: ICFES, menor a mayor"
                          : "Sort: ICFES, lowest first"}
                      </option>
                    </select>
                  </label>
                  {[
                    {
                      key: "department" as const,
                      label: lang === "es" ? "Departamento" : "Department",
                      opts: options.departments,
                    },
                    {
                      key: "program" as const,
                      label: lang === "es" ? "Carrera" : "Major",
                      opts: options.programs,
                    },
                    {
                      key: "gender" as const,
                      label: lang === "es" ? "Género" : "Gender",
                      opts: options.genders,
                    },
                  ]
                    .filter((f) => f.opts.length > 1)
                    .map((f) => (
                      <label key={f.key} className="block">
                        <span className="sr-only">{f.label}</span>
                        <select
                          value={filters[f.key]}
                          onChange={(e) => applyFilter(f.key, e.target.value)}
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
                          } ${a.essay ? "" : "opacity-55"}`}
                        >
                          <div className="text-body font-semibold text-primary flex items-center justify-between gap-2">
                            {a.name}
                            {mine && (
                              <span className="text-[10px] uppercase tracking-widest text-accent">
                                {lang === "es" ? "Calificado" : "Rated"}
                              </span>
                            )}
                          </div>
                          <div className="text-meta text-muted mt-0.5">
                            {(() => {
                              // The score rides in the meta line so the ICFES sort is
                              // legible: an ordered list with the number hidden asks
                              // the reader to trust it.
                              const saber =
                                a.saber11 != null
                                  ? `ICFES ${a.saber11}`
                                  : lang === "es"
                                    ? "sin ICFES"
                                    : "no ICFES"
                              const parts = [a.program, a.city, saber].filter(Boolean)
                              if (!a.essay) parts.push(lang === "es" ? "sin ensayo" : "no essay")
                              return parts.join(" · ")
                            })()}
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
                {!applicant && (
                  <p className="text-body text-muted">
                    {lang === "es" ? "Ningún candidato seleccionado." : "No candidate selected."}
                  </p>
                )}

                {applicant && (
                  <>
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h2 className="text-h3 font-semibold text-primary">{applicant.name}</h2>
                      <div className="text-meta uppercase tracking-widest text-muted">
                        {[applicant.program, applicant.city].filter(Boolean).join(" · ")}
                      </div>
                    </div>
                    <div className="text-meta uppercase tracking-widest text-accent mt-2">
                      {applicant.submitted_at
                        ? `${lang === "es" ? "Enviado" : "Submitted"} ${new Date(
                            applicant.submitted_at,
                          ).toLocaleDateString(lang, {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : lang === "es"
                          ? "Sin envío"
                          : "Nothing submitted"}
                      {!applicant.invited &&
                        (lang === "es"
                          ? " · No estaba en la convocatoria"
                          : " · Not on the invited list")}
                    </div>

                    {/* Academic record, as sent by Uniandes */}
                    <div className="mt-6 bg-surface rounded-sm p-6">
                      <div className="text-meta uppercase tracking-widest text-muted mb-4">
                        {lang === "es" ? "Registro académico" : "Academic record"}
                      </div>
                      {applicant.saber11 == null ? (
                        <p className="text-body text-ink/70">
                          {lang === "es"
                            ? "Sin puntajes Saber 11 en la convocatoria. La hoja de cálculo llegó con valores de relleno para esta cohorte, así que no se muestra ninguno."
                            : "No Saber 11 scores on the roster. The spreadsheet arrived with placeholder values for this cohort, so none are shown."}
                        </p>
                      ) : (
                        <>
                          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              Saber 11
                            </div>
                            <div className="text-h3 font-bold text-primary tabular-nums">
                              {applicant.saber11}
                              <span className="text-body font-normal text-muted">/500</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-4 mt-5">
                            {[
                              { k: lang === "es" ? "Lectura crítica" : "Critical reading", v: applicant.plc },
                              { k: lang === "es" ? "Matemáticas" : "Mathematics", v: applicant.pma },
                              { k: lang === "es" ? "Sociales" : "Social studies", v: applicant.psc },
                              { k: lang === "es" ? "Ciencias" : "Sciences", v: applicant.pcn },
                              { k: lang === "es" ? "Inglés" : "English", v: applicant.pin },
                            ].map((cell) => (
                              <div key={cell.k} className="flex flex-col">
                                <div className="text-meta uppercase tracking-widest text-muted min-h-[2.6em]">
                                  {cell.k}
                                </div>
                                <div className="text-body font-semibold text-ink/80 tabular-nums mt-auto">
                                  {cell.v ?? "—"}
                                  <span className="text-meta font-normal text-muted">/100</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {(applicant.school || applicant.estrato) && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-4 mt-5 pt-5 border-t border-ink/10">
                          {[
                            { k: lang === "es" ? "Colegio" : "School", v: applicant.school },
                            {
                              k: lang === "es" ? "Tipo" : "Type",
                              v: t2(SCHOOL_TYPE, applicant.school_type),
                            },
                            { k: lang === "es" ? "Grado" : "Graduated", v: applicant.graduated },
                            { k: "Estrato", v: applicant.estrato },
                            { k: "Sisbén", v: applicant.sisben },
                            {
                              k: lang === "es" ? "Hogar" : "Household",
                              // "Rented · 1 sibs · 17 yrs" read as codes; spell it out
                              v: [
                                applicant.housing &&
                                  (lang === "es"
                                    ? `Vivienda ${t2(HOUSING, applicant.housing).toLowerCase()}`
                                    : `${t2(HOUSING, applicant.housing)} home`),
                                applicant.siblings &&
                                  `${applicant.siblings} ${
                                    applicant.siblings === "1"
                                      ? lang === "es"
                                        ? "hermano"
                                        : "sibling"
                                      : lang === "es"
                                        ? "hermanos"
                                        : "siblings"
                                  }`,
                                applicant.age &&
                                  (lang === "es"
                                    ? `${Math.floor(applicant.age)} años`
                                    : `age ${Math.floor(applicant.age)}`),
                              ]
                                .filter(Boolean)
                                .join(" · "),
                            },
                          ]
                            .filter((c) => c.v)
                            .map((cell) => (
                              <div key={cell.k}>
                                <div className="text-meta uppercase tracking-widest text-muted">
                                  {cell.k}
                                </div>
                                <div className="text-meta text-ink/80 mt-1">{cell.v}</div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Submitted in Spanish, shown verbatim */}
                    <div className="text-meta uppercase tracking-widest text-muted mt-8">
                      {lang === "es"
                        ? "Ensayo, tal como fue enviado"
                        : "Essay, as submitted (Spanish original)"}
                    </div>
                    {applicant.essay ? (
                      <Prose text={applicant.essay} />
                    ) : (
                      <p className="text-body text-ink/70 mt-3">
                        {lang === "es"
                          ? "Este candidato todavía no ha enviado su ensayo."
                          : "This candidate has not submitted an essay yet."}
                      </p>
                    )}

                    {applicant.answers && (
                      <div className="mt-8">
                        <div className="text-meta uppercase tracking-widest text-muted">
                          {lang === "es" ? "Respuestas cortas" : "Short answers"}
                        </div>
                        <div className="bg-surface rounded-sm p-5 mt-3 max-w-3xl">
                          <Prose text={applicant.answers} />
                        </div>
                      </div>
                    )}

                    {applicant.essay && (
                      <>
                        <div className="mt-12 border-t border-ink/10 pt-8 space-y-10 max-w-3xl">
                          <div>
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Paso 1 · Valores Lumen" : "Step 1 · Lumen values"}
                            </div>
                            <p className="text-body text-ink/70 mt-2">
                              {lang === "es"
                                ? "Califica de 1 a 5, o N/A si el ensayo no da con qué juzgarlo."
                                : "Score 1 to 5, or N/A when the essay gives nothing to judge it on."}
                            </p>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
                              {VALUES.map((v) => (
                                <div key={v.key}>
                                  <div className="text-body font-semibold text-primary">
                                    {lang === "es" ? v.label.es : v.label.en}
                                  </div>
                                  <div className="mt-2.5 flex gap-2">
                                    {([1, 2, 3, 4, 5, "na"] as Score[]).map((n) => {
                                      const on = draft.values[v.key as ValueKey] === n
                                      return (
                                        <button
                                          key={String(n)}
                                          type="button"
                                          aria-pressed={on}
                                          aria-label={`${lang === "es" ? v.label.es : v.label.en}: ${n === "na" ? "N/A" : n}`}
                                          onClick={() => {
                                            setDraft((d) => ({
                                              ...d,
                                              values: { ...d.values, [v.key]: n },
                                            }))
                                            setSaved(false)
                                          }}
                                          className={`h-11 rounded-sm border text-body tabular-nums cursor-pointer transition-colors duration-200 ${
                                            n === "na" ? "px-3" : "w-11"
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
                                {draftValuesAvg(draft)?.toFixed(2) ?? "—"}
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
                              placeholder={
                                lang === "es" ? COMMENT_PLACEHOLDER.es : COMMENT_PLACEHOLDER.en
                              }
                              className="mt-4 w-full bg-white border border-ink/15 rounded-sm px-4 py-3 text-body text-ink focus:outline-none focus:border-accent"
                            />
                            <div className="mt-8">
                              <div className="text-meta uppercase tracking-widest text-muted mb-3">
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
                                    className={`text-body rounded-sm px-4 py-2.5 border cursor-pointer transition-colors duration-200 ${
                                      draft.recommendation === r.score
                                        ? "bg-primary text-white border-primary font-semibold"
                                        : "border-ink/15 text-ink/70 hover:border-primary/50"
                                    }`}
                                  >
                                    {lang === "es" ? r.label.es : r.label.en}
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
                              disabled={!member || !toRating(draft) || status === "saving"}
                              className="text-body font-semibold rounded-sm px-6 py-3 bg-primary text-white cursor-pointer transition-opacity duration-200 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {status === "saving"
                                ? lang === "es"
                                  ? "Guardando"
                                  : "Saving"
                                : lang === "es"
                                  ? "Guardar calificación"
                                  : "Save rating"}
                            </button>
                            <span className="text-body text-muted">
                              {lang === "es" ? "Promedio de valores" : "Values average"}:{" "}
                              <strong className="text-primary tabular-nums">
                                {(() => {
                                  const r = toRating(draft)
                                  return r ? valuesAverage(r).toFixed(2) : "—"
                                })()}
                              </strong>
                            </span>
                            {status !== "saving" && (!member || !toRating(draft)) && (
                              <span className="text-meta text-muted">
                                {!member
                                  ? lang === "es"
                                    ? "Elige tu nombre arriba para poder guardar."
                                    : "Pick your name above to be able to save."
                                  : lang === "es"
                                    ? "Califica los cuatro valores y elige una recomendación."
                                    : "Score all four values and pick a recommendation."}
                              </span>
                            )}
                            {saved && status === "ready" && (
                              <span role="status" className="text-body text-accent">
                                {lang === "es"
                                  ? "Guardado para toda la junta."
                                  : "Saved for the whole board."}
                              </span>
                            )}
                            {status === "error" && (
                              <span role="alert" className="text-body text-accent">
                                {lang === "es"
                                  ? "No se pudo guardar. Revisa la conexión e intenta de nuevo."
                                  : "Could not save. Check the connection and try again."}
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
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Where the candidates come from */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-muted mb-3">
              {lang === "es" ? "Origen" : "Origin"}
            </div>
            <h2 className="text-h3 font-semibold text-primary">
              {lang === "es"
                ? "De dónde vienen los candidatos."
                : "Where the candidates come from."}
            </h2>
          </Reveal>
          <div className="mt-8">
            <ApplicantsMap applicants={people} />
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
                ? "El promedio de los cuatro valores ordena la lista y define sí, maybe o no. La recomendación y los comentarios de cada miembro se leen aparte, más abajo. El corte es relativo a la mediana de la junta, así que aparece cuando cada candidato con ensayo tiene al menos una lectura."
                : "The average of the four values orders the list and sets yes, maybe or no. Each member's recommendation and comments read separately, below. The cut is relative to the board's median, so it appears once every submitted candidate has at least one read."}
            </p>
          </Reveal>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left border-collapse">
              <thead>
                <tr className="border-b border-ink/15">
                  {[
                    lang === "es" ? "Puesto" : "Rank",
                    lang === "es" ? "Candidato" : "Candidate",
                    lang === "es" ? "Promedio de valores" : "Values average",
                    lang === "es" ? "Recomendación" : "Recommendation",
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
                {ratedRows.map((row, i) => (
                  <tr key={row.candidate} className="border-b border-ink/5">
                    <td className="py-3 pr-4 text-body tabular-nums text-muted">{i + 1}</td>
                    <td className="py-3 pr-4 text-body font-semibold text-primary">
                      {nameOf(row.candidate)}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums font-bold text-primary">
                      {row.valuesAvg.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums text-ink/80">
                      {row.freeFormAvg.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-body tabular-nums text-muted">{row.raters}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-widest font-semibold rounded-full px-2.5 py-1 ${
                          verdictsLive ? VERDICT_STYLE[row.recommendation] : VERDICT_STYLE.unrated
                        }`}
                      >
                        {!verdictsLive
                          ? lang === "es"
                            ? "Pendiente"
                            : "Pending"
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
                {ratedRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-body text-muted">
                      {rows.length === 0
                        ? lang === "es"
                          ? "Todavía no hay ensayos que calificar."
                          : "No essays to rate yet."
                        : lang === "es"
                          ? "Aún no hay calificaciones guardadas."
                          : "No ratings saved yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {rows.length > ratedRows.length && (
            <p className="text-meta text-muted mt-4">
              {lang === "es" ? "Sin lecturas todavía: " : "No reads yet: "}
              {rows
                .filter((r) => !r.raters)
                .map((r) => nameOf(r.candidate))
                .join(", ")}
            </p>
          )}

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratedRows.map((row) => (
              <div key={row.candidate} className="bg-white border border-ink/10 rounded-sm p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-body font-semibold text-primary">
                    {nameOf(row.candidate)}
                  </div>
                  <div className="text-meta tabular-nums text-muted">
                    {row.raters ? row.score.toFixed(2) : "·"}
                  </div>
                </div>
                <p className="text-body text-ink/75 mt-2">{readOfScores(row, lang)}</p>
                {row.raters > 0 && (
                  <div className="mt-5 border-t border-ink/10 pt-5 space-y-5">
                    {Object.entries(store[row.candidate] ?? {}).map(([slug, r]) => (
                      <div key={slug}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <div className="text-body font-semibold text-primary">
                            {BOARD.find((m) => m.slug === slug)?.name ?? slug}
                          </div>
                          <div className="text-meta text-muted tabular-nums whitespace-nowrap">
                            {lang === "es" ? "Valores" : "Values"}{" "}
                            <strong className="text-ink/80">{valuesAverage(r).toFixed(1)}</strong>{" "}
                            · {lang === "es" ? "Recomendación" : "Rec"}{" "}
                            <strong className="text-ink/80">{r.recommendation}/5</strong>
                          </div>
                        </div>
                        {r.comments && <p className="text-body text-ink/75 mt-2">{r.comments}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-meta text-muted mt-8 max-w-3xl">
            {lang === "es"
              ? "El puesto y la lectura se calculan con las calificaciones que la junta ha ingresado."
              : "Rank and read are computed from the ratings the board has entered."}
          </p>
        </div>
      </section>
    </>
  )
}

export default function BoardPortal() {
  const [attempt, setAttempt] = useState(0)
  return (
    <PasscodeGate
      key={attempt}
      role="board"
      eyebrow={{ en: "Board login", es: "Acceso junta" }}
      heading={{
        en: "Enter the board access code.",
        es: "Ingresa el código de acceso de la junta.",
      }}
    >
      <Portal onSessionLost={() => setAttempt((n) => n + 1)} />
    </PasscodeGate>
  )
}
