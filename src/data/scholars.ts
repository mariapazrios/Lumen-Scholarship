import type { L, LList } from "../lib/i18n"

export type Scholar = {
  slug: string
  /** Display name, as used across Lumen materials */
  name: string
  generation: "2024" | "2025"
  major: L
  hometown: string
  department: string
  /** One-breath bio for hover cards and the pop-up summary */
  short: L
  /** Signature quote, from the annual reports */
  quote: L
  /** Longer narrative, condensed from the annual reports */
  story: LList
  /** Campus involvement and achievements */
  highlights: LList
}

/** Alphabetical by last name: the order the directory and generation rows render in. */
export const SCHOLARS: Scholar[] = [
  {
    slug: "juan-angel-aicardy",
    name: "Juan Ángel Aicardy",
    generation: "2024",
    major: { en: "Systems & Computing Engineering", es: "Ingeniería de Sistemas y Computación" },
    hometown: "Montería",
    department: "Córdoba",
    short: {
      en: "Juan Ángel's fascination with computing began in a Montería primary school, and his grandmothers convinced him that Los Andes was within reach. His goal now: research at a leading technology company.",
      es: "La fascinación de Juan Ángel por la computación nació en una primaria de Montería, y sus abuelas lo convencieron de que Los Andes estaba a su alcance. Su meta ahora: investigar en una gran empresa de tecnología.",
    },
    quote: {
      en: "Lumen has opened my eyes to the possibilities life can offer. Being part of the program is a privilege, because I can count on a group of people who understand our needs and care about our well-being.",
      es: "Lumen me ha permitido abrir los ojos respecto a las posibilidades que te puede ofrecer la vida. Ser parte del programa es un privilegio porque sé que puedo contar con un grupo de personas que entiende nuestras necesidades y se preocupa por nuestro bienestar.",
    },
    story: {
      en: [
        "Juan Ángel's grandmothers pushed him to apply to Los Andes and to seek the financial aid they insisted he deserved. His fascination with computing began in primary school in Montería; a turning point in high school taught him to value learning, and he has chased excellence ever since.",
        "At Los Andes he created Newt, a virtual 3D physics laboratory that simulates concepts like buoyancy and projectile motion, built so schools without lab budgets can still teach hands-on physics. It won best idea and best execution at ExpoAndes. His goal: research at a leading technology company.",
      ],
      es: [
        "Las abuelas de Juan Ángel lo animaron a aplicar a Los Andes y a buscar el apoyo financiero que, insistían, merecía. Su fascinación por la computación empezó en la primaria en Montería; un punto de inflexión en el colegio le enseñó a valorar el aprendizaje y desde entonces persigue la excelencia.",
        "En Los Andes creó Newt, un laboratorio virtual de física en 3D que simula conceptos como la flotabilidad y el movimiento parabólico, pensado para que colegios sin presupuesto de laboratorio puedan enseñar física práctica. Ganó mejor idea y mejor ejecución en ExpoAndes. Su meta: investigar en una gran empresa de tecnología.",
      ],
    },
    highlights: {
      en: [
        "Built Newt, a virtual physics lab; best idea and best execution at ExpoAndes",
        "Teaching assistant for two computer-science courses",
        "Second place, university wall-climbing tournament, and a lifelong violinist",
      ],
      es: [
        "Creó Newt, un laboratorio virtual de física; mejor idea y mejor ejecución en ExpoAndes",
        "Monitor de dos cursos de computación",
        "Segundo puesto en el torneo universitario de escalada, y violinista desde niño",
      ],
    },
  },
  {
    slug: "daniel-alzate",
    name: "Daniel Álzate",
    generation: "2025",
    major: { en: "Physics", es: "Física" },
    hometown: "Galapaga",
    department: "Atlántico",
    short: {
      en: "Daniel grew up on the Caribbean coast looking up at the sky, and physics gave that wonder a language. He dreams of NASA, and of one day opening the door to science for kids who grew up the way he did.",
      es: "Daniel creció en la costa Caribe mirando al cielo, y la física le dio un lenguaje a ese asombro. Sueña con la NASA y con abrirles algún día la puerta de la ciencia a los niños que crecieron como él.",
    },
    quote: {
      en: "Lumen is the opportunity I needed to fulfill my dreams, one I know will carry me toward what I aspire to as a human being, so I can support others in need.",
      es: "Lumen es la oportunidad que necesitaba para cumplir mis sueños y que sé que me llevará a lo que aspiro como ser humano, para apoyar a otros que lo necesiten.",
    },
    story: {
      en: [
        "Born in Barranquilla and raised in Galapaga, Daniel has been fascinated since childhood by the universe and the laws that govern it. He chose physics because he believes the world needs new generations working in science and technology to solve society's problems, hand in hand with human rights.",
        "His ambitions run from joining NASA and applying science to everyday human problems in medicine, the environment, and the economy, to founding a Colombian institution that helps low-income youth discover and access scientific education. He credits his parents' constant support, and the values they taught him, for making the journey possible.",
      ],
      es: [
        "Nacido en Barranquilla y criado en Galapaga, Daniel se ha sentido fascinado desde niño por el universo y las leyes que lo gobiernan. Eligió la física porque cree que el mundo necesita nuevas generaciones trabajando en ciencia y tecnología para resolver los problemas de la sociedad, de la mano de los derechos humanos.",
        "Sus ambiciones van desde llegar a la NASA y aplicar la ciencia a problemas humanos cotidianos en la medicina, el medio ambiente y la economía, hasta fundar una institución colombiana que ayude a jóvenes de bajos recursos a descubrir y acceder a la educación científica. Agradece el apoyo constante de sus padres y los valores que le enseñaron.",
      ],
    },
    highlights: {
      en: [
        "Ranks in the top 5% of the physics department",
        "Multi-instrumentalist: electric bass, piano, guitar, and percussion, and part of Los Andes's salsa band",
        "Trains daily: gym and fútbol, plus the dance rhythms of his Caribbean culture",
      ],
      es: [
        "Está en el 5% superior del departamento de física",
        "Multiinstrumentista: bajo eléctrico, piano, guitarra y percusión, y parte de la banda de salsa de Los Andes",
        "Entrena a diario: gimnasio y fútbol, además de los ritmos de su cultura caribeña",
      ],
    },
  },
  {
    slug: "mateo-arcila",
    name: "Mateo Arcila",
    generation: "2025",
    major: { en: "Economics", es: "Economía" },
    hometown: "Bogotá",
    department: "Bogotá D.C.",
    short: {
      en: "For Mateo, economics is a way of reading the world: markets, politics, ethics, and the problems nobody has solved yet. Ask him about university, and he will tell you about the people first.",
      es: "Para Mateo, la economía es una forma de leer el mundo: mercados, política, ética y los problemas que nadie ha resuelto todavía. Pregúntale por la universidad y te hablará primero de la gente.",
    },
    quote: {
      en: "The best way to thank Lumen for this opportunity is to show my commitment and give my best every day, always pursuing excellence, growing academically and personally.",
      es: "La mejor manera de agradecer al programa Lumen por esta oportunidad es mostrando mi compromiso y dando lo mejor cada día, buscando siempre la excelencia y desarrollándome académica y personalmente.",
    },
    story: {
      en: [
        "Mateo always wanted Los Andes for the prestige of its Economics faculty. He found Lumen through the financial aid process: pre-selected STEM-track finalists were invited to a virtual session on the program's purpose, and he applied on the spot.",
        "He loves how economics lets him read world events and frame economic, political, and ethical problems, then propose unbiased solutions. The most enriching part of university, he says, is the people: including his Lumen peers, \"incredible people, extremely intelligent, with an enormous ambition to prosper.\"",
      ],
      es: [
        "Mateo siempre quiso Los Andes por el prestigio de su facultad de Economía. Conoció Lumen a través del proceso de apoyo financiero: los finalistas preseleccionados fueron invitados a una sesión virtual sobre el propósito del programa, y aplicó de inmediato.",
        "Le encanta cómo la economía le permite leer los acontecimientos del mundo y plantear problemas económicos, políticos y éticos, para luego proponer soluciones sin sesgos. Lo más enriquecedor de la universidad, dice, es la gente: incluidos sus compañeros de Lumen, \"personas increíbles, demasiado inteligentes y con una ambición de prosperar descomunal\".",
      ],
    },
    highlights: {
      en: [
        "Highest cumulative GPA in the Lumen cohort",
        "Credits Lumen for \"a safe space of positive feedback\"",
      ],
      es: [
        "El promedio acumulado más alto de la cohorte Lumen",
        "Agradece a Lumen por \"un espacio seguro de retroalimentación positiva\"",
      ],
    },
  },
  {
    slug: "juan-pablo-contreras",
    name: "Pablo Contreras",
    generation: "2024",
    major: { en: "Economics & Industrial Engineering", es: "Economía e Ingeniería Industrial" },
    hometown: "Bogotá",
    department: "Bogotá D.C.",
    short: {
      en: "Pablo's high school had a path to only one university, so he charted his own to Los Andes. He studies economics for its social impact, and added industrial engineering because one lens wasn't enough.",
      es: "El colegio de Pablo tenía camino a una sola universidad, así que él trazó el suyo hacia Los Andes. Estudia economía por su impacto social, y sumó ingeniería industrial porque una sola mirada no le bastaba.",
    },
    quote: {
      en: "I'm the first in my family to go to university. My parents couldn't do it, so with Lumen I am in a process of discovery and building my life project. Thank you for believing in me.",
      es: "Soy el primero de mi familia en ir a la universidad. Mis papás no pudieron hacerlo, así que con Lumen estoy en un proceso de descubrimiento y de construcción de mi proyecto de vida. Gracias por creer en mí.",
    },
    story: {
      en: [
        "Pablo's high school only had an agreement with one university, so he went looking for his own way into Los Andes, his dream school, finding Quiero Estudiar first and then Lumen. He feared the selection process; the committee and his future Lumen peers convinced him this was where he deserved to be.",
        "He chose Economics for its currency and social impact, then added Industrial Engineering. As the first university student in his family, he sees education as the thing that breaks cycles: \"it is good people in a country like Colombia who make society progress.\"",
      ],
      es: [
        "El colegio de Pablo solo tenía convenio con una universidad, así que buscó su propio camino hacia Los Andes, la universidad de sus sueños, encontrando primero Quiero Estudiar y luego Lumen. Temía al proceso de selección; el comité y sus futuros compañeros de Lumen lo convencieron de que este era el lugar donde merecía estar.",
        "Eligió Economía por su actualidad y su impacto social, y luego sumó Ingeniería Industrial. Como el primer universitario de su familia, ve la educación como aquello que rompe ciclos: \"son las buenas personas en un país como Colombia las que hacen progresar a la sociedad\".",
      ],
    },
    highlights: {
      en: [
        "Elected representative of the Engineering Faculty on the Uniandes Student Council",
        "Model United Nations delegate; received honors representing Panama",
        "Active member of the Finance Club; volunteer companion to the elderly in nursing homes",
      ],
      es: [
        "Representante electo de la Facultad de Ingeniería en el Consejo Estudiantil Uniandino",
        "Delegado del Modelo ONU; recibió honores representando a Panamá",
        "Miembro activo del Club de Finanzas; voluntario acompañando adultos mayores en ancianatos",
      ],
    },
  },
  {
    slug: "juan-daniel-gonzalo",
    name: "Daniel Gonzalo",
    generation: "2025",
    major: { en: "Systems & Computing Engineering", es: "Ingeniería de Sistemas y Computación" },
    hometown: "Duitama",
    department: "Boyacá",
    short: {
      en: "A sumo robot Daniel built in school taught him that engineering is a creative act. He dreams of founding ventures that serve people, starting with technology that eases life for people with disabilities.",
      es: "Un robot de sumo que construyó en el colegio le enseñó a Daniel que la ingeniería es un acto creativo. Sueña con fundar emprendimientos al servicio de la gente, empezando por tecnología que facilite la vida de las personas con discapacidad.",
    },
    quote: {
      en: "I want to contribute through innovation and service, and find in my career a path to transform realities.",
      es: "Quiero aportar desde la innovación y el servicio, y encontrar en mi carrera un camino para transformar realidades.",
    },
    story: {
      en: [
        "Daniel worked for years on grades, standardized tests, and a profile strong enough for Los Andes, and got in. When the flagship financial aid program turned him down, a link to a Lumen information session changed everything: roughly eight interviews later, one week before classes began, María Paz video-called him with life-changing news.",
        "A school project, a sumo combat robot he researched and built with classmates, awakened his passion for creative engineering. He dreams of building technology that serves people, from ventures of his own to projects that improve life for people with disabilities.",
      ],
      es: [
        "Daniel trabajó durante años en sus notas, las pruebas de Estado y un perfil sólido para Los Andes, y lo logró. Cuando el programa insignia de apoyo financiero lo rechazó, un enlace a una sesión informativa de Lumen lo cambió todo: unas ocho entrevistas después, una semana antes de iniciar clases, María Paz lo llamó por video con una noticia que le cambió la vida.",
        "Un proyecto escolar, un robot de combate de sumo que investigó y construyó con sus compañeros, despertó su pasión por la ingeniería creativa. Sueña con construir tecnología al servicio de las personas, desde emprendimientos propios hasta proyectos que mejoren la vida de personas con discapacidad.",
      ],
    },
    highlights: {
      en: [
        "Winner of ExpoAndes 2025, Los Andes's science and innovation fair, with an AI voice-recognition baby-monitoring solution",
        "Passionate about entrepreneurship, cooking, reading, and music",
      ],
      es: [
        "Ganador de ExpoAndes 2025, la feria de ciencia e innovación de Los Andes, con una solución de monitoreo de bebés basada en reconocimiento de voz e IA",
        "Apasionado por el emprendimiento, la cocina, la lectura y la música",
      ],
    },
  },
  {
    slug: "sebastian-martinez",
    name: "Sebastián Martínez",
    generation: "2024",
    major: { en: "Systems & Computing Engineering", es: "Ingeniería de Sistemas y Computación" },
    hometown: "Duitama",
    department: "Boyacá",
    short: {
      en: "Sebastián taught himself to build software from Duitama long before he reached campus. Give him a hard problem and a deadline, and he will find a team and build something that matters.",
      es: "Sebastián aprendió por su cuenta a construir software desde Duitama mucho antes de llegar al campus. Dale un problema difícil y una fecha límite, y encontrará un equipo y construirá algo que importe.",
    },
    quote: {
      en: "My parents dreamed of going to college but were unable to. Being the first professional is a huge milestone for my whole family.",
      es: "Mis papás soñaban con ir a la universidad, pero no pudieron. Ser el primer profesional es un logro enorme para toda mi familia.",
    },
    story: {
      en: [
        "Sebastián has been building since 2020: programming, IoT, and cloud projects from his home in Duitama. When Lumen called to say he was in, he couldn't believe it: \"financially it was very hard for us to pay tuition at a private university, even a cheaper one.\"",
        "With two classmates he developed Audicia, an AI prototype built on Google Cloud that detects anomalies in public contracts to fight corruption. From more than 500 teams worldwide, theirs, SiliCO, reached the 25-team final of the Intelligent Planet Hackathon in Dhahran, Saudi Arabia: the only team from Latin America.",
      ],
      es: [
        "Sebastián construye desde 2020: proyectos de programación, IoT y computación en la nube desde su casa en Duitama. Cuando Lumen lo llamó para decirle que había quedado, no lo podía creer: \"económicamente era muy difícil para nosotros pagar la matrícula en una universidad privada, incluso una que costara menos\".",
        "Con dos compañeros desarrolló Audicia, un prototipo de IA construido sobre Google Cloud que detecta anomalías en contratos públicos para combatir la corrupción. Entre más de 500 equipos del mundo, el suyo, SiliCO, llegó a la final de 25 equipos del Intelligent Planet Hackathon en Dhahran, Arabia Saudita: el único equipo de América Latina.",
      ],
    },
    highlights: {
      en: [
        "Finalist, Intelligent Planet Hackathon (Google Cloud · KFUPM); only Latin American team, from 500+ worldwide",
        "Member of the Robotic Automation Society; spoke at Colombia's Congreso de la República",
        "Discovered squash at the sports center, and now owns his own racket",
      ],
      es: [
        "Finalista del Intelligent Planet Hackathon (Google Cloud · KFUPM); único equipo latinoamericano entre más de 500",
        "Miembro de la Robotic Automation Society; participó como invitado en el Congreso de la República",
        "Descubrió el squash en el centro deportivo, y ya tiene raqueta propia",
      ],
    },
  },
  {
    slug: "jose-maturana",
    name: "José Maturana",
    generation: "2024",
    major: { en: "Industrial Engineering", es: "Ingeniería Industrial" },
    hometown: "Cartagena",
    department: "Bolívar",
    short: {
      en: "José loves the corner where engineering meets business, an instinct that carried him to a Math Olympiad final in high school. At ExpoAndes, Los Andes's engineering entrepreneurship fair, his wine made from exotic Colombian fruits earned an honorable mention.",
      es: "A José le encanta la esquina donde la ingeniería se encuentra con los negocios, un instinto que lo llevó a una final de Olimpiadas de Matemáticas en el colegio. En ExpoAndes, la feria de emprendimiento e ingeniería de Los Andes, su vino de frutas exóticas colombianas se ganó una mención de honor.",
    },
    quote: {
      en: "Lumen is not just a scholarship. It's a program that pushes you professionally and supports you in every aspect of life.",
      es: "Lumen no es solo una beca, sino un programa que busca impulsarte a nivel profesional y apoyarte en diferentes aspectos de la vida.",
    },
    story: {
      en: [
        "José reached the final round of the Math Olympiads at Universidad Tecnológica de Bolívar in 11th grade, and always wanted a career where engineering meets mathematics, finance, and business. The day after missing another scholarship, an email invited him to apply to Lumen. He learned of his acceptance on his grandmother's birthday, \"a gift for the whole family.\"",
        "Now in Bogotá, the academic rigor has him weighing a double major in business. For ExpoAndes, he created a wine made from exotic Colombian fruits, a nod to the biodiversity of the country he wants his work to serve.",
      ],
      es: [
        "José llegó a la ronda final de las Olimpiadas de Matemáticas de la Universidad Tecnológica de Bolívar en grado 11 y siempre quiso una carrera donde la ingeniería se encontrara con las matemáticas, las finanzas y los negocios. Un día después de no quedar en otra beca, un correo lo invitó a aplicar a Lumen. Conoció su aceptación el día del cumpleaños de su abuela, \"un regalo para toda la familia\".",
        "Ya en Bogotá, el rigor académico lo tiene considerando una doble titulación con Administración. Para ExpoAndes creó un vino de frutas exóticas colombianas, un homenaje a la biodiversidad del país al que quiere servir con su trabajo.",
      ],
    },
    highlights: {
      en: [
        "Weighing a double major with Business Administration",
        "Learned of his Lumen acceptance on his grandmother's birthday",
      ],
      es: [
        "Considera una doble titulación con Administración",
        "Conoció su aceptación a Lumen el día del cumpleaños de su abuela",
      ],
    },
  },
  {
    slug: "julian-rodriguez",
    name: "Julián Rodríguez",
    generation: "2024",
    major: { en: "Electronic Engineering", es: "Ingeniería Electrónica" },
    hometown: "Cajicá",
    department: "Cundinamarca",
    short: {
      en: "Julián found engineering through a school robotics club, and Los Andes was always the goal, even when it looked impossible. His parents never finished high school; he is writing a new chapter for his family.",
      es: "Julián encontró la ingeniería en un semillero de robótica del colegio, y Los Andes siempre fue la meta, incluso cuando parecía imposible. Sus padres no terminaron el colegio; él está escribiendo un nuevo capítulo para su familia.",
    },
    quote: {
      en: "Living these experiences marks a before and after in our stories. In my case, in my family's story, since my parents didn't even graduate from high school. I feel deeply grateful to everyone who gives us this opportunity.",
      es: "Poder vivir estas experiencias marca un antes y un después en nuestras historias, en mi caso en la historia de mi familia, ya que mis padres no llegaron ni siquiera a graduarse del colegio. Me siento muy agradecido con todos aquellos que nos brindan esta oportunidad.",
    },
    story: {
      en: [
        "A robotics research seedbed and Colombia's FIRST LEGO League confirmed what Julián suspected in 10th grade: electronic engineering was his path. Los Andes was always the goal, but without a scholarship, entry \"would be almost impossible.\" The email inviting him to apply to Lumen was, in his words, a great relief.",
        "He works weekends in event logistics to cover personal expenses, plays ping-pong at the sports center, and spends the rest of his time building things that move: a motion-tracking smart lamp, and a fully electric racing kart.",
      ],
      es: [
        "Un semillero de robótica y la FIRST LEGO League de Colombia confirmaron lo que Julián intuía desde grado 10: la ingeniería electrónica era su camino. Los Andes siempre fue la meta, pero sin beca entrar \"sería casi imposible\". El correo que lo invitó a aplicar a Lumen fue, en sus palabras, un gran alivio.",
        "Trabaja los fines de semana en logística de eventos para cubrir sus gastos personales, juega ping-pong en el centro deportivo y dedica el resto de su tiempo a construir cosas que se mueven: una lámpara inteligente con sensor de movimiento y un kart de carreras totalmente eléctrico.",
      ],
    },
    highlights: {
      en: [
        "Member of the Power & Energy Society research group",
        "Building a fully electric racing kart",
        "Developed a smart lamp that tracks motion with servo-driven lighting",
      ],
      es: [
        "Miembro del grupo de investigación Power & Energy Society",
        "Construye un kart de carreras totalmente eléctrico",
        "Desarrolló una lámpara inteligente que sigue el movimiento con servomotores",
      ],
    },
  },
  {
    slug: "santiago-rubiano",
    name: "Santiago Rubiano",
    generation: "2025",
    major: { en: "Biomedical Engineering", es: "Ingeniería Biomédica" },
    hometown: "Funza",
    department: "Cundinamarca",
    short: {
      en: "Six years of high-performance soccer gave Santiago his discipline; biomedical engineering gave him a purpose. He lives with chronic rhinitis, and he intends to engineer the solution that relieves it.",
      es: "Seis años de fútbol de alto rendimiento le dieron a Santiago su disciplina; la ingeniería biomédica le dio un propósito. Vive con rinitis crónica y piensa diseñar la solución que la alivie.",
    },
    quote: {
      en: "Being part of Lumen represents success, and the success of one is the success of all.",
      es: "Ser parte de Lumen representa éxito, y el éxito de uno es el éxito de todos.",
    },
    story: {
      en: [
        "Santiago was admitted to Los Andes on his school ranking and ICFES score, and won 80% financial aid. The remaining 20% was still out of reach for his family. Lumen's process, an essay on his story, a phrase that represents him, and six interviews with the founder and donors, closed the gap in December 2024.",
        "He planned on Medicine until he discovered biomedical engineering, which merges engineering with health. Living with chronic rhinitis himself, he dreams of developing a solution that combines micro-robotics and biomaterials to relieve a condition that affects hundreds of millions of people.",
      ],
      es: [
        "Santiago fue admitido a Los Andes por su puesto en el colegio y su puntaje ICFES, y obtuvo un apoyo financiero del 80%. El 20% restante seguía fuera del alcance de su familia. El proceso de Lumen, un ensayo sobre su historia, una frase que lo representara y seis entrevistas con la fundadora y los donantes, cerró esa brecha en diciembre de 2024.",
        "Pensaba estudiar Medicina hasta que descubrió la ingeniería biomédica, que une la ingeniería con la salud. Él mismo vive con rinitis crónica y sueña con desarrollar una solución que combine microrobótica y biomateriales para aliviar una condición que afecta a cientos de millones de personas.",
      ],
    },
    highlights: {
      en: [
        "Chose biomedical engineering over medicine, to build solutions rather than prescribe them",
        "Exploring economics alongside engineering",
      ],
      es: [
        "Eligió ingeniería biomédica sobre medicina, para construir soluciones en lugar de recetarlas",
        "Explora la economía en paralelo a la ingeniería",
      ],
    },
  },
  {
    slug: "valentina-salgado",
    name: "Valentina Salgado",
    generation: "2025",
    major: { en: "Systems & Computing Engineering", es: "Ingeniería de Sistemas y Computación" },
    hometown: "Bogotá",
    department: "Bogotá D.C.",
    short: {
      en: "Valentina sees artificial intelligence as a new industrial revolution, and she wants a hand in building it. Between classes, you'll find her on the tennis courts or at the board-games club, where she found her people.",
      es: "Valentina ve la inteligencia artificial como una nueva revolución industrial, y quiere ayudar a construirla. Entre clases, la encontrarás en las canchas de tenis o en el club de juegos de mesa, donde encontró a su gente.",
    },
    quote: {
      en: "All of this has been possible thanks to Lumen, a program that changed my life, and to which I will always be grateful.",
      es: "Todo esto ha sido posible gracias a Lumen, un programa que cambió mi vida y con el que estaré siempre agradecida.",
    },
    story: {
      en: [
        "Getting into Los Andes was not easy: Valentina competed against very talented students for aid she needed to attend at all, and the percentage she was first assigned wasn't enough. Lumen, an essay and then individual interviews with the donors, offered more, and she loved sharing her ambitions with the people behind the program.",
        "She chose systems engineering out of conviction that technology is fundamental to the future. She is especially passionate about artificial intelligence, \"a new industrial revolution\" capable of transforming the world from even the smallest contexts, and wants to explore cybersecurity.",
      ],
      es: [
        "Entrar a Los Andes no fue fácil: Valentina compitió contra estudiantes muy talentosos por un apoyo sin el cual no podía asistir, y el porcentaje que le asignaron al principio no era suficiente. Lumen, un ensayo y luego entrevistas individuales con los donantes, ofrecía más, y disfrutó mucho compartir sus ambiciones con las personas detrás del programa.",
        "Eligió ingeniería de sistemas por la convicción de que la tecnología es fundamental para el futuro. Le apasiona especialmente la inteligencia artificial, \"una nueva revolución industrial\" capaz de transformar el mundo incluso desde los contextos más pequeños, y quiere explorar la ciberseguridad.",
      ],
    },
    highlights: {
      en: [
        "Took up tennis at the university, and made friends across majors and semesters",
        "Core member of the board-games club, her favorite campus community",
      ],
      es: [
        "Empezó tenis en la universidad e hizo amigos de todas las carreras y semestres",
        "Miembro activa del club de juegos de mesa, su comunidad favorita del campus",
      ],
    },
  },
  {
    slug: "valerie-suarez",
    name: "Valerie Suárez",
    generation: "2024",
    major: { en: "Chemistry", es: "Química" },
    hometown: "Funza",
    department: "Cundinamarca",
    short: {
      en: "Valerie once said she would never get into Los Andes; a campus visit changed her mind, and she never looked back. Her love of chemistry was born in the pandemic, sparked by a teacher who made molecules feel alive.",
      es: "Valerie decía que nunca entraría a Los Andes; una visita al campus la hizo cambiar de opinión, y no miró atrás. Su amor por la química nació en la pandemia, gracias a una profesora que hacía sentir vivas las moléculas.",
    },
    quote: {
      en: "Pursuing my passions inspires me to support the youngest in my family to build their dreams, and to believe this is a country with opportunities for us.",
      es: "Poder hacer lo que me gusta me inspira a apoyar a los más pequeños de la familia para que crean en sus sueños y sepan que este sí es un país de oportunidades para nosotros.",
    },
    story: {
      en: [
        "Valerie used to say she would never get into Los Andes, until a campus visit made her fall in love with it. People asked why not a public university; she stayed sure of her decision, \"convinced I deserved to be there.\" Her love of science was sparked in the pandemic by a chemistry teacher's passion.",
        "She finished her first semester with the highest average in Lumen's founding cohort, was invited by two professors into graduate-level research, and now splits her time between two research groups and teaching programming to fellow undergraduates.",
      ],
      es: [
        "Valerie solía decir que nunca entraría a Los Andes, hasta que una visita al campus la enamoró. Le preguntaban por qué no una universidad pública; ella se mantuvo segura de su decisión, \"convencida de que merecía estar ahí\". Su amor por la ciencia nació en la pandemia gracias a la pasión de su profesora de química.",
        "Terminó su primer semestre con el promedio más alto de la primera generación de Lumen, fue invitada por dos profesores a investigación de nivel de posgrado y hoy divide su tiempo entre dos grupos de investigación y las monitorias de programación.",
      ],
    },
    highlights: {
      en: [
        "Researcher in the Inorganic Chemistry, Catalysis & Bioinorganics group since freshman year",
        "Teaching assistant for Introduction to Programming, as a chemistry major",
        "Highest first-semester GPA of Lumen's founding generation",
      ],
      es: [
        "Investigadora del grupo de Química Inorgánica, Catálisis y Bioinorgánica desde primer semestre",
        "Monitora de Introducción a la Programación, siendo estudiante de Química",
        "El promedio más alto del primer semestre de la generación fundadora de Lumen",
      ],
    },
  },
]

