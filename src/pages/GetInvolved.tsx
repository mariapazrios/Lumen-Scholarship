import CountUp from "../components/primitives/CountUp"
import Reveal from "../components/primitives/Reveal"
import Tricolor from "../components/primitives/Tricolor"
import { useLang, type L } from "../lib/i18n"

const CONTACT_EMAIL = "hq@lumenedu.org"

/** The case for sponsoring, in three numbers: how narrow the funnel is, what
 *  they scored coming in, and how they perform once they are here. */
const PROOF: Array<{ value: L; label: L; sub: L }> = [
  {
    value: { en: "0.14%", es: "0,14%" },
    label: { en: "Acceptance rate", es: "Tasa de admisión" },
    sub: { en: "11 selected from 8,065", es: "11 seleccionados de 8.065" },
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

/**
 * Three returns. "First look at hiring" and "direct access to the cohort" were
 * the same promise told twice, so they are one card: the access is what produces
 * the first look.
 */
const RETURNS: Array<{ n: string; title: L; body: L }> = [
  {
    n: "01",
    title: { en: "A pre-vetted talent pool", es: "Un grupo de talento preseleccionado" },
    body: {
      en: "One Lumen per 733 applicants. Every one ranked in the top 1% of the national exam, and the cohort averages 4.3 against program averages of 3.9.",
      es: "Un Lumen por cada 733 aspirantes. Todos en el 1% superior del examen nacional, con un promedio de 4.3 frente al 3.9 de sus carreras.",
    },
  },
  {
    n: "02",
    title: { en: "First look at the cohort", es: "Primera mirada a la cohorte" },
    body: {
      en: "Speaker slots, workshops and recruiting sessions put your team in front of all of them, so you meet interns and early-career candidates years before they reach the open market.",
      es: "Charlas, talleres y sesiones de selección ponen a tu equipo frente a todos ellos, así conoces practicantes y candidatos de inicio de carrera años antes de que lleguen al mercado abierto.",
    },
  },
  {
    n: "03",
    title: { en: "Reporting on every scholar", es: "Reportes sobre cada estudiante" },
    body: {
      en: "An annual report per Lumen: major, GPA against their program, internships, competitions and what they have built.",
      es: "Un informe anual por Lumen: carrera, promedio frente a su programa, prácticas, competencias y lo que ha construido.",
    },
  },
]

/**
 * Split by who is reading and what they have to give. Corporates lead: under the
 * talent-pipeline framing a company that opens a role is doing the last step of
 * the program, and the individual routes follow.
 */
const OTHER_WAYS: Array<{ heading: L; items: L[] }> = [
  {
    heading: { en: "Corporates: Access", es: "Empresas: Acceso" },
    items: [
      { en: "Open internships and early-career roles", es: "Abre prácticas y vacantes de inicio de carrera" },
      { en: "Fast-track Lumen applications", es: "Agiliza los procesos de selección para los Lumens" },
      { en: "Host a session with your recruiting team", es: "Organiza una sesión con tu equipo de selección" },
    ],
  },
  {
    heading: { en: "Individuals: Time and network", es: "Personas: Tiempo y red" },
    items: [
      { en: "Speak at a mentorship session", es: "Da una charla de mentoría" },
      { en: "Take a 15-minute call with a Lumen", es: "Toma una llamada de 15 minutos con un Lumen" },
      { en: "Run an interview or resume workshop", es: "Dirige un taller de entrevistas u hoja de vida" },
      { en: "Introduce us to a potential sponsor", es: "Preséntanos a un patrocinador potencial" },
    ],
  },
]

/**
 * Tax treatment, reduced to a sticker and one line per jurisdiction. It is the
 * mechanics of a decision already made, so it does not need a headline, a card,
 * or the payment-method detail that used to run alongside it.
 */
const TAX: Array<{ jurisdiction: L; detail: L }> = [
  {
    jurisdiction: { en: "United States", es: "Estados Unidos" },
    detail: {
      en: "Through the University of the Andes Foundation, a 501(c)(3).",
      es: "A través de la University of the Andes Foundation, una 501(c)(3).",
    },
  },
  {
    jurisdiction: { en: "Colombia", es: "Colombia" },
    detail: {
      en: "Through Universidad de los Andes, carrying a 25% tax benefit against renta líquida.",
      es: "A través de la Universidad de los Andes, con un descuento tributario del 25% sobre la renta líquida.",
    },
  },
]

const TIERS: Array<{ label: L; amount?: number; cop?: L; detail?: L }> = [
  {
    label: { en: "Full scholarship", es: "Beca completa" },
    amount: 50,
    cop: { en: "$190M COP", es: "$190M COP" },
    detail: { en: "One Lumen, all ten semesters.", es: "Un Lumen, los diez semestres." },
  },
  {
    label: { en: "Half scholarship", es: "Media beca" },
    amount: 25,
    cop: { en: "$95M COP", es: "$95M COP" },
    detail: { en: "Co-sponsor a Lumen with a partner.", es: "Copatrocina un Lumen con un socio." },
  },
  {
    label: { en: "Ad hoc", es: "Monto libre" },
    detail: {
      en: "Contributions under $5K will be allocated to fund the living stipend every Lumen receives each semester.",
      es: "Los aportes de menos de $5K se destinarán a financiar el apoyo de sostenimiento que cada Lumen recibe cada semestre.",
    },
  },
]

function SponsorsSection() {
  const { lang, t } = useLang()
  return (
    <section id="sponsors" className="bg-surface-soft scroll-mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        {/* The record leads the page, ahead of any heading. The numbers are the
            argument; the heading and the tiers are what you do about them. */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-ink/15">
            {PROOF.map((p) => (
              <div key={p.label.en} className="py-5 sm:py-0 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <Tricolor className="w-7 h-[3px] mb-5" />
                <div className="text-stat font-bold text-primary tabular-nums leading-none">
                  {t(p.value)}
                </div>
                <div className="text-meta uppercase tracking-widest text-muted mt-4">
                  {t(p.label)}
                </div>
                <div className="text-meta text-muted mt-1.5 tabular-nums">{t(p.sub)}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="text-h2 font-semibold text-primary mt-16">
            {lang === "es" ? (
              <>
                Financia a un Lumen.{" "}
                <em className="italic font-light">Sigue su carrera hasta la empresa.</em>
              </>
            ) : (
              <>
                Fund a Lumen.{" "}
                <em className="italic font-light">Follow their career into the firm.</em>
              </>
            )}
          </h2>
        </Reveal>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.label.en} delay={i * 110}>
              <div className="rounded-sm p-8 h-full flex flex-col bg-white border border-ink/10 transition-transform duration-300 hover:-translate-y-1">
                <div className="text-meta uppercase tracking-widest text-muted">
                  {t(tier.label)}
                </div>
                <div className="text-h2 font-bold mt-4 tabular-nums text-primary">
                  {tier.amount ? (
                    <>
                      ~US$
                      <CountUp value={tier.amount} duration={900 + i * 150} />K
                    </>
                  ) : (
                    <span>{lang === "es" ? "Tú eliges" : "Any amount"}</span>
                  )}
                </div>
                {tier.cop && <div className="text-body mt-2 text-muted">{t(tier.cop)}</div>}
                {tier.detail && (
                  <p className="text-body text-ink/75 mt-3 flex-1">{t(tier.detail)}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="text-body text-ink/75 mt-6">
            {lang === "es"
              ? "Todos los compromisos se pueden pagar de contado o diferidos en cuotas semestrales, cada 6 meses, al 0% de interés."
              : "All commitments can be paid upfront or deferred in semester installments, every 6 months, at 0% interest."}
          </p>
        </Reveal>

        {/* Deductibility as a sticker plus one line per jurisdiction. */}
        <Reveal delay={140}>
          <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-5">
            <span className="self-start sm:self-center shrink-0 -rotate-3 inline-block rounded-full border-2 border-accent text-accent text-meta uppercase tracking-widest font-semibold px-5 py-2">
              {lang === "es" ? "Deducible de impuestos" : "Tax deductible"}
            </span>
            <div className="space-y-1.5">
              {TAX.map((row) => (
                <p key={row.jurisdiction.en} className="text-body text-ink/75">
                  <span className="font-semibold text-primary">{t(row.jurisdiction)}</span>{" "}
                  {t(row.detail)}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** What a sponsor gets back, framed as a talent portfolio. */
function ReturnsSection() {
  const { lang, t } = useLang()
  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden">
      <img
        src="/lumen-icon.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -left-36 -bottom-36 w-[28rem] opacity-[0.06] brightness-0 invert"
      />
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
            {lang === "es" ? "Lo que regresa" : "What comes back"}
          </div>
          <h2 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Formamos el talento que{" "}
                <em className="italic font-light">
                  impulsa a las mejores empresas de Colombia.
                </em>
              </>
            ) : (
              <>
                Fostering the talent pool that{" "}
                <em className="italic font-light">propels Colombia's top businesses.</em>
              </>
            )}
          </h2>
          <p className="text-lead font-light text-primary-foreground/75 mt-6 max-w-4xl">
            {lang === "es"
              ? "Los patrocinadores cubren la beca y nosotros nos encargamos del resto: elegimos a quién se le otorga, acompañamos a cada estudiante durante los cinco años de la carrera y lo presentamos a las empresas donde va a empezar su vida profesional."
              : "Sponsors cover the scholarship and we take it from there, choosing who receives it, working alongside them through all five years of the degree, and introducing them to the companies where they will start their careers."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {RETURNS.map((r, i) => (
            <Reveal key={r.n} delay={i * 100}>
              <div className="border border-primary-foreground/15 rounded-sm p-7 md:p-8 h-full bg-primary-foreground/[0.03]">
                <div className="flex items-baseline justify-between gap-4">
                  {/* Two lines reserved on all three: the longest title wraps, and
                      without this the bodies start at three different heights. */}
                  <h3 className="text-h3 font-semibold leading-tight md:min-h-[2.4em]">
                    {t(r.title)}
                  </h3>
                  <span className="text-meta font-semibold tracking-widest text-primary-foreground/50">
                    {r.n}
                  </span>
                </div>
                <p className="text-body text-primary-foreground/75 mt-3">{t(r.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function OtherWaysSection() {
  const { lang, t } = useLang()
  return (
    <section id="other-ways" className="bg-surface scroll-mt-24">
      {/* Deliberately quieter than the sponsor section above: smaller heading,
          tighter band, and a line that says outright where this sits. Funding a
          scholar is the ask; everything here is what people do instead. */}
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-16">
        <Reveal>
          <h2 className="text-h3 font-semibold text-primary">
            {lang === "es"
              ? "Otras formas de vincularse."
              : "Other ways to get involved."}
          </h2>
          <p className="text-body text-ink/70 mt-3 max-w-2xl">
            {lang === "es"
              ? "Patrocinar es lo que sostiene el programa. Para quienes no pueden financiar una beca, estas son las demás formas de aportar."
              : "Sponsorship is what keeps the program running. For those who cannot fund a scholarship, these are the other ways to contribute."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mt-10">
          {OTHER_WAYS.map((group, gi) => (
            <Reveal key={group.heading.en} delay={gi * 120}>
              <div className="border-t border-ink/20 pt-5">
                <h3 className="text-body font-semibold uppercase tracking-widest text-primary">
                  {t(group.heading)}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.en} className="text-body text-ink/80 flex gap-3">
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0"
                      />
                      {t(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function GetInvolved() {
  const { lang } = useLang()

  return (
    <>
      <section className="bg-primary text-primary-foreground relative overflow-hidden">
        <img
          src="/lumen-icon.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-32 -top-32 w-[30rem] opacity-[0.06] brightness-0 invert"
        />
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 relative">
          <Reveal>
            <div className="text-meta uppercase tracking-widest text-primary-foreground/60 mb-4">
              {lang === "es" ? "Vincúlate" : "Get involved"}
            </div>
            <h1 className="text-display font-light">
              {lang === "es" ? (
                <>
                  Los patrocinadores financian,
                  <br />
                  <em className="italic font-semibold">Lumen forma.</em>
                </>
              ) : (
                <>
                  Sponsors fund,
                  <br />
                  <em className="italic font-semibold">Lumen fosters.</em>
                </>
              )}
            </h1>
          </Reveal>
        </div>
      </section>

      <SponsorsSection />
      <ReturnsSection />
      <OtherWaysSection />

      {/* Closing CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 text-center">
          <Reveal>
            <h2 className="text-h2 font-semibold max-w-3xl mx-auto">
              {lang === "es" ? "¿Listo para abrir una puerta?" : "Ready to open a door?"}
            </h2>
            <p className="text-lead font-light text-primary-foreground/75 mt-4 max-w-xl mx-auto">
              {lang === "es" ? "Escríbenos a " : "Reach out to "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold underline underline-offset-4 decoration-primary-foreground/40 hover:decoration-primary-foreground transition-colors duration-200"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
