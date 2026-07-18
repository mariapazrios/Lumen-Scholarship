import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

const PILLARS: Array<{ n: string; title: L; body: L }> = [
  {
    n: "01",
    title: { en: "Robust financial aid", es: "Apoyo financiero integral" },
    body: {
      en: "A 95% full-ride scholarship, which includes 10 semesters, a summer session, and a $1M COP living stipend every semester.",
      es: "Una beca del 95% que cubre 10 semestres y una sesión de verano, más un apoyo de sostenimiento de $1M COP por semestre.",
    },
  },
  {
    n: "02",
    title: { en: "Identity-driven community", es: "Comunidad con identidad" },
    body: {
      en: "A supportive, identity-driven community that drives the standard for excellence: mentorship from the Board, peer academic synergies, and shared belonging.",
      es: "Una comunidad unida, con identidad propia, que eleva el estándar de excelencia: mentoría de la Junta, estudio entre compañeros y un fuerte sentido de pertenencia.",
    },
  },
  {
    n: "03",
    title: { en: "Early-career guidance", es: "Orientación profesional" },
    body: {
      en: "Position Lumens for early-career momentum by offering continued mentorship, helping them identify opportunities, and connecting students with top companies and industry-specific mentors.",
      es: "Acompañamos a los Lumens al arrancar su vida profesional: mentoría constante, orientación para descubrir oportunidades y conexiones con empresas líderes y mentores de cada industria.",
    },
  },
]

const VALUES: L[] = [
  { en: "Resilience", es: "Resiliencia" },
  { en: "Excellence", es: "Excelencia" },
  { en: "Integrity", es: "Integridad" },
  { en: "Community", es: "Comunidad" },
]

export default function Mission() {
  const { lang, t } = useLang()

  return (
    <section className="bg-background relative overflow-hidden">
      <Watermark className="-right-36 top-16 w-[28rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-20 relative">
        {/* Mission */}
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-accent font-semibold mb-6">
            {lang === "es" ? "Nuestra misión" : "Our mission"}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div className="bg-surface rounded-sm p-8 md:p-10 h-full">
                <div className="text-meta uppercase tracking-widest text-accent font-semibold">
                  {p.n}
                </div>
                {/* One line at desktop; reserves two lines only where wrapping is possible */}
                <h3 className="font-semibold text-primary mt-4 leading-tight text-[clamp(1.25rem,1.6vw,1.6rem)] md:min-h-[2.4em] lg:min-h-0 lg:whitespace-nowrap">
                  {t(p.title)}
                </h3>
                <p className="text-body text-ink/75 mt-3">{t(p.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Values */}
        <Reveal delay={120}>
          <div className="mt-16">
            <div className="text-meta uppercase tracking-widest text-accent font-semibold mb-8">
              {lang === "es" ? "Nuestros valores" : "Our values"}
            </div>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              {VALUES.map((v, i) => (
                <span key={v.en} className="flex items-center gap-x-10">
                  <span className="text-h3 font-bold text-primary tracking-tight">{t(v)}</span>
                  {i < VALUES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:inline-block w-2 h-2 rounded-full bg-accent"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
