import { useLang } from "../lib/i18n"
import type { ScholarTermRecord } from "../lib/grades"

const ACCENT = "var(--color-cobalt)"
const CONTEXT = "var(--color-muted)"

/**
 * Term-by-term record for one scholar, set as a dumbbell per term rather than
 * a bar with a reference line over it.
 *
 * The bars answered "what did they score", which is the less interesting
 * question: a 4.1 in a programme averaging 3.6 is a different result from a
 * 4.1 in one averaging 4.3, and the bar could not say which. The dumbbell
 * makes the gap itself the subject, in the same dot-and-line language the
 * landing page uses for Lumen against the Andes average.
 *
 * Hover state lives with the caller, because the extracurriculars listed
 * below this chart highlight the term they happened in and both need to agree
 * on which term that is.
 */
export default function GpaTrend({
  record,
  cohort,
  active,
  onActive,
}: {
  record: ScholarTermRecord
  /**
   * Uniandes's average for this scholar's programme, indexed by semester, so
   * `[0]` is first semester.
   */
  cohort?: number[]
  /** Term code currently highlighted, shared with the extracurricular list. */
  active?: string | null
  onActive?: (term: string | null) => void
}) {
  const { lang } = useLang()
  const terms = record.terms
  if (terms.length === 0) return null

  /**
   * The cohort figure for each slot, counted in enrolled semesters rather than
   * term slots: Uniandes indexes its averages by "semestre 1, 2, 3", so a
   * scholar who sat a term out is in their third semester, not their fourth.
   */
  let nextSemester = 0
  const cohortAt = terms.map((t) =>
    t.average == null ? null : (cohort?.[nextSemester++] ?? null),
  )

  // Domain starts under the lowest point on the page rather than at a fixed
  // 3.5, so a term below that floor is drawn rather than pinned to the edge.
  const values = [
    ...terms.map((t) => t.average),
    ...cohortAt,
  ].filter((v): v is number => v != null)
  const lo = values.length
    ? Math.min(4.0, Math.max(2.0, Math.floor((Math.min(...values) - 0.2) * 2) / 2))
    : 3.5
  const hi = 5.0
  const pos = (v: number) => ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * 100

  const ticks: number[] = []
  for (let v = lo; v <= hi + 1e-9; v += 0.5) ticks.push(Number(v.toFixed(1)))

  const hasCohort = cohortAt.some((v) => v != null)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-4">
        <span className="inline-flex items-center gap-2 text-meta text-muted">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ background: ACCENT }}
          />
          {lang === "es" ? "Este estudiante" : "This scholar"}
        </span>
        {hasCohort && (
          <span className="inline-flex items-center gap-2 text-meta text-muted">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: CONTEXT }}
            />
            {lang === "es"
              ? "Su carrera, mismo semestre"
              : "Their programme, same term"}
          </span>
        )}
      </div>

      {/* Axis, hidden on phones where the track drops onto its own row */}
      <div className="hidden sm:grid grid-cols-[7rem_1fr_4rem] gap-x-4 mb-1">
        <div />
        <div className="relative h-4">
          {ticks.map((tk) => (
            <span
              key={tk}
              className="absolute top-0 text-meta text-muted tabular-nums -translate-x-1/2"
              style={{ left: `${pos(tk)}%` }}
            >
              {tk.toFixed(1)}
            </span>
          ))}
        </div>
        <div />
      </div>

      <div className="space-y-0.5">
        {terms.map((t) => {
          const i = terms.indexOf(t)
          const peer = cohortAt[i]
          const isActive = active === t.term
          const delta = t.average != null && peer != null ? t.average - peer : null

          return (
            <div
              key={t.term}
              onMouseEnter={() => onActive?.(t.term)}
              onMouseLeave={() => onActive?.(null)}
              className={`grid grid-cols-[1fr_4rem] sm:grid-cols-[7rem_1fr_4rem] items-center gap-x-4 gap-y-1 rounded-sm px-2 py-2 transition-colors duration-200 ${
                isActive ? "bg-accent/5" : ""
              }`}
            >
              <div className="order-1 sm:order-none">
                <div
                  className={`text-body tabular-nums ${
                    isActive ? "text-primary font-semibold" : "text-ink/80"
                  }`}
                >
                  {t.term}
                </div>
                {t.courses != null && (
                  <div className="text-meta text-muted tabular-nums">
                    {t.courses} {lang === "es" ? "cursos" : "courses"}
                  </div>
                )}
              </div>

              <div className="order-3 col-span-2 sm:order-none sm:col-span-1 relative h-7">
                {/* Gridlines sit inside the track so they line up with the dots */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
                  {ticks.map((tk) => (
                    <span
                      key={tk}
                      className="absolute top-0 bottom-0 w-px bg-ink/10"
                      style={{ left: `${pos(tk)}%` }}
                    />
                  ))}
                </div>

                {t.average == null ? (
                  <span className="absolute inset-y-0 left-0 flex items-center text-meta italic text-muted">
                    {lang === "es" ? "Sin matrícula" : "Not enrolled"}
                  </span>
                ) : (
                  <>
                    {peer != null && Math.abs(t.average - peer) > 0.001 && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                        style={{
                          left: `${pos(Math.min(peer, t.average))}%`,
                          width: `${Math.abs(pos(t.average) - pos(peer))}%`,
                          background: CONTEXT,
                          opacity: 0.35,
                        }}
                      />
                    )}
                    {peer != null && (
                      <span
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                        style={{
                          left: `${pos(peer)}%`,
                          width: 10,
                          height: 10,
                          background: CONTEXT,
                          boxShadow: "0 0 0 2px var(--color-surface)",
                        }}
                        title={`${lang === "es" ? "Su carrera" : "Their programme"} ${peer.toFixed(2)}`}
                      />
                    )}
                    <span
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-transform duration-200"
                      style={{
                        left: `${pos(t.average)}%`,
                        width: isActive ? 15 : 12,
                        height: isActive ? 15 : 12,
                        background: ACCENT,
                        boxShadow: "0 0 0 2px var(--color-surface)",
                      }}
                      title={`${lang === "es" ? "Este estudiante" : "This scholar"} ${t.average.toFixed(2)}`}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 text-body font-semibold text-primary tabular-nums"
                      style={{
                        left: `calc(${pos(t.average)}% + 14px)`,
                      }}
                    >
                      {t.average.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <div className="order-2 sm:order-none text-right text-body tabular-nums">
                {delta != null && (
                  <span className={delta >= 0 ? "text-accent" : "text-muted"}>
                    {delta >= 0 ? "+" : ""}
                    {delta.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!record.complete && (
        <p className="text-meta text-accent font-semibold mt-4">
          {lang === "es"
            ? "Cobertura parcial: faltan semestres por recuperar."
            : "Partial coverage: some terms are still to be recovered."}
        </p>
      )}
    </div>
  )
}
