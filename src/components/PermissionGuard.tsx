import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  resource,
  action,
  children,
  fallback,
  showAlert = false,
}) => {
  const { hasPermission } = useRBAC();

  if (!hasPermission(resource, action)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showAlert) {
      return (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to {action} {resource}. Contact your administrator for access.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};