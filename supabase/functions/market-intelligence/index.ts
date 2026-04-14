import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    let body: any = {};
    try { body = await req.json(); } catch { /* empty body ok */ }

    const action = body.action || "get-demand";

    // ── ACTION: get-demand — Return aggregated market demand from job_market_data
    if (action === "get-demand") {
      const days = body.days || 30;

      // Use the aggregation functions
      const [skillsRes, certsRes, jobCountRes, lastRefresh] = await Promise.all([
        supabase.rpc("get_market_skill_rankings", { _limit: 50, _days: days }),
        supabase.rpc("get_market_cert_rankings", { _limit: 30, _days: days }),
        supabase.from("job_market_data").select("*", { count: "exact", head: true })
          .gte("scraped_at", new Date(Date.now() - days * 86400000).toISOString()),
        supabase.from("market_refresh_log").select("*").order("started_at", { ascending: false }).limit(1),
      ]);

      return new Response(
        JSON.stringify({
          skills: skillsRes.data || [],
          certifications: certsRes.data || [],
          total_jobs: jobCountRes.count || 0,
          last_refresh: lastRefresh.data?.[0] || null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── ACTION: get-student-gaps — Return skill gaps for a student
    if (action === "get-student-gaps") {
      const userId = body.user_id;
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "user_id required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: gaps } = await supabase.rpc("get_student_skill_gaps", {
        _user_id: userId,
        _limit: 20,
      });

      return new Response(
        JSON.stringify({ gaps: gaps || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── ACTION: get-sectors — Return sector breakdown
    if (action === "get-sectors") {
      const { data: jobs } = await supabase
        .from("job_market_data")
        .select("sector")
        .gte("scraped_at", new Date(Date.now() - 30 * 86400000).toISOString());

      const sectorCounts: Record<string, number> = {};
      for (const j of (jobs || [])) {
        const s = j.sector || "Other";
        sectorCounts[s] = (sectorCounts[s] || 0) + 1;
      }

      const sectors = Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count);

      return new Response(
        JSON.stringify({ sectors }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Use "get-demand", "get-student-gaps", or "get-sectors".' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("market-intelligence error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
