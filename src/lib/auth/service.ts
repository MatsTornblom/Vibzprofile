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
      console.error('Supabase sign out error:', error);
    }

    const hostname = window.location.hostname;
    const domainParts = hostname.split('.');
    const rootDomain = domainParts.length >= 2
      ? '.' + domainParts.slice(-2).join('.')
      : hostname;

    const cookieOptions = {
      domain: rootDomain,
      path: '/',
      sameSite: 'lax' as const,
      secure: true
    };

    const cookieOptionsWithoutDomain = {
      path: '/',
      sameSite: 'lax' as const,
      secure: true
    };

    Cookies.remove('vibz_return_url', cookieOptions);
    Cookies.remove('vibz_username', cookieOptions);
    Cookies.remove('vibz_id', cookieOptions);

    Cookies.remove('vibz_return_url', cookieOptionsWithoutDomain);
    Cookies.remove('vibz_username', cookieOptionsWithoutDomain);
    Cookies.remove('vibz_id', cookieOptionsWithoutDomain);

    Cookies.remove('vibz_return_url');
    Cookies.remove('vibz_username');
    Cookies.remove('vibz_id');

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
