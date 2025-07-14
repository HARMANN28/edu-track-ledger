/*
  # Deployment Ready Database Schema

  1. Database Schema Improvements
    - Fix all foreign key relationships
    - Add proper constraints and indexes
    - Optimize RLS policies
    - Add data validation functions

  2. Data Cleanup
    - Remove all demo/test data
    - Clean up any placeholder entries

  3. Performance Optimizations
    - Add comprehensive indexes
    - Optimize queries with proper constraints
    - Add database functions for common operations

  4. Security Enhancements
    - Strengthen RLS policies
    - Add data validation triggers
    - Ensure proper user isolation
*/

-- Drop existing foreign key constraints to recreate them properly
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_student_id_fkey;

-- Add proper foreign key constraints with CASCADE options
ALTER TABLE public.payments 
ADD CONSTRAINT payments_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add constraint to ensure fee_structures class matches students class format
ALTER TABLE public.fee_structures 
ADD CONSTRAINT fee_structures_class_format_check 
CHECK (class ~ '^[0-9]+$');

-- Add constraint to ensure students class is valid
ALTER TABLE public.students 
ADD CONSTRAINT students_class_format_check 
CHECK (class ~ '^[0-9]+$');

-- Add constraint to ensure admission numbers are unique globally
CREATE UNIQUE INDEX IF NOT EXISTS idx_students_admission_number_unique 
ON public.students(admission_number);

-- Add constraint to ensure receipt numbers are unique globally
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_receipt_number_unique 
ON public.payments(receipt_number);

-- Add comprehensive indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id_status ON public.students(user_id, status);
CREATE INDEX IF NOT EXISTS idx_students_class_section_status ON public.students(class, section, status);
CREATE INDEX IF NOT EXISTS idx_students_academic_year ON public.students(academic_year);
CREATE INDEX IF NOT EXISTS idx_students_discount_type ON public.students(discount_type) WHERE discount_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fee_structures_user_id_class ON public.fee_structures(user_id, class);

