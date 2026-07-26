import FlagCO from "./primitives/FlagCO"
import { useLang } from "../lib/i18n"

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-8xl mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/logo-white.svg" alt="Lumen" className="h-8 w-auto" />
            <div className="text-meta uppercase tracking-widest text-primary-foreground/50">
              {lang === "es"
                ? "Movilidad social basada en educación"
                : "Education-Based Social Mobility"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-meta text-primary-foreground/50">© 2026 Lumen</div>
            <FlagCO className="w-5 h-auto" />
          </div>
        </div>
      </div>
    </footer>
  )
}
