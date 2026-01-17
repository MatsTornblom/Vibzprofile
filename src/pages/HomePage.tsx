import React from 'react';
import { Camera, Loader2, Save, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FreeVibzButton } from '../components/FreeVibzButton';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { isDevEnvironment } from '../lib/browser';
import { createCheckoutSession } from '../lib/api/stripe';
import { VIBZ_PRODUCT } from '../lib/stripe-config';
import { uploadProfileImage, saveUser } from '../lib/services/userService';
import type { UserProfile } from '../lib/types/user';

export function HomePage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const navigate = useNavigate();
  const isDevMode = isDevEnvironment();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const [vibzBalance, setVibzBalance] = React.useState<number>(0);
  const [editedUser, setEditedUser] = React.useState<Partial<UserProfile>>({});
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBuyVibz = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

      const baseUrl = window.location.origin;
      const { url } = await createCheckoutSession({
        priceId: VIBZ_PRODUCT.priceId,
        mode: VIBZ_PRODUCT.mode,
        successUrl: `${baseUrl}/success`,
        cancelUrl: `${baseUrl}/cancel`,
      });

      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Failed to start checkout');
      setCheckoutLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      setVibzBalance(user.vibz_balance || 0);
      setEditedUser({
        username: user.username,
        wallet_address: user.wallet_address,
        email: user.email,
        profile_image_url: user.profile_image_url,
      });
    }
  }, [user]);

  const handleVibzAdded = (newBalance: number) => {
    setVibzBalance(newBalance);
    refreshUser();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const { url } = await uploadProfileImage(file);
      setEditedUser({ ...editedUser, profile_image_url: url });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaveLoading(true);
    setSaveSuccess(false);

    try {
      await saveUser({
        ...user,
        username: editedUser.username ?? user.username,
        wallet_address: editedUser.wallet_address ?? user.wallet_address,
        email: editedUser.email ?? user.email,
        profile_image_url: editedUser.profile_image_url ?? user.profile_image_url,
      });

      setSaveSuccess(true);
      await refreshUser();

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };


  // Auto-redirect to login if not authenticated (skip in dev mode)
  React.useEffect(() => {
    if (!isDevMode && !loading && !user) {
      const returnUrl = encodeURIComponent(window.location.href);
      const authUrl = `https://enter.vibz.world/?returnUrl=${returnUrl}`;
      window.location.href = authUrl;
    }
  }, [user, loading, isDevMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => window.location.href = 'https://love.vibz.world'}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Spread love
            </Button>
            <h1 className="text-2xl font-bold">Vibz World Citizenship</h1>
          </div>
          <Button
            variant="secondary"
            onClick={() => window.location.href = 'https://enter.vibz.world/logout'}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Development Mode Indicator */}
        {isDevMode && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-300 text-sm mb-6">
            🔧 Development Mode Active
          </div>
        )}

        {/* Profile Header */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src={editedUser.profile_image_url || user.profile_image_url || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Camera size={20} />
              )}
            </button>
          </div>

          {/* VIBZ Balance */}
          <div className="text-center mb-6">
            <p className="text-white/60 mb-2">$VIBZ Balance</p>
            <p className="text-5xl font-bold mb-4">{vibzBalance}</p>

            {checkoutError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm mb-4">
                {checkoutError}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <FreeVibzButton onVibzAdded={handleVibzAdded} />
              <Button
                variant="primary"
                onClick={handleBuyVibz}
                disabled={checkoutLoading}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy $VIBZ'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm text-white/60 mb-2">Name</label>
            <input
              type="text"
              value={editedUser.username ?? ''}
              onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Citizen ID</label>
            <input
              type="text"
              value={user.id}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Solana Wallet Address</label>
            <input
              type="text"
              value={editedUser.wallet_address ?? ''}
              onChange={(e) => setEditedUser({ ...editedUser, wallet_address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              placeholder="Enter wallet address"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>
            <input
              type="email"
              value={editedUser.email ?? ''}
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              placeholder="Enter email address"
            />
          </div>

          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-300 text-sm text-center">
              Profile saved successfully!
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleSaveProfile}
            disabled={saveLoading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </Button>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm mb-2">Messages Sent</p>
            <p className="text-4xl font-bold">{user.messages_sent || 0}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm mb-2">Messages Received</p>
            <p className="text-4xl font-bold">{user.messages_received || 0}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-white/60 text-sm mb-2">Pending Messages</p>
            <p className="text-4xl font-bold">{user.pending_messages || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}