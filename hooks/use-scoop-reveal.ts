import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Alert } from "react-native";

export function useScoopReveal(
  setIsScoopRevealed: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>,
  timezone = "America/Chicago"
) {
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const lastDate = await AsyncStorage.getItem("last_revealed_date");
        const today = new Date().toLocaleDateString("en-US", {
          timeZone: timezone,
        });
        await fetchDailyScoop();

        if (lastDate === today) {
          setIsScoopRevealed(true);
        } else {
          setIsScoopRevealed(false);
        }
      } catch (e) {
        console.log("Error reading storage", e);
        Alert.alert("Error", "An error occurred, please refresh app.");
      }
    };

    checkStorage();
  }, [fetchDailyScoop, setIsScoopRevealed, timezone]);
}

export default useScoopReveal;
