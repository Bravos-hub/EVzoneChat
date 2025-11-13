import React from 'react';
import EVZUserMobileShell from './shell/EVZUserMobileShell';
import registry from './user/registry';
import { ThemeContextProvider } from './context/ThemeContext';

export default function App(){
  return (
    <ThemeContextProvider>
      <EVZUserMobileShell registry={registry} />
    </ThemeContextProvider>
  );
}
