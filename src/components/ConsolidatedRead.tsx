import { isStale, ratingSpread, type InterviewConsolidated } from "../lib/interviewConsolidated"
import type { Interview } from "../lib/interviews"
import type { Lang } from "../lib/i18n"

/**
 * The board's consolidated read of one candidate's interviews, shown above the
 * individual notes it was written from on the Interview notes tab.
 *
 * Lives in its own file rather than inline in BoardPortal for two reasons: the
 * portal is already 2,900 lines, and this is the one block on the page whose
 * rendering is worth looking at directly during development, which needs it
 * importable from somewhere other than behind a passcode.
 */
export default function ConsolidatedRead({
  summary,
  rows,
  lang,
}: {
  summary: InterviewConsolidated | undefined
  /** Every live pairing for this candidate, written up or not. */
  rows: Interview[]
  lang: Lang
}) {
  if (!summary) return null

  const spread = ratingSpread(rows)
  const stale = isStale(summary, rows)
  const written = rows.filter((r) => r.feedback_text?.trim()).length
  const plural = (n: number, [one, many]: [string, string]) => (n === 1 ? one : many)

  return (
    <div className="mt-4 bg-surface rounded-sm px-5 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
        <span className="text-meta uppercase tracking-widest font-semibold text-primary">
          {lang === "es" ? "Lectura consolidada" : "Consolidated read"}
        </span>

        {/* Coverage, always, not only when it is short. Two reads consolidated
            look exactly like four on the page, and the difference is the whole
            question of how much the summary is worth. */}
        <span className="text-meta uppercase tracking-widest text-muted">
          {written} {lang === "es" ? "de" : "of"} {rows.length}{" "}
          {plural(rows.length, lang === "es" ? ["lectura", "lecturas"] : ["read", "reads"])}
        </span>

        {/* Burgundy, the palette's most serious state on a scale: a board that
            split 4/4 against 2/2 on one person is the thing on this card that
            has to be discussed rather than read. Two points apart on a 1-4
            scale is half the range, so that is the threshold. */}
        {spread != null && spread >= 2 && (
          <span className="text-meta uppercase tracking-widest font-semibold rounded-sm px-2 py-0.5 bg-accent-warm/15 text-accent-warm">
            {lang === "es" ? "Dividido" : "Split"} · {spread}{" "}
            {plural(spread, lang === "es" ? ["punto", "puntos"] : ["point", "points"])}
          </span>
        )}

        {stale && (
          <span className="text-meta uppercase tracking-widest font-semibold rounded-sm px-2 py-0.5 bg-accent/15 text-accent">
            {lang === "es" ? "Desactualizada" : "Out of date"}
          </span>
        )}
      </div>

      <p className="text-body text-ink/85 mt-3">
        {lang === "es" ? summary.summary.es : summary.summary.en}
      </p>

      {/* Said on every card rather than once at the top of the tab. This
          paragraph reads exactly like a colleague's write-up, and the one place
          it must not be mistaken for one is directly above four that are. */}
      <p className="text-meta text-muted mt-3">
        {stale &&
          (lang === "es"
            ? "Alguien escribió una nota después de este resumen, así que no la incluye. "
            : "Somebody wrote a note after this summary, so it is not in here. ")}
        {lang === "es"
          ? "Resumen derivado de las notas de abajo. No lo escribió un miembro de la junta."
          : "Summary derived from the notes below. No board member wrote it."}
      </p>
    </div>
  )
}
