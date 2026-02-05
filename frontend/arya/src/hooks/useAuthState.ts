import { useMemo } from 'react';
import { useProfile } from '@/hooks/queries';

const ADMIN_ROLES = new Set(['admin', 'superadmin']);

export const useAuthState = () => {
  const { data: profile, isLoading, isError } = useProfile();

  return useMemo(() => {
    const isAuthenticated = Boolean(profile) && !isError;
    const role = profile?.role;

    return {
      isAuthenticated,
      role,
      isAdmin: Boolean(role && ADMIN_ROLES.has(role)),
      isLoading,
    };
  }, [isError, isLoading, profile]);
};
