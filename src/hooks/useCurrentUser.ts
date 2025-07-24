import { useState, useEffect } from 'react';
import { getCurrentUser, clearStoredUserId } from '../lib/services/userService';
import { supabase } from '../lib/api/supabase';
import type { UserProfile } from '../lib/types/user';

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    setLoading(true);
    try {
      // Simply try to get the current user - let the service handle session logic
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
      // Clear any stored data on error
      clearStoredUserId();
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

    // Listen for user updates
    window.addEventListener('userUpdated', loadUser);

    return () => {
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  return { user, loading, refreshUser };
}