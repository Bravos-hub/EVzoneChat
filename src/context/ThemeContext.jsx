import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const EV = { green: '#03cd8c', orange: '#f77f00', grey: '#a6a6a6', light: '#f2f2f2' };

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeContextProvider');
  }
  return context;
};

// Helper to get system preference
const getSystemPreference = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeContextProvider = ({ children }) => {
  // Load theme from localStorage or default to 'system' to adapt to system preference
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('themeMode');
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to read theme from localStorage', e);
    }
    // Default to 'system' so it always adapts to the system's current theme preference
    return 'system';
  });

  const [accent, setAccent] = useState(() => {
    try {
      const saved = localStorage.getItem('themeAccent');
      // Only use saved value if it exists and is valid
      // For new users (no saved value), default to 'green'
      if (saved && ['orange', 'green', 'grey'].includes(saved)) {
        return saved;
      }
      // New user: default to green (primary color)
      // This will be saved to localStorage by the useEffect below
      return 'green';
    } catch (e) {
      console.warn('Failed to read accent from localStorage', e);
      // Default to green on error
      return 'green';
    }
  });

  // Track system preference changes
  const [systemPreference, setSystemPreference] = useState(() => getSystemPreference());

  // Determine actual mode (light/dark) based on mode setting
  const actualMode = useMemo(() => {
    if (mode === 'system') {
      return systemPreference;
    }
    return mode;
  }, [mode, systemPreference]);

  // Listen to system theme changes - always listen, but only use when mode is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newPreference = e.matches ? 'dark' : 'light';
      setSystemPreference(newPreference);
    };

    // Set initial value
    setSystemPreference(getSystemPreference());

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []); // Empty deps - always listen

  // Save mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
    } catch (e) {
      console.warn('Failed to save theme to localStorage', e);
    }
  }, [mode]);

  // Save accent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('themeAccent', accent);
    } catch (e) {
      console.warn('Failed to save accent to localStorage', e);
    }
  }, [accent]);

  // Calculate accent color value
  const accentColor = useMemo(() => {
    return accent === 'green' ? EV.green : accent === 'orange' ? EV.orange : EV.grey;
  }, [accent]);

  // Create MUI theme with proper dark/light mode support
  const muiTheme = useMemo(() => {
    const isDark = actualMode === 'dark';
    
    return createTheme({
      palette: {
        mode: actualMode,
        primary: {
          main: accent === 'green' ? EV.green : accent === 'orange' ? EV.orange : EV.grey,
          light: accent === 'orange' ? '#ff9f4d' : accent === 'green' ? '#4dd9a8' : '#c0c0c0',
          dark: accent === 'orange' ? '#c56200' : accent === 'green' ? '#029a6a' : '#757575',
        },
        secondary: {
          main: accent === 'green' ? EV.orange : accent === 'orange' ? EV.green : EV.orange,
        },
        background: {
          default: isDark ? '#121212' : '#f2f2f2',
          paper: isDark ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: isDark ? '#ffffff' : '#111111',
          secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      shape: { borderRadius: 12 },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              transition: 'background-color 0.3s ease, color 0.3s ease',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? '#1e1e1e' : accentColor,
              color: '#ffffff',
              transition: 'background-color 0.3s ease',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            contained: {
              backgroundColor: accentColor,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: accent === 'orange' ? '#e06f00' : accent === 'green' ? '#02b37b' : '#8f8f8f',
              },
            },
            outlined: {
              borderColor: accentColor,
              color: accentColor,
              '&:hover': {
                borderColor: accent === 'orange' ? '#e06f00' : accent === 'green' ? '#02b37b' : '#8f8f8f',
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              transition: 'background-color 0.3s ease',
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              transition: 'background-color 0.3s ease',
            },
          },
        },
      },
    });
  }, [actualMode, accent, accentColor]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    mode,
    setMode,
    accent,
    setAccent,
    accentColor, // Export the accent color value
    actualMode,
    isDark: actualMode === 'dark',
    isLight: actualMode === 'light',
    isSystem: mode === 'system',
  }), [mode, accent, accentColor, actualMode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

