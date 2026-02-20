import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

// Cookie storage implementation for cross-domain auth
const cookieStorage = {
  getItem: (key: string) => {
    const value = Cookies.get(key);
    console.log('Getting cookie:', key, value ? 'found' : 'not found');
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    console.log('Setting cookie:', key);
    Cookies.set(key, value, {
      domain: '.' + window.location.hostname.split('.').slice(-2).join('.'),
      sameSite: 'lax',
      path: '/',
      secure: true,
      expires: 365
    });
  },
  removeItem: (key: string) => {
    console.log('Removing cookie:', key);
    Cookies.remove(key, {
      domain: '.' + window.location.hostname.split('.').slice(-2).join('.'),
      sameSite: 'lax',
      path: '/',
      secure: true
    });
  }
};

// Create Supabase client with cookie storage
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: cookieStorage,
      flowType: 'pkce',
      debug: true,
    }
  }
);