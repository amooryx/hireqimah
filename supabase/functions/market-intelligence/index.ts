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

    // ── ACTION: get-role-insights — Dynamic role-specific data with similarity fallback
    if (action === "get-role-insights") {
      const role = body.role;
      if (!role || typeof role !== "string" || role.trim().length < 2) {
        return new Response(
          JSON.stringify({ error: "role (string, min 2 chars) required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const days = body.days || 30;
      const cutoff = new Date(Date.now() - days * 86400000).toISOString();

      // Count exact/partial matches for this role
      const { count: exactCount } = await supabase
        .from("job_market_data")
        .select("*", { count: "exact", head: true })
        .ilike("title", `%${role.trim()}%`)
        .gte("scraped_at", cutoff);

      const hasData = (exactCount || 0) > 0;

      if (hasData) {
        // Direct match: get skills & certs from matching jobs
        const { data: matchingJobs } = await supabase
          .from("job_market_data")
          .select("title, company, extracted_skills, extracted_certifications, sector, experience_level")
          .ilike("title", `%${role.trim()}%`)
          .gte("scraped_at", cutoff)
          .limit(500);

        const skillFreq: Record<string, number> = {};
        const certFreq: Record<string, number> = {};
        const companies = new Set<string>();
        const sectors = new Set<string>();

        for (const j of (matchingJobs || [])) {
          if (j.company) companies.add(j.company);
          if (j.sector) sectors.add(j.sector);
          for (const s of (j.extracted_skills || [])) {
            const k = s.toLowerCase().trim();
            if (k) skillFreq[k] = (skillFreq[k] || 0) + 1;
          }
          for (const c of (j.extracted_certifications || [])) {
            const k = c.trim();
            if (k) certFreq[k] = (certFreq[k] || 0) + 1;
          }
        }

        const totalJobs = matchingJobs?.length || 0;
        const topSkills = Object.entries(skillFreq)
          .map(([name, freq]) => ({ skill_name: name, frequency: freq, percentage: Math.round((freq / totalJobs) * 1000) / 10 }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 20);

        const topCerts = Object.entries(certFreq)
          .map(([name, freq]) => ({ cert_name: name, frequency: freq, percentage: Math.round((freq / totalJobs) * 1000) / 10 }))
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 10);

        return new Response(
          JSON.stringify({
            match_type: "exact",
            role: role.trim(),
            job_count: totalJobs,
            companies: Array.from(companies).slice(0, 15),
            sectors: Array.from(sectors),
            skills: topSkills,
            certifications: topCerts,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fallback: similarity match
      const { data: similar } = await supabase.rpc("find_similar_roles", {
        _search: role.trim(),
        _limit: 10,
        _days: days,
      });

      if (similar && similar.length > 0) {
        // Get aggregated skills/certs from similar roles
        const topRole = similar[0].role_title;
        const { data: fallbackJobs } = await supabase
          .from("job_market_data")
          .select("extracted_skills, extracted_certifications, company")
          .ilike("title", `%${topRole}%`)
          .gte("scraped_at", cutoff)
          .limit(200);

        const skillFreq: Record<string, number> = {};
        const certFreq: Record<string, number> = {};
        for (const j of (fallbackJobs || [])) {
          for (const s of (j.extracted_skills || [])) {
            const k = s.toLowerCase().trim();
            if (k) skillFreq[k] = (skillFreq[k] || 0) + 1;
          }
          for (const c of (j.extracted_certifications || [])) {
            const k = c.trim();
            if (k) certFreq[k] = (certFreq[k] || 0) + 1;
          }
        }

        const total = fallbackJobs?.length || 1;
        return new Response(
          JSON.stringify({
            match_type: "similar",
            searched_role: role.trim(),
            message: `No exact data for "${role.trim()}". Showing nearest matches.`,
            similar_roles: similar,
            closest_role: topRole,
            job_count: similar.reduce((s: number, r: any) => s + Number(r.job_count), 0),
            skills: Object.entries(skillFreq)
              .map(([name, freq]) => ({ skill_name: name, frequency: freq, percentage: Math.round((freq / total) * 1000) / 10 }))
              .sort((a, b) => b.frequency - a.frequency)
              .slice(0, 20),
            certifications: Object.entries(certFreq)
              .map(([name, freq]) => ({ cert_name: name, frequency: freq, percentage: Math.round((freq / total) * 1000) / 10 }))
              .sort((a, b) => b.frequency - a.frequency)
              .slice(0, 10),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // No matches at all
      return new Response(
        JSON.stringify({
          match_type: "none",
          searched_role: role.trim(),
          message: `No data yet for "${role.trim()}" or similar roles. Try a different career target.`,
          skills: [],
          certifications: [],
          similar_roles: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Use "get-demand", "get-student-gaps", "get-sectors", or "get-role-insights".' }),
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
