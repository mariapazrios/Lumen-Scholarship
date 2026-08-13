import CountUp from "./primitives/CountUp"
import Reveal from "./primitives/Reveal"
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
    width: "80%",
  },
  {
    label: { en: "Financial aid applications", es: "Solicitudes de apoyo financiero" },
    values: [1471, 1275, 926],
    width: "48%",
  },
  {
    label: {
      en: "The Lumen pool of applicants",
      es: "El grupo Lumen de aspirantes",
    },
    values: [11, 46, 27],
    width: "24%",
    accent: true,
  },
  {
    label: { en: "Lumens selected", es: "Lumens seleccionados" },
    values: [6, 5, null],
    width: "12%",
    accent: true,
  },
]

const STEPS: Array<{ n: string; title: L; body: L }> = [
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
      en: "One essay, 650 words, on the prompt you choose from the ones we provide.",
      es: "Un ensayo de 650 palabras sobre el tema que elijas entre los que proponemos.",
    },
  },
  {
    n: "04",
    title: { en: "Interview with the Board", es: "Entrevístate con la Junta" },
    body: {
      en: "A series of one-on-one conversations with the members of the Lumen Board, who will become your mentors.",
      es: "Una serie de conversaciones individuales con los miembros de la Junta Lumen, que luego serán tus mentores.",
    },
  },
  {
    n: "05",
    title: { en: "Become a Lumen", es: "Conviértete en Lumen" },
    body: {
      en: "Join the next generation.",
      es: "Únete a la próxima generación.",
    },
  },
]

type Props = {
  id?: string
  eyebrow?: L
  tone?: "white" | "soft"
}

/** The Lumen admissions filter across cycles, process steps, and aid package. */
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
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {t(eyebrow)}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Un proceso selectivo,
                <br />
                <em className="italic font-light">altamente curado.</em>
              </>
            ) : (
              <>
                A selective,
                <br />
                <em className="italic font-light">highly curated process.</em>
              </>
            )}
          </h2>
          <p className="text-body text-ink/75 mt-6 max-w-2xl">
            {lang === "es"
              ? "Lumen elige selectivamente de un grupo ya altamente curado: los finalistas de Quiero Estudiar."
              : "Lumen cherry-picks from an already highly curated pool: the finalists of Quiero Estudiar."}
          </p>
          <p className="text-body text-ink/75 mt-4 max-w-2xl">
            {lang === "es"
              ? "Es una beca STEM+: cubre todas las ciencias y todas las ingenierías de Los Andes, más economía, administración y derecho."
              : "It is a STEM+ scholarship: it covers every science and every engineering at Los Andes, plus economics, business and law."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 mt-12">
          {/* Filter across the three admission cycles */}
          <div>
            <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(3.75rem,auto))] gap-x-3 sm:gap-x-4 items-end mb-2">
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
                    <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,minmax(3.75rem,auto))] gap-x-3 sm:gap-x-4 items-baseline">
                      <div className="text-meta uppercase tracking-widest text-muted">
                        {t(row.label)}
                      </div>
                      {row.values.map((v, vi) => (
                        <div
                          key={CYCLES[vi].term}
                          className={`text-right text-body font-bold tabular-nums ${
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
                    <div
                      className={`h-2 rounded-sm mt-2 ${row.accent ? "bg-accent" : "bg-primary"}`}
                      style={{ width: row.width }}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="text-meta text-muted mt-6">
              {lang === "es"
                ? "2026-20 sigue en curso: el grupo Lumen ya está armado, la selección no."
                : "2026-20 is still underway: the Lumen pool is set, the selection is not."}
            </p>
          </div>

          {/* Steps */}
          <div>
            <ol className="space-y-0 border-t border-ink/10">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 100} as="li">
                  <div className="flex gap-6 md:gap-8 py-7 border-b border-ink/10">
                    <span className="text-h3 font-bold text-accent tabular-nums shrink-0">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="text-h3 font-semibold text-primary">{t(s.title)}</h3>
                      <p className="text-body text-ink/75 mt-2">{t(s.body)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={200}>
              <div className="bg-surface rounded-sm p-8 mt-10">
                <div className="text-meta uppercase tracking-widest text-muted mb-3">
                  {lang === "es" ? "El paquete de apoyo Lumen" : "The Lumen financial aid package"}
                </div>
                <p className="text-body text-ink/80">
                  {lang === "es" ? (
                    <>
                      Una beca del 95% que cubre <strong>10 semestres</strong> y{" "}
                      <strong>una sesión de verano</strong>, más un apoyo de sostenimiento de{" "}
                      <strong>$2M COP por semestre</strong>. Para afianzar el compromiso, cada
                      Lumen aporta el 5% restante de su matrícula.
                    </>
                  ) : (
                    <>
                      A 95% full-ride scholarship covering <strong>10 semesters</strong> plus{" "}
                      <strong>1 summer session</strong> of tuition, along with a{" "}
                      <strong>$2M COP living stipend every semester</strong>. To promote
                      alignment, Lumens contribute the remaining 5% of tuition.
                    </>
                  )}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
