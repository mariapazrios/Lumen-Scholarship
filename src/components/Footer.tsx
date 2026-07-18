import { useLang } from "../lib/i18n"

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <img src="/logo-white.svg" alt="Lumen" className="h-8 w-auto" />
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-10">
            <div className="text-meta uppercase tracking-widest text-primary-foreground/50">
              {lang === "es"
                ? "Movilidad social basada en educación"
                : "Education-Based Social Mobility"}
            </div>
            <div className="text-meta text-primary-foreground/50">
              {lang === "es"
                ? "© 2026 Lumen · En alianza con la Universidad de los Andes"
                : "© 2026 Lumen · In partnership with Universidad de los Andes"}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
