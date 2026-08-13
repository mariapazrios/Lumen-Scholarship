import Reveal from "../primitives/Reveal"
import Tricolor from "../primitives/Tricolor"
import Watermark from "../primitives/Watermark"
import { useLang, type L } from "../../lib/i18n"

const PILLARS: Array<{ n: string; title: L }> = [
  { n: "01", title: { en: "Robust financial aid", es: "Apoyo financiero integral" } },
  { n: "02", title: { en: "Identity-driven community", es: "Comunidad con identidad" } },
  { n: "03", title: { en: "Early-career guidance", es: "Orientación profesional" } },
]

/**
 * What the scholarship actually covers, as figures rather than a sentence
 * buried in a pillar card. This is the first question anyone applying or
 * funding asks, and it was previously a clause in the middle of a paragraph.
 *
 * `{andes}` is replaced by a link to uniandes.edu.co when the row renders.
 */
const COVERAGE: Array<{ figure: L; label: L }> = [
  {
    figure: { en: "95%", es: "95%" },
    label: {
      en: "Full-ride tuition at {andes}, Colombia's top private university.",
      es: "De la matrícula en {andes}, la mejor universidad privada de Colombia.",
    },
  },
  {
    figure: { en: "10 + 1", es: "10 + 1" },
    label: {
      en: "Ten semesters plus a summer session, enrolment through to the degree.",
      es: "Diez semestres más una sesión de verano, desde la matrícula hasta el grado.",
    },
  },
  {
    figure: { en: "$2M COP", es: "$2M COP" },
    label: {
      en: "Living stipend, paid every semester.",
      es: "De apoyo de sostenimiento, cada semestre.",
    },
  },
]

/**
 * What Lumen funds: every science and every engineering at Los Andes, plus
 * economics, business and law. This is the faculty offering, not the roster,
 * so most of it has no Lumen in it yet. Taken from the university's own
 * listings, uniandes.edu.co/es/oferta-academica/pregrados and
 * ingenieria.uniandes.edu.co/es/programas/pregrado, checked 2026-08-05.
 *
 * Medicina sits under the sciences on the university's site and is left off:
 * it runs past the ten semesters and one summer the scholarship covers.
 */
const MAJOR_GROUPS: Array<{ heading: L; items: L[] }> = [
  {
    heading: { en: "Sciences", es: "Ciencias" },
    items: [
      { en: "Biology", es: "Biología" },
      { en: "Physics", es: "Física" },
      { en: "Geosciences", es: "Geociencias" },
      { en: "Mathematics", es: "Matemáticas" },
      { en: "Microbiology", es: "Microbiología" },
      { en: "Chemistry", es: "Química" },
    ],
  },
  {
    heading: { en: "Engineering", es: "Ingeniería" },
    items: [
      { en: "Environmental Engineering", es: "Ingeniería Ambiental" },
      { en: "Biomedical Engineering", es: "Ingeniería Biomédica" },
      { en: "Civil Engineering", es: "Ingeniería Civil" },
      { en: "Systems and Computing Engineering", es: "Ingeniería de Sistemas y Computación" },
      { en: "Electrical Engineering", es: "Ingeniería Eléctrica" },
      { en: "Electronic Engineering", es: "Ingeniería Electrónica" },
      { en: "Industrial Engineering", es: "Ingeniería Industrial" },
      { en: "Mechanical Engineering", es: "Ingeniería Mecánica" },
      { en: "Chemical Engineering", es: "Ingeniería Química" },
      { en: "Data Science", es: "Ciencia de Datos" },
    ],
  },
  {
    heading: { en: "Other", es: "Otras" },
    items: [
      { en: "Economics", es: "Economía" },
      { en: "Business Administration", es: "Administración de Empresas" },
      { en: "Law", es: "Derecho" },
    ],
  },
]

const VALUES: L[] = [
  { en: "Resilience", es: "Resiliencia" },
  { en: "Excellence", es: "Excelencia" },
  { en: "Integrity", es: "Integridad" },
  { en: "Community", es: "Comunidad" },
]

/**
 * Splits a pillar body on the {andes} placeholder and links that half. Keeping
 * the marker inside the translated string means the link lands in the right
 * place in both languages, where Spanish word order puts it earlier.
 */
