import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Students
  const getStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
      
      return data;
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
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('fee_structures')
        .select('*')
        .order('class');

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('fee_structures')
        .insert([feeData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fee structure created successfully",
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('fee_structures')
        .update(feeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Fee structure updated successfully",
      });
      
      return data;
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
      const { error } = await supabase
        .from('fee_structures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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
      // Generate receipt number
      const receiptNumber = `RCP-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...paymentData, receipt_number: receiptNumber }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('payments')
        .update(paymentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment updated successfully",
      });
      
      return data;
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
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('discount_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
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