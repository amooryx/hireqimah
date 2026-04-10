CREATE POLICY "Public read visible students for leaderboard"
ON public.student_profiles
FOR SELECT
TO anon, authenticated
USING (visibility_public = true);