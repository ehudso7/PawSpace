import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1', // Indigo
    primaryContainer: '#e0e7ff',
    secondary: '#8b5cf6', // Purple
    secondaryContainer: '#ede9fe',
    tertiary: '#ec4899', // Pink
    tertiaryContainer: '#fce7f3',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    background: '#f8fafc',
    error: '#ef4444',
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#312e81',
    onSecondary: '#ffffff',
    onSecondaryContainer: '#4c1d95',
    onTertiary: '#ffffff',
    onTertiaryContainer: '#831843',
    onSurface: '#1e293b',
    onSurfaceVariant: '#475569',
    onBackground: '#1e293b',
    onError: '#ffffff',
    onErrorContainer: '#7f1d1d',
    outline: '#cbd5e1',
    outlineVariant: '#e2e8f0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#334155',
    inverseOnSurface: '#f1f5f9',
    inversePrimary: '#a5b4fc',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#ffffff',
      level3: '#ffffff',
      level4: '#ffffff',
      level5: '#ffffff',
    },
    surfaceDisabled: 'rgba(30, 41, 59, 0.12)',
    onSurfaceDisabled: 'rgba(30, 41, 59, 0.38)',
    backdrop: 'rgba(30, 41, 59, 0.4)',
  },
};