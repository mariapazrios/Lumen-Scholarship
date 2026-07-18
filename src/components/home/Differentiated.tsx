import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

type Pillar = { n: string; title: L; challenge: L; solution: L }

const GROUPS: Array<{ label: L; pillars: Pillar[] }> = [
  {
    label: { en: "University focus", es: "Enfoque universitario" },
    pillars: [
      {
        n: "01",
        title: { en: "Mentorship", es: "Mentoría" },
        challenge: {
          en: "Limited access to trusted, accomplished mentors.",
          es: "Acceso limitado a mentores confiables y con trayectoria.",
        },
        solution: {
          en: "Board members hold regular check-ins and ad-hoc guidance sessions with every Lumen.",
          es: "Los miembros de la Junta tienen encuentros periódicos con cada Lumen y sesiones de orientación cuando se necesitan.",
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
          en: "The cohort runs on academic synergy: shared notes and peer tutoring.",
          es: "La cohorte estudia en equipo: apuntes compartidos y tutorías entre compañeros.",
        },
      },
      {
        n: "03",
        title: { en: "Identity", es: "Identidad" },
        challenge: {
          en: "Financial aid students can face isolation and a strained sense of belonging, or financial aid-driven discrimination.",
          es: "Los estudiantes becados pueden sentirse aislados, con un sentido de pertenencia frágil, o vivir discriminación por su condición de becarios.",
        },
        solution: {
          en: "Lumen sponsors social and community-building activities every semester.",
          es: "Lumen organiza actividades sociales y de integración cada semestre.",
        },
      },
    ],
  },
  {
    label: { en: "Pre-professional focus", es: "Enfoque preprofesional" },
    pillars: [
      {
        n: "04",
        title: { en: "Inform", es: "Informar" },
        challenge: {
          en: "Little visibility into the careers that exist.",
          es: "Poca visibilidad sobre los caminos profesionales que existen.",
        },
        solution: {
          en: "Panels and speaker series show Lumens the full range of paths open to them.",
          es: "Paneles y ciclos de charlas les muestran a los Lumens todo el abanico de caminos posibles.",
        },
      },
      {
        n: "05",
        title: { en: "Prepare", es: "Preparar" },
        challenge: {
          en: "Little preparation for competitive selection processes.",
          es: "Poca preparación para procesos de selección competitivos.",
        },
        solution: {
          en: "Resume and interview workshops position Lumens to stand out in every application.",
          es: "Talleres de hoja de vida y entrevistas preparan a los Lumens para destacarse en cada proceso de selección.",
        },
      },
      {
        n: "06",
        title: { en: "Connect", es: "Conectar" },
        challenge: {
          en: "No professional network to lean on.",
          es: "Sin una red profesional en la cual apoyarse.",
        },
        solution: {
          en: "Individual and corporate affiliates offer mentorship, networking, and early-career opportunities.",
          es: "Afiliados individuales y corporativos ofrecen mentoría, networking y oportunidades de inicio de carrera.",
        },
      },
    ],
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
            {lang === "es" ? "Qué hace diferente a Lumen" : "How Lumen is different"}
          </div>
          <h2 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Más que <em className="italic font-light">solo matrícula.</em>
              </>
            ) : (
              <>
                More than <em className="italic font-light">just tuition.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-primary-foreground/75 mt-6">
            {lang === "es"
              ? "A los estudiantes de bajos recursos, primeros de su familia en llegar a la universidad, suelen faltarles el conocimiento del sistema, la preparación y la red de contactos para alcanzar las mejores carreras."
              : "Low-income, first-generation students often lack the know-how, preparation, and network to reach top-tier careers."}
          </p>
        </Reveal>

        {GROUPS.map((group, gi) => (
          <Reveal key={group.label.en} delay={gi * 120}>
            <div className="mt-14">
              <div className="text-meta uppercase tracking-widest font-semibold text-primary-foreground/90 mb-5 flex items-center gap-4">
                {t(group.label)}
                <span aria-hidden="true" className="flex-1 h-px bg-primary-foreground/15" />
              </div>
              {/* Subgrid keeps title, gap, and response rows aligned across the three cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {group.pillars.map((p) => (
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
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
