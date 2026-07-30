import CountUp from "../components/primitives/CountUp"
import Reveal from "../components/primitives/Reveal"
import Tricolor from "../components/primitives/Tricolor"
import { useLang, type L } from "../lib/i18n"

const CONTACT_EMAIL = "hq@lumenedu.org"

/** The case for sponsoring, in numbers. */
const PROOF: Array<{ value: string; label: L }> = [
  { value: "8,065", label: { en: "Applicants screened", es: "Aspirantes evaluados" } },
  { value: "11", label: { en: "Selected to date", es: "Seleccionados hasta hoy" } },
  { value: "Top 1%", label: { en: "National ICFES exam", es: "Examen ICFES nacional" } },
  { value: "100%", label: { en: "Retention", es: "Retención" } },
]

/** Pragmatic returns: a curated talent portfolio, reported on annually. */
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
    title: { en: "First look at hiring", es: "Primera opción en contratación" },
    body: {
      en: "Meet interns and early-career candidates years before they reach the open market, across engineering, economics, physics and chemistry.",
      es: "Conoce practicantes y candidatos de inicio de carrera años antes de que lleguen al mercado abierto, en ingeniería, economía, física y química.",
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
  {
    n: "04",
    title: { en: "Direct access to the cohort", es: "Acceso directo a la cohorte" },
    body: {
      en: "Speaker slots, workshops and recruiting sessions put your firm and your team in front of all of them.",
      es: "Charlas, talleres y sesiones de selección ponen a tu empresa y a tu equipo frente a todos ellos.",
    },
  },
]

