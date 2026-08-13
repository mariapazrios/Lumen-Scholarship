import Reveal from "./primitives/Reveal"
import Tricolor from "./primitives/Tricolor"
import { useLang, type L } from "../lib/i18n"

/**
 * The case for sponsoring, in three numbers: how narrow the completed cycles
 * are, what they scored coming in, and how they perform once they are here.
 *
 * Denominator is applications to Los Andes across the two generations already
 * selected (2024-10 and 2025-10). 2026-20 is still in process.
 */
const PROOF: Array<{ value: L; label: L; sub: L }> = [
  {
    value: { en: "0.09%", es: "0,09%" },
    label: { en: "Acceptance rate", es: "Tasa de admisión" },
    sub: { en: "11 selected from 12,088", es: "11 seleccionados de 12.088" },
  },
  {
    value: { en: "Top 1%", es: "Top 1%" },
    label: { en: "National ICFES exam", es: "Examen ICFES nacional" },
    sub: { en: "Every Lumen, both generations", es: "Todos los Lumens, ambas generaciones" },
  },
  {
    value: { en: "+10%", es: "+10%" },
    label: { en: "GPA above the Andes average", es: "Promedio por encima de Los Andes" },
    sub: { en: "4.3 against 3.9", es: "4.3 frente a 3.9" },
  },
]

export default function ProofBand() {
  const { t } = useLang()
  return (
    <section className="bg-surface">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14">
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink/15">
            {PROOF.map((p) => (
              <div key={p.label.en} className="py-5 sm:py-0 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <Tricolor className="w-7 h-[3px] mb-5" />
                <div className="text-stat font-bold text-primary tabular-nums leading-none">
                  {t(p.value)}
                </div>
                <div className="text-body font-semibold uppercase tracking-wide text-primary mt-4">
                  {t(p.label)}
                </div>
                <div className="text-meta text-muted mt-2 tabular-nums">{t(p.sub)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
