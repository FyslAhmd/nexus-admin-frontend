import { useMemo } from 'react';
import { useAppSelector } from './useRedux';
import { UserRole, Project } from '../types';

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);

  const permissions = useMemo(
    () => ({
      // Role checks
      isAdmin: user?.role === UserRole.ADMIN,
      isManager: user?.role === UserRole.MANAGER,
      isStaff: user?.role === UserRole.STAFF,

      // Feature permissions
      canManageUsers: user?.role === UserRole.ADMIN,
      canCreateInvite: user?.role === UserRole.ADMIN,
      canCreateProject: !!user,
      canEditProject: (_project: Project) => user?.role === UserRole.ADMIN,
      canDeleteProject: (_project: Project) => user?.role === UserRole.ADMIN,
      canViewUsers: user?.role === UserRole.ADMIN,
    }),
    [user]
  );

  return permissions;
};

export default usePermissions;
