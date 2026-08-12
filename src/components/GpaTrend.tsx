import { useState } from "react"
import { useLang } from "../lib/i18n"
import { useIsNarrow } from "../lib/viewport"
import type { ScholarTermRecord } from "../lib/grades"

const ACCENT = "var(--color-cobalt)"

/**
 * Term-by-term record for one scholar, with achievements called out against
 * the terms they happened in. Zero-based columns on a fixed 0-to-5 axis, the
 * same shape as the site's other bar charts: each term reads as a level in a
 * passing band rather than a slope, and the shared scale still lets sponsors
 * compare scholars.
 */
export default function GpaTrend({
  record,
  achievements,
  cohort,
}: {
  record: ScholarTermRecord
  achievements: string[]
  /**
   * Uniandes's average for this scholar's programme, indexed by semester, so
   * `[0]` is first semester. Drawn as a reference line across the bars: a 3.88
   * reads differently in Ingeniería Industrial than in Física, and the bar
   * alone cannot say which.
   */
  cohort?: number[]
}) {
  const { lang } = useLang()
  const narrow = useIsNarrow()
  const [active, setActive] = useState<number | null>(null)
  const terms = record.terms
  if (terms.length === 0) return null

  /**
   * Two geometries, not one scaled. On a phone this chart sits inside about
   * 280px of column, so a 620 unit viewBox would render every label at roughly
   * a third of its size. The narrow variant is drawn near 1:1 instead, which
   * costs some width and buys legible numbers.
   */
  const W = narrow ? 280 : 620
  const H = 200
  const PAD = narrow ? { l: 30, r: 6, t: 20, b: 30 } : { l: 34, r: 16, t: 16, b: 34 }
  const FS = narrow
    ? { axis: 11, value: 13, term: 11, none: 11 }
    : { axis: 10, value: 11, term: 10, none: 10 }
  // Label offsets travel with the geometry so the wide chart is unchanged: at
  // narrow widths the axis gutter is smaller and a bigger label needs to sit
  // closer in, or "5.0" clips off the left edge.
  const OFF = narrow ? { axis: 7, value: 6, term: 10 } : { axis: 8, value: 8, term: 12 }
  const MAX = 5.0
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  // one slot per term, bar centered in its slot
  const slotW = innerW / terms.length
  const barW = Math.min(56, slotW * 0.5)
  const x = (i: number) => PAD.l + slotW * i + slotW / 2
  const y = (v: number) => PAD.t + innerH - (v / MAX) * innerH

  const ticks = [1, 2, 3, 4, 5]

  // one achievement pinned per enrolled term, in order, so the callouts spread
  // across the run and never land on a semester the scholar sat out
  let nextAchievement = 0
  const pinned = terms.map((t) =>
    t.average == null ? null : (achievements[nextAchievement++] ?? null),
  )

  /**
   * The cohort figure for each slot, counted in enrolled semesters rather than
   * term slots: Uniandes indexes its averages by "semestre 1, 2, 3", so a
   * scholar who sat a term out is in their third semester, not their fourth.
   * A term with no bar gets no reference point either.
   */
  let nextSemester = 0
  const cohortAt = terms.map((t) => {
    if (t.average == null) return null
    return cohort?.[nextSemester++] ?? null
  })
  const cohortPoints = cohortAt
    .map((v, i) => (v == null ? null : { x: x(i), y: y(v), v, i }))
    .filter((p): p is { x: number; y: number; v: number; i: number } => p !== null)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={lang === "es" ? "Promedio por semestre" : "Average by term"}>
        {ticks.map((tk) => (
          <g key={tk}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(tk)} y2={y(tk)}
              stroke="var(--color-ink)" strokeOpacity={0.08} />
            <text x={PAD.l - OFF.axis} y={y(tk) + 4} textAnchor="end"
              fontSize={FS.axis} fill="var(--color-muted)" className="tabular-nums">
              {tk.toFixed(1)}
            </text>
          </g>
        ))}
        {/* baseline */}
        <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)}
          stroke="var(--color-ink)" strokeOpacity={0.25} />

        {terms.map((t, i) => (
          <g key={t.term}>
            {t.average == null ? (
              <text x={x(i)} y={y(2.5) + 4} textAnchor="middle" fontSize={FS.none}
                fill="var(--color-muted)" fontStyle="italic">
                {lang === "es" ? "Sin matrícula" : "Not enrolled"}
              </text>
            ) : (
              <>
                {/* Softened deliberately. At full cobalt these read as five
                    saturated slabs and drown everything around them, including
                    the cohort line they are supposed to be compared against.
                    Rounded tops and a lighter fill let the chart be read rather
                    than just seen; hover still brings one bar forward. */}
                <rect
                  x={x(i) - barW / 2}
                  y={y(t.average)}
                  width={barW}
                  height={y(0) - y(t.average)}
                  rx={4}
                  fill={ACCENT}
                  opacity={active === i ? 0.72 : active === null ? 0.42 : 0.22}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
                <text x={x(i)} y={y(t.average) - OFF.value} textAnchor="middle"
                  fontSize={FS.value} fontWeight={active === i ? 700 : 400}
                  fill="var(--color-navy)" fillOpacity={active === i ? 1 : 0.7}
                  className="tabular-nums transition-opacity duration-200">
                  {t.average.toFixed(2)}
                </text>
              </>
            )}
            <text x={x(i)} y={H - OFF.term} textAnchor="middle" fontSize={FS.term}
              fill="var(--color-muted)" className="tabular-nums">
              {t.term}
            </text>
          </g>
        ))}

        {/* Cohort reference, drawn last so it sits over the bars: muted grey is
            context on this site, cobalt is Lumen. A line rather than a second
            set of bars, so the comparison reads as a level to clear rather than
            two things competing for the same slot. */}
        {cohortPoints.length > 0 && (
          <g className="pointer-events-none">
            {cohortPoints.length > 1 && (
              <polyline
                points={cohortPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth={1.5}
                strokeOpacity={0.75}
              />
            )}
            {cohortPoints.map((p) => (
              <g key={p.i}>
                <line
                  x1={p.x - barW / 2 - 3}
                  x2={p.x + barW / 2 + 3}
                  y1={p.y}
                  y2={p.y}
                  stroke="var(--color-muted)"
                  strokeWidth={2}
                />
                {active === p.i && (
                  <text
                    x={p.x + barW / 2 + 6}
                    y={p.y + 3.5}
                    fontSize={FS.term}
                    fill="var(--color-muted)"
                    className="tabular-nums"
                  >
                    {p.v.toFixed(2)}
                  </text>
                )}
              </g>
            ))}
          </g>
        )}
      </svg>

      {cohortPoints.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
          <span className="inline-flex items-center gap-2 text-[11px] text-muted">
            <svg width="14" height="8" aria-hidden="true">
              <rect x="2" y="0" width="10" height="8" rx="2" fill={ACCENT} opacity={0.42} />
            </svg>
            {lang === "es" ? "Este estudiante" : "This scholar"}
          </span>
          <span className="inline-flex items-center gap-2 text-[11px] text-muted">
            <svg width="14" height="8" aria-hidden="true">
              <line x1="0" x2="14" y1="4" y2="4" stroke="var(--color-muted)" strokeWidth="2" />
            </svg>
            {lang === "es"
              ? "Promedio de su cohorte en ese semestre"
              : "Their cohort's average in that semester"}
          </span>
        </div>
      )}

      {/* Achievement callouts, tied to the term they land against */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {terms.map((t, i) =>
          pinned[i] ? (
            <div key={t.term}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              className={`rounded-sm border p-3 transition-colors duration-200 ${
                active === i ? "border-accent bg-accent/5" : "border-ink/10"
              }`}>
              <div className="text-[10px] uppercase tracking-widest text-accent tabular-nums">
                {t.term} · {t.courses} {lang === "es" ? "cursos" : "courses"}
              </div>
              <div className="text-meta text-ink/80 mt-1">{pinned[i]}</div>
            </div>
          ) : null,
        )}
      </div>

      <p className="text-[11px] text-muted mt-3">
        {/* These were straight means while the source report embedded its term
            tables as images and carried no credit counts. The 2026-1 report
            carries them, so the bars are now weighted the same way Uniandes
            weights the cumulative. The intersemestral note is here because the
            cumulative takes those in and the bars do not, so the two cannot be
            reconciled by eye without it. */}
        {lang === "es"
          ? "Promedio del semestre ponderado por créditos, leído del reporte de notas de Uniandes, en la misma base que el PGA acumulado oficial. El acumulado incluye además los intersemestrales, que no aparecen como barra."
          : "Credit-weighted average for the term, read from the Uniandes grade report, on the same basis as the official cumulative PGA. The cumulative also takes in the intersemestral sessions, which are not shown as bars."}
        {cohortPoints.length > 0 && (
          <>
            {" "}
            {lang === "es"
              ? "La línea gris es el promedio de los estudiantes de su misma carrera que van en ese mismo semestre a agosto de 2026, según Uniandes."
              : "The grey line is the average of the students in the same programme who are in that same semester as of August 2026, as reported by Uniandes."}
          </>
        )}
        {!record.complete && (
          <>
            {" "}
            <strong className="text-accent">
              {lang === "es"
                ? "Cobertura parcial: faltan semestres por recuperar."
                : "Partial coverage: some terms are still to be recovered."}
            </strong>
          </>
        )}
      </p>
    </div>
  )
}
