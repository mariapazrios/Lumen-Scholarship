import type { L } from "../lib/i18n"

/**
 * Placeholder applicants for the portal prototype.
 *
 * These are invented. Real submissions arrive at hq@lumenedu.org and must not
 * be published to a static host: any file in this project is fetchable by URL
 * with no gate. Swap this list for the live feed once submissions are served
 * through authenticated routes.
 */
/**
 * Academic and household fields, matching the columns Uniandes sends in
 * "Convocatoria LUMEN.xlsx". Saber 11 is the global score out of 500; the five
 * components are out of 100 each.
 */
export type AcademicRecord = {
  age: number
  estrato: number
  siblings: string
  housing: L
  sisben: string
  school: string
  schoolType: L
  graduated: string
  saber11: number
  plc: number
  pma: number
  psc: number
  pcn: number
  pin: number
}

export type SampleApplicant = {
  slug: string
  label: string
  major: L
  city: string
  /** Colombian department, used by the board filters */
  department: string
  gender: "M" | "F"
  prompt: L
  /** Spanish is the language of submission, so it is shown verbatim */
  essay: L
  shortAnswers: Array<{ q: L; a: L }>
  academic: AcademicRecord
}

const HOUSING = {
  family: { en: "Family owned", es: "Familiar" },
  rented: { en: "Rented", es: "Arrendada" },
  owned: { en: "Owned", es: "Propia" },
} as const

const SCHOOL_TYPE = {
  public: { en: "Public", es: "Público" },
  private: { en: "Private", es: "Privado" },
} as const

