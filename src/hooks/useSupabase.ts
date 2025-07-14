import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demo purposes
const mockStudents = [
  {
    id: '1',
    admission_number: 'ADM001',
    first_name: 'John',
    middle_name: 'Michael',
    last_name: 'Doe',
    date_of_birth: '2010-05-15',
    gender: 'male',
    class: '8',
    section: 'A',
    roll_number: '001',
    date_of_admission: '2023-04-01',
    academic_year: '2024-25',
    father_name: 'Robert Doe',
    father_occupation: 'Engineer',
    father_contact: '+91-9876543210',
    father_email: 'robert.doe@email.com',
    mother_name: 'Mary Doe',
    mother_occupation: 'Teacher',
    mother_contact: '+91-9876543211',
    mother_email: 'mary.doe@email.com',
    guardian_name: '',
    guardian_relationship: '',
    guardian_contact: '',
    permanent_address: '123 Main Street, City',
    current_address: '123 Main Street, City',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin_code: '400001',
    country: 'India',
    discount_type: null,
    discount_percentage: null,
    discount_validity_period: '',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    admission_number: 'ADM002',
    first_name: 'Jane',
    middle_name: '',
    last_name: 'Smith',
    date_of_birth: '2009-08-22',
    gender: 'female',
    class: '9',
    section: 'B',
    roll_number: '002',
    date_of_admission: '2023-04-01',
    academic_year: '2024-25',
    father_name: 'James Smith',
    father_occupation: 'Doctor',
    father_contact: '+91-9876543212',
    father_email: 'james.smith@email.com',
    mother_name: 'Sarah Smith',
    mother_occupation: 'Nurse',
    mother_contact: '+91-9876543213',
    mother_email: 'sarah.smith@email.com',
    guardian_name: '',
    guardian_relationship: '',
    guardian_contact: '',
    permanent_address: '456 Oak Avenue, City',
    current_address: '456 Oak Avenue, City',
    city: 'Delhi',
    state: 'Delhi',
    pin_code: '110001',
    country: 'India',
    discount_type: 'SC',
    discount_percentage: 50,
    discount_validity_period: '2024-25',
    status: 'active',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
];

const mockFeeStructures = [
  {
    id: '1',
    class: '8',
    monthly_fees: {
      tuition: 5000,
      transport: 1500,
      meal: 1000,
      library: 200,
      lab: 300,
      sports: 500,
    },
    annual_fees: {
      admission: 10000,
      development: 5000,
      maintenance: 2000,
    },
    exam_fees: {
      quarterly: 500,
      halfYearly: 800,
      annual: 1200,
    },
    activity_fees: 2000,
    late_fee_percentage: 5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    class: '9',
    monthly_fees: {
      tuition: 5500,
      transport: 1500,
      meal: 1000,
      library: 200,
      lab: 400,
      sports: 500,
    },
    annual_fees: {
      admission: 12000,
      development: 6000,
      maintenance: 2500,
    },
    exam_fees: {
      quarterly: 600,
      halfYearly: 900,
      annual: 1400,
    },
    activity_fees: 2500,
    late_fee_percentage: 5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

const mockPayments = [
  {
    id: '1',
    student_id: '1',
    student_name: 'John Michael Doe',
    class: '8-A',
    amount: 8500,
    fee_type: 'Monthly Fee',
    payment_method: 'online',
    payment_date: '2024-01-15',
    due_date: '2024-01-10',
    status: 'paid',
    receipt_number: 'RCP-1705312800000',
    academic_year: '2024-25',
    month: 'January',
    remarks: 'Paid on time',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    student_id: '2',
    student_name: 'Jane Smith',
    class: '9-B',
    amount: 4250,
    fee_type: 'Monthly Fee',
    payment_method: 'cash',
    payment_date: '2024-01-20',
    due_date: '2024-01-10',
    status: 'paid',
    receipt_number: 'RCP-1705744800000',
    academic_year: '2024-25',
    month: 'January',
    remarks: 'SC discount applied (50%)',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
  },
];

// In-memory storage for demo
let studentsData = [...mockStudents];
let feeStructuresData = [...mockFeeStructures];
let paymentsData = [...mockPayments];

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Students
  const getStudents = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return studentsData;
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newStudent = {
        ...studentData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      studentsData.push(newStudent);
      
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      
      return newStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = studentsData.findIndex(s => s.id === id);
      if (index !== -1) {
        studentsData[index] = {
          ...studentsData[index],
          ...studentData,
          updated_at: new Date().toISOString(),
        };
        
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
        
        return studentsData[index];
      }
      throw new Error('Student not found');
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      studentsData = studentsData.filter(s => s.id !== id);
      
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fee Structures
  const getFeeStructures = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return feeStructuresData;
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fee structures",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createFeeStructure = async (feeData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newFeeStructure = {
        ...feeData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      feeStructuresData.push(newFeeStructure);
      
      toast({
        title: "Success",
        description: "Fee structure created successfully",
      });
      
      return newFeeStructure;
    } catch (error) {
      console.error('Error creating fee structure:', error);
      toast({
        title: "Error",
        description: "Failed to create fee structure",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeeStructure = async (id: string, feeData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = feeStructuresData.findIndex(f => f.id === id);
      if (index !== -1) {
        feeStructuresData[index] = {
          ...feeStructuresData[index],
          ...feeData,
          updated_at: new Date().toISOString(),
        };
        
        toast({
          title: "Success",
          description: "Fee structure updated successfully",
        });
        
        return feeStructuresData[index];
      }
      throw new Error('Fee structure not found');
    } catch (error) {
      console.error('Error updating fee structure:', error);
      toast({
        title: "Error",
        description: "Failed to update fee structure",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeeStructure = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      feeStructuresData = feeStructuresData.filter(f => f.id !== id);
      
      toast({
        title: "Success",
        description: "Fee structure deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      toast({
        title: "Error",
        description: "Failed to delete fee structure",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Payments
  const getPayments = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return paymentsData;
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const receiptNumber = `RCP-${Date.now()}`;
      
      const newPayment = {
        ...paymentData,
        id: Date.now().toString(),
        receipt_number: receiptNumber,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      paymentsData.push(newPayment);
      
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      
      return newPayment;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, paymentData: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = paymentsData.findIndex(p => p.id === id);
      if (index !== -1) {
        paymentsData[index] = {
          ...paymentsData[index],
          ...paymentData,
          updated_at: new Date().toISOString(),
        };
        
        toast({
          title: "Success",
          description: "Payment updated successfully",
        });
        
        return paymentsData[index];
      }
      throw new Error('Payment not found');
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      paymentsData = paymentsData.filter(p => p.id !== id);
      
      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Discount Types
  const getDiscountTypes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: '1', name: 'Right to Education', code: 'RTE', percentage: 100, is_active: true },
        { id: '2', name: 'Scheduled Caste', code: 'SC', percentage: 50, is_active: true },
        { id: '3', name: 'Economically Disadvantaged', code: 'ED', percentage: 25, is_active: true },
      ];
    } catch (error) {
      console.error('Error fetching discount types:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    // Students
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    // Fee Structures
    getFeeStructures,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    // Payments
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    // Discount Types
    getDiscountTypes,
  };
};