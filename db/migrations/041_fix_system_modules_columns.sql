-- 041_fix_system_modules_columns.sql
-- Reconciles a schema-drift bug: 016_lifeos_core.sql and
-- 017_lifeos_engines_logs.sql both do `CREATE TABLE IF NOT EXISTS system_modules`
-- with DIFFERENT column names —
--   016: module_name varchar, is_active boolean, config jsonb, updated_at timestamptz
--   017: name text,        is_active boolean, settings jsonb, last_updated_at timestamptz
-- `IF NOT EXISTS` means only whichever of the two files ran first on a given
-- environment actually shaped the live table (both files run their CREATE TABLE
-- as part of one implicit/explicit multi-statement transaction; per
-- scripts/apply-migration-file.ts, the whole file is sent as a single
-- `client.query(sql)` call, so if the file that ran *second* then tried its
-- INSERT ... ON CONFLICT against a column that doesn't exist on the
-- already-created table, that entire file's transaction would have failed and
-- rolled back — net effect: only ONE of the two shapes is live, never a mix).
--
-- app/architect/page.tsx already reads `m.name` in production — this migration
-- guarantees that column exists no matter which of the two shapes is live,
-- without knowing (or needing to know) which one actually is. It is written
-- with information_schema checks so it is a safe no-op if `name` already
-- exists, and correctly migrates data (via RENAME, not a lossy add+drop) if
-- only `module_name` exists.
--
-- Also reconciles updated_at vs last_updated_at: 016 additionally creates a
-- `trg_system_modules_updated_at` trigger whose function (update_updated_at_column)
-- unconditionally does `NEW.updated_at = NOW()` on every UPDATE. If that
-- trigger exists (it does, if 016 was the file that ran) but the live table
-- only has `last_updated_at` (which would only happen if 017 shaped the table
-- while 016 still separately created the trigger against it — not possible
-- under the same-file-transaction reasoning above, but reconciled anyway as a
-- cheap defensive no-op) any UPDATE would fail at runtime with
-- "record NEW has no field updated_at". Reconciling this column too makes the
-- new PATCH endpoint in app/api/architect/modules/route.ts safe regardless.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'system_modules'
  ) THEN

    -- module_name -> name
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'module_name'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'name'
    ) THEN
      ALTER TABLE system_modules RENAME COLUMN module_name TO name;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'name'
    ) THEN
      ALTER TABLE system_modules ADD COLUMN name text;
    END IF;

    -- last_updated_at -> updated_at
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'last_updated_at'
    ) AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE system_modules RENAME COLUMN last_updated_at TO updated_at;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'system_modules' AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE system_modules ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;

  END IF;
END $$;
