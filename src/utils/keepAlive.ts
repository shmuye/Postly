import { supabase } from "../supabase-client";


export const keepSupabaseAlive = async () => {
  try {
    await supabase.from("posts").select("id").limit(1);
  } catch (error) {
    console.log("Supabase ping failed:", error);
  }
};