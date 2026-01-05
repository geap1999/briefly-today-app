import { Dimensions, useWindowDimensions } from 'react-native';

// Dimensions de base (design mobile de référence)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Breakpoints
export const BREAKPOINTS = {
  small: 360,    // Petits téléphones
  medium: 768,   // Grandes téléphones / petites tablettes
  large: 1024,   // Tablettes
  xlarge: 1280,  // Grandes tablettes / desktop
} as const;

export type DeviceType = 'phone' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

/**
 * Hook pour obtenir les informations sur l'appareil
 */
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

/**
 * Scale une valeur basée sur la largeur de l'écran
 */
export const scaleWidth = (size: number): number => {
  const { width } = Dimensions.get('window');
  return (width / BASE_WIDTH) * size;
};

/**
 * Scale une valeur basée sur la hauteur de l'écran
 */
export const scaleHeight = (size: number): number => {
  const { height } = Dimensions.get('window');
  return (height / BASE_HEIGHT) * size;
};

/**
 * Scale modéré - évite que les tailles deviennent trop grandes sur tablette
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  const { width } = Dimensions.get('window');
  const scale = width / BASE_WIDTH;
  return size + (scale - 1) * size * factor;
};

/**
 * Retourne une valeur différente selon le type d'appareil
 */
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

/**
 * Retourne le nombre de colonnes selon la taille d'écran
 */
export const getColumns = (defaultCols: number = 1): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.xlarge) return Math.min(defaultCols * 3, 4);
  if (width >= BREAKPOINTS.large) return Math.min(defaultCols * 2, 3);
  if (width >= BREAKPOINTS.medium) return Math.min(defaultCols * 1.5, 2);
  
  return defaultCols;
};

/**
 * Padding horizontal responsive
 */
export const getHorizontalPadding = (): number => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.xlarge) return 60;
  if (width >= BREAKPOINTS.large) return 40;
  if (width >= BREAKPOINTS.medium) return 30;
  
  return 20; // mobile
};

/**
 * Largeur maximale du contenu pour éviter que ça s'étire trop sur tablette
 */
export const getMaxContentWidth = (): number | string => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.large) return 900;
  
  return '100%';
};

/**
 * Taille de police responsive
 */
export const getFontSize = (baseSize: number): number => {
  return moderateScale(baseSize, 0.3);
};
