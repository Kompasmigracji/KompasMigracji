-- Migration: 018_lifeos_monetization_cfo.sql
-- Description: Adds transactions table for Academy Monetization and CFO LLM analysis

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  product_id text NOT NULL, -- e.g., 'course_01'
  product_type text NOT NULL, -- e.g., 'academy_course', 'subscription'
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Only service role or authenticated endpoints (handled via Supabase client with anon/service) can insert.
-- We'll allow authenticated users to insert pending transactions for themselves.
CREATE POLICY "Users can create their own transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
