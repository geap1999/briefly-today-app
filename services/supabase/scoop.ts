import type { Region } from "@/contexts/timezone-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase-client";

const LOCALE_STORAGE_KEY = "@app_locale";

export const getScoop = async (region: Region = "US") => {
  try {
    let tableName = region === "EU" ? "current_scoop_eu" : "current_scoop";

    const lang = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
    if (lang === "fr") {
      tableName = "current_scoop_fr";
    }

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    return null;
  }
};
