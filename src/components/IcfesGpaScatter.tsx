import { useState } from "react"
import { useLang } from "../lib/i18n"
import { useIsNarrow } from "../lib/viewport"
import type { ScholarGrades } from "../lib/grades"
import { SCHOLARS } from "../data/scholars"

const ACCENT = "var(--color-cobalt)"
const CONTEXT = "var(--color-muted)"

type Point = {
  slug: string
  name: string
  last: string
  generation: "2024" | "2025"
  icfes: number
  gpa: number
  /** Quoted by the scholar, no ICFES report on file. Drawn, never fitted. */
  selfReported: boolean
}

/** Least squares of gpa on icfes, plus Pearson r. */
function fit(points: Point[]) {
  const n = points.length
  if (n < 3) return null
  const mx = points.reduce((s, p) => s + p.icfes, 0) / n
  const my = points.reduce((s, p) => s + p.gpa, 0) / n
  const sxy = points.reduce((s, p) => s + (p.icfes - mx) * (p.gpa - my), 0)
  const sxx = points.reduce((s, p) => s + (p.icfes - mx) ** 2, 0)
  const syy = points.reduce((s, p) => s + (p.gpa - my) ** 2, 0)
  if (sxx === 0 || syy === 0) return null
  const slope = sxy / sxx
  return { slope, intercept: my - slope * mx, r: sxy / Math.sqrt(sxx * syy), n }
}

/**
 * Saber 11 against cumulative PGA, one dot per scholar.
 *
 * The chart exists to answer a question sponsors ask out loud, which is whether
 * the entrance score predicts how a scholar does once they are in. On this
 * cohort it does not, and the caption says so rather than leaving a downward
 * line to imply something the data cannot carry: nine points, and every one of
 * them inside a 37 point band near the top of a 500 point scale, because that
 * is who Lumen admits. There is no low scoring group here to compare against.
 *
 * Colour follows the site's chart convention rather than introducing a second
 * hue: cobalt is Lumen, grey is context. Generation rides on the fill (solid
 * 2024, ring 2025) so it survives greyscale and colour blindness, and every dot
 * is directly labelled anyway.
 */
