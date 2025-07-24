import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/services/userService';
import type { UserProfile } from '../lib/types/user';

export function AccountButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    loadUser();

    // Listen for username updates
    window.addEventListener('userUpdated', loadUser);
    return () => {
      window.removeEventListener('userUpdated', loadUser);
    };
  }, []);

  return (
    <button 
      onClick={() => navigate('/account')}
      className="flex items-center gap-2 px-4 py-2 
        bg-white/10 backdrop-blur-sm rounded-lg text-white 
        hover:text-pink-500 transition-colors"
    >
      <UserCircle size={20} />
      <span className="text-sm">
        {user?.username || 'Account'}
      </span>
    </button>
  );
}