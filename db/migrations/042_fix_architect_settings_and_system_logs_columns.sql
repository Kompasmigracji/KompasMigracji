-- 042_fix_architect_settings_and_system_logs_columns.sql
-- Same root cause as 041 (016_lifeos_core.sql and 017_lifeos_engines_logs.sql
-- both `CREATE TABLE IF NOT EXISTS` the same table names with different
-- columns; whichever ran first wins, the other's incompatible INSERT fails
-- and rolls its whole file back) — applied here to the other two tables that
-- collide the same way:
--
--   architect_settings: 016 uses key_name/value_json, 017 uses key/value.
--   system_logs:         016 uses meta,               017 uses details.
--
-- Canonicalize to `key`/`value` and `details` — the names already used by
-- real, working code: app/architect/page.tsx reads `log.details` for the
-- latest SoulEngine/FateEngine entries, and app/api/cron/lifeos/route.ts
-- (the real, scheduled daily cron) writes `details`. lib/lifeos/alexDigital.ts
-- is updated in this same change set to write `details` instead of `meta` so
-- every writer/reader agrees on one shape after this migration runs.
--
-- Idempotent: safe no-op if the canonical column already exists; renames
-- (not lossy add+drop) if only the old name exists; adds the column fresh
-- only if neither exists (defensive fallback, not expected to fire given
-- both source migrations always create one or the other).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'architect_settings'
  ) THEN

    -- key_name -> key
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'key_name'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'key'
    ) THEN
      ALTER TABLE architect_settings RENAME COLUMN key_name TO key;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'key'
    ) THEN
      ALTER TABLE architect_settings ADD COLUMN key text;
    END IF;

    -- value_json -> value
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'value_json'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'value'
    ) THEN
      ALTER TABLE architect_settings RENAME COLUMN value_json TO value;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'architect_settings' AND column_name = 'value'
    ) THEN
      ALTER TABLE architect_settings ADD COLUMN value jsonb;
    END IF;

  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'system_logs'
  ) THEN

    -- meta -> details
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_logs' AND column_name = 'meta'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_logs' AND column_name = 'details'
    ) THEN
      ALTER TABLE system_logs RENAME COLUMN meta TO details;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_logs' AND column_name = 'details'
    ) THEN
      ALTER TABLE system_logs ADD COLUMN details jsonb;
    END IF;

  END IF;
END $$;
