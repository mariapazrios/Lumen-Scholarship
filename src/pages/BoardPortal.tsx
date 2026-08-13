import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  DISAGREEMENT_THRESHOLD,
  RECOMMENDATIONS,
  SessionExpired,
  VALUES,
  axisSpreads,
  consolidate,
  deleteRating,
  fetchRatings,
  loadMember,
  saveMember,
  saveRating,
  scoreValue,
  valuesAverage,
  type Consolidated,
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

/**
 * Where the board's individual scores land for one candidate, broken out by
 * value and recommendation rather than blended into one sentence. A 4.0
 * average reads as consensus; the same average can hide a 2 sitting next to
 * a 5 on one specific value, which is exactly what a board needs to see
 * before a decision, not a paragraph that already smoothed it away.
 */
function AxisBreakdown({
  candidate,
  store,
  lang,
}: {
  candidate: string
  store: RatingStore
  lang: "en" | "es"
}) {
  const axes = axisSpreads(candidate, store)
  const disputed = [...axes]
    .filter((a) => a.spread >= DISAGREEMENT_THRESHOLD)
    .sort((a, b) => b.spread - a.spread)
  const aligned = axes.filter((a) => a.spread < DISAGREEMENT_THRESHOLD)
  const firstName = (slug: string) => BOARD.find((m) => m.slug === slug)?.name.split(" ")[0] ?? slug

  return (
    <div className="mt-3 space-y-4">
      {disputed.length > 0 && (
        <div>
          <div className="text-meta uppercase tracking-widest text-accent mb-2">
            {lang === "es" ? "Donde la junta no coincide" : "Where the board disagrees"}
          </div>
          <div className="space-y-1.5">
            {disputed.map((a) => (
              <div
                key={a.key}
                className="flex flex-wrap items-baseline justify-between gap-x-4 border-l-2 border-accent pl-3"
              >
                <span className="text-body font-semibold text-primary">
                  {lang === "es" ? a.label.es : a.label.en}
                </span>
                <span className="text-body tabular-nums text-ink/80">
                  {a.byMember.map((m) => `${firstName(m.member)} ${m.score}`).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {aligned.length > 0 && (
        <div>
          <div className="text-meta uppercase tracking-widest text-muted mb-2">
            {lang === "es" ? "Donde la junta coincide" : "Where the board agrees"}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {aligned.map((a) => {
              const nums = a.byMember.map((m) => m.score)
              const lo = Math.min(...nums)
              const hi = Math.max(...nums)
              return (
                <span key={a.key} className="text-body text-ink/75">
                  <span className="font-semibold text-primary">
                    {lang === "es" ? a.label.es : a.label.en}
                  </span>{" "}
                  <span className="tabular-nums text-muted">{lo === hi ? lo : `${lo}–${hi}`}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Portal({ onSessionLost }: { onSessionLost: () => void }) {
  const { lang } = useLang()
  const [member, setMember] = useState(loadMember)
  const [people, setPeople] = useState<Applicant[]>([])
  const [store, setStore] = useState<RatingStore>({})
  const [active, setActive] = useState<string>("")
  // Scroll target for the detail pane: picking a candidate from the list
  // brings their name and scores back into view instead of leaving the
  // reader scrolled to wherever in the list they clicked from.
  const detailRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saved, setSaved] = useState(false)
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">("loading")
  const [filters, setFilters] = useState({ department: "", program: "", gender: "" })
  // Ranked by ICFES rather than alphabetically: a shortlist read A-Z puts the
  // strongest candidate wherever their surname happens to fall.
  const [sort, setSort] = useState<"name" | "saber-desc" | "saber-asc">("saber-desc")
  // Arms the second click on "Delete my rating". Reset whenever the target
  // changes, so a confirm armed on one candidate cannot fire on the next.
  const [confirmDelete, setConfirmDelete] = useState(false)
  // Narrows the consolidated section to one candidate. Null shows everyone.
  const [focus, setFocus] = useState<string | null>(null)
  // Which of the three views is on screen. Per-candidate first: that is
  // the page's primary task (reading an essay and scoring it), and the
  // other two are what a member checks before or after that, not instead.
  const [tab, setTab] = useState<"per-candidate" | "consolidated" | "discuss">(
    "per-candidate",
  )

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
        const first = roster.find((a) => a.essay)
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
      departments: uniq(submitted.map((a) => a.department)),
      programs: uniq(submitted.map((a) => a.program)),
      genders: uniq(submitted.map((a) => a.gender)),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const visible = ordered(submitted.filter(matches(filters)))

  /**
   * Changing a filter can hide the candidate being read, which left the detail
   * pane showing someone the list no longer contains. Reselect in the handler
   * so pane and list always agree.
   */
  const applyFilter = (key: keyof typeof filters, value: string) => {
    const next = { ...filters, [key]: value }
    setFilters(next)
    const nextVisible = submitted.filter(matches(next))
    if (nextVisible.some((a) => a.slug === active)) return
    const first = nextVisible[0]
    setActive(first?.slug ?? "")
    setDraft(first ? (store[first.slug]?.[member] ?? emptyDraft()) : emptyDraft())
    setSaved(false)
    setConfirmDelete(false)
  }

  const pick = (slug: string) => {
    setActive(slug)
    setDraft(store[slug]?.[member] ?? emptyDraft())
    setSaved(false)
    setConfirmDelete(false)
    // The list can run long enough to scroll well past the detail pane's own
    // top, so picking a name from partway down it left the name and scores
    // it just switched to sitting off-screen above the fold.
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const chooseMember = (slug: string) => {
    setMember(slug)
    saveMember(slug)
    setDraft(store[active]?.[slug] ?? emptyDraft())
    setSaved(false)
    setConfirmDelete(false)
  }

  /** Clears this member's own saved rating for the candidate on screen. */
  const removeMyRating = async () => {
    if (!member || !store[active]?.[member] || status === "saving") return
    setStatus("saving")
    try {
      await deleteRating(active, member)
      await refresh()
      setDraft(emptyDraft())
      setSaved(false)
      setConfirmDelete(false)
    } catch (e) {
      if (e instanceof SessionExpired) onSessionLost()
      else setStatus("error")
    }
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

  const perCandidateContent = (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
          {status === "loading" && (
            <p role="status" className="text-body text-muted">
              {lang === "es" ? "Cargando candidatos." : "Loading candidates."}
            </p>
          )}

          {status !== "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-8 lg:gap-12">
              {/* On a phone the 17-row list means scrolling past everyone to
                  reach the essay; a dropdown jumps straight to a candidate. */}
              {/* The sort and the filters live in the sidebar below, which is
                  hidden under lg. Without a copy of the sort here a phone had
                  no way to reorder the field at all: it silently inherited the
                  default and there was no control anywhere on the page. */}
              <div className="lg:hidden space-y-4">
                <label className="block">
                  <span className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Ordenar" : "Sort"}
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="mt-2 w-full bg-white border border-ink/15 rounded-sm px-3 py-3 text-body text-ink cursor-pointer focus:outline-none focus:border-accent"
                  >
                    <option value="saber-desc">
                      {lang === "es" ? "ICFES, mayor a menor" : "ICFES, highest first"}
                    </option>
                    <option value="saber-asc">
                      {lang === "es" ? "ICFES, menor a mayor" : "ICFES, lowest first"}
                    </option>
                    <option value="name">
                      {lang === "es" ? "Nombre (A-Z)" : "Name (A-Z)"}
                    </option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Candidato" : "Candidate"} ({visible.length})
                  </span>
                  <select
                    value={active}
                    onChange={(e) => e.target.value && pick(e.target.value)}
                    className="mt-2 w-full bg-white border border-ink/15 rounded-sm px-3 py-3 text-body text-ink cursor-pointer focus:outline-none focus:border-accent"
                  >
                    {!active && <option value="">—</option>}
                    {/* The score rides along so a ranked list reads as ranked;
                        a bare name list gives no clue why it is in this order. */}
                    {visible.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.saber11 != null ? `${a.name} · ICFES ${a.saber11}` : a.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="hidden lg:block">
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "Candidatos" : "Candidates"} ({visible.length})
                </div>

                <div className="space-y-2 mb-5">
                  {/* Sort sits above the filters: it changes the reading order of
                      the whole field, where the filters change who is in it. */}
                  {/* The label was sr-only, which left a control identical to
                      the filter dropdowns under it, reading "Orden: nombre",
                      and it went unread as one more filter. Naming it out loud
                      is what makes it findable. */}
                  <label className="block">
                    <span className="text-meta uppercase tracking-widest text-muted">
                      {lang === "es" ? "Ordenar" : "Sort"}
                    </span>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as typeof sort)}
                      className="mt-1.5 w-full bg-white border border-ink/15 rounded-sm px-3 py-2 text-meta text-ink cursor-pointer focus:outline-none focus:border-accent"
                    >
                      <option value="saber-desc">
                        {lang === "es" ? "ICFES, mayor a menor" : "ICFES, highest first"}
                      </option>
                      <option value="saber-asc">
                        {lang === "es" ? "ICFES, menor a mayor" : "ICFES, lowest first"}
                      </option>
                      <option value="name">
                        {lang === "es" ? "Nombre (A-Z)" : "Name (A-Z)"}
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
                          }`}
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
                              // Ages come off the roster fractional (18.12...),
                              // so floor rather than round: nobody is 19 the
                              // day before their nineteenth birthday.
                              const age =
                                a.age != null
                                  ? lang === "es"
                                    ? `${Math.floor(a.age)} años`
                                    : `age ${Math.floor(a.age)}`
                                  : null
                              const parts = [a.program, a.city, age, saber].filter(Boolean)
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

              {/* scroll-mt clears the sticky header (67px): without it,
                  scrolling this into view puts the candidate's name directly
                  behind the nav bar, which is the thing the scroll exists to
                  show. */}
              <div ref={detailRef} className="scroll-mt-24">
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
                        {[
                          applicant.program,
                          applicant.city,
                          applicant.age != null
                            ? lang === "es"
                              ? `${Math.floor(applicant.age)} años`
                              : `age ${Math.floor(applicant.age)}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
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
                            {/* Percentile only exists where the candidate's own report
                                does: read off that PDF, not derived from the score. */}
                            {applicant.saber11_pct != null && (
                              <div className="text-body text-muted tabular-nums">
                                {lang === "es"
                                  ? `percentil ${applicant.saber11_pct}`
                                  : `${applicant.saber11_pct}th percentile`}
                              </div>
                            )}
                            {/* The number above came from Uniandes's spreadsheet, not
                                the candidate. This is the source document, for whoever
                                wants to check it rather than take the number on faith. */}
                            {applicant.icfes_report && (
                              <a
                                href={`/api/applicant-doc?kind=applicant-icfes&subject=${applicant.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-meta uppercase tracking-widest text-accent hover:text-ink transition-colors"
                              >
                                {lang === "es"
                                  ? "Verificado, ver reporte ICFES"
                                  : "Verified, view ICFES report"}
                              </a>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-4 mt-5">
                            {[
                              {
                                k: lang === "es" ? "Lectura crítica" : "Critical reading",
                                v: applicant.plc,
                                pct: applicant.plc_pct,
                              },
                              {
                                k: lang === "es" ? "Matemáticas" : "Mathematics",
                                v: applicant.pma,
                                pct: applicant.pma_pct,
                              },
                              {
                                k: lang === "es" ? "Sociales" : "Social studies",
                                v: applicant.psc,
                                pct: applicant.psc_pct,
                              },
                              {
                                k: lang === "es" ? "Ciencias" : "Sciences",
                                v: applicant.pcn,
                                pct: applicant.pcn_pct,
                              },
                              { k: lang === "es" ? "Inglés" : "English", v: applicant.pin, pct: applicant.pin_pct },
                            ].map((cell) => (
                              <div key={cell.k} className="flex flex-col">
                                <div className="text-meta uppercase tracking-widest text-muted min-h-[2.6em]">
                                  {cell.k}
                                </div>
                                <div className="text-body font-semibold text-ink/80 tabular-nums mt-auto">
                                  {cell.v ?? "—"}
                                  <span className="text-meta font-normal text-muted">/100</span>
                                  {cell.pct != null && (
                                    <span className="text-meta font-normal text-muted">
                                      {" "}
                                      · {lang === "es" ? `p${cell.pct}` : `${cell.pct}th pct`}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* School results, where the candidate has sent their
                          report. Colombian secondary marks run 0 to 5 on each
                          school's own scale, so the rank travels with the
                          average: 4.15 says little alone, first of thirty-six
                          says a great deal. */}
                      {(applicant.school_grades?.length || applicant.transcript) && (
                        <div className="mt-5 pt-5 border-t border-ink/10">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
                            <div className="text-meta uppercase tracking-widest text-muted">
                              {lang === "es" ? "Notas del colegio" : "School results"}
                            </div>
                            {applicant.transcript && (
                              <a
                                href={`/api/applicant-doc?kind=applicant-transcript&subject=${applicant.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-meta uppercase tracking-widest text-accent hover:text-ink transition-colors"
                              >
                                {lang === "es" ? "Ver boletín" : "View transcript"}
                              </a>
                            )}
                          </div>
                          {applicant.school_grades?.length ? (
                            <div className="flex flex-wrap gap-x-10 gap-y-4">
                              {applicant.school_grades.map((g) => (
                                <div key={g.year}>
                                  <div className="text-meta uppercase tracking-widest text-muted">
                                    {(lang === "es" ? g.grade.es : g.grade.en) + " · " + g.year}
                                  </div>
                                  <div className="text-body font-semibold text-ink/80 tabular-nums mt-1">
                                    {g.average.toFixed(2)}
                                    <span className="text-meta font-normal text-muted">
                                      /{(g.scale ?? 5).toFixed(2)}
                                    </span>
                                    {g.rank != null && (
                                      <span className="text-meta font-normal text-muted">
                                        {" "}
                                        ·{" "}
                                        {g.of != null
                                          ? lang === "es"
                                            ? `puesto ${g.rank} de ${g.of}`
                                            : `${g.rank} of ${g.of}`
                                          : lang === "es"
                                            ? `puesto ${g.rank}`
                                            : `rank ${g.rank}`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-body text-ink/70">
                              {lang === "es"
                                ? "Boletín en archivo, sin resumen capturado."
                                : "Transcript on file, no summary captured."}
                            </p>
                          )}
                        </div>
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

                    {/* Submitted in Spanish, shown verbatim. No heading: the
                        essay is the substance of this page, and labelling it
                        told the reader what they were plainly already looking
                        at. */}
                    {applicant.essay ? (
                      <div className="mt-8">
                        <Prose text={applicant.essay} />
                      </div>
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
                        <div className="bg-surface rounded-sm p-4 sm:p-5 mt-3 max-w-3xl">
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

                            {/* Only once this member has something saved to remove.
                                Two clicks, because it is not recoverable and the
                                button sits next to Save. */}
                            {member && store[active]?.[member] && (
                              <button
                                type="button"
                                onClick={() =>
                                  confirmDelete ? removeMyRating() : setConfirmDelete(true)
                                }
                                disabled={status === "saving"}
                                className={`ml-auto text-meta uppercase tracking-widest rounded-sm px-4 py-2.5 border cursor-pointer transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                                  confirmDelete
                                    ? "border-accent text-accent font-semibold"
                                    : "border-ink/15 text-muted hover:border-accent/50 hover:text-accent"
                                }`}
                              >
                                {confirmDelete
                                  ? lang === "es"
                                    ? "¿Seguro? Eliminar"
                                    : "Sure? Delete"
                                  : lang === "es"
                                    ? "Eliminar mi calificación"
                                    : "Delete my rating"}
                              </button>
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
  )

  const consolidatedContent = (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
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
                ? "El promedio de los cuatro valores ordena la lista y define sí, maybe o no. Las calificaciones de cada miembro, su recomendación y sus comentarios están en la pestaña Para discutir. El corte es relativo a la mediana de la junta, así que aparece cuando cada candidato con ensayo tiene al menos una lectura."
                : "The average of the four values orders the list and sets yes, maybe or no. Each member's scores, recommendation and comments are one tab over, under To discuss. The cut is relative to the board's median, so it appears once every submitted candidate has at least one read."}
            </p>
          </Reveal>

          {/* Six columns cannot fit a phone, so the table scrolls sideways. Say
              so: cut-off content with no cue reads as a broken layout, and the
              same numbers appear again as cards below. */}
          <p className="md:hidden text-meta uppercase tracking-widest text-muted mt-8">
            {lang === "es" ? "Desliza para ver la tabla →" : "Swipe to see the table →"}
          </p>
          <div className="mt-4 md:mt-10 overflow-x-auto">
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
                  <tr
                    key={row.candidate}
                    className={`border-b border-ink/5 ${
                      focus === row.candidate ? "bg-accent/5" : ""
                    }`}
                  >
                    <td className="py-3 pr-4 text-body tabular-nums text-muted">{i + 1}</td>
                    <td className="py-3 pr-4 text-body font-semibold text-primary">
                      {/* Clicking a name narrows the To discuss tab to that one
                          candidate and jumps there, since that is where the
                          narrowed detail actually lives now. Clicking the same
                          name again clears the focus without leaving the tab. */}
                      <button
                        type="button"
                        onClick={() => {
                          const next = focus === row.candidate ? null : row.candidate
                          setFocus(next)
                          if (next) setTab("discuss")
                        }}
                        className={`text-left cursor-pointer underline-offset-4 hover:underline decoration-accent/50 ${
                          focus === row.candidate ? "underline decoration-accent" : ""
                        }`}
                      >
                        {nameOf(row.candidate)}
                      </button>
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
          <p className="text-meta text-muted mt-8 max-w-3xl">
            {lang === "es"
              ? "El puesto y la lectura se calculan con las calificaciones que la junta ha ingresado."
              : "Rank and read are computed from the ratings the board has entered."}
          </p>

          {/* Who still owes what. Candidates down the side, members across the
              top: the row reads as "who has this candidate left to score" and
              the column as "what this member has left", which is the same
              question asked from either end. */}
          <div className="mt-16">
            <div className="text-meta uppercase tracking-widest text-muted mb-3">
              {lang === "es" ? "Cobertura" : "Coverage"}
            </div>
            <h3 className="text-h3 font-semibold text-primary">
              {lang === "es" ? "Quién falta por calificar a quién." : "Who still has whom to score."}
            </h3>

            <p className="md:hidden text-meta uppercase tracking-widest text-muted mt-6">
              {lang === "es" ? "Desliza para ver la tabla →" : "Swipe to see the table →"}
            </p>
            <div className="mt-4 md:mt-8 overflow-x-auto">
              <table className="w-full min-w-[44rem] text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink/15">
                    <th className="text-meta uppercase tracking-widest text-muted font-semibold py-3 pr-4">
                      {lang === "es" ? "Candidato" : "Candidate"}
                    </th>
                    {BOARD.map((m) => (
                      <th
                        key={m.slug}
                        className="text-meta uppercase tracking-widest text-muted font-semibold py-3 px-2 text-center"
                      >
                        {/* First name only: six full names will not fit a row. */}
                        {m.name.split(" ")[0]}
                      </th>
                    ))}
                    <th className="text-meta uppercase tracking-widest text-muted font-semibold py-3 pl-4 text-right">
                      {lang === "es" ? "Faltan" : "Missing"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const missing = BOARD.filter((m) => !store[row.candidate]?.[m.slug])
                    return (
                      <tr key={row.candidate} className="border-b border-ink/5">
                        <td className="py-2.5 pr-4 text-body text-primary font-semibold whitespace-nowrap">
                          {nameOf(row.candidate)}
                        </td>
                        {BOARD.map((m) => {
                          const done = Boolean(store[row.candidate]?.[m.slug])
                          return (
                            <td key={m.slug} className="py-2.5 px-2 text-center">
                              <span
                                title={`${m.name} · ${nameOf(row.candidate)}`}
                                className={
                                  done
                                    ? "text-accent font-bold"
                                    : "text-ink/20"
                                }
                              >
                                {done ? "✓" : "·"}
                              </span>
                            </td>
                          )
                        })}
                        <td
                          className={`py-2.5 pl-4 text-meta tabular-nums text-right ${
                            missing.length === 0 ? "text-accent font-semibold" : "text-muted"
                          }`}
                        >
                          {missing.length === 0
                            ? lang === "es"
                              ? "completo"
                              : "complete"
                            : missing.length}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-ink/15">
                    <td className="py-3 pr-4 text-meta uppercase tracking-widest text-muted font-semibold">
                      {lang === "es" ? "Calificados" : "Scored"}
                    </td>
                    {BOARD.map((m) => {
                      const done = rows.filter((r) => store[r.candidate]?.[m.slug]).length
                      return (
                        <td
                          key={m.slug}
                          className={`py-3 px-2 text-center text-meta tabular-nums font-semibold ${
                            done === rows.length && rows.length > 0
                              ? "text-accent"
                              : done === 0
                                ? "text-ink/30"
                                : "text-primary"
                          }`}
                        >
                          {done}/{rows.length}
                        </td>
                      )
                    })}
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
    </div>
  )

  const discussContent = (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
      <Reveal>
        <div className="text-meta uppercase tracking-widest text-muted mb-3">
          {lang === "es" ? "Para discutir" : "To discuss"}
        </div>
        <h2 className="text-h3 font-semibold text-primary">
          {lang === "es"
            ? "Dónde se separan los votos de la junta."
            : "Where the board's votes pull apart."}
        </h2>
        <p className="text-body text-ink/70 mt-3">
          {lang === "es"
            ? "Ordenado según cuánto discrepa la junta, lo más disputado primero. Un valor se marca como en disputa cuando las calificaciones difieren en 2 puntos o más; lo demás es donde la junta ya coincide."
            : "Sorted by how much the board disagrees, most contested first. A value counts as disputed when scores span 2 points or more; everything else is where the board already agrees."}
        </p>
      </Reveal>

          {focus && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="text-body text-ink/75">
                {lang === "es" ? "Mostrando solo " : "Showing only "}
                <strong className="text-primary">{nameOf(focus)}</strong>
              </span>
              <button
                type="button"
                onClick={() => setFocus(null)}
                className="text-meta uppercase tracking-widest text-accent cursor-pointer"
              >
                {lang === "es" ? "Ver todos" : "Show all"}
              </button>
            </div>
          )}

          {/* One column when focused: with a single card there is nothing to
              compare against, and the comments get the full width.
              Sorted by how much the board disagrees, most disputed first:
              this tab exists to surface exactly that, not to repeat the
              consolidated table's rank order. */}
          <div className={`mt-6 grid grid-cols-1 gap-4 ${focus ? "" : "md:grid-cols-2"}`}>
            {[...ratedRows]
              .sort((a, b) => {
                const maxSpread = (r: Consolidated) =>
                  Math.max(...axisSpreads(r.candidate, store).map((x) => x.spread), 0)
                return maxSpread(b) - maxSpread(a)
              })
              .filter((row) => !focus || row.candidate === focus)
              .map((row) => (
                <div
                  key={row.candidate}
                  className="bg-white border border-ink/10 rounded-sm overflow-hidden"
                >
                  {/* The candidate. A cream band, so the person being judged is
                      visibly a different kind of thing from the judgements. */}
                  <div className="bg-surface px-6 py-5 border-b border-ink/10">
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-h3 font-semibold text-primary">
                        {nameOf(row.candidate)}
                      </div>
                      <div className="text-body tabular-nums font-bold text-primary">
                        {row.raters ? row.score.toFixed(2) : "·"}
                      </div>
                    </div>
                    <p className="text-meta uppercase tracking-widest text-muted mt-2">
                      {row.raters}{" "}
                      {lang === "es"
                        ? row.raters === 1
                          ? "lectura"
                          : "lecturas"
                        : row.raters === 1
                          ? "read"
                          : "reads"}
                    </p>
                    {row.raters < 2 ? (
                      <p className="text-body text-ink/70 mt-2">
                        {lang === "es"
                          ? "Solo una lectura por ahora, nada que comparar todavía."
                          : "Only one read so far, nothing to compare yet."}
                      </p>
                    ) : (
                      <AxisBreakdown candidate={row.candidate} store={store} lang={lang} />
                    )}
                  </div>

                  {/* The board. Labelled, and each member's read carries its own
                      rule so several of them do not run together as one wall. */}
                  {row.raters > 0 && (
                    <div className="px-6 py-5">
                      <div className="text-meta uppercase tracking-widest text-muted mb-4">
                        {lang === "es" ? `La junta (${row.raters})` : `The board (${row.raters})`}
                      </div>
                      <div className="space-y-4">
                        {Object.entries(store[row.candidate] ?? {}).map(([slug, r]) => (
                          <div key={slug} className="border-l-2 border-accent/40 pl-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <div className="text-body font-semibold text-primary">
                                {BOARD.find((m) => m.slug === slug)?.name ?? slug}
                              </div>
                              <div className="text-meta text-muted tabular-nums whitespace-nowrap">
                                {lang === "es" ? "Valores" : "Values"}{" "}
                                <strong className="text-ink/80">
                                  {valuesAverage(r).toFixed(1)}
                                </strong>{" "}
                                · {lang === "es" ? "Recomendación" : "Rec"}{" "}
                                <strong className="text-ink/80">{r.recommendation}/5</strong>
                              </div>
                            </div>
                            {r.comments && (
                              <p className="text-body text-ink/75 mt-1.5">{r.comments}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
    </div>
  )

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
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

      {/* Where the candidates come from */}
      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12 md:py-16">
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
            <ApplicantsMap applicants={submitted} />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-10">
          {/* Per-candidate first: opening the portal drops a member straight
              into the scoring task. The other two are what you check before
              or after that, not a replacement for it. */}
          <div className="flex gap-8 border-b border-ink/15">
            {(
              [
                { key: "per-candidate", label: { en: "Per candidate", es: "Por candidato" } },
                { key: "consolidated", label: { en: "Consolidated", es: "Consolidado" } },
                { key: "discuss", label: { en: "To discuss", es: "Para discutir" } },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`pb-3 text-meta uppercase tracking-widest transition-colors duration-200 border-b-2 -mb-px cursor-pointer ${
                  tab === t.key
                    ? "border-accent text-primary font-semibold"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {lang === "es" ? t.label.es : t.label.en}
              </button>
            ))}
          </div>
        </div>

        {tab === "per-candidate" && perCandidateContent}
        {tab === "consolidated" && consolidatedContent}
        {tab === "discuss" && discussContent}
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
