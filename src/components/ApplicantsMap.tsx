import { useState } from "react"
import { COLOMBIA_PATH } from "../data/scholars"
import { useLang } from "../lib/i18n"
import type { Applicant } from "../lib/applicants"

/**
 * Where the current candidates come from, on the same simplified Colombia
 * outline as the landing page.
 *
 * Positions live in the landing map's 600x831 equirectangular viewBox. New
 * cities were projected with the affine fit of the existing MAP_CITIES anchors
 * (x = 50.29·lon + 3967.8, y = -49.78·lat + 618.5, verified against Bogotá,
 * Cartagena and Duitama to within 2px). The Bogotá-savanna cluster uses
 * display offsets, like the landing page, so four markers 15km apart do not
 * sit on top of each other.
 */
const CITY_POS: Record<string, { x: number; y: number; label: string }> = {
  "BOGOTÁ D.C.": { x: 250, y: 390, label: "Bogotá" },
  "CAJICÁ": { x: 254, y: 356, label: "Cajicá" },
  "CHÍA": { x: 222, y: 366, label: "Chía" },
  // The roster writes this as "MADRID (CUND)", not spelled out. It was keyed
  // the long way here and silently fell off the map for it.
  "MADRID (CUND)": { x: 212, y: 396, label: "Madrid" },
  "CÚCUTA": { x: 321, y: 226, label: "Cúcuta" },
  "MARGARITA": { x: 232, y: 163, label: "Margarita" },
  "PITALITO": { x: 143, y: 526, label: "Pitalito" },
  // Valledupar sits on its projected position. Ubaté (256,354) and Cáqueza
  // (249,399) land on top of Cajicá and Bogotá respectively, so both carry a
  // display offset in the true compass direction, the same device the rest of
  // the savanna cluster uses.
  "VALLEDUPAR": { x: 284, y: 98, label: "Valledupar" },
  "UBATE": { x: 278, y: 330, label: "Ubaté" },
  "CAQUEZA": { x: 278, y: 412, label: "Cáqueza" },
}

/**
 * Candidates whose city we cannot place. Counted and named rather than
 * dropped: a map that quietly loses people reads as complete when it is not.
 * "NO DISPONIBLE" is the roster's own value for a candidate schooled abroad.
 */
function unplaceable(applicants: Applicant[]) {
  return applicants.filter((a) => !CITY_POS[a.city])
}

type CityGroup = {
  key: string
  label: string
  department: string
  x: number
  y: number
  total: number
  submitted: number
  names: string[]
}

