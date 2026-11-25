import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export function defaultAuthenticatedPath(permissions: string[] = []): string {
  if (permissions.includes('reports.view')) return '/dashboard';
  if (permissions.includes('sales.create')) return '/pos';
  if (permissions.includes('sales.view_all') || permissions.includes('sales.view_own')) return '/sales';
  return '/login';
}

export function PermissionRoute({ permission, permissions, children }: { permission?: string; permissions?: string[]; children: ReactNode }) {
  const { user } = useAuth();
  const allowed = permission ? user?.permissions.includes(permission) : permissions?.some((item) => user?.permissions.includes(item));
  if (!allowed) {
    return <Navigate to={defaultAuthenticatedPath(user?.permissions)} replace />;
  }
  return children;
}