export const SAMPLE_APPLICANTS: SampleApplicant[] = [
  {
    slug: "applicant-a",
    label: "Applicant A",
    major: { en: "Systems Engineering", es: "Ingeniería de Sistemas" },
    city: "Sincelejo",
    department: "Sucre",
    gender: "M",
    prompt: { en: "Obstacles and lessons", es: "Obstáculos y lecciones" },
    essay: {
      en: "The workshop behind our house was where I learned to take things apart. My father repaired refrigerators and I passed him tools until I was old enough to hold the meter myself. When he lost that work, the tools stayed and the customers did not, and for two years the house ran on what my mother earned sewing. I kept taking things apart anyway, because it was the only thing that made the waiting bearable.\n\nSchool was where I found out that the taking apart had a name. A teacher lent me a laptop with a broken hinge and I taught myself to write small programs on it, mostly badly. By eleventh grade I was the person classmates came to when a phone stopped working, and I had started charging a little, which is how I paid for the exam fees. I want to study systems engineering because I would like to build the tools instead of only repairing them, and because I would like my father to see it.",
      es: "El taller detrás de nuestra casa fue donde aprendí a desarmar cosas. Mi papá reparaba refrigeradores y yo le pasaba las herramientas hasta que tuve edad para sostener el multímetro. Cuando perdió ese trabajo, las herramientas se quedaron y los clientes no, y por dos años la casa funcionó con lo que mi mamá ganaba cosiendo. Seguí desarmando cosas igual, porque era lo único que hacía tolerable la espera.\n\nEn el colegio descubrí que eso de desarmar tenía un nombre. Un profesor me prestó un portátil con la bisagra rota y aprendí solo a escribir programas pequeños, casi todos malos. Para grado once era la persona a la que acudían mis compañeros cuando se les dañaba el celular, y ya cobraba un poco, que fue como pagué los derechos del examen. Quiero estudiar ingeniería de sistemas porque me gustaría construir las herramientas y no solo repararlas, y porque me gustaría que mi papá lo viera.",
    },
    shortAnswers: [
      {
        q: { en: "Who am I?", es: "¿Quién soy?" },
        a: {
          en: "The one who opens the machine before asking whether it can be fixed.",
          es: "El que abre la máquina antes de preguntar si tiene arreglo.",
        },
      },
      {
        q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
        a: {
          en: "An engineer whose work reaches the towns that never get the new thing first.",
          es: "Un ingeniero cuyo trabajo llegue a los pueblos que nunca reciben lo nuevo primero.",
        },
      },
    ],
    academic: {
      age: 18,
      estrato: 2,
      siblings: "2",
      housing: HOUSING.rented,
      sisben: "A5",
      school: "I.E. Normal Superior de Sincelejo",
      schoolType: SCHOOL_TYPE.public,
      graduated: "2025-11-28",
      saber11: 391,
      plc: 78,
      pma: 84,
      psc: 76,
      pcn: 79,
      pin: 74,
    },
  },
  {
    slug: "applicant-b",
    label: "Applicant B",
    major: { en: "Economics", es: "Economía" },
    city: "Pasto",
    department: "Nariño",
    gender: "F",
    prompt: { en: "A significant context", es: "Un contexto significativo" },
    essay: {
      en: "My grandmother has sold potatoes at the same market stall for thirty-one years and has never once written down a price. She holds the whole book in her head: what she paid, what the truck charged, what the woman two stalls down is asking, what a customer can be persuaded to pay on a Tuesday. When I was fourteen I started keeping her accounts in a notebook, and within a month I understood that she was losing money on the days she felt most generous.\n\nShowing her the numbers was harder than adding them. She did not want to be told that kindness had a cost, and she was not entirely wrong, because the neighbours she fed on credit are the same ones who covered her stall when she was ill. What I learned from that argument is that an economy is not only what is efficient, it is also what people owe each other and choose to honour. I want to study economics to understand that second part properly, since the first part is already well documented.",
      es: "Mi abuela ha vendido papa en el mismo puesto del mercado durante treinta y un años y nunca ha anotado un precio. Lleva el libro completo en la cabeza: lo que pagó, lo que le cobró el camión, lo que pide la señora de dos puestos más allá, lo que se le puede sacar a un cliente un martes. A los catorce empecé a llevarle las cuentas en un cuaderno, y en un mes entendí que perdía dinero los días en que se sentía más generosa.\n\nMostrarle los números fue más difícil que sumarlos. No quería que le dijeran que la bondad tenía un costo, y no estaba del todo equivocada, porque los vecinos a los que les daba comida a crédito son los mismos que le cuidaron el puesto cuando se enfermó. Lo que aprendí de esa discusión es que una economía no es solo lo eficiente: también es lo que la gente se debe y decide honrar. Quiero estudiar economía para entender bien esa segunda parte, porque la primera ya está bastante documentada.",
    },
    shortAnswers: [
      {
        q: { en: "Who am I?", es: "¿Quién soy?" },
        a: {
          en: "The bookkeeper of a stall that never needed one, and the granddaughter who argued anyway.",
          es: "La contadora de un puesto que nunca necesitó una, y la nieta que discutió de todas formas.",
        },
      },
      {
        q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
        a: {
          en: "Someone who writes policy that survives contact with a real market.",
          es: "Alguien que escriba política que sobreviva al contacto con un mercado real.",
        },
      },
    ],
    academic: {
      age: 18,
      estrato: 2,
      siblings: "1",
      housing: HOUSING.family,
      sisben: "A5",
      school: "I.E.M. Ciudad de Pasto",
      schoolType: SCHOOL_TYPE.public,
      graduated: "2025-11-27",
      saber11: 398,
      plc: 86,
      pma: 80,
      psc: 88,
      pcn: 76,
      pin: 72,
    },
  },
  {
    slug: "applicant-c",
    label: "Applicant C",
    major: { en: "Chemistry", es: "Química" },
    city: "Quibdó",
    department: "Chocó",
    gender: "F",
    prompt: { en: "A societally consequential force", es: "Una fuerza de consecuencias sociales" },
    essay: {
      en: "The river that runs past my school is the colour of milky tea and has been for as long as I can remember. Upstream there is mining, and downstream there is us, and between the two there is a mercury problem that everybody discusses and nobody measures. In tenth grade a visiting teacher showed us how to test water for turbidity with a jar and a torch, and we started keeping a log. It was not laboratory work. It was enough to show that the river got worse on the days the machines ran.\n\nWhat I have come to think is that the force that will shape my region is not the mining itself but who gets to hold the evidence. Right now the people who can afford instruments are the ones being measured, and the people being poisoned are the ones with the jars. I want to study chemistry because the gap between a jar and a laboratory is a gap I can actually close, and because I would rather come back with the instruments than write about the problem from somewhere else.",
      es: "El río que pasa junto a mi colegio tiene el color del té con leche desde que tengo memoria. Aguas arriba hay minería y aguas abajo estamos nosotros, y entre las dos cosas hay un problema de mercurio que todos comentan y nadie mide. En grado décimo un profesor visitante nos enseñó a medir la turbidez del agua con un frasco y una linterna, y empezamos a llevar un registro. No era trabajo de laboratorio. Bastaba para mostrar que el río empeoraba los días en que funcionaban las máquinas.\n\nHe llegado a pensar que la fuerza que definirá mi región no es la minería en sí, sino quién puede sostener la evidencia. Hoy los que pueden pagar instrumentos son los que están siendo medidos, y los que están siendo envenenados son los que tienen los frascos. Quiero estudiar química porque la distancia entre un frasco y un laboratorio sí la puedo cerrar, y porque preferiría volver con los instrumentos antes que escribir sobre el problema desde otro lugar.",
    },
    shortAnswers: [
      {
        q: { en: "Who am I?", es: "¿Quién soy?" },
        a: {
          en: "The student with the jar, keeping a log nobody asked for.",
          es: "La estudiante del frasco, llevando un registro que nadie pidió.",
        },
      },
      {
        q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
        a: {
          en: "The chemist who brings the instruments back to the river.",
          es: "La química que lleve los instrumentos de vuelta al río.",
        },
      },
    ],
    academic: {
      age: 17,
      estrato: 1,
      siblings: "4+",
      housing: HOUSING.family,
      sisben: "A2",
      school: "I.E. Armando Luna Roa",
      schoolType: SCHOOL_TYPE.public,
      graduated: "2025-12-02",
      saber11: 382,
      plc: 80,
      pma: 74,
      psc: 78,
      pcn: 84,
      pin: 66,
    },
  },
  {
    slug: "applicant-d",
    label: "Applicant D",
    major: { en: "Electronic Engineering", es: "Ingeniería Electrónica" },
    city: "Villavicencio",
    department: "Meta",
    gender: "M",
    prompt: { en: "Questioning a belief", es: "Cuestionar una creencia" },
    essay: {
      en: "I was raised on the idea that a man provides and does not explain himself. My uncle raised four children on that principle and it worked, in the sense that they ate. It stopped working when my cousin needed help he could not ask for, and the family found out afterwards rather than in time. I was sixteen and I decided that the rule was not strength, it was a way of not being known.\n\nSaying so out loud cost me a year of being the difficult one at family lunches. What I did not expect was that my uncle would come around, slowly, in the form of phone calls that started with nothing in particular. I learned that changing someone's mind is not an argument you win, it is a door you leave open longer than is comfortable. I am going into engineering, which is a field with its own version of that rule, where you are supposed to already know. I intend to be the one who asks.",
      es: "Me criaron con la idea de que un hombre provee y no da explicaciones. Mi tío crió cuatro hijos con ese principio y funcionó, en el sentido de que comieron. Dejó de funcionar cuando mi primo necesitó una ayuda que no supo pedir, y la familia se enteró después en vez de a tiempo. Yo tenía dieciséis años y decidí que esa regla no era fortaleza: era una manera de no dejarse conocer.\n\nDecirlo en voz alta me costó un año de ser el difícil en los almuerzos familiares. Lo que no esperaba era que mi tío fuera cediendo, despacio, en forma de llamadas que empezaban sin ningún motivo. Aprendí que cambiarle la cabeza a alguien no es una discusión que se gana: es una puerta que se deja abierta más tiempo del que resulta cómodo. Voy a estudiar ingeniería, un campo con su propia versión de esa regla, donde se supone que uno ya sabe. Pienso ser el que pregunta.",
    },
    shortAnswers: [
      {
        q: { en: "Who am I?", es: "¿Quién soy?" },
        a: {
          en: "The difficult one at lunch, who turned out to be right and kept calling anyway.",
          es: "El difícil del almuerzo, que resultó tener razón y siguió llamando igual.",
        },
      },
      {
        q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
        a: {
          en: "An engineer who says out loud when he does not know something yet.",
          es: "Un ingeniero que diga en voz alta cuando todavía no sabe algo.",
        },
      },
    ],
    academic: {
      age: 19,
      estrato: 3,
      siblings: "1",
      housing: HOUSING.owned,
      sisben: "0",
      school: "Col. Departamental La Esperanza",
      schoolType: SCHOOL_TYPE.public,
      graduated: "2024-11-30",
      saber11: 375,
      plc: 74,
      pma: 76,
      psc: 72,
      pcn: 75,
      pin: 70,
    },
  },
  {
    slug: "applicant-e",
    label: "Applicant E",
    major: { en: "Data Science", es: "Ciencia de Datos" },
    city: "Bogotá",
    department: "Bogotá D.C.",
    gender: "F",
    prompt: { en: "Obstacles and lessons", es: "Obstáculos y lecciones" },
    essay: {
      en: "For three years I got up at four to be at the bakery before the ovens, and then went to school smelling of bread. My mother had taken the night shift at a warehouse and one of us had to be there when the dough was ready. I do not want to describe this as a hardship, because the bakery is also where I learned to work with people twice my age who took me seriously.\n\nWhat it cost me was mathematics. I fell behind in tenth grade and decided the subject was simply not mine, which is the most expensive conclusion I have ever reached. A teacher disagreed and gave me the same problem set every week until I stopped believing it. I want to study data science because the thing I was worst at turned out to be the thing I was only untaught in, and I would like to spend my career on that difference.",
      es: "Durante tres años me levanté a las cuatro para llegar a la panadería antes de los hornos, y después iba al colegio con olor a pan. Mi mamá había tomado el turno de la noche en una bodega y alguno de los dos tenía que estar cuando la masa estuviera lista. No quiero describir esto como una dureza, porque la panadería también fue donde aprendí a trabajar con gente que me doblaba la edad y me tomaba en serio.\n\nLo que me costó fue las matemáticas. Me atrasé en grado décimo y decidí que la materia simplemente no era para mí, que es la conclusión más cara a la que he llegado. Una profesora no estuvo de acuerdo y me dio el mismo taller cada semana hasta que dejé de creerlo. Quiero estudiar ciencia de datos porque aquello en lo que era peor resultó ser solo aquello que nadie me había enseñado, y me gustaría dedicar mi carrera a esa diferencia.",
    },
    shortAnswers: [
      {
        q: { en: "Who am I?", es: "¿Quién soy?" },
        a: {
          en: "The girl who smelled of bread in class and stopped apologising for it.",
          es: "La niña que olía a pan en clase y dejó de disculparse por eso.",
        },
      },
      {
        q: { en: "Who do I want to be?", es: "¿Quién quiero ser?" },
        a: {
          en: "Someone who proves that being behind is not the same as being unable.",
          es: "Alguien que demuestre que estar atrasada no es lo mismo que no poder.",
        },
      },
    ],
    academic: {
      age: 18,
      estrato: 2,
      siblings: "0",
      housing: HOUSING.rented,
      sisben: "B1",
      school: "Col. Nacional Nicolás Esguerra",
      schoolType: SCHOOL_TYPE.public,
      graduated: "2025-11-28",
      saber11: 386,
      plc: 82,
      pma: 70,
      psc: 80,
      pcn: 78,
      pin: 76,
    },
  },
]
