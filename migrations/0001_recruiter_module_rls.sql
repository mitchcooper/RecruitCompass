-- Add RLS policies for recruiter module tables
-- These policies check that users have 'recruiter' in their modules array or are admin

-- RLS Policies for recruiter_leaders table
CREATE POLICY "Recruiter module users can read leaders" ON "recruiter_leaders"
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can create leaders" ON "recruiter_leaders"
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can update leaders" ON "recruiter_leaders"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can delete leaders" ON "recruiter_leaders"
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

-- RLS Policies for recruiter_types table
CREATE POLICY "Recruiter module users can read types" ON "recruiter_types"
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can create types" ON "recruiter_types"
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can update types" ON "recruiter_types"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can delete types" ON "recruiter_types"
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

-- RLS Policies for recruiter_points table
CREATE POLICY "Recruiter module users can read points" ON "recruiter_points"
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can create points" ON "recruiter_points"
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can update points" ON "recruiter_points"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can delete points" ON "recruiter_points"
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

-- RLS Policies for recruiter_recruits table
CREATE POLICY "Recruiter module users can read recruits" ON "recruiter_recruits"
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can create recruits" ON "recruiter_recruits"
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can update recruits" ON "recruiter_recruits"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can delete recruits" ON "recruiter_recruits"
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

-- RLS Policies for recruiter_settings table
CREATE POLICY "Recruiter module users can read settings" ON "recruiter_settings"
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can create settings" ON "recruiter_settings"
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can update settings" ON "recruiter_settings"
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );

CREATE POLICY "Recruiter module users can delete settings" ON "recruiter_settings"
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND ('recruiter' = ANY(modules) OR is_admin = true)
      )
    )
  );
