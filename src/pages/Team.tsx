import Reveal from "../components/primitives/Reveal"
import AdmissionsProcess from "../components/AdmissionsProcess"
import { BOARD, type TeamMember } from "../data/team"
import { useLang } from "../lib/i18n"

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  const { lang, t } = useLang()
  return (
    <Reveal delay={delay}>
      <div className="group h-full">
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={`/team/${member.slug}.jpg`}
            alt={member.name}
            className="w-full aspect-[5/6] object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="mt-4">
          <span className="inline-block text-[11px] leading-none uppercase tracking-wide font-semibold text-accent border border-accent/30 rounded-full px-2.5 py-1.5 whitespace-nowrap">
            {t(member.industry)}
          </span>
        </div>
        {/* Reserved height keeps names (with or without the founder badge) aligned */}
        <h3 className="text-body font-semibold text-primary mt-3 leading-snug md:min-h-[2.6em]">
          {member.name}
          {member.founder && (
            <span className="ml-2 inline-block align-middle text-[10px] leading-none uppercase tracking-widest font-semibold text-white bg-accent rounded-full px-2 py-1">
              {lang === "es" ? "Fundadora" : "Founder"}
            </span>
          )}
        </h3>
        {/* Reserved height keeps the org line aligned across cards */}
        <div className="text-meta font-semibold text-ink/80 mt-1 md:min-h-[2.6em]">
          {t(member.org)}
        </div>
        {/* Reserved height keeps the interview-style block aligned across cards */}
        {member.credentials.length > 0 && (
          <div className="text-meta text-muted mt-2.5 leading-relaxed md:min-h-[5em] lg:min-h-[6.5em]">
            {member.credentials.join(" · ")}
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-ink/10">
          <div className="text-[11px] uppercase tracking-widest text-muted">
            {lang === "es" ? "Estilo de entrevista" : "Interview style"}
          </div>
          <p className="text-meta text-ink/70 mt-1.5 leading-relaxed">{t(member.interviewStyle)}</p>
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
                  Las personas <em className="italic font-semibold">detrás de Lumen.</em>
                </>
              ) : (
                <>
                  The people <em className="italic font-semibold">behind Lumen.</em>
                </>
              )}
            </h1>
            <p className="text-lead font-light text-primary-foreground/75 mt-6">
              {lang === "es"
                ? "Trayectorias en finanzas, derecho corporativo, consultoría, innovación y educación. Los miembros de la junta entrevistan a cada candidato y acompañan a cada estudiante."
                : "Backgrounds in finance, corporate law, consulting, innovation, and education. Board members interview every candidate and mentor every scholar."}
            </p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-10">
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
