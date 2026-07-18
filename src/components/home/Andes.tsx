import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

const FACTS: Array<{ value: string; label: L }> = [
  { value: "1948", label: { en: "Founded in Bogotá", es: "Fundada en Bogotá" } },
  { value: "#1", label: { en: "University in Colombia", es: "Universidad de Colombia" } },
  { value: "#6", label: { en: "University in Latin America", es: "Universidad de América Latina" } },
  { value: "110K+", label: { en: "Graduates since inception", es: "Graduados desde su fundación" } },
  { value: "~2,000", label: { en: "Faculty, 77% hold PhDs", es: "Profesores, 77% con doctorado" } },
  { value: "44", label: { en: "Undergraduate programs", es: "Programas de pregrado" } },
]

export default function Andes() {
  const { lang, t } = useLang()

  return (
    <section className="bg-surface relative overflow-hidden">
      <Watermark className="-right-28 -top-24 w-[22rem] opacity-[0.05]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
          <Reveal>
            <div>
              <div className="text-meta uppercase tracking-widest text-muted mb-4">
                {lang === "es" ? "Aliado institucional" : "Institutional partner"}
              </div>
              <h2 className="text-h2 font-semibold text-primary">
                <a
                  href="https://www.uniandes.edu.co/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-2 underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors duration-200"
                >
                  Universidad de los Andes
                </a>
                .
                <br />
                <em className="italic font-light">
                  {lang === "es"
                    ? "La universidad líder de Colombia."
                    : "Colombia's premier university."}
                </em>
              </h2>
              <p className="text-body text-ink/75 mt-6 max-w-lg">
                {lang === "es"
                  ? "Los Lumens estudian en el centro de Bogotá, en un campus de más de 230.000 m² con más de 180 laboratorios, más de 220 grupos de investigación y seis centros de innovación. De la universidad han salido 12 de las 30 startups más destacadas de Colombia."
                  : "Lumen scholars study in downtown Bogotá on a 2.5M+ sq ft campus with 180+ research labs, 220+ research groups, and six innovation centers. The university has incubated 12 of Colombia's top 30 startups."}
              </p>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8 mt-10">
                {FACTS.map((f, i) => (
                  <Reveal key={f.label.en} delay={i * 80}>
                    <div>
                      <dt className="sr-only">{t(f.label)}</dt>
                      <dd className="text-h3 font-bold text-primary tabular-nums">{f.value}</dd>
                      <dd className="text-meta uppercase tracking-widest text-muted mt-1">
                        {t(f.label)}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-4 -top-4 md:-left-6 md:-top-6 w-2/3 h-2/3 bg-primary rounded-sm"
              />
              <img
                src="/campus-aerial.jpg"
                alt={
                  lang === "es"
                    ? "Vista aérea del campus de la Universidad de los Andes en Bogotá"
                    : "Aerial view of the Universidad de los Andes campus in Bogotá"
                }
                className="relative w-full rounded-sm object-cover aspect-[4/3]"
                loading="lazy"
              />
              <img
                src="/campus-quad.jpg"
                alt={
                  lang === "es"
                    ? "El campus de la Universidad de los Andes frente a los cerros de Bogotá"
                    : "Universidad de los Andes campus against the Bogotá mountains"
                }
                className="hidden lg:block absolute -bottom-10 -right-6 w-1/2 rounded-sm object-cover aspect-[4/3] border-4 border-surface shadow-lg"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
