import React from 'react';
import { StudentList } from '@/components/students/StudentList';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const Students: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'staff') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Student records and information</p>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access student management. This feature is only available for administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <StudentList />;
};