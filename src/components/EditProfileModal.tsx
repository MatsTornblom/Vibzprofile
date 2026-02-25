import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Loader2, Save } from 'lucide-react';
import { StandardInputBox } from './ui/StandardInputBox';
import { StandardRedButton } from './ui/StandardRedButton';
import { uploadProfileImage, saveUser } from '../lib/services/userService';
import type { UserProfile } from '../lib/types/user';

// --- Constants (same as MyVibzModal) ---
const ANIMATION_DURATION = 1500;
const BOTTOM_GAP = 45;
const NORMAL_SWIPE_THRESHOLD = 150;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaved: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSaved }: EditProfileModalProps) {
  // --- Animation & Gesture State ---
  const [isClosing, setIsClosing] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  // --- Form State ---
  const [editedUser, setEditedUser] = useState<Partial<UserProfile>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate form when user data arrives or modal opens
  useEffect(() => {
    if (isOpen && user) {
      setEditedUser({
        username: user.username,
        wallet_address: user.wallet_address,
        email: user.email,
        profile_image_url: user.profile_image_url,
      });
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [isOpen, user]);

  // Handle entry animation — small delay so the browser paints before we animate
  useEffect(() => {
    if (isOpen && !hasAnimatedIn) {
      const timer = setTimeout(() => setHasAnimatedIn(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasAnimatedIn]);

  // --- Close handler ---
  const handleClose = () => {
    setIsClosing(true);
    if (containerRef.current) {
      setTouchOffset(containerRef.current.offsetHeight);
    }
    setTimeout(() => {
      setHasAnimatedIn(false);
      setIsClosing(false);
      setTouchOffset(0);
      onClose();
    }, ANIMATION_DURATION);
  };

  // --- Swipe-to-close handlers (only on the drag handle area, not scroll area) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.touches[0].clientY - touchStart;
    if (diff > 0) setTouchOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchOffset > NORMAL_SWIPE_THRESHOLD) {
      handleClose();
    } else {
      setTouchOffset(0);
    }
    setTouchStart(null);
  };

  const getTransformOffset = () => {
    if (!hasAnimatedIn || isClosing) {
      return containerRef.current ? containerRef.current.offsetHeight : 1000;
    }
    return touchOffset;
  };

  // --- Image upload ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveError('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setSaveError(null);
      const { url } = await uploadProfileImage(file);
      setEditedUser(prev => ({ ...prev, profile_image_url: url }));
    } catch {
      setSaveError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // --- Save profile ---
  const handleSave = async () => {
    setSaveLoading(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      await saveUser({
        ...user,
        username: editedUser.username ?? user.username,
        wallet_address: editedUser.wallet_address ?? user.wallet_address,
        email: editedUser.email ?? user.email,
        profile_image_url: editedUser.profile_image_url ?? user.profile_image_url,
      });
      setSaveSuccess(true);
      onSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (!isOpen) return null;

  const avatarUrl = editedUser.profile_image_url || user.profile_image_url || 'https://via.placeholder.com/150';

  return (
    // Outer overlay — stops all touch events reaching the page behind
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/0 backdrop-blur-sm pointer-events-none"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >

      {/* Floating Close Button — same position as MyVibzModal */}
      <button
        onClick={handleClose}
        className="fixed pointer-events-auto bg-vibz-red/90 backdrop-blur-lg rounded-full p-4 border-2 border-white/20 transition-all duration-1000 delay-1000 hover:bg-vibz-red hover:scale-110 active:scale-95"
        style={{
          top: '40%',
          right: '8px',
          opacity: hasAnimatedIn && !isClosing ? 1 : 0,
          transform: hasAnimatedIn && !isClosing ? 'scale(1)' : 'scale(0.5)',
          zIndex: 60,
          boxShadow: '0 0 15px rgba(0,0,0,0.3), 0 15px 35px rgba(0,0,0,0.6)',
        }}
        aria-label="Close Edit Profile"
      >
        <X size={28} className="text-white" />
      </button>

      {/* Main Modal Container */}
      <div
        style={{
          marginBottom: `${BOTTOM_GAP}px`,
          maxHeight: `calc(100vh - ${BOTTOM_GAP}px - 32px)`,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          maxWidth: '72rem',
        }}
        className="pointer-events-none flex justify-center w-full"
      >
        <div
          ref={containerRef}
          className="bg-vibz-bg/90 backdrop-blur-lg rounded-3xl p-2 shadow-2xl w-full border-4 border-vibz-red pointer-events-auto flex flex-col"
          style={{
            height: `calc(100vh - ${BOTTOM_GAP}px - 32px)`,
            transform: `translateY(${getTransformOffset()}px)`,
            transition: touchStart !== null
              ? 'none'
              : `transform ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${ANIMATION_DURATION}ms ease-in`,
            opacity: isClosing || !hasAnimatedIn ? 0 : 1,
          }}
        >
          {/* Header — swipe target */}
          <div
            className="flex-none p-6 border-b border-vibz-red/20 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <h2 className="text-5xl font-thin text-vibz-textbox-text font-deaugusta text-center pt-2">
              Edit Profile
            </h2>
          </div>

          {/* Scrollable Content — touch events stay here, don't bubble to page */}
          <div className="flex-1 overflow-y-auto min-h-0">

            {/* Avatar — large, pulled up to overlap the Name input below */}
            <div className="flex justify-center pt-6" style={{ marginBottom: '-52px' }}>
              <div className="relative w-40 h-40 z-10">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-vibz-red/30 shadow-xl"
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
                  className="absolute bottom-1 right-1 bg-vibz-red rounded-full p-2.5 border-2 border-vibz-bg hover:bg-vibz-button-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  aria-label="Change profile photo"
                >
                  {uploadingImage
                    ? <Loader2 size={18} className="animate-spin text-white" />
                    : <Camera size={18} className="text-white" />
                  }
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="px-6 pb-6 space-y-5">

              {/* Name — extra top padding so the avatar overlaps into it */}
              <div className="pt-16">
                <StandardInputBox
                  label="Name"
                  type="text"
                  value={editedUser.username ?? ''}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <StandardInputBox
                label="Email"
                type="email"
                value={editedUser.email ?? ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />

              <StandardInputBox
                label="Solana Wallet Address"
                type="text"
                value={editedUser.wallet_address ?? ''}
                onChange={(e) => setEditedUser(prev => ({ ...prev, wallet_address: e.target.value }))}
                placeholder="Enter wallet address"
              />

              <StandardInputBox
                label="Citizen ID"
                type="text"
                value={user.id}
                disabled
              />

              {/* Feedback messages */}
              {saveSuccess && (
                <div className="bg-vibz-red/10 border border-vibz-red/30 rounded-xl p-3 text-vibz-red text-sm text-center font-poppins">
                  Profile saved successfully!
                </div>
              )}
              {saveError && (
                <div className="bg-vibz-red/10 border border-vibz-red/30 rounded-xl p-3 text-vibz-red text-sm text-center font-poppins">
                  {saveError}
                </div>
              )}

              {/* Save Button — larger text, tighter padding, same overall size */}
              <StandardRedButton
                onClick={handleSave}
                disabled={saveLoading || uploadingImage}
                className="w-full py-2 text-xl"
              >
                {saveLoading
                  ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                  : <><Save size={20} /> Save</>
                }
              </StandardRedButton>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
