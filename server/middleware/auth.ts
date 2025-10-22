import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    authUserId: string;
    modules: string[];
  };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user details from user_profiles table (which links to auth.users)
    const { data: dbUser, error: dbError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || !dbUser) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    // Check if user has access to the recruiter module
    const hasRecruiterAccess = dbUser.modules && dbUser.modules.includes('recruiter');
    if (!hasRecruiterAccess && !dbUser.is_admin) {
      return res.status(403).json({ error: 'Access denied. Recruiter module access required.' });
    }

    // Attach user info to request
    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.is_admin ? 'admin' : 'hr',
      authUserId: dbUser.id, // user_profiles.id is the auth user ID
      modules: dbUser.modules || [],
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
