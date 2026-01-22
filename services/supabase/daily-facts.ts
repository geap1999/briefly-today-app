import { getCachedData, setCachedData } from "@/utils/cache";
import { supabase } from "./supabase-client";

export const getDailyFacts = async (month_num: number, day_num: number) => {
  const cacheKey = `cache_daily_facts_${month_num}_${day_num}`;

  try {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  } catch (error) {
    console.error("Error reading cache:", error);
  }

  try {
    const { data, error } = await supabase
      .from("daily_data")
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