function AndesLink({ text, onDark = false }: { text: string; onDark?: boolean }) {
  const [before, after] = text.split("{andes}")
  if (after === undefined) return <>{text}</>
  return (
    <>
      {before}
      <a
        href="https://www.uniandes.edu.co/"
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 transition-colors duration-200 ${
          onDark
            ? // On navy the light-ground treatment resolves to ink on hover,
              // which is all but invisible against the panel.
              "decoration-white/40 hover:decoration-white hover:text-white"
            : "decoration-accent/40 hover:decoration-accent hover:text-foreground"
        }`}
      >
        Los Andes
      </a>
      {after}
    </>
  )
}

export default function Mission() {
  const { lang, t } = useLang()

  return (
    <>
    <section className="bg-background relative overflow-hidden">
      {/* Colombian tricolor, closing the hero */}
      <Tricolor className="absolute inset-x-0 top-0 h-1" />
      <Watermark className="-right-36 top-16 w-[28rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-20 relative">
        {/* Mission */}
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-accent font-semibold mb-6">
            {lang === "es" ? "Nuestra misión" : "Our mission"}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 120}>
              <div className="bg-surface border-t-2 border-accent rounded-sm p-8 md:p-10 h-full">
                <div className="text-meta uppercase tracking-widest text-accent font-semibold">
                  {p.n}
                </div>
                {/* One line at desktop; reserves two lines only where wrapping is possible */}
                <h3 className="font-semibold text-primary mt-4 leading-tight text-[clamp(1.25rem,1.6vw,1.6rem)] md:min-h-[2.4em] lg:min-h-0 lg:whitespace-nowrap">
                  {t(p.title)}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* The terms and the scope get the full-bleed navy band and the logo
        splash, the same treatment as "We strive to be more than tuition".
        They are the two blocks a reader scans rather than reads, and inset
        panels on white left them floating inside the mission rather than
        reading as their own statement. */}
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <Watermark onDark className="-left-36 -bottom-36 w-[28rem]" />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-28 relative">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-8">
            {lang === "es" ? "Qué cubre la beca" : "What the scholarship covers"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {COVERAGE.map((c, i) => (
              <div
                key={c.figure.en}
                className={`py-6 sm:py-0 ${i === 0 ? "sm:pr-8" : i === COVERAGE.length - 1 ? "sm:pl-8" : "sm:px-8"}`}
              >
                <div className="text-h2 font-semibold leading-none tabular-nums">
                  {t(c.figure)}
                </div>
                <p className="text-body text-primary-foreground/70 mt-4">
                  <AndesLink text={t(c.label)} onDark />
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Majors. Nineteen bulleted items in three columns was an inventory;
            the point is the breadth, so each group is one flowing line. */}
        <Reveal delay={140}>
          <div className="mt-16 md:mt-20">
            <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-8">
              {lang === "es" ? "Carreras que apoyamos" : "Majors supported"}
            </div>
            <dl className="border-t border-white/15">
              {MAJOR_GROUPS.map((g) => (
                <div
                  key={g.heading.en}
                  className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-8 gap-y-1 border-b border-white/15 py-4"
                >
                  <dt className="text-body font-semibold">{t(g.heading)}</dt>
                  {/* Sorted here rather than in the data because the two
                      languages do not sort the same: Chemistry comes second in
                      English and Química comes last in Spanish. localeCompare
                      with the active language also files the accented names
                      (Física, Química) where a reader expects them. */}
                  <dd className="text-body text-primary-foreground/75">
                    {[...g.items]
                      .sort((a, b) => t(a).localeCompare(t(b), lang))
                      .map((m) => t(m))
                      .join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="bg-background relative overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20 relative">
        {/* Values */}
        <Reveal delay={120}>
          <div>
            <div className="text-meta uppercase tracking-widest text-accent font-semibold mb-8">
              {lang === "es" ? "Nuestros valores" : "Our values"}
            </div>
            {/* The separating dots are hidden on a phone, which left four bold
                words wrapping as loose text. Below sm they become a 2x2 set,
                each under its own cobalt rule, so they read as four values
                rather than four words. From sm up this is the original row. */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-6">
              {VALUES.map((v, i) => (
                <span
                  key={v.en}
                  className="flex items-center border-t-2 border-accent pt-3 sm:border-t-0 sm:pt-0 sm:gap-x-10"
                >
                  <span className="text-h3 font-bold text-primary tracking-tight">{t(v)}</span>
                  {i < VALUES.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="hidden sm:inline-block w-2 h-2 rounded-full bg-accent"
                    />
                  )}
                </span>
              ))}
            </div>

          </div>
        </Reveal>
      </div>
    </section>
    </>
  )
}
