import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";

interface AuthContextType {
  user: User | null;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    await supabase.auth.signOut();
    setUser(null);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !currentUser) {
      throw new Error("You must be logged in to delete your account");
    }

    const userId = currentUser.id;

    const { data: userPosts } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", userId);

    const postIds = userPosts?.map((post) => post.id) ?? [];

    if (postIds.length > 0) {
      const { error: votesOnPostsError } = await supabase
        .from("votes")
        .delete()
        .in("post_id", postIds);
      if (votesOnPostsError) throw votesOnPostsError;

      const { error: commentsOnPostsError } = await supabase
        .from("comment")
        .delete()
        .in("post_id", postIds);
      if (commentsOnPostsError) throw commentsOnPostsError;
    }

    const { error: votesError } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", userId);
    if (votesError) throw votesError;

    const { error: commentsError } = await supabase
      .from("comment")
      .delete()
      .eq("user_id", userId);
    if (commentsError) throw commentsError;

    const { error: postsError } = await supabase
      .from("posts")
      .delete()
      .eq("user_id", userId);
    if (postsError) throw postsError;

    const { error: deleteUserError } = await supabase.rpc("delete_user");
    if (deleteUserError) throw deleteUserError;

    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithGithub,
        signUpWithEmail,
        signInWithEmail,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};