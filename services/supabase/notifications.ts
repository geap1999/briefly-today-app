import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase-client";

const REGION_UPDATE_KEY = "@last_region_update";

export const registerPushToken = async (
  token: string,
  region: "US" | "EU" = "US"
) => {
  try {
    const { error } = await supabase
      .from("push_tokens")
      .insert({ token: token, region: region });

    if (error) throw error;

    // Store the current date as last update
    await AsyncStorage.setItem(REGION_UPDATE_KEY, new Date().toISOString());
    return true;
  } catch (error) {
    return false;
  }
};

export const updatePushTokenRegion = async (
  token: string,
  region: "US" | "EU"
) => {
  try {
    const lastUpdate = await AsyncStorage.getItem(REGION_UPDATE_KEY);
    const now = new Date();

    // Check if we already updated in the last 7 days
    if (lastUpdate) {
      const lastUpdateDate = new Date(lastUpdate);
      const daysDifference = Math.floor(
        (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDifference < 7) {
        return true;
      }
    }

    const { error } = await supabase
      .from("push_tokens")
      .update({ region: region })
      .eq("token", token);

    if (error) throw error;

    // Store the current date as last update
    await AsyncStorage.setItem(REGION_UPDATE_KEY, now.toISOString());
    return true;
  } catch (error) {
    return false;
  }
};
