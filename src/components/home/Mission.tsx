import Reveal from "../primitives/Reveal"
import Tricolor from "../primitives/Tricolor"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

const PILLARS: Array<{ n: string; title: L; body: L }> = [
  {
    n: "01",
    title: { en: "Robust financial aid", es: "Apoyo financiero integral" },
    // {andes} is replaced by a link to uniandes.edu.co when the card renders.
    body: {
      en: "A 95% full-ride scholarship to {andes}, Colombia's top private university, which includes 10 semesters, a summer session, and a $1M COP living stipend every semester.",
      es: "Una beca del 95% para {andes}, la mejor universidad privada de Colombia, que cubre 10 semestres y una sesión de verano, más un apoyo de sostenimiento de $1M COP por semestre.",
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

/**
 * Splits a pillar body on the {andes} placeholder and links that half. Keeping
 * the marker inside the translated string means the link lands in the right
 * place in both languages, where Spanish word order puts it earlier.
 */
function AndesLink({ text }: { text: string }) {
  const [before, after] = text.split("{andes}")
  if (after === undefined) return <>{text}</>
  return (
    <>
      {before}
      <a
        href="https://www.uniandes.edu.co/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 decoration-accent/40 hover:decoration-accent hover:text-foreground transition-colors duration-200"
      >
        Los Andes
      </a>
      {after}
    </>
  )
}

export default function Mission() {
  const { lang, t } = useLang()

  return (
    <section className="bg-background relative overflow-hidden">
      {/* Colombian tricolor, closing the hero */}
      <Tricolor className="absolute inset-x-0 top-0 h-1" />
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
                <p className="text-body text-ink/75 mt-3">
                  <AndesLink text={t(p.body)} />
                </p>
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
            {/* The separating dots are hidden on a phone, which left four bold
                words wrapping as loose text. Below sm they become a 2x2 set,
                each under its own cobalt rule, so they read as four values
                rather than four words. From sm up this is the original row. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-6">
              {VALUES.map((v, i) => (
                <span
                  key={v.en}
                  className="flex items-center border-t-2 border-accent pt-3 sm:border-t-0 sm:pt-0 sm:gap-x-10"
                >
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

            {/* What the money actually buys, named. The majors come from the
                eleven scholars on the roster, not from an eligibility list. */}
            <p className="text-body text-ink/75 mt-8 max-w-3xl">
              {lang === "es"
                ? "Lumen es una beca STEM+: financiamos ingeniería y ciencias, y también economía y administración. Hoy nuestros estudiantes cursan Ingeniería de Sistemas y Computación, Ingeniería Biomédica, Ingeniería Electrónica, Ingeniería Industrial, Física, Química y Economía."
                : "Lumen is a STEM+ scholarship: we fund engineering and the sciences, and economics and business alongside them. Our scholars are studying Systems and Computing Engineering, Biomedical Engineering, Electronic Engineering, Industrial Engineering, Physics, Chemistry and Economics."}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
