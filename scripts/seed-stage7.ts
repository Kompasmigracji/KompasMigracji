import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase via Postgres!');

    console.log('Creating required tables...');
    
    // Create base tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS kompas_jobs_v2 (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          salary_range VARCHAR(100),
          employment_type VARCHAR(100),
          description TEXT,
          requirements JSONB DEFAULT '[]'::JSONB,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS kompas_legal_cases_v2 (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          case_type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'Oczekuje na dokumenty',
          current_stage TEXT,
          deadline DATE,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS kompas_partners (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          rating DECIMAL(3,2),
          logo_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 1. Seed Jobs
    console.log('Seeding jobs...');
    await client.query(`
      INSERT INTO kompas_jobs_v2 (title, company_name, location, salary_range, employment_type, description, requirements)
      VALUES 
      ('Senior Frontend Developer', 'TechCorp Poland', 'Warsaw / Remote', '18,000 - 25,000 PLN (B2B)', 'B2B', 'We are looking for a Senior React/Next.js developer to join our core product team.', '["React", "Next.js", "TypeScript", "English B2", "Polish A2"]'),
      ('Project Manager', 'BuildIt Sp. z o.o.', 'Kraków', '12,000 - 16,000 PLN', 'Umowa o pracę', 'Manage IT projects and coordinate teams in a fast-paced environment.', '["Scrum", "Jira", "English C1", "Polish B2"]'),
      ('Warehouse Specialist', 'Logistix', 'Wrocław', '6,000 - 8,000 PLN', 'Umowa Zlecenie', 'Organize inventory and manage warehouse logistics.', '["No prior experience required", "Basic Polish"]')
      ON CONFLICT DO NOTHING;
    `);

    // 2. Seed Legal Cases
    console.log('Seeding legal cases...');
    await client.query(`
      INSERT INTO kompas_legal_cases_v2 (case_type, status, current_stage, notes, deadline)
      VALUES
      ('Karta Pobytu', 'active', 'Awaiting Fingerprints', 'Złożono wniosek do Urzędu Wojewódzkiego.', '2026-06-20'),
      ('Zezwolenie na pracę', 'blocked', 'Missing Documents', 'Необхідно донести довідку ZUS.', '2026-05-15')
      ON CONFLICT DO NOTHING;
    `);

    // 3. Seed Partners
    console.log('Seeding partners...');
    await client.query(`
      INSERT INTO kompas_partners (name, category, description, rating, logo_url)
      VALUES
      ('Lex Secure Poland', 'Юриспруденція', 'Провідна юридична фірма', 4.9, null),
      ('PZU Insurance', 'Страхування', 'Медичне та автострахування', 4.7, null)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding DB:', error);
  } finally {
    await client.end();
  }
}

run();
