import { useState } from "react"
import Reveal from "../primitives/Reveal"
import Watermark from "../primitives/Watermark"
import { COLOMBIA_PATH, MAP_CITIES, SCHOLARS } from "../../data/scholars"
import { useLang, type L } from "../../lib/i18n"

const nameOf = (slug: string) => SCHOLARS.find((s) => s.slug === slug)?.name ?? slug

/** Display offsets for the Bogotá-savanna cluster so markers don't overlap. */
const DISPLAY_POS: Record<string, { x: number; y: number }> = {
  Funza: { x: 210, y: 390 },
  Bogotá: { x: 248, y: 390 },
  Cajicá: { x: 252, y: 356 },
}

const COHORT_STATS: Array<{ value: string; label: L }> = [
  { value: "11", label: { en: "Scholars", es: "Estudiantes" } },
  { value: "7", label: { en: "Hometowns", es: "Ciudades de origen" } },
  { value: "6", label: { en: "Departments", es: "Departamentos" } },
  { value: "7", label: { en: "Majors", es: "Carreras" } },
  { value: "9 · 2", label: { en: "Men · Women", es: "Hombres · Mujeres" } },
]

export default function MapSection() {
  const [hovered, setHovered] = useState<string | null>(null)
  const { lang } = useLang()

  return (
    <section className="bg-background relative overflow-hidden">
      <Watermark className="-left-32 -bottom-32 w-[24rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Lumen en cifras" : "Lumen snapshot"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Talento de <em className="italic font-light">todas las regiones de Colombia.</em>
              </>
            ) : (
              <>
                Talent from <em className="italic font-light">every region across Colombia.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-muted mt-6">
            {lang === "es"
              ? "Desde la costa Caribe hasta el altiplano andino, la mayoría de los Lumens son los primeros de su familia en llegar a la universidad."
              : "From the Caribbean coast to the Andean highlands, most Lumens are the first in their family to attend university."}
          </p>
        </Reveal>

        {/* Cohort stats */}
        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-ink/10 border border-ink/10 rounded-sm overflow-hidden">
            {COHORT_STATS.map((s) => (
              <div key={s.label.en} className="bg-background p-6 lg:p-8">
                <div aria-hidden="true" className="w-8 h-[3px] bg-accent mb-5" />
                <div className="text-stat font-bold text-primary tabular-nums leading-none">
                  {s.value}
                </div>
                <div className="text-meta uppercase tracking-widest text-muted mt-3">
                  {lang === "es" ? s.label.es : s.label.en}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mt-14">
          <Reveal>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {MAP_CITIES.map((c) => (
                <li key={c.city}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(c.city)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(c.city)}
                    onBlur={() => setHovered(null)}
                    className={`w-full flex items-baseline justify-between gap-4 py-3.5 px-2 text-left transition-colors duration-200 cursor-default ${
                      hovered === c.city ? "bg-surface-soft" : ""
                    }`}
                  >
                    <span className="text-lead font-semibold text-primary shrink-0">
                      {c.city}
                      <span className="text-meta uppercase tracking-widest text-muted font-normal ml-3">
                        {c.department}
                      </span>
                    </span>
                    <span className="text-body text-muted text-right">
                      {c.scholars.map(nameOf).join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative max-w-md mx-auto w-full">
              <svg
                viewBox="0 0 600 831"
                role="img"
                aria-label={
                  lang === "es"
                    ? "Mapa de Colombia con las siete ciudades de origen de los estudiantes Lumen"
                    : "Map of Colombia showing the seven hometowns of the Lumen scholars"
                }
                className="w-full h-auto"
              >
                <path
                  d={COLOMBIA_PATH}
                  fill="var(--color-cream-soft)"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {MAP_CITIES.map((c) => {
                  const pos = DISPLAY_POS[c.city] ?? c
                  const active = hovered === c.city
                  const size = active ? 40 : 30
                  return (
                    <g
                      key={c.city}
                      onMouseEnter={() => setHovered(c.city)}
                      onMouseLeave={() => setHovered(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="13"
                        fill="var(--color-cobalt)"
                        opacity="0.25"
                        className="animate-pulse-ring"
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                      <circle cx={pos.x} cy={pos.y} r={active ? 21 : 17} fill="white" stroke="var(--color-navy)" strokeWidth="1" opacity="0.95" />
                      <image
                        href="/lumen-icon.png"
                        x={pos.x - size / 2}
                        y={pos.y - (size * 0.9) / 2}
                        width={size}
                        height={size * 0.9}
                        className="transition-all duration-200"
                      />
                      {/* generous hover target */}
                      <circle cx={pos.x} cy={pos.y} r="26" fill="transparent" />
                    </g>
                  )
                })}
              </svg>

              {/* Tooltip */}
              {MAP_CITIES.filter((c) => c.city === hovered).map((c) => {
                const pos = DISPLAY_POS[c.city] ?? c
                return (
                  <div
                    key={c.city}
                    role="status"
                    className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                    style={{
                      left: `${(pos.x / 600) * 100}%`,
                      top: `${(pos.y / 831) * 100 - 3.5}%`,
                    }}
                  >
                    <div className="bg-primary text-primary-foreground rounded-sm px-4 py-3 shadow-lg whitespace-nowrap">
                      <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
                        {c.city} · {c.department}
                      </div>
                      <div className="text-body font-semibold mt-1">
                        {c.scholars.map(nameOf).join(" · ")}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
