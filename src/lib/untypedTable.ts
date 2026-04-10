import { supabase } from "@/integrations/supabase/client";

/**
 * Helper for querying tables that are not yet in the auto-generated types.
 * Use this for: interview_requests, messages, notifications
 */
export function untypedTable(tableName: string) {
  return (supabase as any).from(tableName);
}
