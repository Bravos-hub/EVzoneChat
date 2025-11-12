import React, { useMemo } from 'react';
import EVZUserMobileShell from './shell/EVZUserMobileShell';
import registry from './user/registry';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const EV = { green: '#03cd8c', orange: '#f77f00', grey: '#a6a6a6', light: '#f2f2f2' };

export default function App(){
  const theme = useMemo(()=> createTheme({
    palette: { primary: { main: EV.green }, secondary: { main: EV.orange }, background: { default: '#ffffff' } },
    shape: { borderRadius: 12 },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <EVZUserMobileShell registry={registry} />
    </ThemeProvider>
  );
}
