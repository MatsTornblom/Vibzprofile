import React from 'react';
import { Camera, Loader2, Save, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StandardInputBox } from '../components/ui/StandardInputBox';
import { StandardBeigeButton } from '../components/ui/StandardBeigeButton';
import { StandardRedButton } from '../components/ui/StandardRedButton';
import { FreeVibzButton } from '../components/FreeVibzButton';
import { BuyVibzButton } from '../components/BuyVibzButton';
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
      <div className="min-h-screen bg-vibz-bg flex items-center justify-center">
        <div className="text-vibz-red/60">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-vibz-bg text-vibz-bb">
      {/* Header */}
      <header className="border-b border-vibz-red/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StandardRedButton
              onClick={() => window.location.href = 'https://love.vibz.world'}
            >
              <ArrowLeft size={18} />
              Spread love
            </StandardRedButton>
            <h1 className="text-2xl text-vibz-textbox-text font-deaugusta text-center pt-10">Vibz World Citizenship</h1>
          </div>
          <StandardBeigeButton
            onClick={() => window.location.href = 'https://enter.vibz.world/logout'}
          >
            <LogOut size={18} />
            Log Out
          </StandardBeigeButton>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Development Mode Indicator */}
        {isDevMode && (
          <div className="bg-vibz-red/10 border border-vibz-red/30 rounded-lg p-3 text-vibz-red text-sm mb-6">
            Development Mode Active
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
              className="absolute bottom-0 right-0 bg-vibz-red/30 rounded-full p-2 hover:bg-vibz-red/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-vibz-red/60 mb-2 font-poppins" >$VIBZ Balance</p>
            <p className="text-5xl font-bold font-poppins mb-4 text-vibz-red">{vibzBalance}</p>

            {checkoutError && (
              <div className="bg-vibz-red/10 border border-vibz-red/30 rounded-lg p-3 text-vibz-red text-sm mb-4">
                {checkoutError}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <FreeVibzButton onVibzAdded={handleVibzAdded} />
              <BuyVibzButton onPurchaseClick={handleBuyVibz} isLoading={checkoutLoading} />
            </div>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4 mb-8">
          <StandardInputBox
            label="Name"
            type="text"
            value={editedUser.username ?? ''}
            onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
            placeholder="Enter your name"
          />

          <StandardInputBox
            label="Citizen ID"
            type="text"
            value={user.id}
            disabled
          />

          <StandardInputBox
            label="Solana Wallet Address"
            type="text"
            value={editedUser.wallet_address ?? ''}
            onChange={(e) => setEditedUser({ ...editedUser, wallet_address: e.target.value })}
            placeholder="Enter wallet address"
          />

          <StandardInputBox
            label="Email"
            type="email"
            value={editedUser.email ?? ''}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            placeholder="Enter email address"
          />

          {saveSuccess && (
            <div className="bg-vibz-red/10 border border-vibz-red/30 rounded-lg p-3 text-vibz-red text-sm text-center">
              Profile saved successfully!
            </div>
          )}

          <StandardRedButton
            onClick={handleSaveProfile}
            disabled={saveLoading}
            className="w-full py-3"
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
          </StandardRedButton>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-vibz-button-beige backdrop-blur-sm rounded-xl p-6 border border-vibz-red/10">
            <p className="text-vibz-red/60 text-sm mb-2">Messages Sent</p>
            <p className="text-4xl font-bold text-vibz-red">{user.messages_sent || 0}</p>
          </div>

          <div className="bg-vibz-button-beige backdrop-blur-sm rounded-xl p-6 border border-vibz-red/10">
            <p className="text-vibz-red/60 text-sm mb-2">Messages Received</p>
            <p className="text-4xl font-bold text-vibz-red">{user.messages_received || 0}</p>
          </div>

          <div className="bg-vibz-button-beige backdrop-blur-sm rounded-xl p-6 border border-vibz-red/10">
            <p className="text-vibz-red/60 text-sm mb-2">Pending Messages</p>
            <p className="text-4xl font-bold text-vibz-red">{user.pending_messages || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}