
-- 1. CRITICAL: Block non-admin writes to user_roles
-- Drop existing permissive admin policy and recreate with explicit per-operation policies
-- Add restrictive default-deny for non-admins

-- Non-admin users should NEVER be able to insert/update/delete roles
CREATE POLICY "Block non-admin insert on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin update on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin delete on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. CRITICAL: Remove student ability to self-update ERS scores
DROP POLICY IF EXISTS "Students update own ERS" ON public.ers_scores;

-- Only admins/server can write ERS scores
CREATE POLICY "Only admins update ERS"
ON public.ers_scores
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins insert ERS"
ON public.ers_scores
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Restrict HR shortlists to only public-visibility students
DROP POLICY IF EXISTS "HR manage own shortlists" ON public.hr_shortlists;

CREATE POLICY "HR manage own shortlists"
ON public.hr_shortlists
FOR ALL
TO authenticated
USING (auth.uid() = hr_user_id)
WITH CHECK (
  auth.uid() = hr_user_id
  AND EXISTS (
    SELECT 1 FROM public.student_profiles
    WHERE user_id = student_user_id
    AND visibility_public = true
  )
);
