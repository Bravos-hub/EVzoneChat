/**
 * Hook for Role-Based Access Control
 * Provides easy access to role and permission checks
 */

import { useState, useEffect, useCallback } from 'react';
import RoleBasedAccessService from '../services/RoleBasedAccessService';

export const useRoleBasedAccess = (userId = 'me') => {
  const [userRole, setUserRole] = useState('member');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
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

  const hasPermission = useCallback(async (permission) => {
    return await RoleBasedAccessService.hasPermission(userId, permission);
  }, [userId]);

  const canAccessChannel = useCallback(async (channelId, channelType, channelMembers = []) => {
    return await RoleBasedAccessService.canAccessChannel(userId, channelId, channelType, channelMembers);
  }, [userId]);

  const shouldShowFeature = useCallback(async (feature) => {
    return await RoleBasedAccessService.shouldShowFeature(userId, feature);
  }, [userId]);

  const canPerformAction = useCallback(async (targetId, action) => {
    return await RoleBasedAccessService.canPerformAction(userId, targetId, action);
  }, [userId]);

  const getRoleDisplayName = useCallback(() => {
    return RoleBasedAccessService.getRoleDisplayName(userRole);
  }, [userRole]);

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || userRole === 'admin';
  const isMember = ['member', 'moderator', 'admin'].includes(userRole);

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
    setUserRole: (role) => {
      RoleBasedAccessService.setUserRole(userId, role);
      setUserRole(role);
    }
  };
};

