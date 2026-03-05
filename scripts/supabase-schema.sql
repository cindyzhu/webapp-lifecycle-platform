-- ============================================================
-- Web App Lifecycle Platform — Supabase Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Auto-update updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLE: apps
-- ============================================================
CREATE TABLE apps (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL UNIQUE,
  display_name     TEXT NOT NULL,
  active_rule      TEXT NOT NULL,
  entry_dev        TEXT NOT NULL DEFAULT '',
  entry_test       TEXT NOT NULL DEFAULT '',
  entry_staging    TEXT NOT NULL DEFAULT '',
  entry_production TEXT NOT NULL DEFAULT '',
  props            JSONB NOT NULL DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active', 'inactive', 'deprecated')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER apps_updated_at
  BEFORE UPDATE ON apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: environments
-- ============================================================
CREATE TABLE environments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  domain       TEXT NOT NULL DEFAULT '',
  cluster      TEXT NOT NULL DEFAULT 'shared'
               CHECK (cluster IN ('shared', 'dedicated')),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER environments_updated_at
  BEFORE UPDATE ON environments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TABLE: deployments
-- ============================================================
CREATE TABLE deployments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id       UUID NOT NULL REFERENCES apps(id) ON DELETE CASCADE,
  environment  TEXT NOT NULL,
  version      TEXT NOT NULL DEFAULT '',
  url          TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'success'
               CHECK (status IN ('success', 'failed', 'rollback', 'in_progress')),
  deployed_by  TEXT NOT NULL DEFAULT 'system',
  notes        TEXT NOT NULL DEFAULT '',
  deployed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX deployments_app_id_idx ON deployments(app_id);
CREATE INDEX deployments_deployed_at_idx ON deployments(deployed_at DESC);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO environments (name, display_name, domain, cluster, sort_order) VALUES
  ('test',          'Test',          '', 'shared',    1),
  ('staging',       'Staging',       '', 'shared',    2),
  ('production',    'Production',    '', 'dedicated', 3),
  ('international', 'International', '', 'dedicated', 4);

INSERT INTO apps (name, display_name, active_rule, entry_dev, props) VALUES
  ('sub-supplier', '商户管理', '/supplier', 'http://localhost:5174', '{}'),
  ('sub-goods',    '商品管理', '/goods',    'http://localhost:5175', '{}');
