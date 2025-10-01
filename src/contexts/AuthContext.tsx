"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { userService, UserLimits } from '@/services/userService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userLimits: UserLimits | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshUserLimits: () => Promise<void>;
  useCredits: (credits?: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserLimits(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserLimits(session.user.id);
      } else {
        setUserLimits(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserLimits = async (userId: string) => {
    try {
      const limits = await userService.getUserLimits(userId);
      setUserLimits(limits);
    } catch (error) {
      console.error('Error loading user limits:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUserLimits(null);
    return { error };
  };

  const refreshUserLimits = async () => {
    if (user) {
      await loadUserLimits(user.id);
    }
  };

  const useCredits = async (credits: number = 1) => {
    if (!user) return false;
    const success = await userService.useCredits(user.id, credits);
    if (success) {
      await refreshUserLimits();
    }
    return success;
  };

  const value = {
    user,
    session,
    loading,
    userLimits,
    signIn,
    signUp,
    signOut,
    refreshUserLimits,
    useCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
