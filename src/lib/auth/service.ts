import Cookies from 'js-cookie';
import { supabase } from '../api/supabase';
import { isReactNativeWebView, sendMessageToReactNative } from '../browser';

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export async function signOut(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }

    const cookieOptions = {
      domain: '.' + window.location.hostname.split('.').slice(-2).join('.'),
      sameSite: 'lax' as const,
      secure: true
    };

    Cookies.remove('vibz_return_url', cookieOptions);
    Cookies.remove('vibz_username', cookieOptions);
    Cookies.remove('vibz_id', cookieOptions);

    if (isReactNativeWebView()) {
      sendMessageToReactNative({
        type: 'logout',
        timestamp: new Date().toISOString()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: 'Failed to sign out' };
  }
}
