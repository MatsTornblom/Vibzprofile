import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SuccessPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-vibz-bg font-poppins text-vibz-red flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <CheckCircle className="w-20 h-20 text-vibz-red font-poppins mx-auto" />

        <h1 className="text-4xl font-bold font-poppins text-vibz-red">Payment Successful!</h1>

        <p className="text-vibz-red/80 font-poppins text-lg">
          Thank you for your purchase. Your $VIBZ will be credited to your account shortly.
        </p>

        <div className="text-vibz-red/60 font-poppins text-sm">
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
