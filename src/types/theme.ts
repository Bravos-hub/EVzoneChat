export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'green' | 'orange' | 'grey';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  accentColor: string;
  actualMode: 'light' | 'dark';
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

