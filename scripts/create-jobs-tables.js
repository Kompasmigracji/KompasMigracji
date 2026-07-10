require('dotenv').config({ path: '.env.local' });
const { q } = require('../lib/db.js');
async function createTables() {
  try {
    console.log('Creating kompas_jobs_v2 table...');
    await q(`
      CREATE TABLE IF NOT EXISTS kompas_jobs_v2 (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        company_name TEXT NOT NULL,
        location TEXT NOT NULL,
        salary_range TEXT NOT NULL,
        employment_type TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements JSONB NOT NULL DEFAULT '[]',
        ai_match_reasoning TEXT,
        ai_match_score INTEGER DEFAULT 80,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('kompas_jobs_v2 created successfully.');

    console.log('Creating kompas_job_applications table...');
    await q(`
      CREATE TABLE IF NOT EXISTS kompas_job_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL REFERENCES kompas_jobs_v2(id) ON DELETE CASCADE,
        user_id UUID,
        client_id UUID,
        status TEXT DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('kompas_job_applications created successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
