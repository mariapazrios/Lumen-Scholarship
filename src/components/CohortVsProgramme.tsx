import { useState } from "react"
import { useLang } from "../lib/i18n"
import { useIsNarrow } from "../lib/viewport"
import type { ScholarGrades } from "../lib/grades"
import { SCHOLARS } from "../data/scholars"
import { COHORT_AVERAGES, SCHOLAR_COHORT } from "../data/cohortAverages"

const ACCENT = "var(--color-cobalt)"
const CONTEXT = "var(--color-muted)"

type Row = {
  slug: string
  last: string
  generation: "2024" | "2025"
  gpa: number
  peer: number
  delta: number
}

/**
 * Each scholar's cumulative GPA against the Uniandes average for their own
 * programme, at the same semester of the degree.
 *
 * The scatter next to this one asks whether the entrance score ordered them.
 * This one asks the question that actually pays for the scholarship: once they
 * are in, are they beating the students they sit next to.
 */
export default function CohortVsProgramme({
  grades,
}: {
  grades: Record<string, ScholarGrades> | null
}) {
  const { lang } = useLang()
  const narrow = useIsNarrow()
  const [active, setActive] = useState<string | null>(null)

  if (grades === null) {
    return (
      <p role="status" className="text-body text-ink/70">
        {lang === "es" ? "Cargando los promedios." : "Loading the averages."}
      </p>
    )
  }

  const rows: Row[] = []
  for (const s of SCHOLARS) {
    const g = grades[s.slug]
    const series = COHORT_AVERAGES[SCHOLAR_COHORT[s.slug]]
    if (!g || g.cumulative == null || !series) continue
    let enrolled = 0
    for (const t of g.terms) {
      if (t.average != null) enrolled++
    }
    if (enrolled === 0) continue
    const peer = series[enrolled - 1]
    if (peer == null) continue
    rows.push({
      slug: s.slug,
      last: s.name.split(" ").pop() || s.name,
      generation: s.generation,
      gpa: g.officialPga ?? g.cumulative,
      peer,
      delta: (g.officialPga ?? g.cumulative) - peer,
    })
  }
  rows.sort((a, b) => b.delta - a.delta || b.gpa - a.gpa)
  if (rows.length === 0) return null

  const lo = 3.5
  const hi = 5.0
  const W = narrow ? 300 : 640
  const rowH = narrow ? 26 : 28
  const PAD = narrow
    ? { l: 64, r: 44, t: 18, b: 28 }
    : { l: 78, r: 52, t: 20, b: 32 }
  const H = PAD.t + rows.length * rowH + PAD.b
  const innerW = W - PAD.l - PAD.r
  const x = (v: number) => PAD.l + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * innerW
  const ticks = [3.5, 4.0, 4.5, 5.0]
  const FS = narrow ? 10 : 10
  const ahead = rows.filter((r) => r.delta >= 0).length

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
        <span className="inline-flex items-center gap-2 text-meta uppercase tracking-widest text-muted">
          <svg width="11" height="11" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="5" fill={ACCENT} />
          </svg>
          {lang === "es" ? "Generación 2024" : "2024 generation"}
        </span>
        <span className="inline-flex items-center gap-2 text-meta uppercase tracking-widest text-muted">
          <svg width="11" height="11" aria-hidden="true">
            <circle cx="5.5" cy="5.5" r="4" fill="none" stroke={ACCENT} strokeWidth="2.5" />
          </svg>
          {lang === "es" ? "Generación 2025" : "2025 generation"}
        </span>
        <span className="inline-flex items-center gap-2 text-meta uppercase tracking-widest text-muted">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CONTEXT }} />
          {lang === "es" ? "Su carrera" : "Their programme"}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={
          lang === "es"
            ? "Promedio acumulado de cada Lumen frente al promedio de su carrera"
            : "Each Lumen's cumulative GPA against their programme average"
        }
      >
        {ticks.map((tk) => (
          <g key={tk}>
            <line
              x1={x(tk)}
              x2={x(tk)}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--color-ink)"
              strokeOpacity={0.08}
            />
            <text
              x={x(tk)}
              y={H - 8}
              textAnchor="middle"
              fontSize={FS}
              fill="var(--color-muted)"
              className="tabular-nums"
            >
              {tk.toFixed(1)}
            </text>
          </g>
        ))}

        {rows.map((r, i) => {
          const cy = PAD.t + i * rowH + rowH / 2
          const on = active === r.slug
          const xGpa = x(r.gpa)
          const xPeer = x(r.peer)
          return (
            <g
              key={r.slug}
              onMouseEnter={() => setActive(r.slug)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "default" }}
            >
              <rect
                x={0}
                y={cy - rowH / 2}
                width={W}
                height={rowH}
                fill={on ? "var(--color-accent)" : "transparent"}
                fillOpacity={on ? 0.04 : 0}
              />
              <text
                x={PAD.l - 8}
                y={cy + 3.5}
                textAnchor="end"
                fontSize={FS}
                fill={on ? "var(--color-navy)" : "var(--color-ink)"}
                fillOpacity={on ? 1 : 0.75}
                fontWeight={on ? 700 : 400}
              >
                {r.last}
              </text>
              {Math.abs(r.gpa - r.peer) > 0.001 && (
                <line
                  x1={xPeer}
                  x2={xGpa}
                  y1={cy}
                  y2={cy}
                  stroke={CONTEXT}
                  strokeWidth={2}
                  strokeOpacity={0.35}
                />
              )}
              <circle
                cx={xPeer}
                cy={cy}
                r={5}
                fill={CONTEXT}
                stroke="var(--color-surface-soft)"
                strokeWidth={2}
              />
              <circle
                cx={xGpa}
                cy={cy}
                r={r.generation === "2024" ? 6 : 5.5}
                fill={r.generation === "2024" ? ACCENT : "var(--color-surface-soft)"}
                stroke={ACCENT}
                strokeWidth={r.generation === "2024" ? 0 : 2.5}
              />
              <text
                x={Math.max(xGpa, xPeer) + 10}
                y={cy + 3.5}
                fontSize={FS}
                fill="var(--color-navy)"
                className="tabular-nums"
                fontWeight={on ? 700 : 600}
              >
                {(r.delta >= 0 ? "+" : "") + r.delta.toFixed(2)}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-4 pt-4 border-t border-ink/10 flex flex-wrap gap-x-8 gap-y-3">
        <div>
          <div className="text-body font-semibold text-primary tabular-nums">
            {ahead}/{rows.length}
          </div>
          <div className="text-meta uppercase tracking-widest text-muted">
            {lang === "es" ? "Por encima de su carrera" : "Above their programme"}
          </div>
        </div>
        <div>
          <div className="text-body font-semibold text-primary tabular-nums">
            {(rows.reduce((s, r) => s + r.delta, 0) / rows.length).toFixed(2)}
          </div>
          <div className="text-meta uppercase tracking-widest text-muted">
            {lang === "es" ? "Brecha media" : "Mean gap"}
          </div>
        </div>
      </div>

      <p className="text-body text-ink/70 mt-4">
        {lang === "es" ? (
          <>
            Cada punto compara a un Lumen con los estudiantes de su propia carrera en el mismo
            semestre, no con un promedio general de Los Andes. {ahead} de {rows.length} están por
            encima de ese grupo.
          </>
        ) : (
          <>
            Each mark compares a Lumen with the students in their own programme at the same
            semester, not with a university-wide average. {ahead} of {rows.length} sit above that
            group.
          </>
        )}
      </p>
    </div>
  )
}
