
CREATE TYPE public.app_role AS ENUM ('student', 'hr', 'university', 'admin');
CREATE TYPE public.gpa_scale AS ENUM ('4', '5');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  nationality TEXT DEFAULT 'Saudi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  gpa NUMERIC(3,2) DEFAULT 0,
  gpa_scale gpa_scale NOT NULL DEFAULT '4',
  target_role TEXT,
  visibility_public BOOLEAN DEFAULT true,
  ers_score NUMERIC(5,2) DEFAULT 0,
  academic_score NUMERIC(5,2) DEFAULT 0,
  certification_score NUMERIC(5,2) DEFAULT 0,
  project_score NUMERIC(5,2) DEFAULT 0,
  soft_skills_score NUMERIC(5,2) DEFAULT 0,
  conduct_score NUMERIC(5,2) DEFAULT 0,
  engagement_points INTEGER DEFAULT 0,
  national_rank INTEGER,
  university_rank INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.university_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  official_domain TEXT,
  admin_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.certification_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  weight NUMERIC(5,2) NOT NULL DEFAULT 10,
  description TEXT,
  is_hadaf_reimbursed BOOLEAN DEFAULT false,
  sector TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.student_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id UUID REFERENCES public.certification_catalog(id),
  custom_name TEXT,
  file_path TEXT,
  verified BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.student_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.transcript_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  parsed_data JSONB,
  parsed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.hr_shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hr_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hr_user_id, student_user_id)
);

CREATE TABLE public.skill_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT DEFAULT 'beginner',
  source TEXT DEFAULT 'self',
  verified BOOLEAN DEFAULT false,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_name)
);

CREATE TABLE public.ers_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score NUMERIC DEFAULT 0,
  academic_score NUMERIC DEFAULT 0,
  certification_score NUMERIC DEFAULT 0,
  project_score NUMERIC DEFAULT 0,
  soft_skills_score NUMERIC DEFAULT 0,
  conduct_score NUMERIC DEFAULT 0,
  recency_score NUMERIC DEFAULT 0,
  synergy_bonus NUMERIC DEFAULT 0,
  national_readiness_bonus NUMERIC DEFAULT 0,
  interview_score NUMERIC DEFAULT 0,
  decay_applied NUMERIC DEFAULT 0,
  explanation JSONB,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.job_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT,
  sector TEXT,
  location TEXT DEFAULT 'Saudi Arabia',
  required_skills TEXT[] DEFAULT '{}',
  required_certifications TEXT[] DEFAULT '{}',
  experience_level TEXT,
  source_url TEXT,
  source TEXT DEFAULT 'manual',
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  raw_data JSONB
);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_hr_profiles_updated_at BEFORE UPDATE ON public.hr_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_university_profiles_updated_at BEFORE UPDATE ON public.university_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public LANGUAGE plpgsql
AS $$
DECLARE _role app_role; _full_name TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student');
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  INSERT INTO public.profiles (user_id, full_name, email) VALUES (NEW.id, _full_name, NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  IF _role = 'student' THEN
    INSERT INTO public.student_profiles (user_id, university, major, gpa, gpa_scale)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'university',''), COALESCE(NEW.raw_user_meta_data->>'major',''), COALESCE((NEW.raw_user_meta_data->>'gpa')::NUMERIC,0), COALESCE((NEW.raw_user_meta_data->>'gpa_scale')::gpa_scale,'4'));
  ELSIF _role = 'hr' THEN
    INSERT INTO public.hr_profiles (user_id, company_name, position, industry)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'company_name',''), COALESCE(NEW.raw_user_meta_data->>'position',''), COALESCE(NEW.raw_user_meta_data->>'industry',''));
  ELSIF _role = 'university' THEN
    INSERT INTO public.university_profiles (user_id, university_name, official_domain, admin_contact)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'university_name',''), COALESCE(NEW.raw_user_meta_data->>'official_domain',''), COALESCE(NEW.raw_user_meta_data->>'admin_contact',''));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public profiles viewable by HR" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own" ON public.student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students update own" ON public.student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "HR view public students" ON public.student_profiles FOR SELECT TO authenticated USING (visibility_public = true AND (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'university')));

ALTER TABLE public.hr_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR read own" ON public.hr_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "HR update own" ON public.hr_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin view HR" ON public.hr_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.university_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Uni read own" ON public.university_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Uni update own" ON public.university_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin view uni" ON public.university_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.certification_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read certs" ON public.certification_catalog FOR SELECT USING (true);
CREATE POLICY "Admins manage certs" ON public.certification_catalog FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own certs" ON public.student_certifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "HR view certs" ON public.student_certifications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own projects" ON public.student_projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "HR view projects" ON public.student_projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.transcript_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own transcripts" ON public.transcript_uploads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view transcripts" ON public.transcript_uploads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated insert own audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

ALTER TABLE public.hr_shortlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "HR manage own shortlists" ON public.hr_shortlists FOR ALL USING (auth.uid() = hr_user_id);

ALTER TABLE public.skill_matrix ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own skills" ON public.skill_matrix FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "HR view skills" ON public.skill_matrix FOR SELECT USING (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.ers_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students read own ERS" ON public.ers_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students update own ERS" ON public.ers_scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "HR view ERS" ON public.ers_scores FOR SELECT USING (public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'university'));
CREATE POLICY "Admins manage ERS" ON public.ers_scores FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.job_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read jobs" ON public.job_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage jobs" ON public.job_cache FOR ALL USING (public.has_role(auth.uid(), 'admin'));
