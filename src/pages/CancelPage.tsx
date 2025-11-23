import React from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CancelPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />

        <h1 className="text-4xl font-bold">Payment Cancelled</h1>

        <p className="text-white/80 text-lg">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="text-white/60 text-sm">
          Redirecting to dashboard in 5 seconds...
        </div>

        <a
          href="/"
          className="inline-block text-pink-500 hover:text-pink-400 underline"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
