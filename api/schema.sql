-- Lumen portal schema. Run once against the Postgres database, then set the
-- environment variables listed in api/README.md.

-- One row per board member per candidate. The unique constraint is what makes
-- saving idempotent: a member editing their rating updates it rather than
-- stacking duplicates.
CREATE TABLE IF NOT EXISTS lumen_ratings (
  id            BIGSERIAL PRIMARY KEY,
  candidate     TEXT        NOT NULL,
  member        TEXT        NOT NULL,
  values        JSONB       NOT NULL,
  recommendation SMALLINT   NOT NULL CHECK (recommendation BETWEEN 1 AND 5),
  comments      TEXT        NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (candidate, member)
);

CREATE INDEX IF NOT EXISTS lumen_ratings_candidate ON lumen_ratings (candidate);

-- Restricted documents: admissions essays and anything else that must not sit
-- in the client bundle. `kind` drives access: applicant-* is board only.
CREATE TABLE IF NOT EXISTS lumen_documents (
  id           BIGSERIAL PRIMARY KEY,
  -- 'scholar-essay' | 'scholar-grades' | 'applicant-essay' | 'applicant-answers'
  -- | 'report'.
  -- Anything matching 'applicant%' is board only, so a new applicant-* kind
  -- inherits the right gate without touching api/documents.ts.
  kind         TEXT        NOT NULL,
  subject      TEXT        NOT NULL,   -- scholar slug, applicant slug, or report year
  title        TEXT        NOT NULL DEFAULT '',
  -- Essay text, or for kind='report' the PDF as unwrapped base64: the reports
  -- carry per-scholar averages and the fund's position, so they cannot sit in
  -- `public/`, which is served unauthenticated. api/report.ts streams them.
  body         TEXT        NOT NULL,
  submitted_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (kind, subject)
);

CREATE INDEX IF NOT EXISTS lumen_documents_kind ON lumen_documents (kind);

-- The invited candidate roster, from "Convocatoria LUMEN.xlsx" as sent by
-- Uniandes. Board only: it carries emails, estrato and Sisbén status. Score
-- columns are nullable because the 2026 intake arrived with placeholders
-- rather than real Saber results, and a fake score is worse than none.
CREATE TABLE IF NOT EXISTS lumen_applicants (
  slug         TEXT PRIMARY KEY,
  name         TEXT        NOT NULL,
  code         TEXT        NOT NULL DEFAULT '',
  email        TEXT        NOT NULL DEFAULT '',
  program      TEXT        NOT NULL DEFAULT '',
  gender       TEXT        NOT NULL DEFAULT '',
  city         TEXT        NOT NULL DEFAULT '',
  department   TEXT        NOT NULL DEFAULT '',
  age          NUMERIC,
  siblings     TEXT        NOT NULL DEFAULT '',
  housing      TEXT        NOT NULL DEFAULT '',
  estrato      TEXT        NOT NULL DEFAULT '',
  sisben       TEXT        NOT NULL DEFAULT '',
  school       TEXT        NOT NULL DEFAULT '',
  school_type  TEXT        NOT NULL DEFAULT '',
  graduated    TEXT        NOT NULL DEFAULT '',
  saber11      INTEGER,
  plc          INTEGER,
  pma          INTEGER,
  psc          INTEGER,
  pcn          INTEGER,
  pin          INTEGER,
  invited      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The board's interview-scheduling poll: which days each member can interview,
-- from now through the end of the admissions cycle. One row per member per
-- day they are available. `day` is stored as 'YYYY-MM-DD' text rather than a
-- DATE column so the edge function never has to round-trip through the
-- driver's date-to-JS-Date conversion, which shifts a date by one day for
-- anyone west of UTC.
CREATE TABLE IF NOT EXISTS lumen_availability (
  member     TEXT        NOT NULL,
  day        TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (member, day)
);

-- Booked interviews. Unlike lumen_availability's day-granularity poll, this is
-- a real appointment at a real instant, so scheduled_at is a proper
-- TIMESTAMPTZ: the client sends an unambiguous ISO instant (converted
-- server-side from the Bogotá wall-clock time entered in the booking form),
-- so there is no local-date/UTC round-trip to get wrong.
CREATE TABLE IF NOT EXISTS lumen_interviews (
  id               BIGSERIAL PRIMARY KEY,
  candidate        TEXT        NOT NULL,   -- lumen_applicants.slug
  member           TEXT        NOT NULL,   -- board slug, from src/data/team.ts
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_min     INTEGER     NOT NULL DEFAULT 30,
  location         TEXT        NOT NULL DEFAULT '',
  status           TEXT        NOT NULL DEFAULT 'scheduled', -- scheduled | canceled
  feedback_text    TEXT        NOT NULL DEFAULT '',
  feedback_verdict TEXT,       -- 'yes' | 'no' | 'maybe' | NULL (not yet given)
  created_by       TEXT        NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lumen_interviews_candidate ON lumen_interviews (candidate);
CREATE INDEX IF NOT EXISTS lumen_interviews_member ON lumen_interviews (member);
CREATE INDEX IF NOT EXISTS lumen_interviews_scheduled_at ON lumen_interviews (scheduled_at);
