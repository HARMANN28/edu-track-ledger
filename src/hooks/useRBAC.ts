import { useAuth } from '@/components/AuthProvider';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

export const useRBAC = () => {
  const { user } = useAuth();

  const permissions: Record<string, Permission[]> = {
    admin: [
      // Full access to all resources
      { resource: 'students', action: 'create' },
      { resource: 'students', action: 'read' },
      { resource: 'students', action: 'update' },
      { resource: 'students', action: 'delete' },
      { resource: 'payments', action: 'create' },
      { resource: 'payments', action: 'read' },
      { resource: 'payments', action: 'update' },
      { resource: 'payments', action: 'delete' },
      { resource: 'fee-structure', action: 'create' },
      { resource: 'fee-structure', action: 'read' },
      { resource: 'fee-structure', action: 'update' },
      { resource: 'fee-structure', action: 'delete' },
      { resource: 'reports', action: 'read' },
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'settings', action: 'read' },
      { resource: 'settings', action: 'update' },
    ],
    accountant: [
      // View all sections, edit/add payments only
      { resource: 'students', action: 'read' },
      { resource: 'payments', action: 'create' },
      { resource: 'payments', action: 'read' },
      { resource: 'payments', action: 'update' },
      { resource: 'fee-structure', action: 'read' },
      { resource: 'reports', action: 'read' },
      { resource: 'users', action: 'read' },
    ],
    teacher: [
      // View all sections, add payments only
      { resource: 'students', action: 'read' },
      { resource: 'payments', action: 'create' },
      { resource: 'payments', action: 'read' },
      { resource: 'fee-structure', action: 'read' },
      { resource: 'reports', action: 'read' },
      { resource: 'users', action: 'read' },
    ],
  };

  const hasPermission = (resource: string, action: 'create' | 'read' | 'update' | 'delete'): boolean => {
    if (!user?.role) return false;
    
    const userPermissions = permissions[user.role] || [];
    return userPermissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  };

  const canCreate = (resource: string) => hasPermission(resource, 'create');
  const canRead = (resource: string) => hasPermission(resource, 'read');
  const canUpdate = (resource: string) => hasPermission(resource, 'update');
  const canDelete = (resource: string) => hasPermission(resource, 'delete');

  return {
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    userRole: user?.role,
  };
};