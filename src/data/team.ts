import type { L } from "../lib/i18n"

export type TeamMember = {
  slug: string
  name: string
  /** Shows a "Founder" badge next to the name */
  founder?: boolean
  org: L
  /** Where they are based */
  city: string
  /** Industry tag shown on the card */
  industry: L
  /** Career and academic credentials, shown as a meta line */
  credentials: string[]
  /**
   * What each board member says Lumen means to them, in their own words.
   * These are quotes: the English is what they wrote, and the Spanish is a
   * translation of it. Do not rewrite them into house voice.
   */
  highlight: L
}

/** The Lumen Board of Admissions, alphabetical by last name. */
export const BOARD: TeamMember[] = [
  {
    slug: "oscar-cabrera",
    name: "Oscar Cabrera",
    org: { en: "Former President, BBVA Colombia", es: "Expresidente, BBVA Colombia" },
    city: "Madrid",
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Universidad Complutense de Madrid", "BBVA"],
    highlight: {
      en: "Contributing to a powerful movement for a fairer, more just world.",
      es: "Contribuir a un movimiento poderoso por un mundo más justo y equitativo.",
    },
  },
  {
    slug: "cipriano-echavarria",
    name: "Cipriano Echavarría",
    org: { en: "Founder & CEO, Palomma", es: "Fundador y CEO, Palomma" },
    city: "Bogotá",
    industry: { en: "Technology", es: "Tecnología" },
    credentials: ["Duke University", "Morgan Stanley", "Y Combinator", "Forbes 30 Under 30"],
    highlight: {
      en: "My favorite part of Lumen has been being able to inspire members to take entrepreneurial projects while they continue their education. Lumen on itself significantly changes the outcomes of its members, but it makes me happy to instill in them an entrepreneurial mind to hopefully foster more builders in the long run.",
      es: "Mi parte favorita de Lumen ha sido poder inspirar a sus miembros a emprender proyectos mientras siguen estudiando. Lumen por sí solo cambia significativamente el futuro de sus miembros, pero me alegra sembrar en ellos una mentalidad emprendedora, con la esperanza de formar más constructores a largo plazo.",
    },
  },
  {
    slug: "mateo-mendoza",
    name: "Mateo Mendoza",
    org: { en: "Founder & Partner, Mendoza Abogados", es: "Fundador y Socio, Mendoza Abogados" },
    city: "Bogotá",
    industry: { en: "Law", es: "Derecho" },
    credentials: ["Universidad de los Andes", "NYU", "Allen & Overy"],
    highlight: {
      en: "Serving on Lumen's board has reinforced my belief that the greatest investment I can make is in the hearts, minds, and character of the next generation. It is a privilege to support this mission under exceptional leadership, but above all, to walk alongside students whose stories would inspire anyone, knowing that the impact will extend far beyond them, to their families and the communities they aspire to shape.",
      es: "Estar en la junta de Lumen ha reforzado mi convicción de que la mayor inversión que puedo hacer es en el corazón, la mente y el carácter de la próxima generación. Es un privilegio apoyar esta misión bajo un liderazgo excepcional, pero sobre todo caminar al lado de estudiantes cuyas historias inspirarían a cualquiera, sabiendo que el impacto irá mucho más allá de ellos, hasta sus familias y las comunidades que aspiran a transformar.",
    },
  },
  {
    slug: "maria-paz-rios",
    name: "Maria Paz Rios",
    founder: true,
    org: { en: "Chief of Staff, Sequence Holdings", es: "Chief of Staff, Sequence Holdings" },
    city: "New York City",
    industry: { en: "Finance", es: "Finanzas" },
    credentials: ["Duke University", "Goldman Sachs", "Blackstone", "Sequence Holdings"],
    highlight: {
      en: "The talent has always been here. What Lumen adds is someone willing to go find it, stay with it for five years, and put it in rooms that were closed to it. Judge us in ten years, by what these students are running.",
      es: "El talento siempre ha estado aquí. Lo que Lumen agrega es alguien dispuesto a ir a buscarlo, a acompañarlo durante cinco años y a ponerlo en salas que le estaban cerradas. Júzguennos en diez años, por lo que estos estudiantes estén dirigiendo.",
    },
  },
  {
    slug: "lola-sanchez",
    name: "Lola Sanchez",
    org: { en: "High School Teacher, Regis High School", es: "Profesora de bachillerato, Regis High School" },
    city: "New York City",
    industry: { en: "Education", es: "Educación" },
    credentials: ["Duke University", "Teach For America", "Bold Charter School", "Regis High School"],
    highlight: {
      en: "As an educator, there is no greater joy than hearing someone speak passionately about learning. Lumen students are hungry to learn and to take on the world, and I come out of every interview rethinking how I see things. Alongside talent and access, the program looks for students who are motivated to build a better Colombia.",
      es: "Como educadora, no hay alegría más grande que escuchar a alguien hablar con pasión sobre aprender. Los estudiantes Lumen tienen hambre de aprender y de comerse el mundo, y salgo de cada entrevista replanteándome cómo veo las cosas. Además del talento y del acceso, el programa busca estudiantes motivados a construir una Colombia mejor.",
    },
  },
  {
    slug: "christopher-weisz",
    name: "Christopher Weisz",
    org: { en: "Managing Director & Partner, BCG", es: "Managing Director y Socio, BCG" },
    city: "Bogotá",
    industry: { en: "Technology / Consulting", es: "Tecnología / Consultoría" },
    credentials: ["Georgetown University", "Boston Consulting Group"],
    highlight: {
      en: "Lumen creates a beautiful relationship that allows us to share our experience and help shape the next generation of leaders while learning even more from them!",
      es: "¡Lumen crea una relación hermosa que nos permite compartir nuestra experiencia y ayudar a formar a la próxima generación de líderes, mientras aprendemos aún más de ellos!",
    },
  },
]
