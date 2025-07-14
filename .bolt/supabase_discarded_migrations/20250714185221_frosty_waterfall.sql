/*
  # Fix Database Connections and Remove Demo Data

  1. Database Schema Updates
    - Add proper foreign key constraints
    - Add indexes for better performance
    - Update RLS policies for proper data isolation

  2. Data Cleanup
    - Remove demo discount types
    - Clean up any test data

  3. Performance Improvements
    - Add indexes on frequently queried columns
    - Optimize RLS policies
*/

-- Add proper foreign key constraint for student_id in payments table
-- First, let's make sure the constraint doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'payments_student_id_fkey' 
    AND table_name = 'payments'
  ) THEN
    -- Add the foreign key constraint if it doesn't exist
    ALTER TABLE public.payments 
    ADD CONSTRAINT payments_student_id_fkey 
    FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_class_section ON public.students(class, section);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);

CREATE INDEX IF NOT EXISTS idx_fee_structures_user_id ON public.fee_structures(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_structures_class ON public.fee_structures(class);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON public.payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_academic_year ON public.payments(academic_year);

CREATE INDEX IF NOT EXISTS idx_discount_types_user_id ON public.discount_types(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_types_code ON public.discount_types(code);
CREATE INDEX IF NOT EXISTS idx_discount_types_active ON public.discount_types(is_active);

-- Remove demo data from discount_types table
DELETE FROM public.discount_types WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Update RLS policies to be more specific and secure
-- Drop existing policies and recreate them with better security

-- Students policies
DROP POLICY IF EXISTS "Users can view their own students" ON public.students;
DROP POLICY IF EXISTS "Users can create their own students" ON public.students;
DROP POLICY IF EXISTS "Users can update their own students" ON public.students;
DROP POLICY IF EXISTS "Users can delete their own students" ON public.students;

CREATE POLICY "Users can view their own students" 
ON public.students 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own students" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students" 
ON public.students 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Fee structures policies
DROP POLICY IF EXISTS "Users can view their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can create their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can update their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can delete their own fee structures" ON public.fee_structures;

CREATE POLICY "Users can view their own fee structures" 
ON public.fee_structures 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fee structures" 
ON public.fee_structures 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fee structures" 
ON public.fee_structures 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fee structures" 
ON public.fee_structures 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Payments policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can delete their own payments" ON public.payments;

CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" 
ON public.payments 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" 
ON public.payments 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Discount types policies
DROP POLICY IF EXISTS "Users can view their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can create their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can update their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can delete their own discount types" ON public.discount_types;

CREATE POLICY "Users can view their own discount types" 
ON public.discount_types 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own discount types" 
ON public.discount_types 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discount types" 
ON public.discount_types 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discount types" 
ON public.discount_types 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Add function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_students ON public.students;
CREATE TRIGGER set_user_id_students
  BEFORE INSERT ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_user_id_fee_structures ON public.fee_structures;
CREATE TRIGGER set_user_id_fee_structures
  BEFORE INSERT ON public.fee_structures
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_user_id_payments ON public.payments;
CREATE TRIGGER set_user_id_payments
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_user_id_discount_types ON public.discount_types;
CREATE TRIGGER set_user_id_discount_types
  BEFORE INSERT ON public.discount_types
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();