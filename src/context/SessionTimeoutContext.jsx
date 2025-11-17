/**
 * Session Timeout Context
 * Manages session timeout and inactivity detection
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import SessionTimeoutService from '../services/SessionTimeoutService';
import SessionTimeoutDialog from '../components/SessionTimeoutDialog';

const SessionTimeoutContext = createContext();

export const useSessionTimeout = () => {
  const context = useContext(SessionTimeoutContext);
  if (!context) {
    throw new Error('useSessionTimeout must be used within SessionTimeoutProvider');
  }
  return context;
};

export const SessionTimeoutProvider = ({ children, timeoutMs = 30 * 60 * 1000, warningMs = 5 * 60 * 1000 }) => {
  const [warningOpen, setWarningOpen] = useState(false);
  const [timeoutOpen, setTimeoutOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleSessionEvent = useCallback((event, data) => {
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
    SessionTimeoutService.clearSensitiveData();
    
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

  const value = {
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

