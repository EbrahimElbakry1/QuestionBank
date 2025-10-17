// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

export default function useAuth() {
  const [user, setUser] = useState(null);

  // Watch for Supabase auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Sign Up
  const signUp = async (email, password) => {
    if (password.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });

    if (error) {
      let message = "Something went wrong. Please try again.";

      if (error.message.toLowerCase().includes("password")) {
        message = "Password must be at least 8 characters long.";
      } else if (error.message.includes("rate limit")) {
        message = "Too many attempts. Please wait and try again later.";
      } else if (error.message.includes("invalid email")) {
        message = "Please enter a valid email address.";
      }

      return { success: false, message };
    }

    // Force sign out to prevent unverified access
    await supabase.auth.signOut();

    return {
      success: true,
      message:
        "✅ We've sent a confirmation link to your email. Please verify before logging in.",
    };
  };

  // 🔑 Log In
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let message = "Something went wrong. Please try again.";

      if (error.message.includes("Invalid login credentials")) {
        message = "Incorrect email or password.";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Please confirm your email before logging in.";
      }
      return { success: false, message };
    }

    setUser(data?.user || null);
    return { success: true, user: data.user };
  };

  // 🚪 Log Out
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, signUp, logout };
}
