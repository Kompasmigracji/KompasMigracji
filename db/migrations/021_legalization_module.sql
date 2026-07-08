-- Stage 4: Legalization & Migration Module

-- Table for tracking legal cases (e.g., Karta Pobytu, Visa)
CREATE TABLE IF NOT EXISTS public.kompas_legal_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.kompas_users(id) ON DELETE CASCADE,
    case_type TEXT NOT NULL, -- e.g., 'Karta Pobytu', 'Wiza', 'Obywatelstwo'
    status TEXT NOT NULL DEFAULT 'Oczekuje na dokumenty', -- 'Oczekuje na dokumenty', 'W toku', 'Decyzja pozytywna', 'Odmowa'
    submission_date DATE,
    expected_decision_date DATE,
    urgency_level TEXT DEFAULT 'Normal', -- 'Normal', 'High', 'Critical'
    case_notes TEXT,
    assigned_lawyer_id UUID, -- Reference to an admin/lawyer user if needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table for tracking specific steps of a case (e.g., fingerprints taken)
CREATE TABLE IF NOT EXISTS public.kompas_legal_case_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES public.kompas_legal_cases(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL, -- e.g., 'Złożenie wniosku', 'Odciski palców', 'Decyzja'
    step_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed'
    step_date DATE,
    step_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Row Level Security (RLS)
ALTER TABLE public.kompas_legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kompas_legal_case_steps ENABLE ROW LEVEL SECURITY;

-- Users can read their own cases
CREATE POLICY "Users can read their own legal cases" ON public.kompas_legal_cases
    FOR SELECT USING (auth.uid() = user_id);

-- Users can read the steps of their own cases
CREATE POLICY "Users can read steps of their own legal cases" ON public.kompas_legal_case_steps
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.kompas_legal_cases
            WHERE kompas_legal_cases.id = kompas_legal_case_steps.case_id
            AND kompas_legal_cases.user_id = auth.uid()
        )
    );

-- Admins can do everything (assumes admin role logic)
-- Add RLS for admin if applicable
