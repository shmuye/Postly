import { createContext , useContext, useEffect } from "react";
import { supabase } from "../supabase-client";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

interface AuthContextType {

  user: User | null;
  signInWithGithub: () => void;
  signInWithGoogle: () => void;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {data: listener } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null);
    })

    return () => {
        listener?.subscription.unsubscribe();
    }

    
  }, 
  [])

  const signInWithGithub = async () => {
     supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
};

  const signUpWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

 

  if (error) {
    console.error(error.message);
    throw error;
  }
};

const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    throw error;
  }
};

  const signOut = async () => {
      supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signInWithGoogle,
      signInWithGithub, 
      signUpWithEmail,
      signInWithEmail,
      signOut 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};