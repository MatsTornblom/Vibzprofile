import { supabase } from '../api/supabase';
import type { UserProfile } from '../types/user';
import { isDevEnvironment, getDevUserId } from '../browser';

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const isDevMode = isDevEnvironment();
    const devUserId = getDevUserId();

    // Development mode: bypass authentication and use configured dev user ID
    if (isDevMode && devUserId) {
      console.log('🔧 DEV MODE: Loading user profile for dev user:', devUserId);

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', devUserId)
        .maybeSingle();

      if (error) {
        console.error('Failed to get dev user profile:', error);
        return null;
      }

      if (!profile) {
        console.warn('No user profile found in database for dev user:', devUserId);
        return null;
      }

      console.log('✅ DEV MODE: Successfully loaded user profile:', profile.username || profile.id);
      return profile;
    }

    // Production mode: use normal authentication flow
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

export async function addFreeVibz(userId: string, amount: number = 100): Promise<boolean> {
  try {
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('vibz_balance')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError || !currentUser) {
      console.error('Failed to fetch current balance:', fetchError);
      return false;
    }

    const newBalance = (currentUser.vibz_balance || 0) + amount;

    const { error: updateError } = await supabase
      .from('users')
      .update({ vibz_balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Failed to update balance:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to add free VIBZ:', error);
    return false;
  }
}

export async function uploadProfileImage(file: File): Promise<{ path: string; url: string }> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error('Authentication required');
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('profilepics')
      .upload(filePath, file, {
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('profilepics')
      .getPublicUrl(filePath);

    return { path: filePath, url: urlData.publicUrl };
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}

export async function saveUser(profile: UserProfile): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({
        id: profile.id,
        username: profile.username,
        wallet_address: profile.wallet_address,
        profile_image_url: profile.profile_image_url,
        email: profile.email,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to save profile: ${error.message}`);
    }
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export function clearStoredUserId(): void {
  localStorage.removeItem('user_id');
}