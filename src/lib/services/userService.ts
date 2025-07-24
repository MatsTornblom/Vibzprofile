import { supabase } from '../api/supabase';
import type { UserProfile } from '../types/user';

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile from database
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      console.error('Failed to get user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

export async function setCurrentUser(username: string): Promise<UserProfile | null> {
  try {
    if (!username.trim()) {
      throw new Error('Username is required');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .update({ 
        username,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error || !profile) {
      throw error || new Error('Failed to update user profile');
    }

    window.dispatchEvent(new Event('userUpdated'));
    return profile;
  } catch (error) {
    console.error('Failed to set current user:', error);
    throw error;
  }
}

export async function createNewUser(username?: string): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('users')
      .insert([{
        id: user.id,
        email: user.email,
        username: username || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error || !profile) {
      console.error('Failed to create user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Failed to create user:', error);
    return null;
  }
}

// Legacy function - kept for compatibility
export function clearStoredUserId(): void {
  // No-op since we use database-based user management
}