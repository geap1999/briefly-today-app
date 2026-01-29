import { getTimezoneDateString } from "@/utils/timezone-date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";
import { AdEventType } from "react-native-google-mobile-ads";

export function useInterstitialAd(
  interstitial: any,
  isScoopRevealed: boolean,
  setIsScoopRevealed: (v: boolean) => void,
  setAdLoaded: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>,
  onAdClosed?: () => void,
  timezone = "America/Chicago"
) {
  useEffect(() => {
    const setupAd = async () => {
      // If scoop already revealed, don't setup ad
      if (isScoopRevealed) {
        return;
      }

      const unsubscribeLoaded = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          setAdLoaded(true);
        },
      );

      const unsubscribeClosed = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        async () => {
          try {
            const today = getTimezoneDateString(timezone);
            await fetchDailyScoop();
            await AsyncStorage.setItem("last_revealed_date", today);
            setIsScoopRevealed(true);
          } catch (e) {
            Alert.alert(
              "Error",
              "An error occurred. Please try refreshing the app.",
            );
          }

          setAdLoaded(false);

          if (onAdClosed) {
            setTimeout(() => onAdClosed(), 300);
          }
        },
      );

      interstitial.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
      };
    };

    let cleanup: (() => void) | undefined;
    setupAd().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [
    interstitial,
    isScoopRevealed,
    setIsScoopRevealed,
    setAdLoaded,
    fetchDailyScoop,
    onAdClosed,
  ]);
}

export default useInterstitialAd;
