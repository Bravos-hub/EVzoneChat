import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type React from 'react';
import type { CallContextValue, ActiveCall, CallType, CallState } from '../types/call';

const CallContext = createContext<CallContextValue | undefined>(undefined);

export const useCall = (): CallContextValue => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallContextProvider');
  }
  return context;
};

interface CallContextProviderProps {
  children: ReactNode;
}

export const CallContextProvider: React.FC<CallContextProviderProps> = ({ children }) => {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  const startCall = useCallback((type: CallType, contact: string) => {
    setActiveCall({
      id: `call-${Date.now()}`,
      type,
      state: 'dialing',
      contact,
      startTime: Date.now(),
    });
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
  }, []);

  const updateCallState = useCallback((state: CallState) => {
    setActiveCall(prev => prev ? { ...prev, state } : null);
  }, []);

  const value: CallContextValue = {
    activeCall,
    startCall,
    endCall,
    updateCallState,
    isInCall: activeCall !== null && (activeCall.state === 'connected' || activeCall.state === 'ringing' || activeCall.state === 'connecting' || activeCall.state === 'dialing'),
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

