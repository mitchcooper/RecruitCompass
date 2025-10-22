import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export function AuthDebug() {
  const { user, session, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionInfo(session);
    };
    checkSession();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Authentication Debug</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
        <div><strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}</div>
        <div><strong>Session Info:</strong> {sessionInfo ? 'Present' : 'None'}</div>
        {sessionInfo && (
          <div><strong>Session Token:</strong> {sessionInfo.access_token ? 'Present' : 'Missing'}</div>
        )}
      </div>
    </div>
  );
}
