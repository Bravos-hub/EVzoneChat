export type UserRole = 'admin' | 'moderator' | 'member';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: UserRole;
}

export interface UserPermissions {
  canCreateChannel: boolean;
  canDeleteMessage: boolean;
  canManageUsers: boolean;
}

