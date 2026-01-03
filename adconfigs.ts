import { TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const PRODUCTION_INTERSTITIAL_ANDROID_ID = 'ca-app-pub-9097683109961993/2042632334';
const PRODUCTION_INTERSTITIAL_IOS_ID = 'ca-app-pub-9097683109961993/3132368634';

const INTERSTITIAL_AD_ID_IOS = __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_IOS_ID;
const INTERSTITIAL_AD_ID = __DEV__ ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_ANDROID_ID;

export const adUnitId = Platform.select({
  ios: INTERSTITIAL_AD_ID_IOS,
  android: INTERSTITIAL_AD_ID,
}) as string;