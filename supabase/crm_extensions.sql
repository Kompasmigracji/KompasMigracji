-- 1. Add RODO/GDPR consent tracking columns to member profiles
ALTER TABLE kompas_member_profiles ADD COLUMN IF NOT EXISTS rodo_consented_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE kompas_member_profiles ADD COLUMN IF NOT EXISTS rodo_consent_source VARCHAR(100); -- e.g., 'uk_plans_page', 'tg_bot'
ALTER TABLE kompas_member_profiles ADD COLUMN IF NOT EXISTS rodo_consent_version VARCHAR(20);

-- 2. GDPR Consent Action logs table for legal audit
CREATE TABLE IF NOT EXISTS kompas_rodo_consent_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES kompas_users(id) ON DELETE SET NULL,
    email VARCHAR(255),
    phone VARCHAR(100),
    action_type VARCHAR(50) NOT NULL, -- 'give_consent', 'withdraw_consent', 'request_deletion'
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Expenses tracking ledger (semi-automated entry)
CREATE TABLE IF NOT EXISTS kompas_expenses (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- 'marketing', 'legal_partners', 'salaries', 'infrastructure'
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PLN',
    description TEXT,
    paid_at DATE NOT NULL,
    recorded_by INT REFERENCES kompas_users(id),
    invoice_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. VAT Invoices metadata reference table
CREATE TABLE IF NOT EXISTS kompas_invoices (
    id SERIAL PRIMARY KEY,
    due_id INT REFERENCES kompas_dues(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    pdf_url TEXT,
    vat_rate NUMERIC(4,2) DEFAULT 23.00,
    net_amount NUMERIC(10,2) NOT NULL,
    gross_amount NUMERIC(10,2) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Team Commission Rules configuration table
CREATE TABLE IF NOT EXISTS kompas_commission_rules (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES kompas_users(id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- 'percent_total', 'flat_lead', 'percent_service'
    rule_value NUMERIC(10, 2) NOT NULL, -- value of % or flat fee
    service_slug VARCHAR(100), -- optional filter if rule_type is 'percent_service'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Commissions earned tracking ledger
CREATE TABLE IF NOT EXISTS kompas_commissions_earned (
    id SERIAL PRIMARY KEY,
    rule_id INT REFERENCES kompas_commission_rules(id) ON DELETE SET NULL,
    due_id INT REFERENCES kompas_dues(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    user_id INT REFERENCES kompas_users(id) ON DELETE CASCADE,
    calculated_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'calculated', -- 'calculated', 'approved', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
