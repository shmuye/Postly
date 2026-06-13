import { supabase } from "@/lib/supabase-client";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const KEEP_ALIVE_INTERVAL_MS = SEVEN_DAYS_MS - 24 * 60 * 60 * 1000;

const pingSupabase = async (): Promise<void> => {
  try {
    const { error } = await supabase
      .from("posts")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (error) return;
  } catch {
    return;
  }
};

export const startSupabaseKeepAlive = (): (() => void) => {
  void pingSupabase();

  const intervalId = window.setInterval(() => {
    void pingSupabase();
  }, KEEP_ALIVE_INTERVAL_MS);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      void pingSupabase();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
};
