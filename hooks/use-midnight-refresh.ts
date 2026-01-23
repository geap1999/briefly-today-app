import { getTimezoneDateString } from "@/utils/timezone-date";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getMidnightCountdown } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getMidnightDelay = (timeZone: string) => {
  const now = new Date();
  const { hours, minutes, seconds } = getMidnightCountdown(now, timeZone);
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + 1000; // +1s margin
};

export function useMidnightRefresh(
  onMidnight: () => void,
  setIsScoopRevealed: (v: boolean) => void,
  timeZone: string = "America/Chicago",
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastRefreshDateRef = useRef<string>(getTimezoneDateString(timeZone));

  // Prevent stale callback references
  const onMidnightRef = useRef(onMidnight);
  const setIsScoopRevealedRef = useRef(setIsScoopRevealed);

  useEffect(() => {
    onMidnightRef.current = onMidnight;
  }, [onMidnight]);

  useEffect(() => {
    setIsScoopRevealedRef.current = setIsScoopRevealed;
  }, [setIsScoopRevealed]);

  const runMidnightIfNeeded = async () => {
    const currentDate = getTimezoneDateString(timeZone);

    if (lastRefreshDateRef.current !== currentDate) {
      lastRefreshDateRef.current = currentDate;
      setIsScoopRevealedRef.current(false);
      await AsyncStorage.setItem("scoop_revealed", "false");
      onMidnightRef.current();
      return true;
    }
    const scoopRevealed = await AsyncStorage.getItem("scoop_revealed");

    if (scoopRevealed === "true") {
      setIsScoopRevealedRef.current(true);
    }
    return false;
  };

  const scheduleMidnightRefresh = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const delay = getMidnightDelay(timeZone);

    timerRef.current = setTimeout(() => {
      runMidnightIfNeeded();
      scheduleMidnightRefresh();
    }, delay);
  };

  useEffect(() => {
    const initialize = async () => {
      await runMidnightIfNeeded();
      scheduleMidnightRefresh();
    }

    initialize();
    
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          runMidnightIfNeeded();
          scheduleMidnightRefresh();
        }
      },
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      subscription.remove();
    };
  }, [timeZone]);

  return null;
}