export type MapCity = {
  city: string
  department: string
  /** Projected coordinates in the 600 × 831 map viewBox */
  x: number
  y: number
  /** Which side the label sits on */
  labelSide: "left" | "right"
  scholars: string[] // slugs
}

/** Where the Lumens come from: 7 hometowns across 6 departments. */
export const MAP_CITIES: MapCity[] = [
  { city: "Galapaga", department: "Atlántico", x: 203, y: 76, labelSide: "right", scholars: ["daniel-alzate"] },
  { city: "Cartagena", department: "Bolívar", x: 172, y: 101, labelSide: "left", scholars: ["jose-maturana"] },
  { city: "Montería", department: "Córdoba", x: 154, y: 183, labelSide: "left", scholars: ["juan-angel-aicardy"] },
  { city: "Duitama", department: "Boyacá", x: 295, y: 328, labelSide: "right", scholars: ["juan-daniel-gonzalo", "sebastian-martinez"] },
  { city: "Cajicá", department: "Cundinamarca", x: 246, y: 373, labelSide: "right", scholars: ["julian-rodriguez"] },
  { city: "Bogotá", department: "Bogotá D.C.", x: 244, y: 384, labelSide: "right", scholars: ["mateo-arcila", "juan-pablo-contreras", "valentina-salgado"] },
  { city: "Funza", department: "Cundinamarca", x: 237, y: 383, labelSide: "left", scholars: ["santiago-rubiano", "valerie-suarez"] },
]

