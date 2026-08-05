import Reveal from "../components/primitives/Reveal"
import AdmissionsProcess from "../components/AdmissionsProcess"
import { BOARD, type TeamMember } from "../data/team"
import { useLang } from "../lib/i18n"

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  const { lang, t } = useLang()
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group h-full flex flex-col min-w-0">
        <div className="relative">
          {/* The founder's portrait carries a soft cobalt halo, the same
              radial-blur device the hero uses. It sits outside the image's
              overflow-hidden wrapper so it can bleed past the frame. */}
          {member.founder && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 blur-2xl opacity-35"
              style={{
                background:
                  "radial-gradient(ellipse at center, var(--color-cobalt) 0%, transparent 70%)",
              }}
            />
          )}
          <div
            className={`relative overflow-hidden rounded-sm ${
              member.founder ? "ring-1 ring-accent/40" : ""
            }`}
          >
            <img
              src={`/team/${member.slug}.jpg`}
              alt={member.name}
              className="w-full aspect-[5/6] object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>
        </div>
        {/* Industry and the founder badge share a row, so every name starts at the same latitude */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="inline-block text-[10px] leading-none uppercase tracking-wide font-semibold text-accent border border-accent/30 rounded-full px-2 py-1.5">
            {t(member.industry)}
          </span>
          {member.founder && (
            <span className="inline-block text-[10px] leading-none uppercase tracking-wide font-semibold text-white bg-accent rounded-full px-2 py-1.5 whitespace-nowrap">
              {lang === "es" ? "Fundadora" : "Founder"}
            </span>
          )}
        </div>
        {/* Reserved height keeps the org line aligned across cards */}
        <h3 className="text-body font-semibold text-primary mt-3 leading-snug break-words md:min-h-[2.6em]">
          {member.name}
        </h3>
        {/* Three lines: the Spanish "Profesora de bachillerato, Regis High School"
            is the longest org on the board and sets this floor. */}
        <div className="text-meta font-semibold text-ink/80 mt-1 break-words md:min-h-[4em]">
          {t(member.org)}
        </div>
        <div className="text-meta uppercase tracking-widest text-muted mt-1.5">
          {member.city}
        </div>
        {member.credentials.length > 0 && (
          /* Reserved height: with the divider pinned from above rather than
             below, this is what keeps every divider at the same latitude. */
          <div className="text-meta text-muted mt-2.5 leading-relaxed md:min-h-[7em]">
            {/* Real spaces around the dot keep "Blackstone · Sequence" breakable */}
            {member.credentials.map((c, i) => (
              <span key={c}>
                {i > 0 && (
                  <>
                    {" "}
                    <span aria-hidden="true" className="text-accent font-bold text-[1.3em] leading-none align-middle">
                      ·
                    </span>{" "}
                  </>
                )}
                {c}
              </span>
            ))}
          </div>
        )}
        {/* The quotes run from 66 to 415 characters, so the divider can no longer
            be pinned from the bottom: reserving for the longest would leave a
            third of a card empty under the shortest. It is pinned from above
            instead, by the reserved credentials height, and the quotes run to
            their natural depth. The ragged bottom edge is invisible. */}
        <div className="pt-3 border-t border-ink/10">
          <div
            className={`text-[11px] uppercase tracking-widest ${
              member.founder ? "text-accent font-semibold" : "text-muted"
            }`}
          >
            {member.founder
              ? lang === "es"
                ? "Mensaje de la fundadora"
                : "Founder's message"
              : lang === "es"
                ? "En sus palabras"
                : "Personal highlight"}
          </div>
          {/* Italic because these are their own words, not description of them.
              The founder's message is set upright and in full ink instead: it is
              the statement of intent for the programme, not a board member's
              reflection on it. */}
          <p
            className={`text-meta mt-1.5 leading-relaxed ${
              member.founder ? "text-ink" : "italic text-ink/70"
            }`}
          >
            {t(member.highlight)}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

export default function Team() {
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
              {lang === "es" ? "Equipo y proceso" : "Team and process"}
            </div>
            <h1 className="text-display font-light">
              {lang === "es" ? (
                <>
                  El <em className="italic font-semibold">equipo Lumen.</em>
                </>
              ) : (
                <>
                  The <em className="italic font-semibold">Lumen team.</em>
                </>
              )}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <Reveal>
            <h2 className="text-h2 font-semibold text-primary mb-12">
              {lang === "es" ? (
                <>
                  La Junta de <em className="italic font-light">Admisiones Lumen.</em>
                </>
              ) : (
                <>
                  The Lumen <em className="italic font-light">Board of Admissions.</em>
                </>
              )}
            </h2>
          </Reveal>
          {/* Six across only once columns are wide enough for the chips to sit on one line */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-5 gap-y-10">
            {BOARD.map((m, i) => (
              <MemberCard key={m.slug} member={m} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      <AdmissionsProcess
        id="process"
        tone="soft"
        eyebrow={{ en: "The admissions process", es: "El proceso de admisión" }}
      />
    </>
  )
}
