-- Судові справи / Оскарження (Litigation) — адміністративне оскарження
-- негативних рішень (odmowa), апеляції до WSA/NSA, wstrzymanie wykonania decyzji.
-- Дзеркалить структуру 015_enforcement_cases.sql, окремий модуль
-- (не плутати з enforcement_cases — це судові справи, а не komornik/борги).

CREATE TABLE IF NOT EXISTS litigation_cases (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER, -- без жорсткого FK: leads живуть у різних таблицях залежно від CRM-дерева
    full_name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    case_type VARCHAR(50) NOT NULL DEFAULT 'odwolanie_decyzja'
        CHECK (case_type IN (
            'odwolanie_decyzja',      -- Оскарження негативного рішення
            'skarga_wsa',             -- Скарга до Воєводського адмінсуду (WSA)
            'skarga_kasacyjna_nsa',   -- Касаційна скарга до Верховного адмінсуду (NSA)
            'wstrzymanie_wykonania',  -- Клопотання про зупинення виконання рішення
            'inne'                    -- Інше
        )),
    court_name VARCHAR(255),           -- напр. "WSA w Warszawie"
    case_signature VARCHAR(100),       -- номер справи в суді (sygnatura akt)
    opposing_decision_ref VARCHAR(255),-- реквізити рішення, що оскаржується
    stage VARCHAR(50) NOT NULL DEFAULT 'preparation'
        CHECK (stage IN (
            'preparation',       -- Підготовка скарги
            'filed',              -- Подано до суду
            'hearing_scheduled',  -- Призначено засідання
            'in_court',           -- Судовий розгляд
            'resolved'            -- Вирішено
        )),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'closed'
    filed_date DATE,
    hearing_date TIMESTAMP WITH TIME ZONE,
    deadline_date DATE,                -- статутний строк на оскарження (напр. 30 днів)
    notes TEXT,
    assigned_to INTEGER REFERENCES kompas_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS litigation_case_logs (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES litigation_cases(id) ON DELETE CASCADE,
    event VARCHAR(255) NOT NULL,
    actor VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_litigation_cases_stage       ON litigation_cases(stage);
CREATE INDEX IF NOT EXISTS idx_litigation_cases_status      ON litigation_cases(status);
CREATE INDEX IF NOT EXISTS idx_litigation_cases_assigned_to ON litigation_cases(assigned_to);
CREATE INDEX IF NOT EXISTS idx_litigation_cases_deadline    ON litigation_cases(deadline_date);
CREATE INDEX IF NOT EXISTS idx_litigation_case_logs_case_id ON litigation_case_logs(case_id);
