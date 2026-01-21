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
    <div className="min-h-screen bg-vibz-bg text-vibz-red flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <XCircle className="w-20 h-20 text-vibz-red mx-auto" />

        <h1 className="text-4xl font-poppins font-bold text-vibz-red">Payment Cancelled</h1>

        <p className="text-vibz-red/80 text-lg font-poppins ">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="text-vibz-red/60 text-sm font-poppins">
          Redirecting to dashboard in 5 seconds...
        </div>

        <a
          href="/"
          className="inline-block font-poppins text-vibz-red hover:text-vibz-button-red-hover underline"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}