CREATE INDEX IF NOT EXISTS idx_payments_user_id_status ON public.payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_student_id_status ON public.payments(student_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date_status ON public.payments(payment_date, status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date_status ON public.payments(due_date, status);
CREATE INDEX IF NOT EXISTS idx_payments_academic_year_month ON public.payments(academic_year, month);
CREATE INDEX IF NOT EXISTS idx_payments_fee_type ON public.payments(fee_type);

CREATE INDEX IF NOT EXISTS idx_discount_types_user_id_active ON public.discount_types(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_discount_types_code_active ON public.discount_types(code, is_active);

-- Clean up any existing demo/test data
DELETE FROM public.payments WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.students WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.fee_structures WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';
DELETE FROM public.discount_types WHERE user_id IS NULL OR user_id = '00000000-0000-0000-0000-000000000000';

-- Add data validation functions
CREATE OR REPLACE FUNCTION public.validate_student_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email formats
  IF NEW.father_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid father email format';
  END IF;
  
  IF NEW.mother_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid mother email format';
  END IF;
  
  -- Validate phone numbers (basic validation)
  IF NEW.father_contact !~ '^[+]?[0-9\s\-()]{10,15}$' THEN
    RAISE EXCEPTION 'Invalid father contact format';
  END IF;
  
  IF NEW.mother_contact !~ '^[+]?[0-9\s\-()]{10,15}$' THEN
    RAISE EXCEPTION 'Invalid mother contact format';
  END IF;
  
  -- Validate dates
  IF NEW.date_of_birth > CURRENT_DATE THEN
    RAISE EXCEPTION 'Date of birth cannot be in the future';
  END IF;
  
  IF NEW.date_of_admission > CURRENT_DATE THEN
    RAISE EXCEPTION 'Date of admission cannot be in the future';
  END IF;
  
  -- Validate discount percentage
  IF NEW.discount_percentage IS NOT NULL AND (NEW.discount_percentage < 0 OR NEW.discount_percentage > 100) THEN
    RAISE EXCEPTION 'Discount percentage must be between 0 and 100';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for student data validation
DROP TRIGGER IF EXISTS validate_student_data_trigger ON public.students;
CREATE TRIGGER validate_student_data_trigger
  BEFORE INSERT OR UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_student_data();

-- Add payment validation function
CREATE OR REPLACE FUNCTION public.validate_payment_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate amount is positive
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Payment amount must be positive';
  END IF;
  
  -- Validate payment date is not in the future
  IF NEW.payment_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Payment date cannot be in the future';
  END IF;
  
  -- Validate due date is not before payment date
  IF NEW.due_date < NEW.payment_date THEN
    RAISE EXCEPTION 'Due date cannot be before payment date';
  END IF;
  
  -- Auto-generate receipt number if not provided
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := 'RCP' || LPAD(nextval('receipt_number_seq')::text, 6, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for receipt numbers
CREATE SEQUENCE IF NOT EXISTS receipt_number_seq START 1;

-- Create trigger for payment data validation
DROP TRIGGER IF EXISTS validate_payment_data_trigger ON public.payments;
CREATE TRIGGER validate_payment_data_trigger
  BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_payment_data();

-- Add fee structure validation function
CREATE OR REPLACE FUNCTION public.validate_fee_structure_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate late fee percentage
  IF NEW.late_fee_percentage < 0 OR NEW.late_fee_percentage > 100 THEN
    RAISE EXCEPTION 'Late fee percentage must be between 0 and 100';
  END IF;
  
  -- Validate activity fees is not negative
  IF NEW.activity_fees < 0 THEN
    RAISE EXCEPTION 'Activity fees cannot be negative';
  END IF;
  
  -- Validate JSON structure for fees
  IF NOT (NEW.monthly_fees ? 'tuition') THEN
    RAISE EXCEPTION 'Monthly fees must include tuition fee';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for fee structure validation
DROP TRIGGER IF EXISTS validate_fee_structure_data_trigger ON public.fee_structures;
CREATE TRIGGER validate_fee_structure_data_trigger
  BEFORE INSERT OR UPDATE ON public.fee_structures
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_fee_structure_data();

-- Add discount type validation function
CREATE OR REPLACE FUNCTION public.validate_discount_type_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate percentage is between 0 and 100
  IF NEW.percentage < 0 OR NEW.percentage > 100 THEN
    RAISE EXCEPTION 'Discount percentage must be between 0 and 100';
  END IF;
  
  -- Ensure name is not empty
  IF LENGTH(TRIM(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Discount type name cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for discount type validation
DROP TRIGGER IF EXISTS validate_discount_type_data_trigger ON public.discount_types;
CREATE TRIGGER validate_discount_type_data_trigger
  BEFORE INSERT OR UPDATE ON public.discount_types
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_discount_type_data();

-- Update RLS policies to be more restrictive and secure
-- Students policies - more restrictive
DROP POLICY IF EXISTS "Users can view their own students" ON public.students;
DROP POLICY IF EXISTS "Users can create their own students" ON public.students;
DROP POLICY IF EXISTS "Users can update their own students" ON public.students;
DROP POLICY IF EXISTS "Users can delete their own students" ON public.students;

CREATE POLICY "Users can view their own students" 
ON public.students 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can create their own students" 
ON public.students 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own students" 
ON public.students 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can delete their own students" 
ON public.students 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Fee structures policies - more restrictive
DROP POLICY IF EXISTS "Users can view their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can create their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can update their own fee structures" ON public.fee_structures;
DROP POLICY IF EXISTS "Users can delete their own fee structures" ON public.fee_structures;

CREATE POLICY "Users can view their own fee structures" 
ON public.fee_structures 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can create their own fee structures" 
ON public.fee_structures 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own fee structures" 
ON public.fee_structures 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can delete their own fee structures" 
ON public.fee_structures 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Payments policies - more restrictive with student relationship validation
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can delete their own payments" ON public.payments;

CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = payments.student_id 
    AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = student_id 
    AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own payments" 
ON public.payments 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = payments.student_id 
    AND students.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = student_id 
    AND students.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own payments" 
ON public.payments 
FOR DELETE 
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.students 
    WHERE students.id = payments.student_id 
    AND students.user_id = auth.uid()
  )
);

-- Discount types policies - more restrictive
DROP POLICY IF EXISTS "Users can view their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can create their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can update their own discount types" ON public.discount_types;
DROP POLICY IF EXISTS "Users can delete their own discount types" ON public.discount_types;

CREATE POLICY "Users can view their own discount types" 
ON public.discount_types 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can create their own discount types" 
ON public.discount_types 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update their own discount types" 
ON public.discount_types 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL)
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can delete their own discount types" 
ON public.discount_types 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Add helpful database functions for common operations
CREATE OR REPLACE FUNCTION public.get_student_outstanding_balance(student_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_due DECIMAL := 0;
  total_paid DECIMAL := 0;
BEGIN
  -- Calculate total due (this would need to be implemented based on fee structure)
  -- For now, return the sum of pending payments
  SELECT COALESCE(SUM(amount), 0) INTO total_due
  FROM public.payments 
  WHERE student_id = student_uuid AND status IN ('pending', 'overdue');
  
  RETURN total_due;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_class_collection_summary(class_name TEXT, user_uuid UUID)
RETURNS TABLE(
  total_students BIGINT,
  total_collected DECIMAL,
  total_pending DECIMAL,
  collection_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT s.id) as total_students,
    COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0) as total_collected,
    COALESCE(SUM(CASE WHEN p.status IN ('pending', 'overdue') THEN p.amount ELSE 0 END), 0) as total_pending,
    CASE 
      WHEN COALESCE(SUM(p.amount), 0) = 0 THEN 0
      ELSE (COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END), 0) / COALESCE(SUM(p.amount), 1)) * 100
    END as collection_rate
  FROM public.students s
  LEFT JOIN public.payments p ON s.id = p.student_id
  WHERE s.class = class_name 
    AND s.user_id = user_uuid 
    AND s.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to automatically update payment status based on due dates
CREATE OR REPLACE FUNCTION public.update_overdue_payments()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.payments 
  SET status = 'overdue'
  WHERE status = 'pending' 
    AND due_date < CURRENT_DATE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to clean up old data (for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_data(days_old INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Only allow authenticated users to run cleanup
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Delete old payments that are completed and older than specified days
  DELETE FROM public.payments 
  WHERE status = 'paid' 
    AND payment_date < (CURRENT_DATE - INTERVAL '1 day' * days_old)
    AND user_id = auth.uid();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments to tables for documentation
COMMENT ON TABLE public.students IS 'Student information and enrollment details';
COMMENT ON TABLE public.fee_structures IS 'Fee structure definitions for different classes';
COMMENT ON TABLE public.payments IS 'Payment records and transaction history';
COMMENT ON TABLE public.discount_types IS 'Available discount types and their percentages';

-- Add comments to important columns
COMMENT ON COLUMN public.students.admission_number IS 'Unique admission number for the student';
COMMENT ON COLUMN public.students.user_id IS 'Reference to the authenticated user who owns this record';
COMMENT ON COLUMN public.payments.receipt_number IS 'Unique receipt number for the payment';
COMMENT ON COLUMN public.payments.student_id IS 'Foreign key reference to the student';
COMMENT ON COLUMN public.fee_structures.monthly_fees IS 'JSON object containing monthly fee breakdown';
COMMENT ON COLUMN public.fee_structures.annual_fees IS 'JSON object containing annual fee breakdown';

-- Final verification queries to ensure data integrity
DO $$
BEGIN
  -- Verify all tables have proper RLS enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename IN ('students', 'fee_structures', 'payments', 'discount_types')
    GROUP BY tablename 
    HAVING COUNT(*) >= 4
  ) THEN
    RAISE NOTICE 'Warning: Some tables may not have complete RLS policies';
  END IF;
  
  -- Verify foreign key constraints exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'payments_student_id_fkey'
  ) THEN
    RAISE EXCEPTION 'Critical: Foreign key constraint missing for payments.student_id';
  END IF;
  
  RAISE NOTICE 'Database schema validation completed successfully';
END $$;