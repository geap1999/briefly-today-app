import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useCurrentTime(
  setIsScoopRevealed: (v: boolean) => void,
  timezone = "America/Chicago"
) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    let lastCheckedDate = new Date().toDateString();

    const timer = setInterval(async () => {
      const now = new Date();
      setCurrentTime(now);

      const currentDate = now.toLocaleDateString("en-US", {
        timeZone: timezone,
      });
      if (currentDate !== lastCheckedDate) {
        lastCheckedDate = currentDate;
        const lastRevealedDate =
          await AsyncStorage.getItem("last_revealed_date");

        if (lastRevealedDate !== currentDate) {
          setIsScoopRevealed(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [setIsScoopRevealed, timezone]);

  return currentTime;
}

export default useCurrentTime;
