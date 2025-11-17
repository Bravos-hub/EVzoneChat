/**
 * Session Timeout Service
 * Manages user session timeout and inactivity detection
 */

class SessionTimeoutService {
  constructor() {
    this.timeoutDuration = 30 * 60 * 1000; // 30 minutes default
    this.warningDuration = 5 * 60 * 1000; // 5 minutes before timeout
    this.timeoutTimer = null;
    this.warningTimer = null;
    this.lastActivity = Date.now();
    this.listeners = new Set();
    this.isActive = true;
  }

  /**
   * Initialize session timeout
   * @param {number} timeoutMs - Timeout duration in milliseconds
   * @param {number} warningMs - Warning duration before timeout
   */
  init(timeoutMs = null, warningMs = null) {
    if (timeoutMs) this.timeoutDuration = timeoutMs;
    if (warningMs) this.warningDuration = warningMs;

    this.resetTimer();
    this.setupActivityListeners();
  }

  /**
   * Setup activity listeners to detect user interaction
   */
  setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const updateActivity = () => {
      this.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Also track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateActivity();
      }
    });
  }

  /**
   * Update last activity timestamp
   */
  updateActivity() {
    if (!this.isActive) return;
    
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  /**
   * Reset timeout timer
   */
  resetTimer() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }

    // Set warning timer
    const warningTime = this.timeoutDuration - this.warningDuration;
    this.warningTimer = setTimeout(() => {
      this.notifyListeners('warning', {
        timeRemaining: this.warningDuration,
        message: `Your session will expire in ${Math.floor(this.warningDuration / 60000)} minutes due to inactivity.`
      });
    }, warningTime);

    // Set timeout timer
    this.timeoutTimer = setTimeout(() => {
      this.notifyListeners('timeout', {
        message: 'Your session has expired due to inactivity.'
      });
      this.handleTimeout();
    }, this.timeoutDuration);
  }

  /**
   * Handle session timeout
   */
  handleTimeout() {
    this.isActive = false;
    this.clearTimers();
    
    // Clear sensitive data
    this.clearSensitiveData();
    
    // Notify listeners
    this.notifyListeners('expired', {
      message: 'Session expired. Please log in again.'
    });
  }

  /**
   * Clear sensitive data (keys, tokens, etc.)
   */
  async clearSensitiveData() {
    // Clear localStorage tokens
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionData');
    } catch (e) {
      console.warn('Failed to clear tokens:', e);
    }

    // Clear IndexedDB keys (will be handled by encryption service)
    // This is just a placeholder - actual key clearing should be done by EncryptionService
  }

  /**
   * Add event listener
   * @param {Function} callback - Callback function
   */
  addListener(callback) {
    this.listeners.add(callback);
  }

  /**
   * Remove event listener
   * @param {Function} callback - Callback function
   */
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   * @param {string} event - Event type
   * @param {Object} data - Event data
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (e) {
        console.error('Error in session timeout listener:', e);
      }
    });
  }

  /**
   * Clear all timers
   */
  clearTimers() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
  }

  /**
   * Extend session (user clicked "Stay logged in")
   */
  extendSession() {
    this.updateActivity();
    this.notifyListeners('extended', {
      message: 'Session extended successfully.'
    });
  }

  /**
   * Get time remaining until timeout
   * @returns {number} Milliseconds until timeout
   */
  getTimeRemaining() {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.timeoutDuration - elapsed);
  }

  /**
   * Check if session is about to expire
   * @returns {boolean} True if within warning period
   */
  isWarningPeriod() {
    return this.getTimeRemaining() <= this.warningDuration;
  }

  /**
   * Destroy service (cleanup)
   */
  destroy() {
    this.clearTimers();
    this.listeners.clear();
    this.isActive = false;
  }
}

// Export singleton instance
const sessionTimeoutService = new SessionTimeoutService();
export default sessionTimeoutService;

