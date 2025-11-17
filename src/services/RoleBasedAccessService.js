/**
 * Role-Based Access Control Service
 * Manages user roles and permissions for UI controls
 */

class RoleBasedAccessService {
  constructor() {
    // Default roles and permissions
    this.roles = {
      admin: {
        name: 'Admin',
        permissions: [
          'create_channel',
          'delete_channel',
          'manage_members',
          'promote_members',
          'demote_members',
          'remove_members',
          'view_logs',
          'moderate_messages',
          'ban_users',
          'edit_channel_settings',
          'pin_messages',
          'delete_any_message'
        ]
      },
      moderator: {
        name: 'Moderator',
        permissions: [
          'moderate_messages',
          'remove_members',
          'pin_messages',
          'delete_any_message',
          'view_channel_info'
        ]
      },
      member: {
        name: 'Member',
        permissions: [
          'send_messages',
          'view_channel_info',
          'react_to_messages'
        ]
      },
      guest: {
        name: 'Guest',
        permissions: [
          'view_channel_info'
        ]
      }
    };

    // Channel types and access rules
    this.channelTypes = {
      public: {
        name: 'Public',
        defaultAccess: ['member', 'moderator', 'admin'],
        canJoin: true
      },
      private: {
        name: 'Private',
        defaultAccess: ['member', 'moderator', 'admin'],
        canJoin: false // Requires invitation
      },
      announcement: {
        name: 'Announcement',
        defaultAccess: ['admin', 'moderator'],
        canJoin: true,
        canPost: ['admin', 'moderator']
      }
    };
  }

  /**
   * Get user role (in production, this would come from backend/auth)
   * @param {string} userId - User ID
   * @returns {Promise<string>} User role
   */
  async getUserRole(userId) {
    // In production, fetch from backend
    // For now, return from localStorage or default to 'member'
    try {
      const stored = localStorage.getItem(`userRole_${userId}`);
      return stored || 'member';
    } catch {
      return 'member';
    }
  }

  /**
   * Set user role (for demo/testing)
   * @param {string} userId - User ID
   * @param {string} role - Role name
   */
  setUserRole(userId, role) {
    if (!this.roles[role]) {
      console.warn(`Invalid role: ${role}`);
      return;
    }
    localStorage.setItem(`userRole_${userId}`, role);
  }

  /**
   * Check if user has permission
   * @param {string} userId - User ID
   * @param {string} permission - Permission name
   * @returns {Promise<boolean>} True if user has permission
   */
  async hasPermission(userId, permission) {
    const role = await this.getUserRole(userId);
    const roleData = this.roles[role];
    
    if (!roleData) return false;
    
    return roleData.permissions.includes(permission);
  }

  /**
   * Check if user can access channel
   * @param {string} userId - User ID
   * @param {string} channelId - Channel ID
   * @param {string} channelType - Channel type
   * @param {Array} channelMembers - Channel member IDs
   * @returns {Promise<boolean>} True if user can access
   */
  async canAccessChannel(userId, channelId, channelType, channelMembers = []) {
    const role = await this.getUserRole(userId);
    const channelConfig = this.channelTypes[channelType];

    if (!channelConfig) return false;

    // Admins can always access
    if (role === 'admin') return true;

    // Check if user is a member
    if (channelMembers.includes(userId)) return true;

    // Check default access for channel type
    if (channelConfig.defaultAccess.includes(role)) {
      return channelConfig.canJoin;
    }

    return false;
  }

  /**
   * Get UI visibility for feature based on role
   * @param {string} userId - User ID
   * @param {string} feature - Feature name
   * @returns {Promise<boolean>} True if feature should be visible
   */
  async shouldShowFeature(userId, feature) {
    const featurePermissions = {
      'create_channel': 'create_channel',
      'delete_channel': 'delete_channel',
      'manage_members': 'manage_members',
      'promote_member': 'promote_members',
      'demote_member': 'demote_members',
      'remove_member': 'remove_members',
      'view_logs': 'view_logs',
      'moderate': 'moderate_messages',
      'ban_user': 'ban_users',
      'edit_settings': 'edit_channel_settings',
      'pin_message': 'pin_messages',
      'delete_message': 'delete_any_message',
      'send_message': 'send_messages'
    };

    const permission = featurePermissions[feature];
    if (!permission) return true; // Default to visible if no permission mapping

    return await this.hasPermission(userId, permission);
  }

  /**
   * Get role display name
   * @param {string} role - Role key
   * @returns {string} Role display name
   */
  getRoleDisplayName(role) {
    return this.roles[role]?.name || role;
  }

  /**
   * Get all available roles
   * @returns {Array} Array of role objects
   */
  getAvailableRoles() {
    return Object.keys(this.roles).map(key => ({
      key,
      name: this.roles[key].name,
      permissions: this.roles[key].permissions
    }));
  }

  /**
   * Check if user can perform action on another user
   * @param {string} actorId - User performing action
   * @param {string} targetId - Target user
   * @param {string} action - Action name
   * @returns {Promise<boolean>} True if action is allowed
   */
  async canPerformAction(actorId, targetId, action) {
    const actorRole = await this.getUserRole(actorId);
    const targetRole = await this.getUserRole(targetId);

    // Users can't act on themselves (except for leaving)
    if (actorId === targetId && action !== 'leave') return false;

    // Admins can do everything
    if (actorRole === 'admin') return true;

    // Moderators can moderate members and guests
    if (actorRole === 'moderator') {
      if (['member', 'guest'].includes(targetRole)) {
        return ['remove_members', 'moderate_messages'].includes(action);
      }
    }

    // Members can only send messages and react
    if (actorRole === 'member') {
      return ['send_messages', 'react_to_messages'].includes(action);
    }

    return false;
  }

  /**
   * Get channel access indicator (lock icon, etc.)
   * @param {string} channelType - Channel type
   * @returns {Object} Access indicator data
   */
  getChannelAccessIndicator(channelType) {
    const config = this.channelTypes[channelType];
    if (!config) return { icon: null, label: null };

    if (channelType === 'private') {
      return {
        icon: 'lock',
        label: 'Private channel',
        color: '#f77f00'
      };
    }

    if (channelType === 'announcement') {
      return {
        icon: 'announcement',
        label: 'Announcement channel',
        color: '#03cd8c'
      };
    }

    return {
      icon: 'public',
      label: 'Public channel',
      color: '#a6a6a6'
    };
  }
}

// Export singleton instance
const roleBasedAccessService = new RoleBasedAccessService();
export default roleBasedAccessService;

