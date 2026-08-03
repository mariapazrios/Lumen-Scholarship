/**
 * Academic standing per Lumen, from the Uniandes report "Reporte de notas -
 * Beneficiarios Lumen" (through 2025-2). These are the same figures Lumen
 * already reports to donors in the annual reports.
 *
 * Per-semester averages are absent because that report embeds its term tables
 * as images, so only the cumulative figure is machine readable.
 */
export type ScholarGrades = {
  program: string
  asOf: string
  cumulative: number
  semesters: string[]
}

export const SCHOLAR_GRADES: Record<string, ScholarGrades> = {
  "daniel-alzate": {
    "program": "Física",
    "asOf": "2025-2",
    "cumulative": 4.41,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "jose-maturana": {
    "program": "Ingeniería Industrial",
    "asOf": "2025-2",
    "cumulative": 3.22,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "juan-angel-aicardy": {
    "program": "Ingeniería de Sistemas y Computación",
    "asOf": "2025-2",
    "cumulative": 4.15,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "juan-daniel-gonzalo": {
    "program": "Ingeniería de Sistemas y Computación",
    "asOf": "2025-2",
    "cumulative": 3.92,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "juan-pablo-contreras": {
    "program": "Economía e Ingeniería Industrial",
    "asOf": "2025-2",
    "cumulative": 4.36,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "julian-rodriguez": {
    "program": "Ingeniería Electrónica",
    "asOf": "2025-2",
    "cumulative": 3.98,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "mateo-arcila": {
    "program": "Economía",
    "asOf": "2025-2",
    "cumulative": 4.64,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "santiago-rubiano": {
    "program": "Ingeniería Biomédica",
    "asOf": "2025-2",
    "cumulative": 4.33,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "valentina-salgado": {
    "program": "Ingeniería de Sistemas y Computación",
    "asOf": "2025-2",
    "cumulative": 3.71,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  },
  "valerie-suarez": {
    "program": "Química y Administración de Empresas",
    "asOf": "2025-2",
    "cumulative": 4.03,
    "semesters": [
      "2024-1",
      "2024-2",
      "2025-1",
      "2025-2"
    ]
  }
}

/**
 * Saber 11 (ICFES) global scores, recovered from the Uniandes postulados
 * files in Maria Paz's mail (2026-08-02).
 *
 * Generación 2024 comes from "Datos Postulados LUMEN - Quiero Estudiar
 * V21122023". No official score exists for Generación 2025: Uniandes admitted
 * that round by school performance and wrote "no contamos con este detalle"
 * next to every candidate; the Ciclo 2 file carries no Saber column at all.
 * Álzate's 432 is self-reported in his admissions essay and labeled as such.
 */
export type Saber11 = { score: number; selfReported?: boolean }

export const SCHOLAR_SABER11: Record<string, Saber11 | null> = {
  "juan-angel-aicardy": { score: 394 },
  "jose-maturana": { score: 399 },
  "juan-pablo-contreras": { score: 383 },
  "julian-rodriguez": { score: 386 },
  "sebastian-martinez": { score: 419 },
  "valerie-suarez": { score: 382 },
  "daniel-alzate": { score: 432, selfReported: true },
  "juan-daniel-gonzalo": null,
  "mateo-arcila": null,
  "santiago-rubiano": null,
  "valentina-salgado": null,
}
