CREATE POLICY "Public read profiles for leaderboard"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.student_profiles sp
  WHERE sp.user_id = profiles.user_id AND sp.visibility_public = true
));

CREATE POLICY "Public read certs for leaderboard"
ON public.student_certifications
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public read projects for leaderboard"
ON public.student_projects
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Public read transcripts for leaderboard"
ON public.transcript_uploads
FOR SELECT
TO anon
USING (true);