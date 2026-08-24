# Lumen portal backend

Edge functions behind the board and sponsor portals. They exist so that ratings
can be shared between board members, and so that essays and the annual reports
are served only to an authenticated session instead of shipping inside the
client bundle.

| Route | Method | Who | Purpose |
|---|---|---|---|
| `/api/login` | POST | anyone | Exchange a role passcode for a session cookie |
| `/api/login` | GET | anyone | Report the role the caller's cookie carries, or 401 |
| `/api/ratings` | GET, POST | board | Read all ratings, upsert your own |
| `/api/availability` | GET, POST | board | Read everyone's interview-availability poll, replace your own hour slots |
| `/api/interviews` | GET, POST, PATCH, DELETE | board | The group calendar: book an interview (emails calendar invites), read it, save feedback, cancel |
| `/api/documents` | GET | board, sponsor | Fetch restricted documents |
| `/api/applicants` | GET | board | The roster joined to each candidate's essay, answers, and board notes |
| `/api/report` | GET | board, sponsor | Stream an annual report PDF |

Availability and interviews are board-only end to end: gated by the same
`allows(role, "board")` check as ratings, and there is no sponsor- or
candidate-facing surface anywhere in the app that reads either table.
Candidates never see this app at all; asking them for interview blackout
dates happens over email, outside the portal.

## Calendar invites

`POST /api/interviews` sends the two calendar invites itself, over the Resend
HTTP API. Needs three env vars, same pattern as the ones above:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | from resend.com |
| `EMAIL_FROM` | `Lumen <hq@lumenedu.org>`. All candidate-facing mail goes out from the Lumen HQ mailbox, never from a board member's personal or work address. Sending to real candidate/board addresses (not just your own Resend account email) needs `lumenedu.org` verified as a sending domain in Resend. |
| `BOARD_EMAILS` | a JSON object, board slug -> email, e.g. `{"oscar-cabrera":"...","cipriano-echavarria":"..."}`. Board member emails are personal data and belong only in this env var, never in `src/data/team.ts` (that file ships in the public bundle). |

If any of the three are missing, or a candidate/board member has no email on
file, booking still succeeds — the interview is created either way — and the
response's `warnings` array says what invite did not go out, so nothing fails
silently and nothing blocks scheduling on email being configured yet.

`GET /api/login` exists because the cookie is httpOnly: the browser cannot read
it, so after a reload the gate has no other way to tell a live session from an
expired one.

Sessions are HMAC-signed httpOnly cookies holding a role and a 12 hour expiry.
Board sessions can read anything a sponsor can; applicant material is board only.

## Setting it up

**1. Create the database.** In the Vercel dashboard for this project, open
Storage, create a Postgres database and attach it to the project. Vercel injects
`POSTGRES_URL` and friends automatically, which is what `@vercel/postgres` reads.

**2. Create the tables.** Open the database's Query tab and run
[`schema.sql`](./schema.sql).

`lumen_availability` and `lumen_interviews` are the exception: they also
self-provision on first request (`api/_ensure.ts`), because relying on a human
to have run the schema made the whole portal fail closed. A missing relation
threw a 500, which rejected the client's initial fetch, which left every tab
blank, including the ones that predate scheduling. `schema.sql` is still the
canonical definition; the DDL is duplicated there deliberately.

**3. Set the environment variables.** Project Settings, Environment Variables,
for Production and Preview:

| Name | Value |
|---|---|
| `SESSION_SECRET` | a long random string, e.g. `openssl rand -base64 32` |
| `BOARD_PASSCODE` | the code shared with the board |
| `SPONSOR_PASSCODE` | the code shared with sponsors |

Rotating a passcode is just editing the variable and redeploying. Rotating
`SESSION_SECRET` additionally signs everyone out, which is the fastest way to
revoke access in a hurry.

**4. Redeploy** so the functions pick up the variables.

## Loading documents

Documents are rows in `lumen_documents`, not files. `kind` controls access:

- `scholar-essay` — visible to sponsors and the board
- `scholar-grades` — visible to sponsors and the board
- `applicant-essay` — board only
- `applicant-answers` — board only; the ¿Quién soy? / ¿Quién quiero ser? short
  answers, kept apart from the essay because the board portal shows them apart
