/**
 * Session Timeout Service
 * Manages user session timeout and inactivity detection
 */

type SessionTimeoutCallback = (event: string, data: any) => void;

interface TimeoutEventData {
  timeRemaining?: number;
  message: string;
}

class SessionTimeoutService {
  private timeoutDuration: number = 30 * 60 * 1000; // 30 minutes default
  private warningDuration: number = 5 * 60 * 1000; // 5 minutes before timeout
  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private warningTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivity: number = Date.now();
  private listeners: Set<SessionTimeoutCallback> = new Set();
  private isActive: boolean = true;

  /**
   * Initialize session timeout
   */
  init(timeoutMs: number | null = null, warningMs: number | null = null): void {
    if (timeoutMs) this.timeoutDuration = timeoutMs;
    if (warningMs) this.warningDuration = warningMs;

    this.resetTimer();
    this.setupActivityListeners();
  }

  /**
   * Setup activity listeners to detect user interaction
   */
  private setupActivityListeners(): void {
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
  updateActivity(): void {
    if (!this.isActive) return;
    
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  /**
   * Reset timeout timer
   */
  private resetTimer(): void {
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
  private handleTimeout(): void {
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
  private async clearSensitiveData(): Promise<void> {
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
   */
  addListener(callback: SessionTimeoutCallback): void {
    this.listeners.add(callback);
  }

  /**
   * Remove event listener
   */
  removeListener(callback: SessionTimeoutCallback): void {
    this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(event: string, data: TimeoutEventData): void {
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
  private clearTimers(): void {
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
  extendSession(): void {
    this.updateActivity();
    this.notifyListeners('extended', {
      message: 'Session extended successfully.'
    });
  }

  /**
   * Get time remaining until timeout
   */
  getTimeRemaining(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.timeoutDuration - elapsed);
  }

  /**
   * Check if session is about to expire
   */
  isWarningPeriod(): boolean {
    return this.getTimeRemaining() <= this.warningDuration;
  }

  /**
   * Destroy service (cleanup)
   */
  destroy(): void {
    this.clearTimers();
    this.listeners.clear();
    this.isActive = false;
  }
}

// Export singleton instance
const sessionTimeoutService = new SessionTimeoutService();
export default sessionTimeoutService;

