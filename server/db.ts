import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_WEB) {
  throw new Error(
    "SUPABASE_WEB must be set. Did you forget to configure Supabase?",
  );
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_KEY must be set. Did you forget to configure Supabase?",
  );
}

// Create Supabase client with service key for backend operations
// Using untyped client for now - can add generated types later
export const supabase = createClient(
  process.env.SUPABASE_WEB,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to verify JWT tokens
export async function verifyJWT(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return { user, error };
}
