export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  class: string;
  section: string;
  rollNumber: string;
  dateOfAdmission: string;
  academicYear: string;
  
  // Parent/Guardian Details
  fatherName: string;
  
  motherName: string;
  
  
  
  // Address Information
  permanentAddress: string;
  
  
  // Discount Information
  discountType?: 'RTE' | 'SC' | 'ED';
  discountPercentage?: number;
  discountValidityPeriod?: string;
  
  // Status
  status: 'active' | 'inactive' | 'transferred' | 'withdrawn';
  pan_no?: string;
  apar_id?: string;
  samagra_id?: string;
  caste?: string;
  aadhar_no?: string;
  bank_account_no?: string;
  ifsc_code?: string;
  student_contact_no?: string;
  enrollment_no?: string;
}

export interface FeeStructure {
  id: string;
  class: string;
  monthlyFees: {
    tuition: number;
    transport?: number;
    meal?: number;
    library?: number;
    lab?: number;
    sports?: number;
  };
  annualFees: {
    admission?: number;
    development?: number;
    maintenance?: number;
  };
  examFees: {
    quarterly?: number;
    halfYearly?: number;
    annual?: number;
  };
  activityFees?: number;
  lateFeePercentage: number;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  feeType: string;
  paymentMethod: 'cash' | 'cheque' | 'online' | 'card';
  paymentDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  receiptNumber: string;
  academicYear: string;
  month?: string;
  remarks?: string;
}

export interface DiscountType {
  id: string;
  name: string;
  code: 'RTE' | 'SC' | 'ED';
  description: string;
  percentage: number;
  isActive: boolean;
}