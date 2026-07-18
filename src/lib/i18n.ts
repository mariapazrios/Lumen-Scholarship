import { createContext, useContext } from "react"

export type Lang = "en" | "es"

/** A localized string. */
export type L = { en: string; es: string }
/** A localized list (e.g. story paragraphs, bullet highlights). */
export type LList = { en: string[]; es: string[] }

export const LANG_STORAGE_KEY = "lumen-lang"

export function initialLang(): Lang {
  const stored = localStorage.getItem(LANG_STORAGE_KEY)
  if (stored === "en" || stored === "es") return stored
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en"
}

export const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "en",
  setLang: () => {},
})

export function useLang() {
  const { lang, setLang } = useContext(LangContext)
  const t = (l: L) => l[lang]
  const tl = (l: LList) => l[lang]
  return { lang, setLang, t, tl }
}
