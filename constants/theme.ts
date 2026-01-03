/**
 * Premium theme system inspired by Apple's design language
 * Features sophisticated colors, typography, and design tokens
 */

import { Platform } from 'react-native';

// Premium color palette
export const Colors = {
  light: {
    // Backgrounds
    background: '#FAFAFA',
    backgroundElevated: '#FFFFFF',
    backgroundSecondary: '#F5F5F7',
    
    // Text
    text: '#1D1D1F',
    textSecondary: '#6E6E73',
    textTertiary: '#86868B',
    
    // Accents
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#AF52DE',
    
    // UI Elements
    border: 'rgba(0, 0, 0, 0.04)',
    borderSubtle: 'rgba(0, 0, 0, 0.02)',
    divider: 'rgba(0, 0, 0, 0.08)',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.3)',
    blur: 'rgba(255, 255, 255, 0.72)',
    
    // Semantic colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    
    // Card gradients
    gradientStart: '#FFFFFF',
    gradientEnd: '#F9FAFB',
  },
  dark: {
    // Backgrounds
    background: '#000000',
    backgroundElevated: '#1C1C1E',
    backgroundSecondary: '#2C2C2E',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#98989D',
    textTertiary: '#636366',
    
    // Accents
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#BF5AF2',
    
    // UI Elements
    border: 'rgba(255, 255, 255, 0.1)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    divider: 'rgba(255, 255, 255, 0.15)',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    blur: 'rgba(28, 28, 30, 0.72)',
    
    // Semantic colors
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    
    // Card gradients
    gradientStart: '#1C1C1E',
    gradientEnd: '#2C2C2E',
  },
};

// Premium spacing scale
export const Spacing = {
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
};

// Premium border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  full: 9999,
};

// Premium shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

// Premium typography
export const Typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
    '5xl': 40,
    '6xl': 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
    mono: "'SF Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

// Animation durations
export const Duration = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Premium gradient presets
export const Gradients = {
  primary: ['#667EEA', '#764BA2'],
  secondary: ['#FA709A', '#FEE140'],
  success: ['#56CCF2', '#2F80ED'],
  scoop: ['#A855F7', '#7C3AED', '#6366F1'],
  celebrity: ['#F59E0B', '#EF4444'],
  history: ['#3B82F6', '#1E40AF'],
  popCulture: ['#EC4899', '#DB2777'],
  nature: ['#10B981', '#059669'],
  hero: ['#667EEA', '#764BA2'],
  premium: ['#C084FC', '#A855F7', '#9333EA'],
};