/** Simplified Colombia outline, equirectangular projection, viewBox 0 0 600 831. */
export const COLOMBIA_PATH =
  "M179.2,625.1L158.0,613.3L133.7,596.9L119.6,604.8L77.6,597.9L65.5,576.5L56.3,577.3L6.7,549.0L0.0,533.6L18.5,529.8L16.3,505.0L27.9,487.0L52.5,483.6L73.3,452.4L92.3,426.4L74.0,414.6L83.4,385.8L72.2,340.3L82.8,327.3L75.0,285.3L54.9,258.9L61.3,234.7L77.3,238.3L86.6,223.5L75.1,194.3L81.1,187.0L106.7,188.6L143.9,153.9L164.2,148.7L164.7,132.2L173.9,90.3L202.3,67.2L233.5,66.3L237.4,55.9L276.2,60.1L315.1,35.0L334.4,23.9L358.4,0.0L376.0,3.0L389.0,16.1L379.3,32.8L347.5,41.1L335.0,66.0L315.8,80.2L301.4,98.7L295.3,134.1L281.6,163.1L307.2,166.4L313.5,189.3L324.5,200.2L328.4,220.2L322.5,238.6L324.2,248.9L336.4,253.1L348.2,270.4L411.9,265.6L440.7,271.9L475.5,314.7L495.5,309.4L531.2,312.0L559.4,306.4L577.0,314.9L568.0,341.6L557.0,358.3L553.1,393.9L563.1,426.9L577.2,441.7L578.9,452.8L553.8,477.5L571.7,488.4L584.9,505.8L600.0,555.3L590.7,561.4L581.0,532.1L567.2,516.4L550.9,533.5L454.4,532.4L455.0,563.5L484.0,568.6L482.3,587.6L472.4,582.5L444.5,590.7L444.3,626.7L466.2,644.8L474.0,673.3L472.8,694.8L450.6,831.0L425.8,804.6L411.0,803.4L442.9,752.8L405.0,729.6L375.3,733.9L357.4,725.3L330.1,738.4L293.2,732.2L264.0,680.1L241.1,667.3L225.3,643.9L192.4,620.4L179.2,625.1Z"
