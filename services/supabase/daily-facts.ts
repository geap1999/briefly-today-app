import { supabase } from "./supabase-client";

export const getDailyFacts = async (month_num: number, day_num: number) => {
  try {
    const { data, error } = await supabase
      .from('daily_data')
      .select('*')
      .match({ month_num, day_num });

    if (error) throw error;
      return data;
  } catch (error) {
    return null;
  }
}