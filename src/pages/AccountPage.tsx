import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StandardBeigeButton } from '../components/ui/StandardBeigeButton';
import { StandardRedButton } from '../components/ui/StandardRedButton';
import { useCurrentUser } from '../hooks/useCurrentUser';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-vibz-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibz-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vibz-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:text-vibz-red transition-colors text-vibz-red"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-vibz-red">Account</h1>
        </div>

        {user ? (
          /* Signed In View */
          <div className="space-y-6">
            <div className="bg-vibz-button-beige backdrop-blur-sm rounded-2xl p-6 border border-vibz-red/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-vibz-red/20 rounded-full">
                  <User className="text-vibz-red" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-vibz-red">
                    {user.username || 'Anonymous User'}
                  </h2>
                  <p className="text-vibz-red/60">Vibz Citizen</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-vibz-red/40" size={20} />
                  <span className="text-vibz-red">{user.email || 'No email'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-vibz-red/40" size={20} />
                  <span className="text-vibz-red">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <StandardRedButton
                onClick={() => window.open('https://enter.vibz.world/', '_blank')}
              >
                <ExternalLink size={16} />
                Manage Account
              </StandardRedButton>
            </div>
          </div>
        ) : (
          /* Not Signed In View */
          <div className="text-center space-y-6">
            <div className="bg-vibz-button-beige backdrop-blur-sm rounded-2xl p-8 border border-vibz-red/10">
              <h2 className="text-xl font-semibold mb-4 text-vibz-red">Welcome to Vibz</h2>
              <p className="text-vibz-red/60 mb-6">
                You need to be signed in to access this application
              </p>
              
              <StandardRedButton
                onClick={() => window.open('https://check.vibz.world/', '_blank')}
              >
                <ExternalLink size={16} />
                Test Authentication
              </StandardRedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}