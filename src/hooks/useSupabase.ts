import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Generic error handler
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  // Generic success handler
  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  // Students
  const getStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch students");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').insert([studentData]).select();
      if (error) throw error;
      handleSuccess("Student added successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to add student");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, studentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('students').update(studentData).eq('id', id).select();
      if (error) throw error;
      handleSuccess("Student updated successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to update student");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      handleSuccess("Student deleted successfully");
      return true;
    } catch (error) {
      handleError(error, "Failed to delete student");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fee Structures
  const getFeeStructures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('fee_structures').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch fee structures");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createFeeStructure = async (feeData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('fee_structures').insert([feeData]).select();
      if (error) throw error;
      handleSuccess("Fee structure created successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to create fee structure");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFeeStructure = async (id: string, feeData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('fee_structures').update(feeData).eq('id', id).select();
      if (error) throw error;
      handleSuccess("Fee structure updated successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to update fee structure");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFeeStructure = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('fee_structures').delete().eq('id', id);
      if (error) throw error;
      handleSuccess("Fee structure deleted successfully");
      return true;
    } catch (error) {
      handleError(error, "Failed to delete fee structure");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Payments
  const getPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('payments').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch payments");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('payments').insert([paymentData]).select();
      if (error) throw error;
      handleSuccess("Payment recorded successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to record payment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, paymentData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('payments').update(paymentData).eq('id', id).select();
      if (error) throw error;
      handleSuccess("Payment updated successfully");
      return data ? data[0] : null;
    } catch (error) {
      handleError(error, "Failed to update payment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) throw error;
      handleSuccess("Payment deleted successfully");
      return true;
    } catch (error) {
      handleError(error, "Failed to delete payment");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Discount Types
  const getDiscountTypes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('discount_types').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch discount types");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Users
  const getUsers = async () => {
    setLoading(true);
    try {
      // This is a simplified example. In a real app, you'd fetch users
      // from a 'profiles' table or a view, not directly from auth.users
      // to avoid exposing sensitive data.
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    setLoading(true);
    try {
      // Step 1: Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed in Auth.");

      // Step 2: Directly create the user profile in the public.users table
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role,
      });

      if (profileError) throw profileError;

      handleSuccess("User created successfully");
      return true;
    } catch (error) {
      handleError(error, "Failed to create user");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('users').update(userData).eq('id', id).select();
        if (error) throw error;
        handleSuccess("User updated successfully");
        return data ? data[0] : null;
    } catch (error) {
        handleError(error, "Failed to update user");
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        handleSuccess("User deleted successfully");
        return true;
    } catch (error) {
        handleError(error, "Failed to delete user");
        return false;
    } finally {
        setLoading(false);
    }
  };

  return {
    loading,
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getFeeStructures,
    createFeeStructure,
    updateFeeStructure,
    deleteFeeStructure,
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getDiscountTypes,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
