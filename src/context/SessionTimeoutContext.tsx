/**
 * Session Timeout Context
 * Manages session timeout and inactivity detection
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type React from 'react';
import SessionTimeoutService from '../services/SessionTimeoutService';
import SessionTimeoutDialog from '../components/SessionTimeoutDialog';

type SessionTimeoutCallback = (event: string, data: any) => void;

interface SessionTimeoutContextValue {
  extendSession: () => void;
  logout: () => void;
  getTimeRemaining: () => number;
  isWarningPeriod: () => boolean;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextValue | undefined>(undefined);

export const useSessionTimeout = (): SessionTimeoutContextValue => {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error('useSessionTimeout must be used within SessionTimeoutProvider');
  }
  return context;
};

interface SessionTimeoutProviderProps {
  children: ReactNode;
  timeoutMs?: number;
  warningMs?: number;
}

export const SessionTimeoutProvider: React.FC<SessionTimeoutProviderProps> = ({ 
  children, 
  timeoutMs = 30 * 60 * 1000, 
  warningMs = 5 * 60 * 1000 
}) => {
  const [warningOpen, setWarningOpen] = useState<boolean>(false);
  const [timeoutOpen, setTimeoutOpen] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const handleSessionEvent = useCallback<SessionTimeoutCallback>((event, data) => {
    switch (event) {
      case 'warning':
        setTimeRemaining(data.timeRemaining);
        setWarningOpen(true);
        break;
      case 'timeout':
        setWarningOpen(false);
        setTimeoutOpen(true);
        break;
      case 'expired':
        setWarningOpen(false);
        setTimeoutOpen(true);
        break;
      case 'extended':
        setWarningOpen(false);
        break;
      default:
        break;
    }
  }, []);

  const handleExtend = useCallback(() => {
    SessionTimeoutService.extendSession();
    setWarningOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    // Clear session data
    // Note: clearSensitiveData is private, so we'll handle logout differently
    // In production, redirect to login
    // For now, reload the page
    window.location.reload();
  }, []);

  useEffect(() => {
    // Initialize session timeout
    SessionTimeoutService.init(timeoutMs, warningMs);
    SessionTimeoutService.addListener(handleSessionEvent);

    return () => {
      SessionTimeoutService.removeListener(handleSessionEvent);
      SessionTimeoutService.destroy();
    };
  }, [timeoutMs, warningMs, handleSessionEvent]);

  const value: SessionTimeoutContextValue = {
    extendSession: handleExtend,
    logout: handleLogout,
    getTimeRemaining: () => SessionTimeoutService.getTimeRemaining(),
    isWarningPeriod: () => SessionTimeoutService.isWarningPeriod()
  };

  return (
    <SessionTimeoutContext.Provider value={value}>
      {children}
      <SessionTimeoutDialog
        open={warningOpen}
        onClose={handleExtend}
        onExtend={handleExtend}
        onLogout={handleLogout}
        timeRemaining={timeRemaining}
        type="warning"
      />
      <SessionTimeoutDialog
        open={timeoutOpen}
        onClose={() => {}}
        onExtend={handleExtend}
        onLogout={handleLogout}
        timeRemaining={0}
        type="expired"
      />
    </SessionTimeoutContext.Provider>
  );
};

