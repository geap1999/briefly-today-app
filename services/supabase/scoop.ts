import type { Region } from "@/contexts/timezone-context";
import { supabase } from "./supabase-client";

export const getScoop = async (region: Region = "US") => {
  try {
    const tableName = region === "EU" ? "current_scoop_eu" : "current_scoop";
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