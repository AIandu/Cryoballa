/*
# Fix RLS Policies for units and deployments tables

Security fix: Replace permissive USING (true) policies with proper ownership checks.
Adds user_id column to track ownership and restricts write operations to owners.
*/

-- Add user_id column to units table
ALTER TABLE units ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add user_id column to deployments table  
ALTER TABLE deployments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Drop existing permissive policies on units
DROP POLICY IF EXISTS "anon_select_units" ON units;
DROP POLICY IF EXISTS "anon_insert_units" ON units;
DROP POLICY IF EXISTS "anon_update_units" ON units;
DROP POLICY IF EXISTS "anon_delete_units" ON units;

-- Drop existing permissive policies on deployments
DROP POLICY IF EXISTS "anon_select_deployments" ON deployments;
DROP POLICY IF EXISTS "anon_insert_deployments" ON deployments;
DROP POLICY IF EXISTS "anon_update_deployments" ON deployments;
DROP POLICY IF EXISTS "anon_delete_deployments" ON deployments;

-- Create new secure policies for units (SELECT is public, writes require ownership)
CREATE POLICY "select_units" ON units FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_units" ON units FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_units" ON units FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_units" ON units FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create new secure policies for deployments (SELECT is public, writes require ownership)
CREATE POLICY "select_deployments" ON deployments FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_deployments" ON deployments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_deployments" ON deployments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_deployments" ON deployments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);