const OTHER_WAYS: Array<{ heading: L; items: L[] }> = [
  {
    heading: { en: "Individuals give time.", es: "Las personas aportan tiempo." },
    items: [
      { en: "Speak at a mentorship session", es: "Da una charla de mentoría" },
      { en: "Take a 15-minute call with a Lumen", es: "Toma una llamada de 15 minutos con un Lumen" },
      { en: "Run an interview or resume workshop", es: "Dirige un taller de entrevistas u hoja de vida" },
      { en: "Introduce us to a potential sponsor", es: "Preséntanos a un patrocinador potencial" },
    ],
  },
  {
    heading: { en: "Companies give access.", es: "Las empresas aportan acceso." },
    items: [
      { en: "Open internships and early-career roles", es: "Abre prácticas y vacantes de inicio de carrera" },
      { en: "Fast-track Lumen applications", es: "Agiliza los procesos de selección para los Lumens" },
      { en: "Host a session with your recruiting team", es: "Organiza una sesión con tu equipo de selección" },
    ],
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
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Patrocinadores" : "Sponsors"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Financia a un Lumen. <em className="italic font-light">Sigue su carrera.</em>
              </>
            ) : (
              <>
                Fund a Lumen. <em className="italic font-light">Follow their career.</em>
              </>
            )}
          </h2>
        </Reveal>

        {/* Proof strip */}
        <Reveal delay={80}>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10 rounded-sm overflow-hidden">
            {PROOF.map((p) => (
              <div key={p.label.en} className="bg-surface-soft p-6">
                <Tricolor className="w-7 h-[3px] mb-4" />
                <div className="text-h2 font-bold text-primary tabular-nums leading-none">
                  {p.value}
                </div>
                <div className="text-meta uppercase tracking-widest text-muted mt-2.5">
                  {t(p.label)}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
            {lang === "es" ? "Lo que recibes" : "What you get"}
          </div>
          <h2 className="text-h2 font-semibold">
            {lang === "es" ? (
              <>
                Un portafolio de talento,{" "}
                <em className="italic font-light">no una donación y adiós.</em>
              </>
            ) : (
              <>
                A talent portfolio, <em className="italic font-light">not a donation and goodbye.</em>
              </>
            )}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {RETURNS.map((r, i) => (
            <Reveal key={r.n} delay={i * 100}>
              <div className="border border-primary-foreground/15 rounded-sm p-7 md:p-8 h-full bg-primary-foreground/[0.03]">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-h3 font-semibold">{t(r.title)}</h3>
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

/** Tax treatment, stated as such. */
function TaxSection() {
  const { lang } = useLang()
  return (
    <section className="bg-background">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Tratamiento tributario" : "Tax treatment"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                Deducible <em className="italic font-light">a ambos lados de la frontera.</em>
              </>
            ) : (
              <>
                Deductible <em className="italic font-light">on either side of the border.</em>
              </>
            )}
          </h2>
          <p className="text-body text-ink/75 mt-4">
            {lang === "es"
              ? "Donde declares impuestos determina la ruta de tu donación."
              : "Where you file determines the route your donation takes."}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Reveal>
            <div className="bg-surface rounded-sm p-8 h-full border-t-2 border-primary">
              <div className="text-meta uppercase tracking-widest text-muted">
                {lang === "es" ? "Si declaras en" : "If you file in the"}
              </div>
              <h3 className="text-h3 font-semibold text-primary mt-1">
                {lang === "es" ? "Estados Unidos" : "United States"}
              </h3>
              <dl className="mt-5 space-y-3 text-body">
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Vehículo" : "Vehicle"}
                  </dt>
                  <dd className="text-ink/80">University of the Andes Foundation</dd>
                </div>
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Estatus" : "Status"}
                  </dt>
                  <dd className="text-ink/80">
                    {lang === "es"
                      ? "501(c)(3), totalmente deducible, 4/4 en Charity Navigator"
                      : "501(c)(3), fully deductible, rated 4/4 on Charity Navigator"}
                  </dd>
                </div>
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Cómo pagar" : "How to pay"}
                  </dt>
                  <dd className="text-ink/80">
                    {lang === "es"
                      ? "En línea, transferencia o cheque. Muchas empresas duplican la donación."
                      : "Online, wire, or check. Many employers match."}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="bg-surface rounded-sm p-8 h-full border-t-2 border-primary">
              <div className="text-meta uppercase tracking-widest text-muted">
                {lang === "es" ? "Si declaras en" : "If you file in"}
              </div>
              <h3 className="text-h3 font-semibold text-primary mt-1">Colombia</h3>
              <dl className="mt-5 space-y-3 text-body">
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Vehículo" : "Vehicle"}
                  </dt>
                  <dd className="text-ink/80">Universidad de los Andes</dd>
                </div>
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Beneficio" : "Benefit"}
                  </dt>
                  <dd className="text-ink/80">
                    {lang === "es"
                      ? "Descuento tributario del 25% sobre la renta líquida"
                      : "A 25% tax benefit against renta líquida"}
                  </dd>
                </div>
                <div>
                  <dt className="text-meta uppercase tracking-widest text-muted">
                    {lang === "es" ? "Cómo pagar" : "How to pay"}
                  </dt>
                  <dd className="text-ink/80">
                    {lang === "es"
                      ? "Transferencia, PSE, tarjeta o cheque."
                      : "Transfer, PSE, card, or check."}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function OtherWaysSection() {
  const { lang, t } = useLang()
  return (
    <section id="other-ways" className="bg-surface scroll-mt-24">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <Reveal>
          <div className="text-meta uppercase tracking-widest text-muted mb-4">
            {lang === "es" ? "Otras formas de vincularse" : "Other ways to get involved"}
          </div>
          <h2 className="text-h2 font-semibold text-primary">
            {lang === "es" ? (
              <>
                No todo aporte <em className="italic font-light">es un cheque.</em>
              </>
            ) : (
              <>
                Not every contribution <em className="italic font-light">is a check.</em>
              </>
            )}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-12">
          {OTHER_WAYS.map((group, gi) => (
            <Reveal key={group.heading.en} delay={gi * 120}>
              <div className="border-t-2 border-primary pt-6">
                <h3 className="text-h3 font-semibold text-primary">{t(group.heading)}</h3>
                <ul className="mt-5 space-y-3">
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
                  Un Lumen cuesta <em className="italic font-semibold">US$50K.</em>
                </>
              ) : (
                <>
                  One Lumen costs <em className="italic font-semibold">US$50K.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6">
              {lang === "es"
                ? "Eso cubre diez semestres, una sesión de verano y el sostenimiento. Los patrocinadores lo financian. Otros aportan tiempo y acceso. Aquí está cómo funciona cada camino."
                : "That covers ten semesters, a summer session, and the living stipend. Sponsors fund it. Others give time and access. Here is how each route works."}
            </p>
          </Reveal>
        </div>
      </section>

      <SponsorsSection />
      <ReturnsSection />
      <TaxSection />
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
