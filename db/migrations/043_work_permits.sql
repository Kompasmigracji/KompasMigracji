-- Дозволи на працю (zezwolenie na pracę / oświadczenie o powierzeniu wykonywania pracy).
-- Відстеження заявок клієнтів на легалізацію працевлаштування у Польщі, ведеться
-- за тим самим шаблоном, що й enforcement_cases (015_enforcement_cases.sql):
-- основна таблиця + таблиця подій (лог), Kanban-етапи, "active"/"closed" статус.

CREATE TABLE IF NOT EXISTS work_permits (
    id                 SERIAL PRIMARY KEY,
    -- Без hard FK: клієнти (leads) живуть у різних таблицях залежно від того,
    -- яке з двох дерев CRM їх створило (app/admin/(panel) vs app/admin/crm) —
    -- те саме, чому tasks/deals/enforcement_cases.lead_id теж не FK-обмежені.
    lead_id            INTEGER,
    full_name          VARCHAR(255) NOT NULL,
    contact            VARCHAR(255),

    -- Реальні типи документів на легалізацію працевлаштування в Польщі:
    --   zezwolenie_typ_a/b/c/d/e — zezwolenie na pracę, typy A-E (Kodeks pracy, art. 88)
    --   zezwolenie_sezonowe       — zezwolenie na pracę sezonową (typ S)
    --   zezwolenie_jednolite      — jednolite zezwolenie na pobyt czasowy i pracę ("single permit")
    --   oswiadczenie              — oświadczenie o powierzeniu wykonywania pracy cudzoziemcowi (PUP)
    permit_type        VARCHAR(50) NOT NULL CHECK (permit_type IN (
                            'zezwolenie_typ_a',
                            'zezwolenie_typ_b',
                            'zezwolenie_typ_c',
                            'zezwolenie_typ_d',
                            'zezwolenie_typ_e',
                            'zezwolenie_sezonowe',
                            'zezwolenie_jednolite',
                            'oswiadczenie'
                        )),

    employer_name      VARCHAR(255),
    employer_nip       VARCHAR(20),
    voivodeship_office VARCHAR(255),  -- напр. "Mazowiecki UW", "Powiatowy Urząd Pracy Warszawa"
    application_number VARCHAR(100),  -- номер заявки/справи в уряді

    -- Етапи процесу: Підготовка документів -> Подано до Urzędu -> На розгляді -> Затверджено/Відхилено
    stage              VARCHAR(50) NOT NULL DEFAULT 'preparation' CHECK (stage IN (
                            'preparation',
                            'submitted',
                            'under_review',
                            'approved',
                            'rejected'
                        )),
    status             VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),

    submitted_date     DATE,
    -- Статутний термін розгляду заявки на дозвіл на працю в Польщі, як правило 30-60 днів.
    decision_deadline  DATE,

    notes              TEXT,
    assigned_to        INTEGER REFERENCES kompas_users(id) ON DELETE SET NULL,

    created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Історія подій по заявці (як enforcement_case_logs).
CREATE TABLE IF NOT EXISTS work_permit_logs (
    id         SERIAL PRIMARY KEY,
    permit_id  INTEGER REFERENCES work_permits(id) ON DELETE CASCADE,
    event      VARCHAR(255) NOT NULL,
    actor      VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_permits_status ON work_permits(status);
CREATE INDEX IF NOT EXISTS idx_work_permits_stage ON work_permits(stage);
CREATE INDEX IF NOT EXISTS idx_work_permits_assigned_to ON work_permits(assigned_to);
CREATE INDEX IF NOT EXISTS idx_work_permits_lead_id ON work_permits(lead_id);
CREATE INDEX IF NOT EXISTS idx_work_permit_logs_permit_id ON work_permit_logs(permit_id);
