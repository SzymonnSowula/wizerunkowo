-- Fix RLS policies for users table
-- This migration adds the missing RLS policies for the users table

-- First, check if RLS is enabled on users table and enable it if not
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Users can view their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can insert their own data (for registration)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Service role can manage all users (for admin operations)
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Allow the trigger function to insert users (SECURITY DEFINER should handle this, but let's be explicit)
CREATE POLICY "Allow trigger function to insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Update the trigger function to be more explicit about permissions
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into our users table when auth.users gets a new user
  INSERT INTO users (id, email, full_name, subscription_tier, credits_remaining, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'free',
    1,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- In case user already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
