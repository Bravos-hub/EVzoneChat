import type React from 'react';
import EVZUserMobileShell from './shell/EVZUserMobileShell';
import EVZUserDesktopShell from './shell/EVZUserDesktopShell';
import usePlatformMode from './shell/usePlatformMode';
import registry from './user/registry';
import { ThemeContextProvider } from './context/ThemeContext';
import { CallContextProvider } from './context/CallContext';
import { EncryptionProvider } from './context/EncryptionContext';
import { SessionTimeoutProvider } from './context/SessionTimeoutContext';

const App: React.FC = () => {
  // In production, get userId from auth context
  const userId: string = 'me'; // TODO: Get from authentication
  const platformMode = usePlatformMode();
  const Shell = platformMode === 'desktop' ? EVZUserDesktopShell : EVZUserMobileShell;

  return (
    <ThemeContextProvider>
      <CallContextProvider>
        <EncryptionProvider userId={userId}>
          <SessionTimeoutProvider timeoutMs={30 * 60 * 1000} warningMs={5 * 60 * 1000}>
            <Shell registry={registry} />
          </SessionTimeoutProvider>
        </EncryptionProvider>
      </CallContextProvider>
    </ThemeContextProvider>
  );
};

export default App;
