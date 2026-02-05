import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { env } from '@/utils/env';
import { useAuthState } from '@/hooks/useAuthState';

export const AdminRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthState();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (!isAdmin || !env.enableAdminUi) return <Navigate to="/dashboard" replace />;

  return children;
};

export const UiPreviewRoute = ({ children }: { children: ReactElement }) => {
  const canAccessUiPreview = env.appEnv === 'development' && env.enableMockApi;

  if (!canAccessUiPreview) return <Navigate to="/" replace />;

  return children;
};
