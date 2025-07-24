import { supabase } from '../api/supabase';
import type { UserProfile } from '../types/user';

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    // Try to get the current user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('No authenticated user found:', userError.message);
      return null;
    }

    if (!user) {
      console.log('No user in session');
      return null;
    }

    console.log('Found authenticated user:', user.id);

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }

    if (!profile) {
      console.log('No user profile found in database for user:', user.id);
      return null;
    }

    console.log('Successfully loaded user profile:', profile.username || profile.id);
    return profile;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

// Clear any stored user data
export function clearStoredUserId(): void {
  // Clear any local storage or cached data if needed
  localStorage.removeItem('user_id');
}