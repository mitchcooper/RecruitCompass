# Supabase Authentication Setup Guide

## 1. Environment Variables Setup

You need to set these environment variables in your Supabase project:

### Backend Environment Variables (already in your project):
```bash
SUPABASE_URL=your_database_connection_string
SUPABASE_WEB=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5000
```

### Frontend Environment Variables (NEW - add these):
```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

## 2. Supabase Project Configuration

### A. Enable Email Authentication
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Settings
3. Enable "Email" provider
4. Configure email templates if needed

### B. Set Redirect URLs
1. In Authentication > Settings > URL Configuration
2. Add these URLs to "Site URL" and "Redirect URLs":
   - `http://localhost:5000`
   - `http://localhost:5000/auth/callback`
   - Your production domain (when deployed)

### C. Email Configuration
1. Go to Authentication > Settings > SMTP Settings
2. Configure your email provider (or use Supabase's default)
3. Test email sending

## 3. Database Migration

Run the SQL migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of migrations/0001_auth_integration.sql
-- This will:
-- 1. Add auth_user_id column to users table
-- 2. Enable RLS on all tables
-- 3. Create RLS policies
-- 4. Create auto-sync triggers
```

## 4. Testing the Setup

### A. Check Configuration
Visit: `http://localhost:5000/api/debug/supabase`
This should show your Supabase configuration.

### B. Test Magic Link
1. Go to `http://localhost:5000/login`
2. Enter your email address
3. Check the server logs for detailed error messages
4. Check your email for the magic link

## 5. Common Issues

### Issue: "Failed to send magic link"
**Possible causes:**
1. Missing environment variables
2. Email authentication not enabled in Supabase
3. SMTP not configured
4. Invalid Supabase URL or keys

### Issue: "Invalid redirect URL"
**Solution:** Add your domain to Supabase redirect URLs

### Issue: "User not found in database"
**Solution:** The auto-sync trigger should create users automatically, but you can manually create a user in the users table first.

## 6. Manual User Creation (if needed)

If the auto-sync isn't working, you can manually create a user:

```sql
-- First, get the auth user ID from Supabase Auth
-- Then insert into your users table:
INSERT INTO users (email, role, auth_user_id) 
VALUES ('your-email@example.com', 'hr', 'auth-user-id-from-supabase');

-- Create user profile:
INSERT INTO user_profiles (user_id, name)
VALUES (
  (SELECT id FROM users WHERE email = 'your-email@example.com'),
  'Your Name'
);
```

## 7. Next Steps

Once authentication is working:
1. Test the magic link flow end-to-end
2. Verify RLS policies are working
3. Test protected routes
4. Test user management features
