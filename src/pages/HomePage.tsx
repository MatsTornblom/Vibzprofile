import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function HomePage() {
  const { user } = useCurrentUser();

  const handleAuthenticateAndRedirect = () => {
    if (user) {
      alert('You are already authenticated!');
      return;
    }
    
    // Build the return URL (current page)
    const returnUrl = encodeURIComponent(window.location.href);
    const authUrl = `https://enter.vibz.world/?returnUrl=${returnUrl}`;
    
    // Redirect to authentication (same tab)
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="text-pink-500" size={32} fill="currentColor" />
            <Sparkles className="text-yellow-400" size={24} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Vibz Template
          </h1>
          
          <p className="text-xl text-white/80 max-w-lg mx-auto">
            A starter template for building applications in the Vibz ecosystem
          </p>
        </div>

        {/* User Status */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          {user ? (
            <div className="space-y-4">
              {/* Profile Picture */}
              {user.profile_image_url && (
                <div className="flex justify-center">
                  <img 
                    src={user.profile_image_url} 
                    alt={user.username || 'User profile'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500/30"
                  />
                </div>
              )}
              
              <div className="space-y-2 text-center">
              <p className="text-white/60">Welcome back!</p>
              <p className="text-lg font-medium">
                {user.username || 'Anonymous User'}
              </p>
              <p className="text-sm text-white/40">
                User ID: {user.id}
              </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-white/60">Not signed in</p>
              <Button 
                variant="primary" 
                onClick={() => window.open('https://enter.vibz.world/', '_blank')}
              >
                Sign in/Sign up
              </Button>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-sm text-white/60">
              Cross-domain cookie-based auth system
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="font-semibold mb-2">Design System</h3>
            <p className="text-sm text-white/60">
              Consistent UI components and styling
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="font-semibold mb-2">Database</h3>
            <p className="text-sm text-white/60">
              Pre-configured Supabase integration
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <p className="text-white/60">
            Start building your Vibz application!
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={handleAuthenticateAndRedirect}>
              Authenticate and redirect
            </Button>
            <Button variant="primary" onClick={() => window.open('https://check.vibz.world/', '_blank')}>
              Test Authentication
            </Button>
            <Button variant="secondary" onClick={() => window.open('https://github.com/MatsTornblom/VibzWorldTemplate', '_blank')}>
              View Template in GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}