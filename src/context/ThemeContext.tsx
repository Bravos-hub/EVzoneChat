import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { ThemeContextValue, ThemeMode, AccentColor } from '../types/theme';
import { EV_COLORS } from '../utils/constants';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeContextProvider');
  }
  return context;
};

// Helper to get system preference
const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  // Load theme from localStorage or default to 'system' to adapt to system preference
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('themeMode');
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved as ThemeMode;
      }
    } catch (e) {
      console.warn('Failed to read theme from localStorage', e);
    }
    // Default to 'system' so it always adapts to the system's current theme preference
    return 'system';
  });

  const [accent, setAccent] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem('themeAccent');
      // Only use saved value if it exists and is valid
      // For new users (no saved value), default to 'green'
      if (saved && ['orange', 'green', 'grey'].includes(saved)) {
        return saved as AccentColor;
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
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(() => getSystemPreference());

  // Determine actual mode (light/dark) based on mode setting
  const actualMode = useMemo<'light' | 'dark'>(() => {
    if (mode === 'system') {
      return systemPreference;
    }
    return mode;
  }, [mode, systemPreference]);

  // Listen to system theme changes - always listen, but only use when mode is 'system'
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
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
    else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
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
  const accentColor = useMemo<string>(() => {
    return accent === 'green' ? EV_COLORS.green : accent === 'orange' ? EV_COLORS.orange : EV_COLORS.grey;
  }, [accent]);

  // Create MUI theme with proper dark/light mode support
  const muiTheme = useMemo(() => {
    const isDark = actualMode === 'dark';

    return createTheme({
      palette: {
        mode: actualMode,
        primary: {
          main: accent === 'green' ? EV_COLORS.green : accent === 'orange' ? EV_COLORS.orange : EV_COLORS.grey,
          light: accent === 'orange' ? '#ff9f4d' : accent === 'green' ? '#4dd9a8' : '#c0c0c0',
          dark: accent === 'orange' ? '#c56200' : accent === 'green' ? '#029a6a' : '#757575',
        },
        secondary: {
          main: accent === 'green' ? EV_COLORS.orange : accent === 'orange' ? EV_COLORS.green : EV_COLORS.orange,
        },
        background: {
          default: isDark ? '#121212' : EV_COLORS.light,
          paper: isDark ? '#1e1e1e' : '#ffffff',
        },
        text: {
          primary: isDark ? '#ffffff' : '#111111',
          secondary: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        },
        divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      },
      typography: {
        fontFamily: '"Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
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
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.85)' : `${accentColor}DD`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
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
  const value = useMemo<ThemeContextValue>(() => ({
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

