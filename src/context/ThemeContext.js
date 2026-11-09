import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { storage } from '../storage/storage';
import { palette } from '../theme/colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    storage.loadSettings().then((settings) => {
      if (settings?.theme === 'dark' || settings?.theme === 'light') setMode(settings.theme);
    }).catch((error) => console.error('Unable to load settings:', error));
  }, []);

  const setTheme = useCallback(async (nextMode) => {
    const previousMode = mode;
    setMode(nextMode);
    try {
      const existing = (await storage.loadSettings()) || {};
      await storage.saveSettings({ ...existing, theme: nextMode });
    } catch (error) {
      setMode(previousMode);
      console.error('Unable to save theme preference:', error);
      Alert.alert('Could not save setting', 'Please try changing your theme again.');
    }
  }, [mode]);

  const theme = useMemo(() => ({
    dark: mode === 'dark',
    mode,
    colors: mode === 'dark'
      ? {
          ...palette,
          background: palette.darkBackground,
          surface: palette.darkSurface,
          text: palette.darkText,
          secondary: palette.darkSecondary,
          border: palette.darkBorder,
        }
      : palette,
  }), [mode]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used within ThemeProvider');
  return value;
}
