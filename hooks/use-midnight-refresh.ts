import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getMidnightCountdown } from "../utils/utils";

const getMidnightDelay = (timeZone: string) => {
  const now = new Date();
  const { hours, minutes, seconds } = getMidnightCountdown(now, timeZone);
  return (hours * 3600 + minutes * 60 + seconds) * 1000 + 1000; // +1s de marge
};

export function useMidnightRefresh(
  onMidnight: () => void,
  timeZone: string = "America/Chicago",
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshDateRef = useRef<string | null>(null);

  useEffect(() => {
    const scheduleMidnightRefresh = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const delay = getMidnightDelay(timeZone);

      timerRef.current = setTimeout(() => {
        const currentDate = new Date().toDateString();

        if (lastRefreshDateRef.current !== currentDate) {
          lastRefreshDateRef.current = currentDate;
          onMidnight();
        }

        scheduleMidnightRefresh();
      }, delay);
    };

    scheduleMidnightRefresh();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          const currentDate = new Date().toDateString();

          // Si la date a changé pendant que l'app était en arrière-plan
          if (lastRefreshDateRef.current !== currentDate) {
            lastRefreshDateRef.current = currentDate;
            onMidnight();
            // Reprogrammer pour le prochain minuit
            scheduleMidnightRefresh();
          }
        }
      },
    );

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      subscription.remove();
    };
  }, [onMidnight, timeZone]);
}
