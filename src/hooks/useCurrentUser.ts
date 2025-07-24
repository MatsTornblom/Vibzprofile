import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/services/userService';
import { supabase } from '../lib/api/supabase';
import type { UserProfile } from '../lib/types/user';

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    setLoading(true);
    loadUser();
  };

  useEffect(() => {
    loadUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Listen for user updates
    window.addEventListener('userUpdated', loadUser);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  return { user, loading, refreshUser };
}