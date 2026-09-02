import type { L } from "../lib/i18n"

/**
 * Board member responsible for each scholar. First names on the chips match
 * how the board talks about each other.
 */
export const SCHOLAR_DRI: Record<string, string> = {
  "juan-angel-aicardy": "christopher-weisz",
  "daniel-alzate": "christopher-weisz",
  "juan-pablo-contreras": "lola-sanchez",
  "mateo-arcila": "mateo-mendoza",
  "julian-rodriguez": "cipriano-echavarria",
  "sebastian-martinez": "mateo-mendoza",
  "santiago-rubiano": "cipriano-echavarria",
  "juan-daniel-gonzalo": "oscar-cabrera",
  "valerie-suarez": "oscar-cabrera",
  "valentina-salgado": "lola-sanchez",
}

/** Filter order, and the short name on chips. */
export const DRI_FILTERS: Array<{ slug: string; short: L }> = [
  { slug: "christopher-weisz", short: { en: "Chris", es: "Chris" } },
  { slug: "lola-sanchez", short: { en: "Lola", es: "Lola" } },
  { slug: "mateo-mendoza", short: { en: "Mateo", es: "Mateo" } },
  { slug: "cipriano-echavarria", short: { en: "Cipriano", es: "Cipriano" } },
  { slug: "oscar-cabrera", short: { en: "Oscar", es: "Oscar" } },
]

export function driOf(scholarSlug: string): string | null {
  return SCHOLAR_DRI[scholarSlug] ?? null
}

export function driShort(boardSlug: string): L | null {
  return DRI_FILTERS.find((d) => d.slug === boardSlug)?.short ?? null
}
