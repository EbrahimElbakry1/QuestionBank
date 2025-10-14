// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";

export default function useAuth() {
  const [user, setUser] = useState(null);

  // Watch for Supabase auth changes
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setUser(data?.user || null);
    return data?.user;
  };

  // 🔑 Log In
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data?.user || null);
    return data?.user;
  };

  // 🚪 Log Out
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, login, signUp, logout };
}
