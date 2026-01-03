import { supabase } from './supabase-client';

export const registerPushToken = async (token: string) => {
  try {
    const { error } = await supabase
      .from('push_tokens')
      .insert({ token: token });

    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}