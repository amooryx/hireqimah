-- Add scheduling fields to interview_requests
ALTER TABLE public.interview_requests
  ADD COLUMN IF NOT EXISTS meeting_url text,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS meeting_provider text,
  ADD COLUMN IF NOT EXISTS job_posting_id uuid;

-- Helpful index for filtering upcoming interviews
CREATE INDEX IF NOT EXISTS idx_interview_requests_scheduled_at
  ON public.interview_requests (scheduled_at);

CREATE INDEX IF NOT EXISTS idx_interview_requests_student_user_id
  ON public.interview_requests (student_user_id);

CREATE INDEX IF NOT EXISTS idx_interview_requests_hr_user_id
  ON public.interview_requests (hr_user_id);

-- Enable realtime delivery for interview_requests
ALTER TABLE public.interview_requests REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'interview_requests'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_requests';
  END IF;
END $$;

-- Also enable realtime for notifications (used by both dashboards)
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
  END IF;
END $$;