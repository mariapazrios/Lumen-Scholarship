import { useState } from "react"
import { useLang } from "../lib/i18n"
import type { ScholarTermRecord } from "../data/scholarTerms"

const ACCENT = "var(--color-cobalt)"

/**
 * Term-by-term trend for one scholar, with achievements called out against the
 * terms they happened in. The y axis is fixed to 3.0 to 5.0: the whole cohort
 * sits in that band, so a shared scale lets sponsors compare scholars.
 */
export default function GpaTrend({
  record,
  achievements,
}: {
  record: ScholarTermRecord
  achievements: string[]
}) {
  const { lang } = useLang()
  const [active, setActive] = useState<number | null>(null)
  const terms = record.terms
  if (terms.length === 0) return null

  const W = 620
  const H = 200
  const PAD = { l: 34, r: 16, t: 16, b: 34 }
  const MIN = 3.0
  const MAX = 5.0
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  const x = (i: number) =>
    PAD.l + (terms.length === 1 ? innerW / 2 : (i / (terms.length - 1)) * innerW)
  const y = (v: number) => PAD.t + innerH - ((v - MIN) / (MAX - MIN)) * innerH

  const ticks = [3.0, 3.5, 4.0, 4.5, 5.0]
  const line = terms.map((t, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(t.average)}`).join(" ")

  // one achievement pinned per term, in order, so the callouts spread across the run
  const pinned = terms.map((_, i) => achievements[i]).map((a) => a ?? null)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={lang === "es" ? "Promedio por semestre" : "Average by term"}>
        {ticks.map((tk) => (
          <g key={tk}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(tk)} y2={y(tk)}
              stroke="var(--color-ink)" strokeOpacity={tk === 4 ? 0.18 : 0.08} />
            <text x={PAD.l - 8} y={y(tk) + 4} textAnchor="end"
              fontSize="10" fill="var(--color-muted)" className="tabular-nums">
              {tk.toFixed(1)}
            </text>
          </g>
        ))}

        {terms.length > 1 && (
          <path d={line} fill="none" stroke={ACCENT} strokeWidth={2.5}
            strokeLinejoin="round" strokeLinecap="round" />
        )}

        {terms.map((t, i) => (
          <g key={t.term}>
            <circle cx={x(i)} cy={y(t.average)} r={active === i ? 7 : 5}
              fill={ACCENT} stroke="#fff" strokeWidth={2}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />
            <text x={x(i)} y={y(t.average) - 12} textAnchor="middle"
              fontSize="11" fontWeight="700" fill="var(--color-navy)" className="tabular-nums">
              {t.average.toFixed(2)}
            </text>
            <text x={x(i)} y={H - 12} textAnchor="middle" fontSize="10"
              fill="var(--color-muted)" className="tabular-nums">
              {t.term}
            </text>
          </g>
        ))}
      </svg>

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
        {lang === "es"
          ? "Promedio simple de las notas del semestre, leído del reporte de notas de Uniandes. El PGA acumulado oficial se pondera por créditos."
          : "Straight mean of the term's course grades, read from the Uniandes grade report. The official cumulative PGA is credit weighted."}
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
