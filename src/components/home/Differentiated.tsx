import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

type Pillar = { n: string; title: L; challenge: L; solution: L }

/**
 * Three cards, not six across two groups. The university and pre-professional
 * halves were the same three needs seen twice, so each card now carries the gap
 * and the response on both sides of graduation.
 */
const PILLARS: Pillar[] = [
  {
    n: "01",
    title: { en: "Mentorship", es: "Mentoría" },
    challenge: {
      en: "No trusted, accomplished mentors to learn from, and no visibility into the careers that exist.",
      es: "Sin mentores confiables y con trayectoria de quienes aprender, y sin visibilidad sobre los caminos profesionales que existen.",
    },
    solution: {
      en: "The Board stays close to every Lumen and opens its own network, so the range of careers available stops being abstract.",
      es: "La Junta acompaña de cerca a cada Lumen y abre su propia red, para que el abanico de carreras posibles deje de ser abstracto.",
    },
  },
  {
    n: "02",
    title: { en: "Peer support", es: "Apoyo entre pares" },
    challenge: {
      en: "Academic support is often prohibitively priced.",
      es: "El apoyo académico suele tener precios prohibitivos.",
    },
    solution: {
      en: "The cohort runs on academic synergy, carrying each other through the hardest terms rather than paying for help.",
      es: "La cohorte estudia en equipo y se sostiene entre sí en los semestres más duros, en lugar de pagar por ayuda.",
    },
  },
  {
    n: "03",
    title: { en: "Connect", es: "Conectar" },
    challenge: {
      en: "No preparation for competitive selection processes, and no professional network to lean on.",
      es: "Sin preparación para procesos de selección competitivos y sin una red profesional en la cual apoyarse.",
    },
    solution: {
      en: "Lumen prepares every scholar to compete for the roles they want, and our sponsors and corporate affiliates open the door to them.",
      es: "Lumen prepara a cada estudiante para competir por los cargos que quiere, y nuestros patrocinadores y afiliados corporativos le abren la puerta.",
    },
  },
]

export default function Differentiated() {
  const { lang, t } = useLang()

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <Watermark onDark className="-left-36 -bottom-36 w-[28rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
            {lang === "es" ? "Programa diferenciado" : "Differentiated program"}
          </div>
          <h2 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                La matrícula es el punto de partida.
                <br />
                <em className="italic font-light">La carrera es el punto de llegada.</em>
              </>
            ) : (
              <>
                Tuition is where we start.
                <br />
                <em className="italic font-light">A career is where we finish.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-primary-foreground/75 mt-6">
            {lang === "es"
              ? "Los estudiantes de bajos recursos, primeros de su familia en llegar a la universidad, llegan sin el conocimiento del sistema, la preparación ni la red que exigen las mejores carreras. Las empresas que contratan para esas carreras nunca los ven. Lumen trabaja en los dos extremos."
              : "Low-income, first-generation students arrive without the know-how, the preparation, or the network that top-tier careers require. The companies hiring for those careers never see them. Lumen works on both ends."}
          </p>
        </Reveal>

        {/* Reveal wraps the grid, not each card: the cards must stay direct grid
            children for md:grid-rows-subgrid to align their three rows. */}
        <Reveal delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {PILLARS.map((p) => (
              <div
                key={p.n}
                className="md:row-span-3 md:grid md:grid-rows-subgrid md:gap-y-5 border border-primary-foreground/15 rounded-sm p-7 md:p-8 bg-primary-foreground/[0.03]"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-h3 font-semibold">{t(p.title)}</h3>
                  <span className="text-meta font-semibold tracking-widest text-primary-foreground/50">
                    {p.n}
                  </span>
                </div>
                <p className="text-body text-primary-foreground/60 mt-4 md:mt-0">
                  <span className="text-meta uppercase tracking-widest block mb-1">
                    {lang === "es" ? "La brecha" : "The gap"}
                  </span>
                  {t(p.challenge)}
                </p>
                <p className="text-body mt-4 md:mt-0">
                  <span className="text-meta uppercase tracking-widest font-semibold text-primary-foreground/90 block mb-1">
                    {lang === "es" ? "La respuesta de Lumen" : "Lumen's Response"}
                  </span>
                  {t(p.solution)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
