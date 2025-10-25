'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      loading: true,
      isAuthenticated: false,
      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, session: data.session, isAuthenticated: true });
        } catch (error) {
          console.error('Error signing in:', error);
          throw error;
        }
      },
      signUp: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user, session: data.session, isAuthenticated: !!data.session });
        } catch (error) {
          console.error('Error signing up:', error);
          throw error;
        }
      },
      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, session: null, isAuthenticated: false });
        } catch (error) {
          console.error('Error signing out:', error);
          throw error;
        }
      },
      checkUser: async () => {
        try {
          const { data } = await supabase.auth.getSession();
          const { session } = data;
          const user = session?.user || null;
          set({ 
            user,
            session,
            loading: false,
            isAuthenticated: !!session
          });
        } catch (error) {
          console.error('Error checking user:', error);
          set({ 
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);