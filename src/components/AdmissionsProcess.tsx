import CountUp from "./primitives/CountUp"
import Reveal from "./primitives/Reveal"
import { ESSAY_PROMPTS } from "../data/essayPrompts"
import { useLang, type L } from "../lib/i18n"

/** Uniandes admission cycles, oldest completed generation first. */
const CYCLES: Array<{ term: string; gen: L }> = [
  { term: "2024-10", gen: { en: "2024 generation", es: "Generación 2024" } },
  { term: "2025-10", gen: { en: "2025 generation", es: "Generación 2025" } },
  { term: "2026-20", gen: { en: "In process", es: "En curso" } },
]

/**
 * One row of the filter. `values` align with `CYCLES`. A null is a cycle that
 * has not reached that stage yet, drawn as an em dash rather than a zero.
 *
 * Widths are editorial, not proportional: a true scale would make the last two
 * rows vanish, and the numbers already carry the compression.
 */
const FILTER: Array<{
  label: L
  values: Array<number | null>
  width: string
  accent?: boolean
}> = [
  {
    label: { en: "Applications to Los Andes", es: "Solicitudes a Los Andes" },
    values: [6324, 5764, 4313],
    width: "100%",
  },
  {
    label: { en: "Admissions", es: "Admisiones" },
    values: [5059, 4826, 3569],
    width: "86%",
  },
  {
    label: { en: "Financial aid applications", es: "Solicitudes de apoyo financiero" },
    values: [1471, 1275, 926],
    width: "62%",
  },
  {
    label: {
      en: "The Lumen pool of applicants",
      es: "El grupo Lumen de aspirantes",
    },
    values: [11, 46, 27],
    width: "38%",
    accent: true,
  },
  {
    label: { en: "Lumens selected", es: "Lumens seleccionados" },
    values: [6, 5, null],
    width: "22%",
    accent: true,
  },
]

/** Shared by the cycle headers and each bar+count row so the columns cannot drift. */
const FUNNEL_GRID =
  "grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(4.5rem,auto))] sm:grid-cols-[minmax(0,1fr)_repeat(3,minmax(5.5rem,auto))] gap-x-4 sm:gap-x-8"

const STEPS: Array<{ n: string; title: L; body: L; prompts?: boolean }> = [
  {
    n: "01",
    title: { en: "Get into Los Andes", es: "Entra a Los Andes" },
    body: {
      en: "Apply and earn admission to Universidad de los Andes on your school record and ICFES score.",
      es: "Preséntate a la Universidad de los Andes y logra la admisión con tu desempeño en el colegio y tu puntaje ICFES.",
    },
  },
  {
    n: "02",
    title: { en: "Get into Quiero Estudiar", es: "Entra a Quiero Estudiar" },
    body: {
      en: "Reach the final round of the university's flagship financial aid program. Lumen selects from this pool.",
      es: "Llega a la ronda final del programa insignia de apoyo financiero de la universidad: de ese grupo salen los Lumens.",
    },
  },
  {
    n: "03",
    title: { en: "Write your essay", es: "Escribe tu ensayo" },
    body: {
      en: "One essay, 650 words, on the prompt you choose.",
      es: "Un ensayo de 650 palabras sobre el tema que elijas.",
    },
    prompts: true,
  },
  {
    n: "04",
    title: { en: "Interview with the Board", es: "Entrevístate con la Junta" },
    body: {
      en: "A series of one-on-one conversations with the members of the Lumen Board, who will become your mentors.",
      es: "Una serie de conversaciones individuales con los miembros de la Junta Lumen, que luego serán tus mentores.",
    },
  },
]

type Props = {
  id?: string
  eyebrow?: L
  tone?: "white" | "soft"
}

/** The Lumen admissions filter across cycles, then the four process steps. */
export default function AdmissionsProcess({
  id = "students",
  eyebrow = { en: "For students", es: "Para estudiantes" },
  tone = "white",
}: Props) {
  const { lang, t } = useLang()
  return (
    <section
      id={id}
      className={`${tone === "soft" ? "bg-surface-soft" : "bg-background"} scroll-mt-24`}
    >
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {t(eyebrow)}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Un proceso selectivo,{" "}
                <em className="italic font-light">altamente curado.</em>
              </>
            ) : (
              <>
                A selective,{" "}
                <em className="italic font-light">highly curated process.</em>
              </>
            )}
          </h2>
          <p className="text-lead md:text-h3 font-light text-ink/75 mt-5">
            {lang === "es"
              ? "Lumen elige selectivamente de un grupo ya altamente curado: los finalistas de Quiero Estudiar."
              : "Lumen cherry-picks from an already highly curated pool: the finalists of Quiero Estudiar."}
          </p>
        </Reveal>

        {/* Funnel spans the full measure so the bars occupy the page, not a half column.
            Counts sit on the bar row — not in a line above it — so wrapping labels
            cannot lift the last stages off the funnel. */}
        <div className="mt-10">
          <div className={`${FUNNEL_GRID} items-end mb-3`}>
            <div />
            {CYCLES.map((c) => (
              <div key={c.term} className="text-right">
                <div className="text-meta uppercase tracking-widest font-semibold text-primary tabular-nums">
                  {c.term}
                </div>
                <div className="text-meta text-muted mt-1">{t(c.gen)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            {FILTER.map((row, i) => (
              <Reveal key={row.label.en} delay={i * 100}>
                <div>
                  <div className="text-meta uppercase tracking-widest text-muted">
                    {t(row.label)}
                  </div>
                  <div className={`${FUNNEL_GRID} items-center mt-2`}>
                    <div className="h-3.5 md:h-5">
                      <div
                        className={`h-full rounded-sm ${row.accent ? "bg-accent" : "bg-primary"}`}
                        style={{ width: row.width }}
                      />
                    </div>
                    {row.values.map((v, vi) => (
                      <div
                        key={CYCLES[vi].term}
                        className={`text-right text-h3 font-bold tabular-nums leading-none ${
                          row.accent ? "text-accent" : "text-primary"
                        }`}
                      >
                        {v == null ? (
                          <span className="text-muted font-semibold">—</span>
                        ) : (
                          <CountUp value={v} duration={900 + i * 120} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-meta text-muted mt-5">
            {lang === "es"
              ? "2026-20 sigue en curso: el grupo Lumen ya está armado, la selección no."
              : "2026-20 is still underway: the Lumen pool is set, the selection is not."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 items-start">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="bg-white border border-ink/10 rounded-sm p-7 md:p-8 h-full">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h3 font-semibold text-primary leading-tight">
                    {t(s.title)}
                  </h3>
                  <span className="text-meta font-semibold tracking-widest text-accent tabular-nums">
                    {s.n}
                  </span>
                </div>
                <p className="text-body text-ink/75 mt-3">{t(s.body)}</p>
                {s.prompts && (
                  <ol className="mt-5 space-y-4 border-t border-ink/10 pt-5">
                    {ESSAY_PROMPTS.map((p, pi) => (
                      <li key={p.en.slice(0, 24)} className="flex gap-3">
                        <span className="text-meta font-semibold text-accent tabular-nums shrink-0 mt-0.5">
                          {String(pi + 1).padStart(2, "0")}
                        </span>
                        <p className="text-body text-ink/80">{t(p)}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
