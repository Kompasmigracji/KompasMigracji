-- Створення таблиці виконавчих справ
CREATE TABLE IF NOT EXISTS enforcement_cases (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    case_number VARCHAR(100), -- Sygnatura akt
    executor_name VARCHAR(255), -- Ім'я виконавця (Komornik)
    debt_amount NUMERIC(12, 2), -- Сума боргу/стягнення
    stage VARCHAR(50) DEFAULT 'analysis', -- 'analysis', 'negotiation', 'execution', 'court'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'closed'
    assigned_to INTEGER REFERENCES kompas_users(id) ON DELETE SET NULL,
    notes TEXT,
    deadline_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці логів для виконавчих справ
CREATE TABLE IF NOT EXISTS enforcement_case_logs (
    id SERIAL PRIMARY KEY,
    case_id INTEGER REFERENCES enforcement_cases(id) ON DELETE CASCADE,
    event VARCHAR(255) NOT NULL,
    actor VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
