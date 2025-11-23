import React, { useState } from 'react';
import { Loader2, Gift } from 'lucide-react';
import { supabase } from '../lib/api/supabase';

interface FreeVibzButtonProps {
  onVibzAdded: (newBalance: number) => void;
}

export function FreeVibzButton({ onVibzAdded }: FreeVibzButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        throw new Error('Authentication required');
      }

      // Add 100 VIBZ to the user's balance
      const { error: incrementError } = await supabase.rpc('increment_vibz_balance', {
        user_id: session.user.id,
        amount: 100
      });

      if (incrementError) {
        throw new Error(`Failed to add VIBZ: ${incrementError.message}`);
      }

      // Get the updated balance
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('vibz_balance')
        .eq('id', session.user.id)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch updated balance: ${fetchError.message}`);
      }

      // Update the parent component with the new balance
      onVibzAdded(userData.vibz_balance);
      
      // Show the popup
      setShowPopup(true);
      
    } catch (error) {
      console.error('Free VIBZ error:', error);
      setError(error instanceof Error ? error.message : 'Failed to add free VIBZ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-green-500 flex items-center gap-2 text-sm"
          style={{ backgroundColor: isLoading ? undefined : '#22c55e' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={14} />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Gift size={14} />
              <span>Get free $VIBZ</span>
            </>
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <Gift className="text-green-500" size={48} />
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-white">
              Congratulations!
            </h2>
            
            <p className="text-white/80 mb-6">
              100 $VIBZ has been added to your account. Now go spread love in the Vibz world, you beautiful soul!
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </>
  );
}