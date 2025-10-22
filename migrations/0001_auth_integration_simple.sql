-- Add auth_user_id column to users table
ALTER TABLE "users" ADD COLUMN "auth_user_id" varchar;

-- Create unique index for auth_user_id
CREATE UNIQUE INDEX "users_auth_user_id_unique" ON "users"("auth_user_id");

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recruiter_leaders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recruiter_types" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recruiter_points" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recruiter_recruits" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "recruiter_settings" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table - using Supabase's auth.uid() function
CREATE POLICY "Users can read all users" ON "users"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can create users" ON "users"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update users" ON "users"
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete users" ON "users"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for user_profiles table
CREATE POLICY "Authenticated users can read all profiles" ON "user_profiles"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON "user_profiles"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Only admins can create profiles" ON "user_profiles"
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete profiles" ON "user_profiles"
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth_user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for recruiter_leaders table
CREATE POLICY "Authenticated users can read leaders" ON "recruiter_leaders"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create leaders" ON "recruiter_leaders"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update leaders" ON "recruiter_leaders"
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete leaders" ON "recruiter_leaders"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for recruiter_types table
CREATE POLICY "Authenticated users can read types" ON "recruiter_types"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create types" ON "recruiter_types"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update types" ON "recruiter_types"
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete types" ON "recruiter_types"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for recruiter_points table
CREATE POLICY "Authenticated users can read points" ON "recruiter_points"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create points" ON "recruiter_points"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update points" ON "recruiter_points"
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete points" ON "recruiter_points"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for recruiter_recruits table
CREATE POLICY "Authenticated users can read recruits" ON "recruiter_recruits"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create recruits" ON "recruiter_recruits"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update recruits" ON "recruiter_recruits"
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete recruits" ON "recruiter_recruits"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for recruiter_settings table
CREATE POLICY "Authenticated users can read settings" ON "recruiter_settings"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create settings" ON "recruiter_settings"
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update settings" ON "recruiter_settings"
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete settings" ON "recruiter_settings"
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create trigger function to sync auth.users with public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, auth_user_id, role)
  VALUES (
    gen_random_uuid(),
    NEW.email,
    NEW.id,
    'hr'
  );
  
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, name)
  VALUES (
    (SELECT id FROM public.users WHERE auth_user_id = NEW.id),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-sync new auth users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
