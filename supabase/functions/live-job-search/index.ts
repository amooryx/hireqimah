import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Normalize: lowercase, trim, deduplicate */
function normalize(items: string[]): string[] {
  const seen = new Set<string>();
  return items
    .map((s) => s.toLowerCase().trim())
    .filter((s) => {
      if (!s || s.length < 2 || seen.has(s)) return false;
      seen.add(s);
      return true;
    });
}

function inferSource(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("linkedin")) return "LinkedIn";
    if (host.includes("indeed")) return "Indeed";
    if (host.includes("glassdoor")) return "Glassdoor";
    if (host.includes("bayt")) return "Bayt";
    return host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function buildJobPostingResults(
  jobs: Array<{
    title: string;
    text: string;
    company?: string;
    url?: string;
    location?: string;
    sector?: string;
    source?: string;
    required_skills?: string[];
    required_certifications?: string[];
  }>
) {
  const deduped = new Map<string, any>();

  jobs.forEach((job, index) => {
    const title = job.title?.trim();
    const sourceUrl = job.url?.trim();

    if (!title || !sourceUrl) return;

    const key = `${sourceUrl}|${title.toLowerCase()}`;
    if (deduped.has(key)) return;

    deduped.set(key, {
      id: `live-${index}`,
      title,
      company: job.company || null,
      location: job.location || null,
      sector: job.sector || null,
      source: job.source || inferSource(sourceUrl) || null,
      source_url: sourceUrl,
      description: job.text?.slice(0, 600) || null,
      required_skills: normalize(job.required_skills || []),
      required_certifications: normalize(job.required_certifications || []),
    });
  });

  return Array.from(deduped.values()).slice(0, 25);
}

