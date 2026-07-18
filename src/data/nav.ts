import type { L } from "../lib/i18n"

export const NAV_LINKS: ReadonlyArray<{ label: L; route: string }> = [
  { label: { en: "The Program", es: "El Programa" }, route: "" },
  { label: { en: "Scholars", es: "Estudiantes" }, route: "scholars" },
  { label: { en: "Team and Process", es: "Equipo y Proceso" }, route: "team" },
  { label: { en: "Get Involved", es: "Vincúlate" }, route: "get-involved" },
]
