/**
 * Uniandes cohort averages by programme and semester, to August 2026.
 *
 * From "PGA a Ago26 comparado otros estudiantes.xlsx", sent by Uniandes: for
 * each programme, the average PGA of the students who are in that semester at
 * the same point in time. It is the comparison the scholars' own bars need,
 * because a 3.88 means something different in Ingeniería Industrial than in
 * Física.
 *
 * This is aggregate programme data with no student in it, which is why it can
 * sit in `src/data/` where the scholars' own grades deliberately cannot. It is
 * the same class of figure as the programme averages already public on the
 * landing page.
 *
 * Indexed by semester, so `[0]` is first semester. Uniandes supplied eight.
 */
export const COHORT_AVERAGES: Record<string, number[]> = {
  economia: [3.9, 3.94, 3.88, 3.97, 3.97, 4.02, 4.01, 3.96],
  fisica: [4.06, 4.14, 4.03, 4.18, 4.04, 4.17, 4.0, 3.96],
  "ing-biomedica": [4.0, 3.92, 3.8, 3.94, 3.87, 3.83, 3.98, 4.01],
  "ing-electronica": [4.09, 4.06, 3.85, 3.76, 3.96, 3.88, 3.91, 3.87],
  "ing-industrial": [3.9, 4.01, 3.88, 3.89, 3.82, 3.9, 3.87, 3.88],
  "ing-sistemas": [4.02, 3.95, 3.9, 3.87, 3.87, 3.92, 3.86, 3.96],
  quimica: [3.9, 4.09, 3.96, 4.12, 3.85, 4.31, 3.78, 3.89],
}

/**
 * Which cohort each scholar is measured against, keyed by slug rather than
 * matched on their programme string.
 *
 * The roster writes double programmes ("Economía e Ingeniería Industrial",
 * "Química y Administración de Empresas") while Uniandes files each scholar
 * under exactly one cohort in the source spreadsheet. Matching on the
 * programme text would have to guess which half counts; this records what
 * Uniandes actually compared them against.
 */
export const SCHOLAR_COHORT: Record<string, keyof typeof COHORT_AVERAGES> = {
  "julian-rodriguez": "ing-electronica",
  "juan-pablo-contreras": "economia",
  "valerie-suarez": "quimica",
  "sebastian-martinez": "ing-sistemas",
  "juan-angel-aicardy": "ing-sistemas",
  "santiago-rubiano": "ing-biomedica",
  "valentina-salgado": "ing-sistemas",
  "daniel-alzate": "fisica",
  "juan-daniel-gonzalo": "ing-sistemas",
  "mateo-arcila": "economia",
}
