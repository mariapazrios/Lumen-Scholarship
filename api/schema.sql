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
  -- 'scholar-essay' | 'applicant-essay' | 'applicant-answers'. Anything
  -- matching 'applicant%' is board only, so a new applicant-* kind inherits
  -- the right gate without touching api/documents.ts.
  kind         TEXT        NOT NULL,
  subject      TEXT        NOT NULL,   -- scholar slug or applicant slug
  title        TEXT        NOT NULL DEFAULT '',
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
