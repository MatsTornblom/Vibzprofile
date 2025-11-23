import React from 'react';
import { Camera, Gift, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { isDevEnvironment } from '../lib/browser';
import { createCheckoutSession } from '../lib/api/stripe';
import { VIBZ_PRODUCT } from '../lib/stripe-config';
import { addFreeVibz } from '../lib/services/userService';

export function HomePage() {
  const { user, loading, refreshUser } = useCurrentUser();
  const isDevMode = isDevEnvironment();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  const [showFreeVibzModal, setShowFreeVibzModal] = React.useState(false);
  const [freeVibzLoading, setFreeVibzLoading] = React.useState(false);

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

  const handleGetFreeVibz = async () => {
    if (!user) return;

    setFreeVibzLoading(true);
    try {
      const success = await addFreeVibz(user.id, 100);
      if (success) {
        await refreshUser();
        setShowFreeVibzModal(false);
      } else {
        alert('Failed to add free VIBZ. Please try again.');
      }
    } catch (error) {
      console.error('Error adding free VIBZ:', error);
      alert('Failed to add free VIBZ. Please try again.');
    } finally {
      setFreeVibzLoading(false);
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
          <h1 className="text-2xl font-bold">Vibz World Citizenship</h1>
          <Button variant="secondary" onClick={() => {
            window.location.href = 'https://enter.vibz.world/logout';
          }}>
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
              src={user.profile_image_url || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-pink-500 rounded-full p-2 hover:bg-pink-600 transition-colors">
              <Camera size={20} />
            </button>
          </div>

          {/* VIBZ Balance */}
          <div className="text-center mb-6">
            <p className="text-white/60 mb-2">$VIBZ Balance</p>
            <p className="text-5xl font-bold mb-4">{user.vibz_balance || 0}</p>

            {checkoutError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm mb-4">
                {checkoutError}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => setShowFreeVibzModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                disabled={checkoutLoading}
              >
                <Gift size={18} />
                Get free $VIBZ
              </Button>
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

        {/* Free VIBZ Modal */}
        <Modal
          isOpen={showFreeVibzModal}
          onClose={() => setShowFreeVibzModal(false)}
          title="Get Free $VIBZ"
          size="sm"
        >
          <div className="p-6 space-y-4">
            <p className="text-white/80">
              Claim 100 free $VIBZ to get started in Vibz World!
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowFreeVibzModal(false)}
                className="flex-1"
                disabled={freeVibzLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleGetFreeVibz}
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled={freeVibzLoading}
              >
                {freeVibzLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift size={18} className="mr-2" />
                    Claim Free $VIBZ
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Editable Fields */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm text-white/60 mb-2">Name</label>
            <input
              type="text"
              value={user.username || ''}
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
              value={user.wallet_address || ''}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              placeholder="Enter wallet address"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
              placeholder="Enter email address"
            />
          </div>
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