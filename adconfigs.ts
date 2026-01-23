import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION_INTERSTITIAL_ANDROID_ID = 'ca-app-pub-9097683109961993/2042632334';
const PRODUCTION_INTERSTITIAL_IOS_ID = 'ca-app-pub-9097683109961993/3132368634';

// Use test ads in development, production ads otherwise
// In EAS builds, check if we're in a production build
const isProduction = process.env.EXPO_PUBLIC_ENV === 'production';

const INTERSTITIAL_AD_ID_IOS = isProduction ? PRODUCTION_INTERSTITIAL_IOS_ID : TestIds.INTERSTITIAL;
const INTERSTITIAL_AD_ID = isProduction ? PRODUCTION_INTERSTITIAL_ANDROID_ID : TestIds.INTERSTITIAL;

// export const adUnitId = Platform.select({
//   ios: INTERSTITIAL_AD_ID_IOS,
//   android: INTERSTITIAL_AD_ID,
// }) as string;

export const adUnitId = Platform.select({
  ios: TestIds.INTERSTITIAL,
  android: TestIds.INTERSTITIAL,
}) as string;