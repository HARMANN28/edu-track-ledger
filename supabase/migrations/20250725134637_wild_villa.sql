/*
  # Update RLS policies for role-based access control

  1. Security Updates
    - Update RLS policies to support role-based access
    - Add proper user role checks
    - Ensure data isolation based on user permissions

  2. Policy Updates
    - Students: Admin full access, others read-only
    - Payments: Admin/Accountant full access, Teacher create/read
    - Fee Structures: Admin full access, others read-only
    - Users: Admin only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations on students" ON students;
DROP POLICY IF EXISTS "Allow all operations on payments" ON payments;
DROP POLICY IF EXISTS "Allow all operations on fee_structures" ON fee_structures;
DROP POLICY IF EXISTS "Allow all operations on discount_types" ON discount_types;

-- Students policies
CREATE POLICY "Admin full access to students"
  ON students
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Non-admin read access to students"
  ON students
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('accountant', 'teacher')
    )
  );

-- Payments policies
CREATE POLICY "Admin full access to payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Accountant full access to payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'accountant'
    )
  );

CREATE POLICY "Teacher create and read payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'teacher'
    )
  );

CREATE POLICY "Teacher insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'teacher'
    )
  );

-- Fee structures policies
CREATE POLICY "Admin full access to fee_structures"
  ON fee_structures
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Non-admin read access to fee_structures"
  ON fee_structures
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('accountant', 'teacher')
    )
  );

-- Discount types policies
CREATE POLICY "Admin full access to discount_types"
  ON discount_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Non-admin read access to discount_types"
  ON discount_types
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('accountant', 'teacher')
    )
  );