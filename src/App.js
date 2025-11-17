import React from 'react';
import EVZUserMobileShell from './shell/EVZUserMobileShell';
import registry from './user/registry';
import { ThemeContextProvider } from './context/ThemeContext';
import { CallContextProvider } from './context/CallContext';
import { EncryptionProvider } from './context/EncryptionContext';
import { SessionTimeoutProvider } from './context/SessionTimeoutContext';

export default function App(){
  // In production, get userId from auth context
  const userId = 'me'; // TODO: Get from authentication

  return (
    <ThemeContextProvider>
      <CallContextProvider>
        <EncryptionProvider userId={userId}>
          <SessionTimeoutProvider timeoutMs={30 * 60 * 1000} warningMs={5 * 60 * 1000}>
        <EVZUserMobileShell registry={registry} />
          </SessionTimeoutProvider>
        </EncryptionProvider>
      </CallContextProvider>
    </ThemeContextProvider>
  );
}
