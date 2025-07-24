import React, { useState } from 'react';
import { Loader2, Mail, Lock } from 'lucide-react';
import { signInWithEmail, signUpWithEmail } from '../../lib/auth/service';
import { Button } from '../ui/Button';

interface AuthFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function AuthForm({ onSuccess, onError }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setFormError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);
    setFormError(null);

    try {
      const response = mode === 'signup' 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (response.success && response.session) {
        onSuccess();
      } else {
        if (response.error?.toLowerCase().includes('invalid credentials')) {
          setFormError('Invalid email or password');
        } else if (response.error?.includes('already registered')) {
          setFormError('Account exists. Please sign in.');
          setMode('signin');
        } else {
          setFormError(response.error || 'Authentication failed');
        }
        onError(response.error || 'Authentication failed');
      }
    } catch (error) {
      const message = 'Authentication failed. Please try again.';
      setFormError(message);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm text-white/60 mb-1">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError(null);
            }}
            className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
              focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/10"
            placeholder="Enter your email"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError(null);
            }}
            className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-white 
              focus:outline-none focus:ring-2 focus:ring-pink-500 border border-white/10"
            placeholder="Enter your password"
            required
            minLength={6}
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        </div>
        <p className="text-xs text-white/40 mt-1">
          Password must be at least 6 characters long
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setMode('signin');
            handleSubmit(new Event('submit') as any);
          }}
          disabled={isLoading || !email || !password}
          className="flex-1"
        >
          Sign In
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !email || !password}
          loading={isLoading}
          className="flex-1"
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
}