
-- Job market data table for raw scraped/ingested job postings
CREATE TABLE IF NOT EXISTS public.job_market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  location text DEFAULT 'Saudi Arabia',
  description text,
  source text DEFAULT 'manual',
  source_url text,
  extracted_skills text[] DEFAULT '{}',
  extracted_certifications text[] DEFAULT '{}',
  sector text,
  experience_level text,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

CREATE INDEX idx_jmd_scraped_at ON public.job_market_data(scraped_at DESC);
CREATE INDEX idx_jmd_skills ON public.job_market_data USING GIN(extracted_skills);
CREATE INDEX idx_jmd_certs ON public.job_market_data USING GIN(extracted_certifications);
CREATE INDEX idx_jmd_sector ON public.job_market_data(sector);

ALTER TABLE public.job_market_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage job_market_data" ON public.job_market_data
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated read job_market_data" ON public.job_market_data
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read job_market_data" ON public.job_market_data
  FOR SELECT TO anon USING (true);

-- Aggregation function: top skills by frequency across all recent job postings
CREATE OR REPLACE FUNCTION public.get_market_skill_rankings(_limit int DEFAULT 50, _days int DEFAULT 30)
RETURNS TABLE(skill_name text, frequency bigint, percentage numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  WITH total AS (
    SELECT COUNT(*) AS cnt FROM job_market_data WHERE scraped_at > now() - (_days || ' days')::interval
  ),
  skills AS (
    SELECT LOWER(TRIM(unnest(extracted_skills))) AS skill
    FROM job_market_data
    WHERE scraped_at > now() - (_days || ' days')::interval
  )
  SELECT 
    skill AS skill_name,
    COUNT(*) AS frequency,
    ROUND((COUNT(*)::numeric / NULLIF((SELECT cnt FROM total), 0)) * 100, 1) AS percentage
  FROM skills
  WHERE skill <> ''
  GROUP BY skill
  ORDER BY frequency DESC
  LIMIT _limit;
$$;

-- Aggregation function: top certifications by frequency
CREATE OR REPLACE FUNCTION public.get_market_cert_rankings(_limit int DEFAULT 30, _days int DEFAULT 30)
RETURNS TABLE(cert_name text, frequency bigint, percentage numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  WITH total AS (
    SELECT COUNT(*) AS cnt FROM job_market_data WHERE scraped_at > now() - (_days || ' days')::interval
  ),
  certs AS (
    SELECT TRIM(unnest(extracted_certifications)) AS cert
    FROM job_market_data
    WHERE scraped_at > now() - (_days || ' days')::interval
  )
  SELECT 
    cert AS cert_name,
    COUNT(*) AS frequency,
    ROUND((COUNT(*)::numeric / NULLIF((SELECT cnt FROM total), 0)) * 100, 1) AS percentage
  FROM certs
  WHERE cert <> ''
  GROUP BY cert
  ORDER BY frequency DESC
  LIMIT _limit;
$$;

-- Student skill gap function: returns skills the market demands that the student doesn't have
CREATE OR REPLACE FUNCTION public.get_student_skill_gaps(_user_id uuid, _limit int DEFAULT 20)
RETURNS TABLE(skill_name text, market_frequency bigint, market_percentage numeric, is_missing boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = 'public'
AS $$
  WITH market AS (
    SELECT * FROM get_market_skill_rankings(100, 30)
  ),
  student_skills AS (
    SELECT LOWER(TRIM(sm.skill_name)) AS skill FROM skill_matrix sm WHERE sm.user_id = _user_id
  )
  SELECT
    m.skill_name,
    m.frequency AS market_frequency,
    m.percentage AS market_percentage,
    NOT EXISTS (SELECT 1 FROM student_skills ss WHERE ss.skill = m.skill_name) AS is_missing
  FROM market m
  ORDER BY m.frequency DESC
  LIMIT _limit;
$$;
