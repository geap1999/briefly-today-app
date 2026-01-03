import { supabase } from "./supabase-client";

export const getScoop = async () => {
  try {
    const { data, error } = await supabase
      .from("current_scoop")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    return null;
  }
};