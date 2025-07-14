-- Create enum types
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'transferred', 'withdrawn');
CREATE TYPE discount_code AS ENUM ('RTE', 'SC', 'ED');
CREATE TYPE payment_method AS ENUM ('cash', 'cheque', 'online', 'card');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue', 'partial');

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admission_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  date_of_admission DATE NOT NULL,
  academic_year TEXT NOT NULL,
  
  -- Parent/Guardian Details
  father_name TEXT NOT NULL,
  father_occupation TEXT NOT NULL,
  father_contact TEXT NOT NULL,
  father_email TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  mother_occupation TEXT NOT NULL,
  mother_contact TEXT NOT NULL,
  mother_email TEXT NOT NULL,
  guardian_name TEXT,
  guardian_relationship TEXT,
  guardian_contact TEXT,
  
  -- Address Information
  permanent_address TEXT NOT NULL,
  current_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  
  -- Discount Information
  discount_type discount_code,
  discount_percentage DECIMAL(5,2),
  discount_validity_period TEXT,
  
  -- Status
  status student_status NOT NULL DEFAULT 'active',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fee_structures table
CREATE TABLE public.fee_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class TEXT NOT NULL,
  
  -- Monthly Fees (stored as JSONB for flexibility)
  monthly_fees JSONB NOT NULL DEFAULT '{}',
  
  -- Annual Fees
  annual_fees JSONB NOT NULL DEFAULT '{}',
  
  -- Exam Fees
  exam_fees JSONB NOT NULL DEFAULT '{}',
  
  -- Activity Fees
  activity_fees DECIMAL(10,2) DEFAULT 0,
  
  -- Late Fee Percentage
  late_fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 5.0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(class)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  fee_type TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  receipt_number TEXT NOT NULL UNIQUE,
  academic_year TEXT NOT NULL,
  month TEXT,
  remarks TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discount_types table
CREATE TABLE public.discount_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code discount_code NOT NULL,
  description TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(code)
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Users can view their own students" 
ON public.students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own students" 
ON public.students 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students" 
ON public.students 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students" 
ON public.students 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for fee_structures
CREATE POLICY "Users can view their own fee structures" 
ON public.fee_structures 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fee structures" 
ON public.fee_structures 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fee structures" 
ON public.fee_structures 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fee structures" 
ON public.fee_structures 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" 
ON public.payments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" 
ON public.payments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for discount_types
CREATE POLICY "Users can view their own discount types" 
ON public.discount_types 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own discount types" 
ON public.discount_types 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discount types" 
ON public.discount_types 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discount types" 
ON public.discount_types 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_structures_updated_at
  BEFORE UPDATE ON public.fee_structures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discount_types_updated_at
  BEFORE UPDATE ON public.discount_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default discount types
INSERT INTO public.discount_types (name, code, description, percentage, user_id) 
VALUES 
  ('Right to Education', 'RTE', 'Students under Right to Education scheme', 100.0, '00000000-0000-0000-0000-000000000000'),
  ('Scheduled Caste', 'SC', 'Students from Scheduled Caste category', 50.0, '00000000-0000-0000-0000-000000000000'),
  ('Economically Disadvantaged', 'ED', 'Students from economically disadvantaged families', 75.0, '00000000-0000-0000-0000-000000000000')
ON CONFLICT (code) DO NOTHING;