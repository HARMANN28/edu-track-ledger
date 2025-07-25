/*
  # Update Database Policies for RBAC Testing

  This migration updates all RLS policies to allow authenticated users full access
  to all tables, enabling testing of application-level RBAC implementation.

  ## Changes Made
  1. **Students Table**: Allow all authenticated users full CRUD access
  2. **Payments Table**: Allow all authenticated users full CRUD access  
  3. **Fee Structures Table**: Allow all authenticated users full CRUD access
  4. **Discount Types Table**: Allow all authenticated users full CRUD access
  5. **Users Table**: Allow all authenticated users full CRUD access

  ## Security Note
  This configuration is for RBAC testing purposes. The application-level RBAC
  will handle all access control logic.
*/

-- Drop existing policies for students table
DROP POLICY IF EXISTS "Admin full access to students" ON students;
DROP POLICY IF EXISTS "Non-admin read access to students" ON students;

-- Create new policy for students - allow all authenticated users full access
CREATE POLICY "Authenticated users full access to students"
  ON students
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for payments table
DROP POLICY IF EXISTS "Admin full access to payments" ON payments;
DROP POLICY IF EXISTS "Accountant full access to payments" ON payments;
DROP POLICY IF EXISTS "Teacher create and read payments" ON payments;
DROP POLICY IF EXISTS "Teacher insert payments" ON payments;

-- Create new policy for payments - allow all authenticated users full access
CREATE POLICY "Authenticated users full access to payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for fee_structures table
DROP POLICY IF EXISTS "Admin full access to fee_structures" ON fee_structures;
DROP POLICY IF EXISTS "Non-admin read access to fee_structures" ON fee_structures;

-- Create new policy for fee_structures - allow all authenticated users full access
CREATE POLICY "Authenticated users full access to fee_structures"
  ON fee_structures
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for discount_types table
DROP POLICY IF EXISTS "Admin full access to discount_types" ON discount_types;
DROP POLICY IF EXISTS "Non-admin read access to discount_types" ON discount_types;

-- Create new policy for discount_types - allow all authenticated users full access
CREATE POLICY "Authenticated users full access to discount_types"
  ON discount_types
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update users table policy to allow all authenticated users full access
-- Note: Keep the existing policy name but update its logic
DROP POLICY IF EXISTS "Users can view their own profile." ON users;

-- Create new policy for users - allow all authenticated users full access
CREATE POLICY "Authenticated users full access to users"
  ON users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);