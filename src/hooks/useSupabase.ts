import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Students CRUD
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
      toast({
        title: "Error fetching students",
        description: error instanceof Error ? error.message : "Unknown error",
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
        title: "Student created",
        description: "Student has been added successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error creating student",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Student updated",
        description: "Student information has been updated successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error updating student",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Student deleted",
        description: "Student has been removed successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error deleting student",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fee Structures CRUD
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
      toast({
        title: "Error fetching fee structures",
        description: error instanceof Error ? error.message : "Unknown error",
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
        title: "Fee structure created",
        description: "Fee structure has been created successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error creating fee structure",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Fee structure updated",
        description: "Fee structure has been updated successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error updating fee structure",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Fee structure deleted",
        description: "Fee structure has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error deleting fee structure",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Payments CRUD
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
      toast({
        title: "Error fetching payments",
        description: error instanceof Error ? error.message : "Unknown error",
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
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Payment recorded",
        description: "Payment has been recorded successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error recording payment",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Payment updated",
        description: "Payment has been updated successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error updating payment",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
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
        title: "Payment deleted",
        description: "Payment has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error deleting payment",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Discount Types CRUD
  const getDiscountTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Error fetching discount types",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createDiscountType = async (discountData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_types')
        .insert([discountData])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Discount type created",
        description: "Discount type has been created successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error creating discount type",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDiscountType = async (id: string, discountData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_types')
        .update(discountData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Discount type updated",
        description: "Discount type has been updated successfully.",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error updating discount type",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscountType = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('discount_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Discount type deleted",
        description: "Discount type has been deleted successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error deleting discount type",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
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
    createDiscountType,
    updateDiscountType,
    deleteDiscountType,
  };
};