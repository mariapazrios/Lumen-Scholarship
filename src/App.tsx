import { useEffect, useState } from "react"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Scholars from "./pages/Scholars"
import Team from "./pages/Team"
import GetInvolved from "./pages/GetInvolved"
import { initialLang, LANG_STORAGE_KEY, LangContext, type Lang } from "./lib/i18n"

/**
 * Dependency-free hash router.
 * Routes: #/ (home) · #/scholars · #/team · #/get-involved
 * A third segment deep-links to an anchor, e.g. #/scholars/daniel-alzate.
 */
function parseHash(): { route: string; anchor: string | null } {
  const hash = window.location.hash.replace(/^#\/?/, "")
  const [route = "", anchor = null] = hash.split("/") as [string, string | null]
  return { route, anchor }
}

const TITLES: Record<Lang, Record<string, string>> = {
  en: {
    "": "Lumen · Education-Based Social Mobility",
    scholars: "Meet the Students · Lumen",
    team: "Team and Process · Lumen",
    "get-involved": "Get Involved · Lumen",
  },
  es: {
    "": "Lumen · Movilidad Social Basada en Educación",
    scholars: "Conoce a los Estudiantes · Lumen",
    team: "Equipo y Proceso · Lumen",
    "get-involved": "Vincúlate · Lumen",
  },
}

function usePage(lang: Lang) {
  const [page, setPage] = useState(parseHash())

  useEffect(() => {
    const onHashChange = () => setPage(parseHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  // Scroll on navigation: to a deep-linked anchor if present, else to the top.
  useEffect(() => {
    document.title = TITLES[lang][page.route] ?? TITLES[lang][""]
    if (page.anchor) {
      // Let the page render before scrolling to the anchor.
      requestAnimationFrame(() => {
        document.getElementById(`scholar-${page.anchor}`)?.scrollIntoView({ block: "start" })
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [page, lang])

  return page
}

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const { route } = usePage(lang)

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const pages: Record<string, React.ReactNode> = {
    "": <Home />,
    scholars: <Scholars />,
    team: <Team />,
    "get-involved": <GetInvolved />,
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-sm"
        >
          {lang === "es" ? "Ir al contenido" : "Skip to content"}
        </a>
        <Header route={route in pages ? route : ""} />
        <main id="main" className="flex-1">
          {pages[route] ?? <Home />}
        </main>
        <Footer />
      </div>
    </LangContext.Provider>
  )
}
