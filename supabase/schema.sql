-- ============================================
-- SolMate — Complete Database Schema
-- Sol Sports Club · AI Coaching Assistant
-- ============================================
-- Run this file in Supabase SQL Editor to create all tables.
-- Tables are created in dependency order (parents before children).

-- ============================================
-- 1. COACHES
-- ============================================
CREATE TABLE IF NOT EXISTS coaches (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  club        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE coaches IS 'Registered coaches on the SolMate platform.';

-- ============================================
-- 2. TEAMS
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  age_group   TEXT NOT NULL,
  league      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teams_coach_id ON teams(coach_id);

COMMENT ON TABLE teams IS 'Youth soccer teams managed by coaches.';

-- ============================================
-- 3. PAIN POINTS
-- ============================================
CREATE TABLE IF NOT EXISTS pain_points (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'resolved')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pain_points_team_id ON pain_points(team_id);
CREATE INDEX idx_pain_points_status  ON pain_points(status);

COMMENT ON TABLE pain_points IS 'Team pain points / areas of improvement identified by the coach.';

-- ============================================
-- 4. DRILLS
-- ============================================
CREATE TABLE IF NOT EXISTS drills (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id           UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  coach_id          UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  category          TEXT,
  duration_minutes  INTEGER,
  voice_transcript  TEXT,
  drill_plan        JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_drills_team_id  ON drills(team_id);
CREATE INDEX idx_drills_coach_id ON drills(coach_id);

COMMENT ON TABLE drills IS 'AI-generated drill plans, optionally created from voice input.';

-- ============================================
-- 5. DRILL STEPS
-- ============================================
CREATE TABLE IF NOT EXISTS drill_steps (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drill_id          UUID NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
  step_number       INTEGER NOT NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  duration_minutes  INTEGER
);

CREATE INDEX idx_drill_steps_drill_id ON drill_steps(drill_id);

-- Prevent duplicate step numbers within the same drill
ALTER TABLE drill_steps
  ADD CONSTRAINT uq_drill_steps_drill_step
  UNIQUE (drill_id, step_number);

COMMENT ON TABLE drill_steps IS 'Ordered steps within a drill plan.';
