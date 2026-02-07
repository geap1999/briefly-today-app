import { getTimezoneDateString } from "@/utils/timezone-date";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { AdEventType } from "react-native-google-mobile-ads";

export function useInterstitialAd(
  interstitial: any,
  isScoopRevealed: boolean,
  setIsScoopRevealed: (v: boolean) => void,
  setAdLoaded: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>,
  onAdClosed?: () => void,
  timezone = "America/Chicago",
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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
      () => {
        const today = getTimezoneDateString(timezone);

        fetchDailyScoop().catch((e) => {
          console.error("Failed to fetch daily scoop:", e);
          Alert.alert(
            "Error",
            "An error occurred. Please try refreshing the app.",
          );
        });

        AsyncStorage.setItem("last_revealed_date", today);
        setIsScoopRevealed(true);
        setAdLoaded(false);

        if (onAdClosed) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            onAdClosed();
            timeoutRef.current = null;
          }, 100);
        }
      },
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [
    interstitial,
    isScoopRevealed,
    setIsScoopRevealed,
    setAdLoaded,
    fetchDailyScoop,
    onAdClosed,
    timezone,
  ]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
}

export default useInterstitialAd;
