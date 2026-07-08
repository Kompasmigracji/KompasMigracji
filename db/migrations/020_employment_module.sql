-- Migration: 020_employment_module
-- Description: Creates tables for jobs and job applications

-- Table: kompas_jobs
CREATE TABLE IF NOT EXISTS kompas_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES kompas_users(id) ON DELETE SET NULL, -- Nullable if posted by admin
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    employment_type VARCHAR(100), -- e.g. "Full-time", "B2B", "Umowa o pracę"
    description TEXT,
    requirements JSONB DEFAULT '[]'::JSONB, -- List of required skills/certs
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: kompas_job_applications
CREATE TABLE IF NOT EXISTS kompas_job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES kompas_jobs(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES kompas_member_profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, review, interview, offered, rejected, hired
    ai_match_score INTEGER DEFAULT 0, -- Percentage match 0-100
    ai_match_reasoning TEXT, -- Explain why this is a good/bad match
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, member_id) -- Prevent duplicate applications
);

-- RLS Policies
ALTER TABLE kompas_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kompas_job_applications ENABLE ROW LEVEL SECURITY;

-- kompas_jobs policies
CREATE POLICY "Public can view active jobs" 
ON kompas_jobs FOR SELECT 
USING (status = 'active');

CREATE POLICY "Employers can manage their own jobs" 
ON kompas_jobs FOR ALL 
USING (employer_id = auth.uid());

CREATE POLICY "Admins can manage all jobs" 
ON kompas_jobs FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- kompas_job_applications policies
CREATE POLICY "Members can view their own applications" 
ON kompas_job_applications FOR SELECT 
USING (member_id IN (
    SELECT id FROM kompas_member_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Members can apply to jobs" 
ON kompas_job_applications FOR INSERT 
WITH CHECK (member_id IN (
    SELECT id FROM kompas_member_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Employers can view applications to their jobs" 
ON kompas_job_applications FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM kompas_jobs 
        WHERE kompas_jobs.id = kompas_job_applications.job_id 
        AND kompas_jobs.employer_id = auth.uid()
    )
);

CREATE POLICY "Employers can update application status" 
ON kompas_job_applications FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM kompas_jobs 
        WHERE kompas_jobs.id = kompas_job_applications.job_id 
        AND kompas_jobs.employer_id = auth.uid()
    )
);

CREATE POLICY "Admins can manage all applications" 
ON kompas_job_applications FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Setup updated_at trigger for kompas_jobs
CREATE OR REPLACE FUNCTION update_kompas_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kompas_jobs_updated_at_trigger
BEFORE UPDATE ON kompas_jobs
FOR EACH ROW
EXECUTE FUNCTION update_kompas_jobs_updated_at();

-- Setup updated_at trigger for kompas_job_applications
CREATE OR REPLACE FUNCTION update_kompas_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kompas_job_applications_updated_at_trigger
BEFORE UPDATE ON kompas_job_applications
FOR EACH ROW
EXECUTE FUNCTION update_kompas_job_applications_updated_at();
