import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

/** GPA and retention across financial aid programs (Lumen annual report 2025). */
const PROGRAMS: Array<{ name: L; gpa: number; retention: number; lumen?: boolean }> = [
  { name: { en: "Lumen", es: "Lumen" }, gpa: 4.3, retention: 100, lumen: true },
  { name: { en: "Quiero Estudiar (Andes Flagship Aid)", es: "Quiero Estudiar (programa insignia)" }, gpa: 4.1, retention: 82 },
  { name: { en: "Other", es: "Otros" }, gpa: 3.9, retention: 80 },
  { name: { en: "Government", es: "Gobierno" }, gpa: 3.8, retention: 78 },
]

/** GPA by major: Lumen average vs the major's total average. */
const MAJORS: Array<{ name: L; lumen: number; avg: number; total?: boolean }> = [
  { name: { en: "Economics", es: "Economía" }, lumen: 4.6, avg: 3.9 },
  { name: { en: "Physics", es: "Física" }, lumen: 4.5, avg: 3.9 },
  { name: { en: "Biomedical Engineering", es: "Ing. Biomédica" }, lumen: 4.4, avg: 3.9 },
  { name: { en: "Electronic Engineering", es: "Ing. Electrónica" }, lumen: 4.2, avg: 3.8 },
  { name: { en: "Systems & Computing Eng.", es: "Ing. de Sistemas" }, lumen: 4.1, avg: 3.9 },
  { name: { en: "Chemistry", es: "Química" }, lumen: 4.1, avg: 3.8 },
  { name: { en: "Industrial Engineering", es: "Ing. Industrial" }, lumen: 3.9, avg: 3.9 },
  { name: { en: "Total", es: "Total" }, lumen: 4.3, avg: 3.9, total: true },
]

/** Dot-plot / dumbbell domain: GPA axis from 3.5 to 5.0 (position encoding). */
const GPA_MIN = 3.5
const GPA_MAX = 5.0
const gpaX = (v: number) => ((v - GPA_MIN) / (GPA_MAX - GPA_MIN)) * 100
const GPA_TICKS = [3.5, 4.0, 4.5, 5.0]

const ACCENT = "var(--color-cobalt)"
const CONTEXT = "var(--color-muted)"

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-meta uppercase tracking-widest font-semibold text-accent border border-accent/30 rounded-full px-3 py-1">
      {children}
    </span>
  )
}

function GpaAxis() {
  return (
    <div className="relative h-5">
      {GPA_TICKS.map((tick) => (
        <span
          key={tick}
          className="absolute -translate-x-1/2 text-meta text-muted tabular-nums"
          style={{ left: `${gpaX(tick)}%` }}
        >
          {tick.toFixed(1)}
        </span>
      ))}
    </div>
  )
}

function GridLines() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {GPA_TICKS.map((tick) => (
        <span
          key={tick}
          className="absolute top-0 bottom-0 w-px bg-ink/10"
          style={{ left: `${gpaX(tick)}%` }}
        />
      ))}
    </div>
  )
}