export default function ApplicantsMap({
  applicants,
  compact = false,
}: {
  applicants: Applicant[]
  /** Outline and markers only, sized for a corner of a dark band. No city list,
   *  no tooltips: at this size a hover target would be smaller than a finger. */
  compact?: boolean
}) {
  const { lang } = useLang()
  const [hovered, setHovered] = useState<string | null>(null)

  const groups = new Map<string, CityGroup>()
  for (const a of applicants) {
    const pos = CITY_POS[a.city]
    if (!pos) continue // a future city we have no coordinates for: omit rather than misplace
    const g = groups.get(a.city) ?? {
      key: a.city,
      label: pos.label,
      department: a.department,
      x: pos.x,
      y: pos.y,
      total: 0,
      submitted: 0,
      names: [],
    }
    g.total++
    if (a.essay) {
      g.submitted++
      g.names.push(a.name)
    }
    groups.set(a.city, g)
  }
  const cities = [...groups.values()].sort((a, b) => b.total - a.total)
  if (cities.length === 0) return null
  const offMap = unplaceable(applicants)

  if (compact) {
    return (
      <div className="w-28 sm:w-32 shrink-0">
        <svg
          viewBox="0 0 600 831"
          role="img"
          aria-label={
            lang === "es"
              ? `Mapa de Colombia, ${applicants.length - offMap.length} candidatos ubicados`
              : `Map of Colombia, ${applicants.length - offMap.length} candidates placed`
          }
          className="w-full h-auto"
        >
          {/* Inverted for the navy band: the light fill carries the shape and a
              translucent white edge replaces the navy stroke, which would be
              invisible against it. */}
          <path
            d={COLOMBIA_PATH}
            fill="rgba(255,255,255,0.10)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {cities.map((c) => (
            <circle
              key={c.key}
              cx={c.x}
              cy={c.y}
              // Fixed radius: at this scale the 13/17 split reads as noise, and
              // the count is unreadable anyway, so the label is dropped.
              r={c.total > 1 ? 30 : 22}
              fill={c.submitted > 0 ? "var(--color-cobalt)" : "rgba(255,255,255,0.35)"}
              stroke="white"
              strokeWidth="5"
            />
          ))}
        </svg>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
      <div className="order-2 md:order-1">
      <ul className="divide-y divide-ink/10 border-y border-ink/10">
        {cities.map((c) => (
          <li key={c.key}>
            <button
              type="button"
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c.key)}
              onBlur={() => setHovered(null)}
              className={`w-full flex items-baseline justify-between gap-4 py-3 px-2 text-left transition-colors duration-200 cursor-default ${
                hovered === c.key ? "bg-surface-soft" : ""
              }`}
            >
              <span className="text-body font-semibold text-primary shrink-0">
                {c.label}
                <span className="text-meta uppercase tracking-widest text-muted font-normal ml-3">
                  {c.department}
                </span>
              </span>
              <span className="text-meta text-muted text-right tabular-nums">
                {lang === "es"
                  ? `${c.total} candidato${c.total === 1 ? "" : "s"} · ${c.submitted} con ensayo`
                  : `${c.total} candidate${c.total === 1 ? "" : "s"} · ${c.submitted} submitted`}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {offMap.length > 0 && (
        <p className="text-meta text-muted mt-3">
          {lang === "es"
            ? `No ubicados en el mapa: ${offMap.map((a) => a.name).join(", ")}.`
            : `Not placed on the map: ${offMap.map((a) => a.name).join(", ")}.`}
        </p>
      )}
      </div>

      <div className="relative max-w-sm mx-auto w-full order-1 md:order-2">
        <svg
          viewBox="0 0 600 831"
          role="img"
          aria-label={
            lang === "es"
              ? "Mapa de Colombia con las ciudades de origen de los candidatos"
              : "Map of Colombia showing where the candidates come from"
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
          {cities.map((c) => {
            const active = hovered === c.key
            const r = (c.total > 1 ? 17 : 13) + (active ? 3 : 0)
            return (
              <g
                key={c.key}
                onMouseEnter={() => setHovered(c.key)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={r}
                  fill={c.submitted > 0 ? "var(--color-cobalt)" : "var(--color-muted)"}
                  stroke="white"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                <text
                  x={c.x}
                  y={c.y + 5.5}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="white"
                  className="tabular-nums pointer-events-none"
                >
                  {c.total}
                </text>
                <circle cx={c.x} cy={c.y} r="26" fill="transparent" />
              </g>
            )
          })}
        </svg>

        {cities
          .filter((c) => c.key === hovered)
          .map((c) => (
            <div
              key={c.key}
              role="status"
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{ left: `${(c.x / 600) * 100}%`, top: `${(c.y / 831) * 100 - 3}%` }}
            >
              <div className="bg-primary text-primary-foreground rounded-sm px-4 py-3 shadow-lg whitespace-nowrap">
                <div className="text-meta uppercase tracking-widest text-primary-foreground/60">
                  {c.label} · {c.department}
                </div>
                <div className="text-body font-semibold mt-1">
                  {c.names.length > 0
                    ? c.names.join(" · ")
                    : lang === "es"
                      ? "Sin ensayos todavía"
                      : "No essays yet"}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
