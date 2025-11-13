import React from 'react';
import EVZUserMobileShell from './shell/EVZUserMobileShell';
import registry from './user/registry';
import { ThemeContextProvider } from './context/ThemeContext';
import { CallContextProvider } from './context/CallContext';

export default function App(){
  return (
    <ThemeContextProvider>
      <CallContextProvider>
        <EVZUserMobileShell registry={registry} />
      </CallContextProvider>
    </ThemeContextProvider>
  );
}