/** Extract skills & certs from job text via AI */
async function extractFromText(
  title: string,
  text: string,
  apiKey: string
): Promise<{ skills: string[]; certifications: string[] }> {
  try {
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: `Extract ONLY technical/hard skills and named professional certifications from job postings.
NEVER include soft skills (communication, teamwork, leadership, problem solving).
NEVER include generic terms (experience, degree, bachelor, years).
Skills: tools, languages, frameworks, platforms, protocols, techniques.
Certifications: specific named credentials (e.g. PMP, OSCP, AWS Solutions Architect, CISSP, BLS, ACLS).`,
            },
            {
              role: "user",
              content: `Job: ${title}\n\n${text.slice(0, 2500)}\n\nExtract skills and certifications.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_requirements",
                description: "Extract technical skills and certifications",
                parameters: {
                  type: "object",
                  properties: {
                    skills: {
                      type: "array",
                      items: { type: "string" },
                      description: "Technical skills only",
                    },
                    certifications: {
                      type: "array",
                      items: { type: "string" },
                      description: "Named professional certifications only",
                    },
                  },
                  required: ["skills", "certifications"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "extract_requirements" },
          },
        }),
      }
    );

    if (!response.ok) return { skills: [], certifications: [] };

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return {
        skills: normalize(parsed.skills || []),
        certifications: normalize(parsed.certifications || []),
      };
    }
  } catch (e) {
    console.error("AI extraction error:", e);
  }
  return { skills: [], certifications: [] };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { role, user_id } = await req.json();

    if (!role || typeof role !== "string" || role.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: "role (string, min 2 chars) required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firecrawlKey = Deno.env.get("FIRECRAWL_API_KEY");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const searchQuery = `${role.trim()} jobs Saudi Arabia hiring requirements skills`;
    let jobTexts: {
      title: string;
      text: string;
      company?: string;
      url?: string;
      location?: string;
      sector?: string;
      source?: string;
      required_skills?: string[];
      required_certifications?: string[];
    }[] = [];
    let source = "firecrawl";

    // ── Step 1: Try Firecrawl web search ──
    if (firecrawlKey) {
      try {
        console.log(`Firecrawl search: "${searchQuery}"`);
        const fcRes = await fetch("https://api.firecrawl.dev/v1/search", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${firecrawlKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 10,
            scrapeOptions: { formats: ["markdown"] },
          }),
        });

        if (fcRes.ok) {
          const fcData = await fcRes.json();
          const results = fcData.data || fcData.results || [];
          console.log(`Firecrawl returned ${results.length} results`);

          for (const r of results) {
            const text = r.markdown || r.description || r.content || "";
            if (text.length > 50) {
              jobTexts.push({
                title: r.title || role.trim(),
                text: text.slice(0, 3000),
                url: r.url,
                source: inferSource(r.url),
              });
            }
          }
        } else {
          const errText = await fcRes.text();
          console.error("Firecrawl error:", fcRes.status, errText);
        }
      } catch (e) {
        console.error("Firecrawl fetch failed:", e);
      }

      // Second search with different query for more diversity
      if (jobTexts.length < 10) {
        try {
          const fcRes2 = await fetch("https://api.firecrawl.dev/v1/search", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${firecrawlKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `"${role.trim()}" job description required skills certifications qualifications`,
              limit: 10,
              scrapeOptions: { formats: ["markdown"] },
            }),
          });

          if (fcRes2.ok) {
            const fcData2 = await fcRes2.json();
            const results2 = fcData2.data || fcData2.results || [];
            for (const r of results2) {
              const text = r.markdown || r.description || r.content || "";
              if (text.length > 50) {
                jobTexts.push({
                  title: r.title || role.trim(),
                  text: text.slice(0, 3000),
                  url: r.url,
                  source: inferSource(r.url),
                });
              }
            }
          }
        } catch (e) {
          console.error("Firecrawl second search failed:", e);
        }
      }
    }

    // ── Step 2: Fallback to DB if Firecrawl returned < 5 results ──
    if (jobTexts.length < 5) {
      console.log("Firecrawl insufficient, checking DB...");
      const { data: dbJobs } = await supabase
        .from("job_market_data")
        .select("title, description, extracted_skills, extracted_certifications, company, source_url, location, sector, source")
        .ilike("title", `%${role.trim()}%`)
        .gte("scraped_at", new Date(Date.now() - 30 * 86400000).toISOString())
        .limit(50);

      if (dbJobs && dbJobs.length > 0) {
        source = jobTexts.length > 0 ? "firecrawl+database" : "database";
        // For DB jobs with pre-extracted data, add them directly
        for (const j of dbJobs) {
          if (j.description && j.description.length > 50) {
            jobTexts.push({
              title: j.title,
              text: j.description,
              company: j.company || undefined,
              url: j.source_url || undefined,
              location: j.location || undefined,
              sector: j.sector || undefined,
              source: j.source || inferSource(j.source_url || undefined),
              required_skills: j.extracted_skills || [],
              required_certifications: j.extracted_certifications || [],
            });
          }
        }
      }

      // If still not enough, try similarity search in DB
      if (jobTexts.length < 5) {
        const { data: similar } = await supabase.rpc("find_similar_roles", {
          _search: role.trim(),
          _limit: 5,
          _days: 30,
        });

        if (similar && similar.length > 0) {
          const topRole = similar[0].role_title;
          const { data: simJobs } = await supabase
            .from("job_market_data")
              .select("title, description, extracted_skills, extracted_certifications, company, source_url, location, sector, source")
            .ilike("title", `%${topRole}%`)
            .limit(30);

          if (simJobs) {
            source = jobTexts.length > 0 ? source + "+similar" : "database-similar";
            for (const j of simJobs) {
              if (j.description && j.description.length > 50) {
                jobTexts.push({
                  title: j.title,
                  text: j.description,
                  company: j.company || undefined,
                  url: j.source_url || undefined,
                  location: j.location || undefined,
                  sector: j.sector || undefined,
                  source: j.source || inferSource(j.source_url || undefined),
                  required_skills: j.extracted_skills || [],
                  required_certifications: j.extracted_certifications || [],
                });
              }
            }
          }
        }
      }
    }

    // ── Step 3: If both fail, return error ──
    if (jobTexts.length === 0 && !lovableKey) {
      return new Response(
        JSON.stringify({
          match_type: "none",
          searched_role: role.trim(),
          message: `No job data found for "${role.trim()}". Try a different role.`,
          skills: [],
          certifications: [],
          job_postings: [],
          source: "none",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If still no data but we have AI, generate some context
    if (jobTexts.length === 0 && lovableKey) {
      console.log("No search results, using AI to generate role requirements...");
      source = "ai-generated";
      // Use AI to directly generate what skills/certs a role needs
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a job market expert. Return the technical skills and certifications typically required for a given job role.",
            },
            {
              role: "user",
              content: `What are the top 15-20 technical skills and top 5-10 certifications required for a "${role.trim()}" role in Saudi Arabia or the Middle East?`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_requirements",
                description: "Return job requirements",
                parameters: {
                  type: "object",
                  properties: {
                    skills: { type: "array", items: { type: "string" } },
                    certifications: { type: "array", items: { type: "string" } },
                  },
                  required: ["skills", "certifications"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "return_requirements" } },
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const tc = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (tc?.function?.arguments) {
          const parsed = JSON.parse(tc.function.arguments);
          const skills = normalize(parsed.skills || []);
          const certs = normalize(parsed.certifications || []);

          // Build a synthetic frequency profile
          const totalPseudo = 30;
          return new Response(
            JSON.stringify({
              match_type: "ai-generated",
              searched_role: role.trim(),
              message: `Based on AI analysis of "${role.trim()}" role requirements.`,
              job_count: 0,
              source,
              skills: skills.map((s, i) => ({
                skill_name: s,
                frequency: totalPseudo - i,
                percentage: Math.round(((totalPseudo - i) / totalPseudo) * 100),
              })),
              certifications: certs.map((c, i) => ({
                cert_name: c,
                frequency: Math.max(totalPseudo - i * 3, 1),
                percentage: Math.round((Math.max(totalPseudo - i * 3, 1) / totalPseudo) * 100),
              })),
              job_postings: [],
              companies: [],
              sectors: [],
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // ── Step 4: Extract skills/certs from collected job texts via AI ──
    if (!lovableKey) {
      const liveJobPostings = buildJobPostingResults(jobTexts);
      const companies = Array.from(new Set(jobTexts.map((job) => job.company).filter(Boolean))).slice(0, 15);
      const sectors = Array.from(new Set(jobTexts.map((job) => job.sector).filter(Boolean))).slice(0, 15);

      return new Response(
        JSON.stringify({
          match_type: liveJobPostings.length > 0 ? "live" : "none",
          searched_role: role.trim(),
          job_count: liveJobPostings.length,
          source,
          skills: [],
          certifications: [],
          job_postings: liveJobPostings,
          companies,
          sectors,
          student_gaps: [],
          message:
            liveJobPostings.length > 0
              ? `Live job postings found for "${role.trim()}". Skills analysis is temporarily unavailable.`
              : `No data found for "${role.trim()}".`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Extracting skills from ${jobTexts.length} job texts...`);

    const skillFreq: Record<string, number> = {};
    const certFreq: Record<string, number> = {};
    const companies = new Set<string>();
    let processed = 0;

    // Process in parallel batches of 5
    const batchSize = 5;
    for (let i = 0; i < jobTexts.length; i += batchSize) {
      const batch = jobTexts.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((jt) => extractFromText(jt.title, jt.text, lovableKey))
      );

      for (let j = 0; j < results.length; j++) {
        const { skills, certifications } = results[j];
        const jt = batch[j];
        if (jt.company) companies.add(jt.company);

        for (const s of skills) {
          skillFreq[s] = (skillFreq[s] || 0) + 1;
        }
        for (const c of certifications) {
          certFreq[c] = (certFreq[c] || 0) + 1;
        }
        processed++;
      }

      // Rate limit between batches
      if (i + batchSize < jobTexts.length) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    const totalJobs = processed;
    const topSkills = Object.entries(skillFreq)
      .map(([name, freq]) => ({
        skill_name: name,
        frequency: freq,
        percentage: Math.round((freq / Math.max(totalJobs, 1)) * 1000) / 10,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 25);

    const topCerts = Object.entries(certFreq)
      .map(([name, freq]) => ({
        cert_name: name,
        frequency: freq,
        percentage: Math.round((freq / Math.max(totalJobs, 1)) * 1000) / 10,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15);

    const liveJobPostings = buildJobPostingResults(jobTexts);

    // ── Step 5: Get student gaps if user_id provided ──
    let studentGaps: any[] = [];
    if (user_id) {
      const { data: gaps } = await supabase.rpc("get_student_skill_gaps", {
        _user_id: user_id,
        _limit: 20,
      });
      studentGaps = gaps || [];
    }

    return new Response(
      JSON.stringify({
        match_type: topSkills.length > 0 || liveJobPostings.length > 0 ? "live" : "none",
        searched_role: role.trim(),
        job_count: totalJobs,
        source,
        skills: topSkills,
        certifications: topCerts,
        job_postings: liveJobPostings,
        companies: Array.from(companies).slice(0, 15),
        sectors: [],
        student_gaps: studentGaps,
        message:
          topSkills.length > 0 || liveJobPostings.length > 0
            ? `Live market data from ${totalJobs} sources for "${role.trim()}".`
            : `No data found for "${role.trim()}".`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("live-job-search error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
