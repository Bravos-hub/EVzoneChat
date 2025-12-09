/**
 * Hook for Role-Based Access Control
 * Provides easy access to role and permission checks
 */

import { useState, useEffect, useCallback } from 'react';
import RoleBasedAccessService from '../services/RoleBasedAccessService';
import type { UserRole } from '../types/user';

interface UseRoleBasedAccessReturn {
  userRole: UserRole;
  isLoading: boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  canAccessChannel: (
    channelId: string,
    channelType: string,
    channelMembers?: string[]
  ) => Promise<boolean>;
  shouldShowFeature: (feature: string) => Promise<boolean>;
  canPerformAction: (targetId: string, action: string) => Promise<boolean>;
  getRoleDisplayName: () => string;
  isAdmin: boolean;
  isModerator: boolean;
  isMember: boolean;
  setUserRole: (role: UserRole) => void;
}

export const useRoleBasedAccess = (userId: string = 'me'): UseRoleBasedAccessReturn => {
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRole = async (): Promise<void> => {
      try {
        const role = await RoleBasedAccessService.getUserRole(userId);
        setUserRole(role);
      } catch (error) {
        console.error('Failed to load user role:', error);
        setUserRole('member');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadRole();
    }
  }, [userId]);

  const hasPermission = useCallback(
    async (permission: string): Promise<boolean> => {
      return await RoleBasedAccessService.hasPermission(userId, permission);
    },
    [userId]
  );

  const canAccessChannel = useCallback(
    async (
      channelId: string,
      channelType: string,
      channelMembers: string[] = []
    ): Promise<boolean> => {
      return await RoleBasedAccessService.canAccessChannel(
        userId,
        channelId,
        channelType,
        channelMembers
      );
    },
    [userId]
  );

  const shouldShowFeature = useCallback(
    async (feature: string): Promise<boolean> => {
      return await RoleBasedAccessService.shouldShowFeature(userId, feature);
    },
    [userId]
  );

  const canPerformAction = useCallback(
    async (targetId: string, action: string): Promise<boolean> => {
      return await RoleBasedAccessService.canPerformAction(userId, targetId, action);
    },
    [userId]
  );

  const getRoleDisplayName = useCallback((): string => {
    return RoleBasedAccessService.getRoleDisplayName(userRole);
  }, [userRole]);

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || userRole === 'admin';
  const isMember: boolean = ['member', 'moderator', 'admin'].includes(userRole);

  return {
    userRole,
    isLoading,
    hasPermission,
    canAccessChannel,
    shouldShowFeature,
    canPerformAction,
    getRoleDisplayName,
    isAdmin,
    isModerator,
    isMember,
    setUserRole: (role: UserRole) => {
      RoleBasedAccessService.setUserRole(userId, role);
      setUserRole(role);
    },
  };
};

