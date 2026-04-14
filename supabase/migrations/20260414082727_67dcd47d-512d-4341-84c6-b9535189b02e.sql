
-- Function: find similar roles in job_market_data by keyword matching
CREATE OR REPLACE FUNCTION public.find_similar_roles(_search text, _limit int DEFAULT 10, _days int DEFAULT 30)
RETURNS TABLE(role_title text, job_count bigint, similarity_rank int)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH search_terms AS (
    SELECT unnest(string_to_array(LOWER(TRIM(_search)), ' ')) AS term
  ),
  matched_jobs AS (
    SELECT 
      LOWER(TRIM(j.title)) AS norm_title,
      COUNT(*) AS cnt,
      -- Score: how many search terms appear in the title
      SUM(CASE WHEN EXISTS (
        SELECT 1 FROM search_terms st WHERE j.title ILIKE '%' || st.term || '%'
      ) THEN 1 ELSE 0 END) AS match_hits
    FROM job_market_data j
    WHERE j.scraped_at > now() - (_days || ' days')::interval
      AND EXISTS (
        SELECT 1 FROM search_terms st WHERE j.title ILIKE '%' || st.term || '%'
      )
    GROUP BY LOWER(TRIM(j.title))
  )
  SELECT 
    norm_title AS role_title,
    cnt AS job_count,
    ROW_NUMBER() OVER (ORDER BY match_hits DESC, cnt DESC)::int AS similarity_rank
  FROM matched_jobs
  ORDER BY match_hits DESC, cnt DESC
  LIMIT _limit;
$$;

-- Function: get skills/certs for a specific role from job_market_data
CREATE OR REPLACE FUNCTION public.get_role_requirements(_role_pattern text, _days int DEFAULT 30)
RETURNS TABLE(skill_name text, frequency bigint, cert_name text, cert_frequency bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH role_jobs AS (
    SELECT id, extracted_skills, extracted_certifications
    FROM job_market_data
    WHERE scraped_at > now() - (_days || ' days')::interval
      AND title ILIKE '%' || _role_pattern || '%'
  ),
  skills AS (
    SELECT LOWER(TRIM(unnest(extracted_skills))) AS s FROM role_jobs
  ),
  certs AS (
    SELECT TRIM(unnest(extracted_certifications)) AS c FROM role_jobs
  ),
  top_skills AS (
    SELECT s AS skill_name, COUNT(*) AS frequency
    FROM skills WHERE s <> '' GROUP BY s ORDER BY frequency DESC LIMIT 20
  ),
  top_certs AS (
    SELECT c AS cert_name, COUNT(*) AS cert_frequency
    FROM certs WHERE c <> '' GROUP BY c ORDER BY cert_frequency DESC LIMIT 10
  )
  SELECT 
    COALESCE(ts.skill_name, '') AS skill_name,
    COALESCE(ts.frequency, 0) AS frequency,
    COALESCE(tc.cert_name, '') AS cert_name,
    COALESCE(tc.cert_frequency, 0) AS cert_frequency
  FROM top_skills ts
  FULL OUTER JOIN top_certs tc ON false
  LIMIT 30;
$$;
