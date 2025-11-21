import React, { useState, useEffect } from 'react';
import { CircleUser as UserCircle } from 'lucide-react';
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

  const handleClick = () => {
    navigate('/account');
  };

  return (
    <button 
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 
        bg-white/10 backdrop-blur-sm rounded-lg text-white 
        hover:text-pink-500 transition-colors"
    >
      {user?.profile_image_url ? (
        <img 
          src={user.profile_image_url} 
          alt={user.username || 'User'}
          className="w-5 h-5 rounded-full object-cover"
        />
      ) : (
        <UserCircle size={20} />
      )}
      <span className="text-sm">
        {user?.username || 'Account'}
      </span>
    </button>
  );
}