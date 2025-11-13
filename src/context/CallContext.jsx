import React, { createContext, useContext, useState, useCallback } from 'react';

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within CallContextProvider');
  }
  return context;
};

export const CallContextProvider = ({ children }) => {
  const [activeCall, setActiveCall] = useState(null);

  const startCall = useCallback((callData) => {
    setActiveCall({
      ...callData,
      startTime: Date.now(),
    });
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
  }, []);

  const updateCallState = useCallback((state) => {
    setActiveCall(prev => prev ? { ...prev, state } : null);
  }, []);

  const value = {
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

