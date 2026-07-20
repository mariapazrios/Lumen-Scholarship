import type { L } from "../lib/i18n"

export type TeamMember = {
  slug: string
  name: string
  /** Shows a "Founder" badge next to the name */
  founder?: boolean
  org: L
  /** Industry tag shown on the card */
  industry: L
  /** Career and academic credentials, shown as a meta line */
  credentials: string[]
  /** How they describe their interview style and focus */
  interviewStyle: L
}

/** The Lumen Board of Admissions, alphabetical by last name. */
export const BOARD: TeamMember[] = [
  {
    slug: "oscar-cabrera",
    name: "Oscar Cabrera",
    org: { en: "Former President, BBVA Colombia", es: "Expresidente, BBVA Colombia" },
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Universidad Complutense de Madrid", "BBVA"],
    interviewStyle: {
      en: "Calm and structured. He explores how candidates reason through decisions, looking for judgment and discipline beyond the numbers.",
      es: "Tranquilo y estructurado. Explora cómo razonan los candidatos al tomar decisiones, buscando criterio y disciplina más allá de los números.",
    },
  },
  {
    slug: "cipriano-echavarria",
    name: "Cipriano Echavarría",
    org: { en: "Founder & CEO, Palomma", es: "Fundador y CEO, Palomma" },
    industry: { en: "Technology", es: "Tecnología" },
    credentials: ["Duke University", "Morgan Stanley", "Y Combinator", "Forbes 30 Under 30"],
    interviewStyle: {
      en: "Fast-moving and curious. He digs into what candidates have built or taught themselves, looking for initiative and rigor in analytical thinking.",
      es: "Ágil y curioso. Indaga en lo que los candidatos han construido o aprendido por su cuenta, buscando iniciativa y rigor en el pensamiento analítico.",
    },
  },
  {
    slug: "mateo-mendoza",
    name: "Mateo Mendoza",
    org: { en: "Founder & Partner, Mendoza Abogados", es: "Fundador y Socio, Mendoza Abogados" },
    industry: { en: "Law", es: "Derecho" },
    credentials: ["Universidad de los Andes", "NYU", "Allen & Overy"],
    interviewStyle: {
      en: "Socratic. He presses gently on how candidates argue and defend a position, looking for clarity of thought and integrity under pressure.",
      es: "Socrático. Examina con calma cómo los candidatos argumentan y defienden una postura, buscando claridad de pensamiento e integridad bajo presión.",
    },
  },
  {
    slug: "maria-paz-rios",
    name: "Maria Paz Rios",
    founder: true,
    org: { en: "Chief of Staff, Sequence Holdings", es: "Chief of Staff, Sequence Holdings" },
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Duke University", "Goldman Sachs", "Blackstone", "Sequence Holdings"],
    interviewStyle: {
      en: "A conversation, not an interrogation. She asks candidates to tell their story from the beginning and listens for resilience, ambition, and honesty about setbacks.",
      es: "Una conversación, no un interrogatorio. Pide a los candidatos contar su historia desde el principio y presta atención a la resiliencia, la ambición y la honestidad frente a los tropiezos.",
    },
  },
  {
    slug: "lola-sanchez",
    name: "Lola Sanchez",
    org: { en: "Associate Principal, Bold Charter School", es: "Subdirectora, Bold Charter School" },
    industry: { en: "Education", es: "Educación" },
    credentials: ["Duke University", "Teach For America", "Bold Charter School", "Regis High School"],
    interviewStyle: {
      en: "Warm and reflective. She asks about moments of failure and feedback, looking for self-awareness and a genuine love of learning.",
      es: "Cálida y reflexiva. Pregunta por momentos de fracaso y retroalimentación, buscando autoconocimiento y un amor genuino por aprender.",
    },
  },
  {
    slug: "christopher-weisz",
    name: "Christopher Weisz",
    org: { en: "Managing Director & Partner, BCG", es: "Managing Director y Socio, BCG" },
    industry: { en: "Technology / Consulting", es: "Tecnología / Consultoría" },
    credentials: ["Georgetown University", "Boston Consulting Group"],
    interviewStyle: {
      en: "Big-picture. He explores how candidates connect their goals to the world around them, looking for adaptability and rigor in analytical thinking.",
      es: "De visión amplia. Explora cómo los candidatos conectan sus metas con el mundo que los rodea, buscando adaptabilidad y rigor en el pensamiento analítico.",
    },
  },
]
