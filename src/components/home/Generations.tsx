import Reveal from "../primitives/Reveal"
import { SCHOLARS, type Scholar } from "../../data/scholars"
import { useLang } from "../../lib/i18n"

function ScholarCard({ scholar }: { scholar: Scholar }) {
  const { t, lang } = useLang()
  return (
    <a
      href={`#/scholars/${scholar.slug}`}
      aria-label={`${scholar.name}, ${lang === "es" ? "Generación" : "Generation"} ${scholar.generation}`}
      className="group snap-start shrink-0 relative w-[180px] md:w-[220px] aspect-[3/4] rounded-sm overflow-hidden border border-primary-foreground/10 text-left"
    >
      <img
        src={`/scholars/${scholar.slug}.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
        loading="lazy"
      />
      {/* Fixed-height caption so every name sits at the same latitude */}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-8 bg-gradient-to-t from-primary via-primary/70 to-transparent">
        <div className="h-[5em] flex flex-col">
          <div className="text-body font-semibold leading-tight text-primary-foreground min-h-[2.4em]">
            {scholar.name}
          </div>
          <div className="text-meta text-primary-foreground/75 mt-0.5">{t(scholar.major)}</div>
        </div>
      </div>
    </a>
  )
}

/** The Lumens, by generation, alphabetical by last name. Cards link to the full profiles below. */
export default function Generations() {
  const { lang } = useLang()
  const generations: Array<{ year: "2024" | "2025"; scholars: Scholar[] }> = [
    { year: "2024", scholars: SCHOLARS.filter((s) => s.generation === "2024") },
    { year: "2025", scholars: SCHOLARS.filter((s) => s.generation === "2025") },
  ]

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <img
        src="/lumen-icon.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-40 -top-40 w-[36rem] opacity-[0.06] brightness-0 invert"
      />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
        <Reveal>
          <h2 className="text-h2 font-semibold mb-12">
            {lang === "es" ? (
              <>
                Conoce a los <em className="italic font-light">Lumens.</em>
              </>
            ) : (
              <>
                Meet the <em className="italic font-light">Lumens.</em>
              </>
            )}
          </h2>
        </Reveal>

        <div className="space-y-12">
          {generations.map((gen) => (
            <div key={gen.year} className="-mx-6 md:-mx-10 lg:-mx-16">
              <div className="px-6 md:px-10 lg:px-16 mb-5 flex items-baseline gap-4">
                <div className="text-h3 font-semibold">
                  {lang === "es" ? `Generación ${gen.year}` : `${gen.year} Generation`}
                </div>
                <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
                  {gen.scholars.length} Lumens
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-16 px-6 md:px-10 lg:px-16 pb-4 no-scrollbar">
                {gen.scholars.map((s) => (
                  <ScholarCard key={s.slug} scholar={s} />
                ))}
              </div>
            </div>
          ))}

          {/* Incoming 2026 generation */}
          <div className="-mx-6 md:-mx-10 lg:-mx-16">
            <div className="px-6 md:px-10 lg:px-16 mb-5 flex items-baseline gap-4">
              <div className="text-h3 font-semibold">
                {lang === "es" ? "Generación 2026" : "2026 Generation"}
              </div>
              <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
                {lang === "es" ? "5 nuevos Lumens en camino" : "5 incoming new students"}
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 lg:scroll-px-16 px-6 md:px-10 lg:px-16 pb-4 no-scrollbar">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  aria-hidden="true"
                  className="snap-start shrink-0 relative w-[180px] md:w-[220px] aspect-[3/4] rounded-sm border border-dashed border-primary-foreground/30 grid place-items-center"
                >
                  <div className="text-center px-4">
                    <img
                      src="/lumen-icon.png"
                      alt=""
                      className="w-12 h-auto mx-auto opacity-40 brightness-0 invert"
                    />
                    <div className="text-meta uppercase tracking-widest text-primary-foreground/50 mt-4">
                      {lang === "es" ? "Próximamente" : "Incoming"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
