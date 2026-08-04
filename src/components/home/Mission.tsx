import Reveal from "../primitives/Reveal"
import Tricolor from "../primitives/Tricolor"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

/**
 * The three pillars now read as the sequence they always were: sponsors fund,
 * Lumen selects and develops, Lumen delivers into the companies hiring for that
 * profile. Each title names its step so the division of labor is legible
 * without a diagram.
 */
const PILLARS: Array<{ n: string; title: L; body: L }> = [
  {
    n: "01",
    title: { en: "Funded by sponsors", es: "Financiado por patrocinadores" },
    body: {
      en: "A 95% full-ride scholarship covering 10 semesters, a summer session, and a $1M COP living stipend every semester, funded by one person or company committing to one Lumen.",
      es: "Una beca del 95% que cubre 10 semestres y una sesión de verano, más un apoyo de sostenimiento de $1M COP por semestre, financiada por una persona o empresa que se compromete con un Lumen.",
    },
  },
  {
    n: "02",
    title: { en: "Five years of development", es: "Cinco años de formación" },
    body: {
      en: "Mentorship from the Board, peer academic synergies, and a cohort with an identity of its own, from admission through graduation.",
      es: "Mentoría de la Junta, estudio entre compañeros y una cohorte con identidad propia, desde la admisión hasta el grado.",
    },
  },
  {
    n: "03",
    title: { en: "Placed with leading companies", es: "Conexión con empresas líderes" },
    body: {
      en: "Every Lumen finishes inside a company leading their industry, and those companies gain talent their own hiring would never have reached. The same act that changes one career strengthens the businesses the country depends on.",
      es: "Cada Lumen termina dentro de una empresa líder en su industria, y esas empresas ganan talento que sus propios procesos nunca habrían alcanzado. El mismo acto que cambia una carrera fortalece a las empresas de las que depende el país.",
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
      {/* Colombian tricolor, closing the hero */}
      <Tricolor className="absolute inset-x-0 top-0 h-1" />
      <Watermark className="-right-36 top-16 w-[28rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-20 relative">
        {/* The partnership */}
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-accent font-semibold mb-4">
            {lang === "es" ? "La alianza" : "The partnership"}
          </div>
          <p className="text-lead font-light text-ink/80 mb-10 max-w-4xl">
            {lang === "es"
              ? "Los patrocinadores financian la beca. Nosotros elegimos el talento, lo formamos durante cinco años y lo conectamos con las empresas que lo necesitan."
              : "Sponsors fund the scholarship. We select the talent, develop it for five years, and connect it back to the companies that need it."}
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div className="bg-surface rounded-sm p-8 md:p-10 h-full">
                <div className="text-meta uppercase tracking-widest text-accent font-semibold">
                  {p.n}
                </div>
                {/* Two of the three step titles are too long to hold one line at any
                    width, so all three reserve two lines and stay aligned instead. */}
                <h3 className="font-semibold text-primary mt-4 leading-tight text-[clamp(1.25rem,1.6vw,1.6rem)] md:min-h-[2.4em]">
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
