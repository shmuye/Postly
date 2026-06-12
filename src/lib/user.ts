import type { User } from "@supabase/supabase-js";

export const getDisplayName = (user: User) =>
  user.user_metadata?.user_name ||
  user.user_metadata?.full_name ||
  user.user_metadata?.name ||
  user.email?.split("@")[0] ||
  "User";

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getAuthProviders = (user: User) => {
  const providers = user.identities?.map((identity) => identity.provider) ?? [];
  if (providers.length > 0) return [...new Set(providers)];
  if (user.app_metadata?.provider) return [user.app_metadata.provider as string];
  return ["email"];
};

export const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
