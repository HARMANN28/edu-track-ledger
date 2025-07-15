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
  {
    id: '3',
    admission_number: 'ADM003',
    first_name: 'Raj',
    middle_name: 'Kumar',
    last_name: 'Patel',
    date_of_birth: '2011-03-10',
    gender: 'male',
    class: '7',
    section: 'C',
    roll_number: '015',
    date_of_admission: '2023-04-01',
    academic_year: '2024-25',
    father_name: 'Suresh Patel',
    father_occupation: 'Business',
    father_contact: '+91-9876543214',
    father_email: 'suresh.patel@email.com',
    mother_name: 'Meera Patel',
    mother_occupation: 'Homemaker',
    mother_contact: '+91-9876543215',
    mother_email: 'meera.patel@email.com',
    guardian_name: '',
    guardian_relationship: '',
    guardian_contact: '',
    permanent_address: '789 Garden Street, City',
    current_address: '789 Garden Street, City',
    city: 'Pune',
    state: 'Maharashtra',
    pin_code: '411001',
    country: 'India',
    discount_type: 'RTE',
    discount_percentage: 100,
    discount_validity_period: '2024-25',
    status: 'active',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
];

const mockFeeStructures = [
  {
    id: '1',
    class: '7',
    monthly_fees: {
      tuition: 4500,
      transport: 1500,
      meal: 1000,
      library: 200,
      lab: 250,
      sports: 500,
    },
    annual_fees: {
      admission: 8000,
      development: 4000,
      maintenance: 1500,
    },
    exam_fees: {
      quarterly: 400,
      halfYearly: 700,
      annual: 1000,
    },
    activity_fees: 1500,
    late_fee_percentage: 5,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
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
    id: '3',
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

// Generate payments based on students and fee structures
const generatePaymentsForStudents = () => {
  const payments = [];
  let paymentId = 1;

  mockStudents.forEach(student => {
    const feeStructure = mockFeeStructures.find(fs => fs.class === student.class);
    if (!feeStructure) return;

    const monthlyTotal = Object.values(feeStructure.monthly_fees).reduce((sum, fee) => sum + fee, 0);
    const discountAmount = student.discount_percentage ? (monthlyTotal * student.discount_percentage / 100) : 0;
    const finalAmount = monthlyTotal - discountAmount;

    // Generate payments for different months
    const months = ['January', 'February', 'March', 'April', 'May'];
    const statuses = ['paid', 'paid', 'pending', 'pending', 'overdue'];

    months.forEach((month, index) => {
      const paymentDate = index < 2 ? `2024-0${index + 1}-15` : null;
      const dueDate = `2024-0${index + 1}-10`;
      
      payments.push({
        id: paymentId.toString(),
        student_id: student.id,
        student_name: `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`,
        class: `${student.class}-${student.section}`,
        amount: finalAmount,
        fee_type: 'Monthly Fee',
        payment_method: index % 2 === 0 ? 'online' : 'cash',
        payment_date: paymentDate,
        due_date: dueDate,
        status: statuses[index],
        receipt_number: paymentDate ? `RCP-${Date.parse(paymentDate)}` : null,
        academic_year: student.academic_year,
        month: month,
        remarks: student.discount_type ? `${student.discount_type} discount applied (${student.discount_percentage}%)` : 'Regular payment',
        created_at: paymentDate || `2024-0${index + 1}-10T10:00:00Z`,
        updated_at: paymentDate || `2024-0${index + 1}-10T10:00:00Z`,
      });
      paymentId++;
    });
  });

  return payments;
};

// In-memory storage for demo
let studentsData = [...mockStudents];
let feeStructuresData = [...mockFeeStructures];
let paymentsData = generatePaymentsForStudents();

// Helper function to recalculate payments when student data changes
const recalculatePaymentsForStudent = (studentId: string) => {
  const student = studentsData.find(s => s.id === studentId);
  if (!student) return;

  const feeStructure = feeStructuresData.find(fs => fs.class === student.class);
  if (!feeStructure) return;

  const monthlyTotal = Object.values(feeStructure.monthly_fees).reduce((sum, fee) => sum + fee, 0);
  const discountAmount = student.discount_percentage ? (monthlyTotal * student.discount_percentage / 100) : 0;
  const finalAmount = monthlyTotal - discountAmount;

  // Update existing payments for this student
  paymentsData = paymentsData.map(payment => {
    if (payment.student_id === studentId) {
      return {
        ...payment,
        student_name: `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`,
        class: `${student.class}-${student.section}`,
        amount: finalAmount,
        remarks: student.discount_type ? `${student.discount_type} discount applied (${student.discount_percentage}%)` : 'Regular payment',
      };
    }
    return payment;
  });
};

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Students
  const getStudents = async () => {
    setLoading(true);
    try {
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
      
      // Generate payments for the new student
      const feeStructure = feeStructuresData.find(fs => fs.class === newStudent.class);
      if (feeStructure) {
        const monthlyTotal = Object.values(feeStructure.monthly_fees).reduce((sum, fee) => sum + fee, 0);
        const discountAmount = newStudent.discount_percentage ? (monthlyTotal * newStudent.discount_percentage / 100) : 0;
        const finalAmount = monthlyTotal - discountAmount;

        const months = ['January', 'February', 'March', 'April', 'May'];
        months.forEach((month, index) => {
          const dueDate = `2024-0${index + 1}-10`;
          
          paymentsData.push({
            id: (Date.now() + index).toString(),
            student_id: newStudent.id,
            student_name: `${newStudent.first_name} ${newStudent.middle_name ? newStudent.middle_name + ' ' : ''}${newStudent.last_name}`,
            class: `${newStudent.class}-${newStudent.section}`,
            amount: finalAmount,
            fee_type: 'Monthly Fee',
            payment_method: 'cash',
            payment_date: null,
            due_date: dueDate,
            status: 'pending',
            receipt_number: null,
            academic_year: newStudent.academic_year,
            month: month,
            remarks: newStudent.discount_type ? `${newStudent.discount_type} discount applied (${newStudent.discount_percentage}%)` : 'Regular payment',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        });
      }
      
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
        
        // Recalculate payments for this student
        recalculatePaymentsForStudent(id);
        
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
      paymentsData = paymentsData.filter(p => p.student_id !== id);
      
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
      
      // Update payments for all students in this class
      const studentsInClass = studentsData.filter(s => s.class === feeData.class);
      studentsInClass.forEach(student => {
        recalculatePaymentsForStudent(student.id);
      });
      
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
        
        // Update payments for all students in this class
        const studentsInClass = studentsData.filter(s => s.class === feeData.class);
        studentsInClass.forEach(student => {
          recalculatePaymentsForStudent(student.id);
        });
        
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