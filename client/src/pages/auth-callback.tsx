import { useEffect, useState } from 'react';
import { useLocation, useLocation as useLocationHook } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [, setLocation] = useLocationHook();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and search params
        const hashParams = new URLSearchParams(location.split('#')[1] || '');
        const searchParams = new URLSearchParams(location.split('?')[1] || '');
        
        // Check for error in URL
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        
        if (error) {
          setError(errorDescription || 'Authentication failed');
          setLoading(false);
          return;
        }

        // Handle the auth callback
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          setError('Failed to authenticate. Please try again.');
          setLoading(false);
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to the app
          setLocation('/scorecard');
        } else {
          setError('No session found. Please try signing in again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [location, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing sign in...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your magic link.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <button
              onClick={() => setLocation('/login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Try signing in again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
