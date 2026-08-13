import { useLang } from "../lib/i18n"
import { SCHOLARS } from "../data/scholars"
import type { RankingByGeneration, RankSignals, ScholarRank } from "../lib/ranking"

/**
 * Standing within a cohort, read off the journals, the grade record against
 * programme peers, and the extracurricular record.
 *
 * The buckets are labelled as actions rather than grades. "Red" on a page
 * about real students has to mean "call this person", not "this person is
 * failing", and every note is written to name the next step.
 */
const BUCKET: Record<
  ScholarRank["bucket"],
  { dot: string; chip: string; label: { es: string; en: string } }
> = {
  green: {
    dot: "bg-accent",
    chip: "bg-accent/10 text-accent",
    label: { es: "En marcha", en: "Thriving" },
  },
  yellow: {
    dot: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-700",
    label: { es: "Seguir de cerca", en: "Watch" },
  },
  red: {
    dot: "bg-red-600",
    chip: "bg-red-600/10 text-red-700",
    label: { es: "Contactar ya", en: "Needs a call" },
  },
}

const AXES: Array<{ key: keyof RankSignals; label: { es: string; en: string } }> = [
  { key: "growth", label: { es: "Crecimiento", en: "Growth" } },
  { key: "insight", label: { es: "Reflexión", en: "Insight" } },
  { key: "potential", label: { es: "Potencial", en: "Potential" } },
  { key: "grades", label: { es: "Notas", en: "Grades" } },
  { key: "extracurricular", label: { es: "Extracurriculares", en: "Extracurricular" } },
]

function Signals({ signals }: { signals: RankSignals }) {
  const { lang } = useLang()
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
      {AXES.map((a) => (
        <div key={a.key} className="min-w-[5.5rem]">
          <div className="text-meta text-muted leading-tight">
            {lang === "es" ? a.label.es : a.label.en}
          </div>
          <div className="flex gap-0.5 mt-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`h-1.5 w-3 rounded-full ${
                  n <= signals[a.key] ? "bg-accent/70" : "bg-ink/10"
                }`}
              />
            ))}
          </div>
          <span className="sr-only">
            {signals[a.key]} / 5
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CohortRanking({
  ranking,
  generations,
}: {
  ranking: RankingByGeneration | null
  generations: readonly string[]
}) {
  const { lang } = useLang()

  if (ranking === null) {
    return (
      <p role="status" className="text-body text-ink/70">
        {lang === "es" ? "Calculando el ranking." : "Working out the ranking."}
      </p>
    )
  }

  const nameOf = (slug: string) => SCHOLARS.find((s) => s.slug === slug)?.name ?? slug
  const majorOf = (slug: string) => {
    const s = SCHOLARS.find((x) => x.slug === slug)
    return s ? (lang === "es" ? s.major.es : s.major.en) : null
  }

  return (
    <div className="space-y-8">
      {generations.map((gen) => {
        const rows = ranking[gen]
        if (!rows?.length) return null
        return (
          <div key={gen}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
              <h3 className="text-meta uppercase tracking-widest font-semibold text-primary">
                {lang === "es" ? `Generación ${gen}` : `${gen} Generation`}
              </h3>
              <span aria-hidden="true" className="flex-1 h-px bg-ink/15 min-w-8" />
            </div>

            <ol className="space-y-3">
              {rows.map((r) => {
                const b = BUCKET[r.bucket]
                return (
                  <li
                    key={r.slug}
                    className="bg-white border border-ink/10 rounded-sm p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-h3 font-bold text-ink/20 tabular-nums leading-none w-8 shrink-0">
                        {r.rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-body font-semibold text-primary">
                            {nameOf(r.slug)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-meta uppercase tracking-widest rounded-full px-2.5 py-1 ${b.chip}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />
                            {lang === "es" ? b.label.es : b.label.en}
                          </span>
                        </div>
                        {majorOf(r.slug) && (
                          <div className="text-meta text-muted mt-0.5">{majorOf(r.slug)}</div>
                        )}
                        <p className="text-body text-ink/80 mt-2">
                          {lang === "es" ? r.note.es : r.note.en}
                        </p>
                        {r.sparse ? (
                          <p className="text-meta text-muted italic mt-3">
                            {lang === "es"
                              ? "Sin journal en archivo, así que no hay con qué calificar reflexión ni potencial. El puesto se apoya solo en notas y actividades."
                              : "No journal on file, so there is nothing to read insight or potential from. This placing rests on grades and activities alone."}
                          </p>
                        ) : (
                          <Signals signals={r.signals} />
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}
