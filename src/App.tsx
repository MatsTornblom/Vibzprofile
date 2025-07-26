import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AccountPage } from './pages/AccountPage';
import { VersionChecker } from './components/VersionChecker';
import { AccountButton } from './components/AccountButton';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useFullscreen } from './hooks/useFullscreen';

export default function App() {
  const { user, loading } = useCurrentUser();
  const { isFullscreen } = useFullscreen(); // Auto-trigger fullscreen on any interaction
  
  console.log('App rendered, fullscreen state:', isFullscreen);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        {/* Global Header */}
        <header className="fixed top-4 left-4 z-50">
          <AccountButton />
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>

        {/* Global Components */}
        <VersionChecker />
      </div>
    </BrowserRouter>
  );
}