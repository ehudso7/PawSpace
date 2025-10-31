import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Primary Colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#A5B4FC',
    
    // Secondary Colors
    secondary: '#EC4899', // Pink
    secondaryDark: '#DB2777',
    secondaryLight: '#F9A8D4',
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    darkGray: '#374151',
    
    // Background Colors
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text Colors
    text: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Status Background Colors
    successBackground: '#D1FAE5',
    warningBackground: '#FEF3C7',
    errorBackground: '#FEE2E2',
    infoBackground: '#DBEAFE',
    
    // Border Colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Other Colors
    disabled: '#F3F4F6',
    placeholder: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  fonts: {
    // Font Families
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    
    // Font Sizes
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    
    // Line Heights
    lineHeight: {
      xs: 16,
      sm: 20,
      base: 24,
      lg: 28,
      xl: 32,
      '2xl': 36,
      '3xl': 40,
      '4xl': 44,
      '5xl': 56,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
    '7xl': 80,
    '8xl': 96,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  },
  
  dimensions: {
    window: {
      width,
      height,
    },
    screen: {
      width: width,
      height: height,
    },
    isSmallDevice: width < 375,
    isLargeDevice: width > 414,
  },
  
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    statusBarHeight: 44, // iOS default, adjust for Android
    bottomSafeArea: 34, // iOS default, adjust for Android
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      linear: 'linear',
    },
  },
  
  zIndex: {
    modal: 1000,
    overlay: 999,
    dropdown: 998,
    header: 997,
    fab: 996,
  },
};

// Theme utility functions
export const getSpacing = (multiplier: number): number => {
  return theme.spacing.md * multiplier;
};

export const getFontSize = (size: keyof typeof theme.fonts): number => {
  return theme.fonts[size] as number;
};

export const getColor = (color: keyof typeof theme.colors): string => {
  return theme.colors[color];
};

export const getShadow = (level: keyof typeof theme.shadows) => {
  return theme.shadows[level];
};

export const getBorderRadius = (size: keyof typeof theme.borderRadius): number => {
  return theme.borderRadius[size];
};

export default theme;
