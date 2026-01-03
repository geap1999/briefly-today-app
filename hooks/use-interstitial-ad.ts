import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { AdEventType } from 'react-native-google-mobile-ads';

export function useInterstitialAd(
  interstitial: any,
  setIsScoopRevealed: (v: boolean) => void,
  setAdLoaded: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>
) {
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, async () => {
      setIsScoopRevealed(true);
      try {
        await fetchDailyScoop();
        const today = new Date().toDateString();
        await AsyncStorage.setItem('last_revealed_date', today);
      } catch (e) {
        console.log('Storage error', e);
        Alert.alert('Error', 'An error occurred. Please try refreshing the app.');
      }

      setAdLoaded(false);
      interstitial.load();
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [interstitial, setIsScoopRevealed, setAdLoaded, fetchDailyScoop]);
}

export default useInterstitialAd;
