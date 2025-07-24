import { supabase } from '../api/supabase';
import type { AuthError } from '@supabase/supabase-js';
import { clearStoredUserId, createNewUser } from '../services/userService';

export interface AuthResponse {
  success: boolean;
  error?: string;
  session?: any;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long'
      };
    }

    // First check if user exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (existingUser?.session) {
      // User exists and credentials are valid
      return {
        success: true,
        session: existingUser.session
      };
    }

    // If we get here, try to create new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`
      }
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already registered')) {
        return {
          success: false,
          error: 'Account exists. Please sign in with your password.'
        };
      }
      throw error;
    }

    // Create a new user profile after successful signup
    if (data.session) {
      const user = await createNewUser();
      if (!user) {
        throw new Error('Failed to create user profile');
      }
    }
    
    return { 
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: (error as AuthError).message || 'Failed to sign up'
    };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      throw error;
    }

    // Get existing user profile first
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (existingUser) {
      return { 
        success: true,
        session: data.session
      };
    }

    // If no profile exists, create one
    const newUser = await createNewUser();
    if (!newUser) {
      throw new Error('Failed to create user profile');
    }

    return { 
      success: true,
      session: data.session
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: (error as AuthError).message || 'Failed to sign in'
    };
  }
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear local user data
    clearStoredUserId();
    
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: (error as AuthError).message || 'Failed to sign out'
    };
  }
}