import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";
import { AdEventType } from "react-native-google-mobile-ads";

export function useInterstitialAd(
  interstitial: any,
  setIsScoopRevealed: (v: boolean) => void,
  setAdLoaded: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>,
  onAdClosed?: () => void,
) {
  useEffect(() => {
    const setupAd = async () => {
      const scoopStatus = await AsyncStorage.getItem("scoop_revealed");

      if (scoopStatus === "true") {
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
            await fetchDailyScoop();
            await AsyncStorage.setItem("scoop_revealed", "true");
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
    setIsScoopRevealed,
    setAdLoaded,
    fetchDailyScoop,
    onAdClosed,
  ]);
}

export default useInterstitialAd;
