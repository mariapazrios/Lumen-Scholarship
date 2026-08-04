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
| `/api/documents` | GET | board, sponsor | Fetch restricted documents |
| `/api/applicants` | GET | board | The roster joined to each candidate's essay and answers |
| `/api/report` | GET | board, sponsor | Stream an annual report PDF |

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
- `applicant-essay` — board only
- `applicant-answers` — board only; the ¿Quién soy? / ¿Quién quiero ser? short
  answers, kept apart from the essay because the board portal shows them apart

The gate is `kind.startsWith("applicant")`, so any further `applicant-*` kind is
board only by default. `subject` is a slug: the scholar's for `scholar-essay`,
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
`public/`: this repo is public, and both PDFs carry per-scholar averages and the
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
