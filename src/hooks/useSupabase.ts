import { useState, useEffect } from 'react';
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, user_id: user.id }])
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fee_structures')
        .insert([{ ...feeData, user_id: user.id }])
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .insert([{ ...paymentData, user_id: user.id }])
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

  // Discount Types
  const getDiscountTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discount_types')
        .select('*')
        .eq('is_active', true);
      
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
    // Payments
    getPayments,
    createPayment,
    // Discount Types
    getDiscountTypes,
  };
};