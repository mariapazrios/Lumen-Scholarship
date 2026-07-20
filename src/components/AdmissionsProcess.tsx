import CountUp from "./primitives/CountUp"
import Reveal from "./primitives/Reveal"
import { useLang, type L } from "../lib/i18n"

const FUNNEL: Array<{ value: number; label: L; width: string; accent?: boolean }> = [
  {
    value: 8065,
    label: { en: "Applications to Los Andes", es: "Solicitudes a Los Andes" },
    width: "100%",
  },
  {
    value: 2534,
    label: { en: "Financial aid applications", es: "Solicitudes de apoyo financiero" },
    width: "58%",
  },
  {
    value: 82,
    label: {
      en: "The Lumen pool of applicants",
      es: "El grupo Lumen de aspirantes",
    },
    width: "26%",
    accent: true,
  },
  {
    value: 11,
    label: { en: "Lumens selected", es: "Lumens seleccionados" },
    width: "10%",
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

/** The Lumen admissions funnel, process steps, and financial aid package. */
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
          <div>
            <Reveal>
              <div className="text-meta uppercase tracking-widest text-muted mb-4">
                {t(eyebrow)}
              </div>
              <h2 className="text-h2 font-semibold text-primary">
                {lang === "es" ? (
                  <>
                    Un proceso riguroso,
                    <br />
                    <em className="italic font-light">altamente selectivo.</em>
                  </>
                ) : (
                  <>
                    A rigorous,
                    <br />
                    <em className="italic font-light">highly curated process.</em>
                  </>
                )}
              </h2>
              <p className="text-body text-ink/75 mt-6 max-w-lg">
                {lang === "es"
                  ? "Lumen elige selectivamente de un grupo ya altamente curado: los finalistas de Quiero Estudiar."
                  : "Lumen cherry-picks from an already highly curated pool: the finalists of Quiero Estudiar."}
              </p>
            </Reveal>

            {/* Funnel */}
            <div className="mt-12 space-y-4">
              {FUNNEL.map((f, i) => (
                <Reveal key={f.label.en} delay={i * 120}>
                  <div>
                    <div
                      className={`h-11 rounded-sm flex items-center px-4 min-w-fit ${
                        f.accent ? "bg-accent" : "bg-primary"
                      }`}
                      style={{ width: f.width }}
                    >
                      <span className="text-body font-bold text-white tabular-nums whitespace-nowrap">
                        <CountUp value={f.value} duration={1000 + i * 150} />
                      </span>
                    </div>
                    <div className="text-meta uppercase tracking-widest text-muted mt-1.5">
                      {t(f.label)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
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
                      <strong>$1M COP por semestre</strong>. Para afianzar el compromiso, cada
                      Lumen aporta el 5% restante de su matrícula.
                    </>
                  ) : (
                    <>
                      A 95% full-ride scholarship covering <strong>10 semesters</strong> plus{" "}
                      <strong>1 summer session</strong> of tuition, along with a{" "}
                      <strong>$1M COP living stipend every semester</strong>. To promote
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
