CREATE TABLE IF NOT EXISTS "MatchCommentary" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID NOT NULL REFERENCES "Fixture"(id) ON DELETE CASCADE,
  minute TEXT,
  text TEXT NOT NULL,
  is_key BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