export default function IcfesGpaScatter({
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
        {lang === "es" ? "Cargando los puntajes." : "Loading the scores."}
      </p>
    )
  }

  const points: Point[] = []
  let noScore = 0
  for (const s of SCHOLARS) {
    const g = grades[s.slug]
    if (!g?.saber11 || g.cumulative == null) {
      if (g) noScore++
      continue
    }
    points.push({
      slug: s.slug,
      name: s.name,
      // Surname only, so the labels stay short enough not to collide. The
      // roster writes every scholar as given name(s) then one surname, so the
      // last token is the right one: "Juan Ángel Aicardy" is Aicardy, not
      // "Ángel Aicardy".
      last: s.name.split(" ").pop() || s.name,
      generation: s.generation,
      icfes: g.saber11.score,
      gpa: g.cumulative,
      selfReported: g.saber11.selfReported === true,
    })
  }
  if (points.length === 0) return null

  const fitted = points.filter((p) => !p.selfReported)
  const line = fit(fitted)
  const flagged = points.filter((p) => p.selfReported)

  // Axis bounds padded off the data so no dot sits on a wall, then snapped out
  // to round numbers so the ticks read as scores rather than arbitrary marks.
  const xs = points.map((p) => p.icfes)
  const xMin = Math.floor((Math.min(...xs) - 8) / 10) * 10
  const xMax = Math.ceil((Math.max(...xs) + 8) / 10) * 10
  const yMin = 3.0
  const yMax = 5.0

  const W = narrow ? 300 : 640
  const H = narrow ? 260 : 300
  const PAD = narrow
    ? { l: 32, r: 12, t: 26, b: 34 }
    : { l: 40, r: 20, t: 26, b: 38 }
  const FS = narrow ? { axis: 10, name: 9.5 } : { axis: 10, name: 10 }
  const R = narrow ? 5 : 6

  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const x = (v: number) => PAD.l + ((v - xMin) / (xMax - xMin)) * innerW
  const y = (v: number) => PAD.t + innerH - ((v - yMin) / (yMax - yMin)) * innerH

  const yTicks = [3.0, 3.5, 4.0, 4.5, 5.0]
  const xTicks: number[] = []
  for (let v = xMin; v <= xMax; v += 10) xTicks.push(v)

  const fmtR = (v: number) => (v < 0 ? "−" : "") + Math.abs(v).toFixed(2)

  /**
   * Place each name where it does not sit on another name.
   *
   * Scholars cluster: Contreras and Rubiano are three ICFES points and 0.09 GPA
   * apart, so a fixed "label above the dot" rule prints one on top of the
   * other. Each label tries above, below, right, then left, and takes the first
   * slot that clears every label already placed. Points are placed top-down so
   * the order is stable between renders rather than depending on data order.
   */
  type Placed = {
    point: Point
    lx: number
    ly: number
    anchor: "middle" | "start" | "end"
    /** Where the hover readout goes, opposite the name. */
    below: boolean
  }
  const charW = FS.name * 0.52
  // Every dot is an obstacle from the start, so a label never lands on a mark
  // belonging to a scholar placed later in the pass.
  const boxes: Array<{ l: number; r: number; t: number; b: number }> = points.map((p) => ({
    l: x(p.icfes) - R - 1,
    r: x(p.icfes) + R + 1,
    t: y(p.gpa) - R - 1,
    b: y(p.gpa) + R + 1,
  }))
  const placed: Placed[] = [...points]
    .sort((a, b) => b.gpa - a.gpa || a.icfes - b.icfes)
    .map((p) => {
      const cx = x(p.icfes)
      const cy = y(p.gpa)
      const w = p.last.length * charW
      const h = FS.name * 1.15
      const candidates: Array<{
        lx: number
        ly: number
        anchor: "middle" | "start" | "end"
        below: boolean
      }> = [
        { lx: cx, ly: cy - R - 5, anchor: "middle", below: true },
        { lx: cx, ly: cy + R + 11, anchor: "middle", below: false },
        { lx: cx + R + 4, ly: cy - R - 3, anchor: "start", below: true },
        { lx: cx - R - 4, ly: cy - R - 3, anchor: "end", below: true },
        { lx: cx + R + 4, ly: cy + R + 9, anchor: "start", below: false },
        { lx: cx - R - 4, ly: cy + R + 9, anchor: "end", below: false },
        { lx: cx + R + 5, ly: cy + 3.5, anchor: "start", below: true },
        { lx: cx - R - 5, ly: cy + 3.5, anchor: "end", below: true },
      ]
      let pick = candidates[0]
      for (const c of candidates) {
        const l = c.anchor === "middle" ? c.lx - w / 2 : c.anchor === "start" ? c.lx : c.lx - w
        const box = { l, r: l + w, t: c.ly - h * 0.8, b: c.ly + h * 0.2 }
        const clearsLabels = !boxes.some(
          (o) => box.l < o.r && o.l < box.r && box.t < o.b && o.t < box.b,
        )
        const insidePlot = box.l >= 2 && box.r <= W - 2
        if (clearsLabels && insidePlot) {
          pick = c
          break
        }
      }
      const l =
        pick.anchor === "middle" ? pick.lx - w / 2 : pick.anchor === "start" ? pick.lx : pick.lx - w
      boxes.push({ l, r: l + w, t: pick.ly - h * 0.8, b: pick.ly + h * 0.2 })
      return { point: p, ...pick }
    })

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
        {flagged.length > 0 && (
          <span className="inline-flex items-center gap-2 text-meta uppercase tracking-widest text-muted">
            <svg width="11" height="11" aria-hidden="true">
              <circle
                cx="5.5"
                cy="5.5"
                r="4"
                fill="none"
                stroke={CONTEXT}
                strokeWidth="2"
                strokeDasharray="3 2"
              />
            </svg>
            {lang === "es" ? "Autorreportado, fuera del ajuste" : "Self-reported, not fitted"}
          </span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={
          lang === "es"
            ? "Dispersión del puntaje ICFES contra el promedio acumulado de cada estudiante"
            : "Scatter of ICFES score against each scholar's cumulative GPA"
        }
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={y(v)}
              y2={y(v)}
              stroke="var(--color-ink)"
              strokeOpacity={0.08}
            />
            <text
              x={PAD.l - 7}
              y={y(v) + 3.5}
              textAnchor="end"
              fontSize={FS.axis}
              fill="var(--color-muted)"
              className="tabular-nums"
            >
              {v.toFixed(1)}
            </text>
          </g>
        ))}

        {xTicks.map((v) => (
          <text
            key={v}
            x={x(v)}
            y={H - PAD.b + 16}
            textAnchor="middle"
            fontSize={FS.axis}
            fill="var(--color-muted)"
            className="tabular-nums"
          >
            {v}
          </text>
        ))}

        <text
          x={PAD.l + innerW / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize={FS.axis}
          fill="var(--color-muted)"
        >
          {lang === "es" ? "Puntaje ICFES (de 500)" : "ICFES score (of 500)"}
        </text>
        <text
          x={10}
          y={PAD.t + innerH / 2}
          textAnchor="middle"
          fontSize={FS.axis}
          fill="var(--color-muted)"
          transform={`rotate(-90 10 ${PAD.t + innerH / 2})`}
        >
          {lang === "es" ? "Promedio acumulado" : "Cumulative GPA"}
        </text>

        {/* The fit, drawn only across the range that actually has scholars in
            it. Extending it to the axis walls would draw a prediction for
            scores nobody in this cohort has. */}
        {line && (
          <line
            x1={x(Math.min(...fitted.map((p) => p.icfes)))}
            y1={y(line.intercept + line.slope * Math.min(...fitted.map((p) => p.icfes)))}
            x2={x(Math.max(...fitted.map((p) => p.icfes)))}
            y2={y(line.intercept + line.slope * Math.max(...fitted.map((p) => p.icfes)))}
            stroke="var(--color-navy)"
            strokeWidth={2}
            strokeOpacity={0.55}
          />
        )}

        {placed.map(({ point: p, lx, ly, anchor, below }) => {
          const on = active === p.slug
          const cx = x(p.icfes)
          const cy = y(p.gpa)
          return (
            <g
              key={p.slug}
              onMouseEnter={() => setActive(p.slug)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "default" }}
            >
              {/* Hit target larger than the mark. */}
              <circle cx={cx} cy={cy} r={R + 8} fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={R}
                fill={
                  p.selfReported
                    ? "none"
                    : p.generation === "2024"
                      ? ACCENT
                      : "var(--color-surface-soft)"
                }
                stroke={p.selfReported ? CONTEXT : ACCENT}
                strokeWidth={p.selfReported ? 2 : p.generation === "2024" ? 0 : 2.5}
                strokeDasharray={p.selfReported ? "3 2" : undefined}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                fontSize={FS.name}
                fill={on ? "var(--color-navy)" : "var(--color-ink)"}
                fillOpacity={on ? 1 : 0.75}
                fontWeight={on ? 700 : 400}
              >
                {p.last}
              </text>
              {on && (
                <text
                  x={cx}
                  y={below ? cy + R + 12 : cy - R - 6}
                  textAnchor="middle"
                  fontSize={FS.name}
                  fill="var(--color-navy)"
                  className="tabular-nums"
                >
                  {p.icfes} · {p.gpa.toFixed(2)}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {line && (
        <div className="mt-4 pt-4 border-t border-ink/10 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <div className="text-body font-semibold text-primary tabular-nums">{line.n}</div>
            <div className="text-meta uppercase tracking-widest text-muted">
              {lang === "es" ? "Con puntaje oficial" : "With an official score"}
            </div>
          </div>
          <div>
            <div className="text-body font-semibold text-primary tabular-nums">
              {fmtR(line.r)}
            </div>
            <div className="text-meta uppercase tracking-widest text-muted">
              {lang === "es" ? "Correlación r" : "Correlation r"}
            </div>
          </div>
          <div>
            <div className="text-body font-semibold text-primary tabular-nums">
              {(line.r * line.r).toFixed(2)}
            </div>
            <div className="text-meta uppercase tracking-widest text-muted">
              {lang === "es" ? "Varianza explicada r²" : "Variance explained r²"}
            </div>
          </div>
          <div>
            <div className="text-body font-semibold text-primary tabular-nums">
              {Math.min(...fitted.map((p) => p.icfes))}–{Math.max(...fitted.map((p) => p.icfes))}
            </div>
            <div className="text-meta uppercase tracking-widest text-muted">
              {lang === "es" ? "Rango de puntajes" : "Score range"}
            </div>
          </div>
        </div>
      )}

      {line && (
        <p className="text-body text-ink/70 mt-4">
          {lang === "es" ? (
            <>
              La relación es débil y va ligeramente hacia abajo: r = {fmtR(line.r)}, r² ={" "}
              {(line.r * line.r).toFixed(2)}. Con {line.n} estudiantes no es una tendencia
              confiable, y todos entraron con puntajes dentro de una franja estrecha en la parte
              alta de una escala de 500, porque es a quienes Lumen admite. No hay un grupo de
              puntajes bajos con el cual comparar, así que esto no dice que el ICFES no prediga
              nada: dice que dentro de este grupo no los ordena.
            </>
          ) : (
            <>
              The relationship is weak and tilts slightly downward: r = {fmtR(line.r)}, r² ={" "}
              {(line.r * line.r).toFixed(2)}. With {line.n} scholars that is not a reliable trend,
              and all of them arrived inside a narrow band near the top of a 500 point scale,
              because that is who Lumen admits. There is no low scoring group here to compare
              against, so this does not say ICFES predicts nothing: it says that within this group
              it does not rank them.
            </>
          )}
        </p>
      )}

      {(flagged.length > 0 || noScore > 0) && (
        <p className="text-meta text-muted mt-3">
          {flagged.length > 0 &&
            (lang === "es"
              ? `${flagged.map((p) => p.name).join(", ")}: puntaje autorreportado, sin informe del ICFES en archivo, por eso queda fuera del ajuste. `
              : `${flagged.map((p) => p.name).join(", ")}: score is self-reported with no ICFES report on file, so it sits outside the fit. `)}
          {noScore > 0 &&
            (lang === "es"
              ? `${noScore} ${noScore === 1 ? "estudiante no tiene" : "estudiantes no tienen"} puntaje en archivo y no ${noScore === 1 ? "aparece" : "aparecen"} en la gráfica.`
              : `${noScore} ${noScore === 1 ? "scholar has" : "scholars have"} no score on file and ${noScore === 1 ? "is" : "are"} not plotted.`)}
        </p>
      )}
    </div>
  )
}
