import { Dimensions, useWindowDimensions } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Breakpoints
export const BREAKPOINTS = {
  small: 360,    // Small phones
  medium: 768,   // Big phones
  large: 1024,   // Tablets
  xlarge: 1280,  // Desktops
} as const;

export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const deviceType: DeviceType = 
    width < BREAKPOINTS.medium ? 'phone' :
    width < BREAKPOINTS.xlarge ? 'tablet' : 'desktop';
  
  const orientation: Orientation = width > height ? 'landscape' : 'portrait';
  
  const isPhone = deviceType === 'phone';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';
  
  return {
    width,
    height,
    deviceType,
    orientation,
    isPhone,
    isTablet,
    isDesktop,
    isLandscape,
    isPortrait,
  };
};


export const scaleWidth = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / BASE_WIDTH) * size;
};

export const scaleHeight = (size: number): number => {
  const { height } = Dimensions.get('window');
  return (height / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5): number => {
  const { width } = Dimensions.get('window');
  const scale = width / BASE_WIDTH;
  return size + (scale - 1) * size * factor;
};

export const responsive = <T,>(config: {
  phone?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.xlarge && config.desktop !== undefined) {
    return config.desktop;
  }
  if (width >= BREAKPOINTS.medium && config.tablet !== undefined) {
    return config.tablet;
  }
  if (config.phone !== undefined) {
    return config.phone;
  }
  
  return config.default;
};

export const getColumns = (defaultCols: number = 1): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.xlarge) return Math.min(defaultCols * 3, 4);
  if (width >= BREAKPOINTS.large) return Math.min(defaultCols * 2, 3);
  if (width >= BREAKPOINTS.medium) return Math.min(defaultCols * 1.5, 2);
  
  return defaultCols;
};

export const getHorizontalPadding = (): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.xlarge) return 60;
  if (width >= BREAKPOINTS.large) return 40;
  if (width >= BREAKPOINTS.medium) return 30;
  
  return 20; // mobile
};

export const getMaxContentWidth = (): number | string => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.large) return 900;
  
  return '100%';
};

export const getFontSize = (baseSize: number): number => {
  return moderateScale(baseSize, 0.3);
};
