
-- 1. Fix user_roles: restrict admin ALL policy to authenticated only
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Also update restrictive policies to cover public role too
DROP POLICY IF EXISTS "Block non-admin insert on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Block non-admin update on user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Block non-admin delete on user_roles" ON public.user_roles;

CREATE POLICY "Block non-admin insert on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin update on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO public
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin delete on user_roles"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO public
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Scope HR profile access to public-visibility students only
DROP POLICY IF EXISTS "Public profiles viewable by HR" ON public.profiles;
CREATE POLICY "HR view profiles of public students"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (has_role(auth.uid(), 'admin'::app_role))
  OR (
    (has_role(auth.uid(), 'hr'::app_role) OR has_role(auth.uid(), 'university'::app_role))
    AND EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = profiles.user_id AND sp.visibility_public = true
    )
  )
);

-- 3. Scope HR cert view to public students
DROP POLICY IF EXISTS "HR view certs" ON public.student_certifications;
CREATE POLICY "HR view certs of public students"
ON public.student_certifications
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_role(auth.uid(), 'hr'::app_role)
    AND EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = student_certifications.user_id AND sp.visibility_public = true
    )
  )
);

-- 4. Scope HR skills view to public students
DROP POLICY IF EXISTS "HR view skills" ON public.skill_matrix;
CREATE POLICY "HR view skills of public students"
ON public.skill_matrix
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_role(auth.uid(), 'hr'::app_role)
    AND EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = skill_matrix.user_id AND sp.visibility_public = true
    )
  )
);

-- 5. Scope HR/uni ERS view to public students
DROP POLICY IF EXISTS "HR view ERS" ON public.ers_scores;
CREATE POLICY "HR view ERS of public students"
ON public.ers_scores
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    (has_role(auth.uid(), 'hr'::app_role) OR has_role(auth.uid(), 'university'::app_role))
    AND EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = ers_scores.user_id AND sp.visibility_public = true
    )
  )
);

-- 6. Scope HR project view to public students
DROP POLICY IF EXISTS "HR view projects" ON public.student_projects;
CREATE POLICY "HR view projects of public students"
ON public.student_projects
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (
    has_role(auth.uid(), 'hr'::app_role)
    AND EXISTS (
      SELECT 1 FROM public.student_profiles sp
      WHERE sp.user_id = student_projects.user_id AND sp.visibility_public = true
    )
  )
);