- `board-notes` — board only; one set of board meeting minutes per row,
  `subject` the meeting date (`'2026-08-15'`), `title` the meeting name, `body`
  plain text with blank lines between paragraphs. These carry candidate names
  next to rejection reasons, financial circumstances and, in the August 2026
  set, a scholar's medical diagnosis, so they cannot live in `src/data/` for
  exactly the same reason the essays and grades left it: that directory
  compiles into the public bundle and this repository is public. The board-notes
  tab in the portal fetches this kind.
- `applicant-board-notes` — board only; the board's own discussion notes on a
  candidate (strengths flagged, open questions to confirm at interview), as
  opposed to anything the candidate submitted. One row per candidate,
  `subject` their slug, `body` plain text. Since this carries candidate names
  alongside personal circumstances (estrato, household, city), the seed SQL
  that populates it must never be committed to this repo — it is public. Run
  it directly in the Vercel Query tab instead, matching by `name ILIKE`
  against `lumen_applicants` rather than a guessed slug, guarded so it only
  inserts when exactly one applicant matches.

The gate is `kind.startsWith("applicant") || kind.startsWith("board")`, so any
further `applicant-*` or `board-*` kind is board only by default. `subject` is a slug: the scholar's for `scholar-essay`,
the applicant's name slug (diacritics stripped, as with scholar photos) for the
applicant kinds, with the full name on `title`.

```sql
INSERT INTO lumen_documents (kind, subject, title, body, submitted_at)
VALUES ('scholar-essay', 'juan-angel-aicardy', 'Ensayo de admisión', $$...$$, '2023-12-17')
ON CONFLICT (kind, subject) DO UPDATE SET body = EXCLUDED.body;
```

### The reports

The two reports are rows in the same table, `kind = 'report'`, `subject` the
year (`'2024'`, `'2025'`), `body` the PDF as base64 with no line wrapping so
`atob` in the edge runtime can take it whole. They are deliberately not in
`public/`: everything there is served unauthenticated at its own URL, whatever
the repository's visibility, and both PDFs carry per-scholar averages and the
fund's financial position. `/api/report?year=2025` checks the cookie, decodes,
and answers `application/pdf`, so the sponsor card is a plain link.

The 2024 file was 4.8 MB, almost all of it one 300 DPI grayscale cover PNG; it
was recompressed to 200 DPI JPEG (1.7 MB) with every page's text byte-identical.
The 2025 file is vector and font weight rather than photography, so it did not
usefully compress and is stored as sent.

All eleven scholar essays are loaded. `src/data/scholarEssays.ts` held them
before this backend existed and has been deleted; `SponsorPortal` now fetches
`kind=scholar-essay` against the session cookie. Their `submitted_at` is null:
the source file carried no submission dates, and inventing them would be worse
than leaving the column empty.

### The grades

`kind = 'scholar-grades'`, `subject` the scholar's slug, `title` the degree
programme, `body` a JSON object: `program`, `asOf`, `cumulative`, `semesters`,
`terms`, `officialPga`, `complete`, `saber11`. `useScholarGrades()` in
[src/lib/grades.ts](../src/lib/grades.ts) fetches the whole set in one call and
parses each row.

These were in `src/data/` until 2026-08-05, which meant every scholar's
cumulative average, term history and Saber 11 score compiled into the public
bundle. The passcode gated the page and never the payload. Nothing academic
about a named student belongs in `src/data/` while the repository is public,
and it is public.

Term averages are credit-weighted, the way Uniandes computes a PGA. Where a
recomputed cumulative disagrees with `officialPga` by a hundredth, the
university's figure is authoritative: they truncate where this rounds. A term
with `average: null` means the scholar registered and finished nothing
gradeable, which the chart draws as a gap rather than a zero.

## The gates

`src/components/PasscodeGate.tsx` posts the typed code to `/api/login` and holds
nothing itself. No passcode ships in the bundle, and every route behind the gate
checks the cookie on its own, so rendering the page without the form gets you an
empty shell and a row of 401s.

Two things deliberately stay client-side, because neither is a credential:

- **Which board member you are.** One shared board code means the server cannot
  tell members apart, so the client names itself on each save
  (`lumen-board-member` in localStorage).
- **`src/pages/Apply.tsx`.** That gate gates public essay prompts, not scholar
  data, and is unchanged.
