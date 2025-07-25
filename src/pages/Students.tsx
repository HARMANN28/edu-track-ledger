import React from 'react';
import { StudentList } from '@/components/students/StudentList';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const Students: React.FC = () => {
  const { user } = useAuth();

  // Only admins can add/edit students. Teachers and accountants can view.
  return <StudentList />;
};