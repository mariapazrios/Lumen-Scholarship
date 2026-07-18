import type { L } from "../lib/i18n"

export type TeamMember = {
  slug: string
  name: string
  role: L
  org: L
  city: string
  /** Industry tag shown on the card */
  industry: L
  /** Career and academic credentials, shown as a meta line */
  credentials: string[]
}

/** The Lumen Board of Admissions: backgrounds in finance, corporate law, consulting, innovation, and education. */
export const BOARD: TeamMember[] = [
  {
    slug: "maria-paz-rios",
    name: "Maria Paz Rios",
    role: { en: "Lumen Founder", es: "Fundadora de Lumen" },
    org: { en: "Chief of Staff, Sequence Holdings", es: "Chief of Staff, Sequence Holdings" },
    city: "New York",
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Duke University", "Goldman Sachs", "Blackstone"],
  },
  {
    slug: "oscar-cabrera",
    name: "Oscar Cabrera",
    role: { en: "Board Member", es: "Miembro de la Junta" },
    org: { en: "Former President, BBVA Colombia", es: "Expresidente, BBVA Colombia" },
    city: "Madrid",
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Universidad Complutense de Madrid", "BBVA"],
  },
  {
    slug: "cipriano-echavarria",
    name: "Cipriano Echavarría",
    role: { en: "Board Member", es: "Miembro de la Junta" },
    org: { en: "Founder & CEO, Palomma", es: "Fundador y CEO, Palomma" },
    city: "Medellín",
    industry: { en: "Technology", es: "Tecnología" },
    credentials: ["Duke University", "Morgan Stanley", "Y Combinator", "Forbes 30 Under 30"],
  },
  {
    slug: "mateo-mendoza",
    name: "Mateo Mendoza",
    role: { en: "Board Member", es: "Miembro de la Junta" },
    org: { en: "Founder & Partner, Mendoza Abogados", es: "Fundador y Socio, Mendoza Abogados" },
    city: "Bogotá",
    industry: { en: "Law", es: "Derecho" },
    credentials: ["Universidad de los Andes", "NYU", "Allen & Overy"],
  },
  {
    slug: "lola-sanchez",
    name: "Lola Sanchez",
    role: { en: "Board Member", es: "Miembro de la Junta" },
    org: { en: "Associate Principal, Bold Charter School", es: "Subdirectora, Bold Charter School" },
    city: "New York",
    industry: { en: "Education", es: "Educación" },
    credentials: ["Duke University", "Teach For America", "Bold Charter School"],
  },
  {
    slug: "christopher-weisz",
    name: "Christopher Weisz",
    role: { en: "Board Member", es: "Miembro de la Junta" },
    org: { en: "Managing Director & Partner, BCG", es: "Managing Director y Socio, BCG" },
    city: "Bogotá",
    industry: { en: "Technology / Consulting", es: "Tecnología / Consultoría" },
    credentials: ["Georgetown University", "Boston Consulting Group"],
  },
]
