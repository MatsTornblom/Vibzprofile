import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AccountPage } from './pages/AccountPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { VersionChecker } from './components/VersionChecker';
import { useCurrentUser } from './hooks/useCurrentUser';
import { useFullscreen } from './hooks/useFullscreen';

export default function App() {
  const { user, loading } = useCurrentUser();
  const { isFullscreen } = useFullscreen(); // Auto-trigger fullscreen on any interaction
  
  console.log('App rendered, fullscreen state:', isFullscreen);

  if (loading) {
    return (
      <div className="min-h-screen bg-vibz-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibz-red mx-auto mb-4"></div>
          <p className="text-vibz-red">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-vibz-bg text-vibz-red">
        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
        </Routes>

        {/* Global Components */}
        <VersionChecker />
      </div>
    </BrowserRouter>
  );
}