/** Dumbbell: Lumen GPA vs the total major average, with a Total row and % uplift. */
function GpaByMajor() {
  const { lang, t } = useLang()
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-6 md:p-8">
      <div className="mb-4">
        <Tag>{lang === "es" ? "Desempeño" : "Performance"}</Tag>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
        <h3 className="text-body font-semibold text-primary">
          {lang === "es"
            ? "Promedio por carrera: Lumen vs promedio total de la carrera"
            : "GPA by major: Lumen vs total major average"}
        </h3>
        <div className="flex items-center gap-5 text-meta text-muted">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: ACCENT }} />
            Lumen
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: CONTEXT }} />
            {lang === "es" ? "Promedio de la carrera" : "Major average"}
          </span>
        </div>
      </div>

      {/* Axis on top (hidden on phones, where the chart moves to its own row) */}
      <div className="hidden sm:grid grid-cols-[minmax(8rem,2fr)_4fr_2.4rem_3.2rem] gap-3 mb-1">
        <div />
        <GpaAxis />
        <div />
        <div />
      </div>

      <div className="space-y-1">
        {MAJORS.map((m) => {
          const delta = m.lumen - m.avg
          const pct = Math.round((m.lumen / m.avg - 1) * 100)
          return (
            <div
              key={m.name.en}
              className={`grid grid-cols-[1fr_2.4rem_3.2rem] sm:grid-cols-[minmax(8rem,2fr)_4fr_2.4rem_3.2rem] items-center gap-x-3 gap-y-1 py-2 sm:py-1.5 ${
                m.total ? "border-t border-ink/15 mt-2 pt-3" : ""
              }`}
            >
              <div
                className={`order-1 sm:order-none text-body ${
                  m.total ? "font-bold text-primary" : "text-muted"
                }`}
              >
                {t(m.name)}
              </div>
              <div
                className="order-4 col-span-full sm:order-none sm:col-span-1 relative h-6"
                title={`${t(m.name)}: Lumen ${m.lumen.toFixed(1)} · ${
                  lang === "es" ? "promedio" : "average"
                } ${m.avg.toFixed(1)}`}
              >
                <GridLines />
                {delta !== 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                    style={{
                      left: `${gpaX(Math.min(m.avg, m.lumen))}%`,
                      width: `${Math.abs(gpaX(m.lumen) - gpaX(m.avg))}%`,
                      background: "var(--color-muted)",
                      opacity: 0.35,
                    }}
                  />
                )}
                <span
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    left: `${gpaX(m.avg)}%`,
                    width: 10,
                    height: 10,
                    background: CONTEXT,
                    boxShadow: "0 0 0 2px #ffffff",
                  }}
                />
                {delta !== 0 && (
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-meta tabular-nums text-muted"
                    style={{ left: `calc(${gpaX(m.avg)}% - 34px)` }}
                  >
                    {m.avg.toFixed(1)}
                  </span>
                )}
                <span
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    left: `${gpaX(m.lumen)}%`,
                    width: 12,
                    height: 12,
                    background: ACCENT,
                    boxShadow: "0 0 0 2px #ffffff",
                  }}
                />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 text-meta tabular-nums ${
                    m.total ? "font-bold text-foreground" : "font-semibold text-foreground"
                  }`}
                  style={{ left: `calc(${gpaX(m.lumen)}% + 10px)` }}
                >
                  {m.lumen.toFixed(1)}
                </span>
              </div>
              <div
                className={`order-2 sm:order-none text-meta tabular-nums text-right ${
                  m.total ? "font-bold text-foreground" : delta > 0 ? "text-foreground" : "text-muted"
                }`}
              >
                {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
              </div>
              <div
                className={`order-3 sm:order-none text-meta tabular-nums text-right ${
                  m.total ? "font-bold text-accent" : pct > 0 ? "font-semibold text-accent" : "text-muted"
                }`}
              >
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** One graphic, two metrics: GPA (dot plot) and retention (bars) per financial aid program. */
function ProgramComparison() {
  const { lang, t } = useLang()
  return (
    <div className="bg-white border border-ink/10 rounded-sm p-6 md:p-8">
      <h3 className="text-body font-semibold text-primary mb-5">
        {lang === "es"
          ? "Promedio (GPA) y retención por programa de apoyo financiero"
          : "GPA and retention by financial aid program"}
      </h3>

      {/* Column tags (md+; phones get inline labels per row) */}
      <div className="hidden md:grid grid-cols-[minmax(7rem,1.4fr)_2fr_2fr] gap-x-10 lg:gap-x-16 mb-3">
        <div />
        <div>
          <Tag>{lang === "es" ? "Desempeño" : "Performance"}</Tag>
        </div>
        <div>
          <Tag>{lang === "es" ? "Retención" : "Retention"}</Tag>
        </div>
      </div>

      {/* GPA axis on top of its column */}
      <div className="hidden md:grid grid-cols-[minmax(7rem,1.4fr)_2fr_2fr] gap-x-10 lg:gap-x-16 mb-1">
        <div />
        <GpaAxis />
        <div />
      </div>

      <div className="space-y-1">
        {PROGRAMS.map((p) => (
          <div
            key={p.name.en}
            className="grid grid-cols-1 md:grid-cols-[minmax(7rem,1.4fr)_2fr_2fr] md:items-center gap-y-1.5 md:gap-x-10 lg:gap-x-16 py-3 md:py-2 border-b border-ink/5 last:border-0 md:border-0"
          >
            <div className={`text-body ${p.lumen ? "font-semibold text-primary" : "text-muted"}`}>
              {t(p.name)}
            </div>
            <div className="grid grid-cols-[4.5rem_1fr] items-center gap-x-2 md:contents">
              <span className="text-meta uppercase tracking-widest text-muted md:hidden">
                {lang === "es" ? "Promedio" : "GPA"}
              </span>
              <div className="relative h-6" title={`${t(p.name)}: ${p.gpa.toFixed(1)} / 5.0`}>
                <GridLines />
                <span
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    left: `${gpaX(p.gpa)}%`,
                    width: p.lumen ? 14 : 11,
                    height: p.lumen ? 14 : 11,
                    background: p.lumen ? ACCENT : CONTEXT,
                    boxShadow: "0 0 0 2px #ffffff",
                  }}
                />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 text-meta tabular-nums ${
                    p.lumen ? "font-bold text-foreground" : "text-muted"
                  }`}
                  style={{ left: `calc(${gpaX(p.gpa)}% + 12px)` }}
                >
                  {p.gpa.toFixed(1)}
                </span>
              </div>
              <span className="text-meta uppercase tracking-widest text-muted md:hidden">
                {lang === "es" ? "Retención" : "Retention"}
              </span>
              <div className="relative h-6 flex items-center" title={`${t(p.name)}: ${p.retention}%`}>
                <div
                  className="h-3.5 rounded-r-sm"
                  style={{
                    width: `${p.retention * 0.8}%`,
                    background: p.lumen ? ACCENT : CONTEXT,
                    opacity: p.lumen ? 1 : 0.55,
                  }}
                />
                <span
                  className={`ml-2 text-meta tabular-nums ${
                    p.lumen ? "font-bold text-foreground" : "text-muted"
                  }`}
                >
                  {p.retention}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Stats() {
  const { lang } = useLang()

  return (
    <section className="bg-surface-soft relative overflow-hidden">
      <Watermark className="-left-40 -bottom-28 w-[26rem] opacity-[0.05]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="mb-14">
            <h2 className="text-h2 font-semibold text-primary">
              {lang === "es" ? (
                <>
                  Marcando el estándar de excelencia{" "}
                  <em className="italic font-light">dentro y fuera del aula.</em>
                </>
              ) : (
                <>
                  Driving the standard for excellence{" "}
                  <em className="italic font-light">inside and outside the classroom.</em>
                </>
              )}
            </h2>
            <p className="text-lead font-light text-ink/80 mt-6">
              {lang === "es" ? (
                <>
                  Todos los Lumens se ubicaron en el 1% superior del ICFES a nivel nacional.
                  En el campus,{" "}
                  <strong className="font-bold text-primary">
                    son la cohorte de mejor desempeño de toda la universidad, por encima de
                    los programas con y sin apoyo financiero.
                  </strong>{" "}
                  Nuestra meta: formar una cohorte unida y rigurosamente seleccionada, que
                  marque la pauta de excelencia en lo académico y en los valores.
                </>
              ) : (
                <>
                  Every Lumen ranked in the top 1% of Colombia's national ICFES exam. On
                  campus,{" "}
                  <strong className="font-bold text-primary">
                    Lumens are the best-performing cohort across the entire university,
                    including financial aid and non-financial aid programs alike.
                  </strong>{" "}
                  Our goal is to build a tight, rigorously selected cohort that sets the
                  standard for excellence across academics and values.
                </>
              )}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <GpaByMajor />
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-6">
            <ProgramComparison />
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-meta text-muted mt-6">
            {lang === "es"
              ? "Promedios en la escala colombiana de 5.0."
              : "GPA on Colombia's 5.0 scale."}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
