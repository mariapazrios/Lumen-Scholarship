import ArrowButton from "./primitives/ArrowButton"

type Scholar = {
  slug: string
  name: string
  generation: string
}

const SCHOLARS: Scholar[] = [
  { slug: "daniel-alzate", name: "Daniel Álzate", generation: "Generación 2025" },
  { slug: "juan-daniel-gonzalo", name: "Juan Daniel Gonzalo", generation: "Generación 2025" },
  { slug: "mateo-arcila", name: "Mateo Arcila", generation: "Generación 2025" },
  { slug: "santiago-rubiano", name: "Santiago Rubiano", generation: "Generación 2025" },
  { slug: "valentina-salgado", name: "Valentina Salgado", generation: "Generación 2025" },
  { slug: "jose-maturana", name: "José Maturana", generation: "Generación 2024" },
  { slug: "juan-angel-aicardy", name: "Juan Ángel Aicardy", generation: "Generación 2024" },
  { slug: "juan-pablo-contreras", name: "Juan Pablo Contreras", generation: "Generación 2024" },
  { slug: "julian-rodriguez", name: "Julián Rodríguez", generation: "Generación 2024" },
  { slug: "sebastian-martinez", name: "Sebastián Martínez", generation: "Generación 2024" },
  { slug: "valerie-suarez", name: "Valerie Suárez", generation: "Generación 2024" },
]

export default function Hero() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-12xl mx-auto px-4 lg:px-8 pt-24 pb-24 md:pt-32 md:pb-32">
        {/* Top split: headline + paragraph on the left, image on the right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 lg:gap-24 items-start">
          <div className="max-w-xl pt-4">
            <h1 className="font-serif text-hero font-normal tracking-tight">
              Lorem ipsum dolor sit amet,{" "}
              <span className="italic">consectetur adipiscing elit</span>.
            </h1>
            <p className="text-lead text-primary-foreground/70 mt-10 max-w-md">
              Sed do <span className="italic">eiusmod tempor incididunt</span>{" "}
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat
            </p>
          </div>
          <div className="w-full">
            <img
              src="/hero-lumen.jpg"
              alt="The eleven Lumen scholars"
              className="w-full rounded-sm object-cover object-[center_30%] aspect-[3/4]"
              loading="eager"
            />
          </div>
        </div>

        {/* Featured Scholars: horizontal drag-scroll carousel */}
        <div className="mt-16 md:mt-24 -mx-4 lg:-mx-8">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 lg:scroll-px-8 px-4 lg:px-8 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {SCHOLARS.map((s) => (
              <a
                key={s.slug}
                href={`#scholar-${s.slug}`}
                aria-label={`${s.name}, ${s.generation}`}
                className="group snap-start shrink-0 relative w-[200px] md:w-[240px] aspect-[2/3] rounded-sm overflow-hidden border border-primary-foreground/10"
              >
                <img
                  src={`/scholars/${s.slug}.jpg`}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-[center_15%] transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/40 group-focus-visible:bg-primary/40" />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 bg-gradient-to-t from-primary via-primary/80 to-transparent">
                  <div className="text-body font-semibold leading-tight">
                    {s.name}
                  </div>
                  <div className="text-meta text-primary-foreground/75 mt-1 normal-case tracking-normal font-normal">
                    {s.generation}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10">
          <ArrowButton label="scholars" tone="white" href="#scholars" />
        </div>
      </div>
    </section>
  )
}
