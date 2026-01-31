import { getCachedData, setCachedData } from "@/utils/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase-client";

const LOCALE_STORAGE_KEY = "@app_locale";

export const getDailyFacts = async (month_num: number, day_num: number) => {
  const lang = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  const locale = lang || "en";
  const cacheKey = `cache_daily_facts_${locale}_${month_num}_${day_num}`;

  try {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (error) {
    console.error("Error reading cache:", error);
  }

  try {
    const tableName = locale !== "fr" ? "daily_data" : "daily_data_fr";

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .match({ month_num, day_num });

    if (error) throw error;

    if (data) {
      await setCachedData(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error("Error fetching daily facts:", error);
    return null;
  }
};
