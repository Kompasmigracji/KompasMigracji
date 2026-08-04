-- ================================================================
-- MIGRATION: 045_contracts.sql
-- Client service contracts (Umowy o świadczenie usług prawnych) —
-- real DOMUS V ↔ client service agreements: status, value, validity period.
-- Replaces the fully-mocked /admin/contracts admin page.
-- ================================================================

-- Договори з клієнтами
CREATE TABLE IF NOT EXISTS contracts (
    id                SERIAL PRIMARY KEY,
    lead_id           INTEGER, -- без hard FK (тип лідів неоднозначний між kompas_leads/leads у різних модулях)
    client_full_name  VARCHAR(255) NOT NULL,
    client_contact    VARCHAR(255),
    contract_type     VARCHAR(50) NOT NULL DEFAULT 'inne'
                      CHECK (contract_type IN ('karta_pobytu', 'obywatelstwo', 'zezwolenie_pracy', 'legalizacja_firmy', 'inne')),
    title             VARCHAR(255) NOT NULL, -- людська назва/номер договору
    value_pln         NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency          VARCHAR(10) NOT NULL DEFAULT 'PLN',
    status            VARCHAR(50) NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'active', 'completed', 'terminated', 'expired')),
    signed_date       DATE,
    valid_from        DATE,
    valid_until       DATE,
    assigned_to       INTEGER REFERENCES kompas_users(id) ON DELETE SET NULL,
    notes             TEXT,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Журнал подій по договору (створення, зміна статусу, продовження, розірвання...)
CREATE TABLE IF NOT EXISTS contract_logs (
    id            SERIAL PRIMARY KEY,
    contract_id   INTEGER REFERENCES contracts(id) ON DELETE CASCADE,
    event         VARCHAR(255) NOT NULL,
    actor         VARCHAR(100),
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Індекси для фільтрів списку та пошуку договорів, що спливають
CREATE INDEX IF NOT EXISTS idx_contracts_status       ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_assigned_to  ON contracts(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contracts_valid_until  ON contracts(valid_until);
CREATE INDEX IF NOT EXISTS idx_contract_logs_contract_id ON contract_logs(contract_id);
