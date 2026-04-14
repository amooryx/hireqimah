import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/** Normalize skill names: lowercase, trim, deduplicate */
function normalizeSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  return skills
    .map((s) => s.toLowerCase().trim())
    .filter((s) => {
      if (!s || s.length < 2 || seen.has(s)) return false;
      seen.add(s);
      return true;
    });
}

/** Normalize cert names: trim, deduplicate (case-insensitive) */
function normalizeCerts(certs: string[]): string[] {
  const seen = new Set<string>();
  return certs
    .map((c) => c.trim())
    .filter((c) => {
      const key = c.toLowerCase();
      if (!c || c.length < 2 || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Use AI to extract technical skills and certifications from a job description */
async function extractSkillsFromDescription(
  title: string,
  description: string,
  apiKey: string
): Promise<{ skills: string[]; certifications: string[] }> {
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
            content: `You extract ONLY technical skills and professional certifications from job postings. 
Return ONLY hard/technical skills (programming languages, tools, frameworks, protocols, platforms). 
NEVER include soft skills like "communication", "teamwork", "leadership", "problem solving".
NEVER include generic terms like "experience", "degree", "bachelor".
Certifications must be specific named credentials (e.g., "OSCP", "PMP", "AWS Solutions Architect", "CISSP").`,
          },
          {
            role: "user",
            content: `Job Title: ${title}\n\nDescription:\n${description.slice(0, 3000)}\n\nExtract technical skills and certifications.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_job_requirements",
              description: "Extract technical skills and certifications from job posting",
              parameters: {
                type: "object",
                properties: {
                  skills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Technical skills only (tools, languages, frameworks, platforms)",
                  },
                  certifications: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific named professional certifications",
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
          function: { name: "extract_job_requirements" },
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("AI extraction failed:", response.status);
    return { skills: [], certifications: [] };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    const parsed = JSON.parse(toolCall.function.arguments);
    return {
      skills: normalizeSkills(parsed.skills || []),
      certifications: normalizeCerts(parsed.certifications || []),
    };
  }
  return { skills: [], certifications: [] };
}

/** Generate realistic job postings using AI for seeding when no external API is available */
async function generateJobPostings(
  apiKey: string,
  count: number = 50,
  sector: string = "cybersecurity and technology"
): Promise<any[]> {
  const batches = Math.ceil(count / 25);
  const allJobs: any[] = [];

  for (let b = 0; b < batches; b++) {
    const batchSize = Math.min(25, count - allJobs.length);
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a Saudi Arabian job market data generator. Generate realistic job postings that reflect the ACTUAL current Saudi tech and cybersecurity job market. Use real company names active in Saudi Arabia. Include realistic skill requirements and certifications. Each posting must have a detailed description paragraph.`,
            },
            {
              role: "user",
              content: `Generate ${batchSize} realistic Saudi Arabian ${sector} job postings (batch ${b + 1}/${batches}). 
Mix between: entry-level, mid-level, and senior positions.
Include companies like: Aramco, STC, NEOM, Elm, SITE, Rasan, Mozn, Lucidya, Foodics, Tamara, Riyad Bank, SAMA, NCA, SDAIA, Zain, Mobily, stc pay, Tabby, Taqnia, Al Rajhi Bank, SNB.
Sectors: Cybersecurity, Software Engineering, Cloud, Data Science, AI/ML, DevOps, FinTech.
Cities: Riyadh, Jeddah, Dammam, NEOM, Dhahran.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_job_postings",
                description: "Return generated job postings",
                parameters: {
                  type: "object",
                  properties: {
                    jobs: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          company: { type: "string" },
                          location: { type: "string" },
                          sector: { type: "string" },
                          experience_level: {
                            type: "string",
                            enum: ["entry", "mid", "senior", "executive"],
                          },
                          description: { type: "string" },
                        },
                        required: ["title", "company", "location", "sector", "experience_level", "description"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["jobs"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_job_postings" },
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Job generation failed:", response.status);
      continue;
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      allJobs.push(...(parsed.jobs || []));
    }

    // Small delay between batches to avoid rate limits
    if (b < batches - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return allJobs;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(supabaseUrl, serviceKey);

    if (!lovableKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // No body is fine — default action
    }

    const action = body.action || "full-pipeline";
    const count = Math.min(body.count || 100, 300);

    if (action === "full-pipeline" || action === "generate-and-parse") {
      // Step 1: Generate realistic job postings
      console.log(`Generating ${count} job postings...`);
      const rawJobs = await generateJobPostings(lovableKey, count);
      console.log(`Generated ${rawJobs.length} raw jobs`);

      if (rawJobs.length === 0) {
        return new Response(
          JSON.stringify({ error: "Failed to generate job postings" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Step 2: Extract skills/certs from each job using AI
      let parsed = 0;
      let ingested = 0;
      let duplicatesSkipped = 0;
      const batchRows: any[] = [];

      for (const job of rawJobs) {
        try {
          const extracted = await extractSkillsFromDescription(
            job.title,
            job.description || "",
            lovableKey
          );
          parsed++;

          batchRows.push({
            title: job.title,
            company: job.company,
            location: job.location || "Saudi Arabia",
            description: (job.description || "").slice(0, 5000),
            source: "ai-generated",
            extracted_skills: extracted.skills,
            extracted_certifications: extracted.certifications,
            sector: job.sector,
            experience_level: job.experience_level,
          });

          // Insert in batches of 20
          if (batchRows.length >= 20) {
            const { error } = await supabase.from("job_market_data").insert(batchRows);
            if (error) {
              console.error("Insert batch error:", error);
            } else {
              ingested += batchRows.length;
            }
            batchRows.length = 0;
          }

          // Rate limit protection
          if (parsed % 10 === 0) {
            await new Promise((r) => setTimeout(r, 500));
          }
        } catch (err) {
          console.error("Parse error for job:", job.title, err);
        }
      }

      // Insert remaining
      if (batchRows.length > 0) {
        const { error } = await supabase.from("job_market_data").insert(batchRows);
        if (error) {
          console.error("Insert final batch error:", error);
        } else {
          ingested += batchRows.length;
        }
      }

      // Step 3: Update demand tables from job_market_data
      await updateDemandTables(supabase);

      // Log refresh
      await supabase.from("market_refresh_log").insert({
        status: "completed",
        jobs_analyzed: ingested,
        completed_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          data_source: "ai-generated",
          generated: rawJobs.length,
          parsed,
          ingested,
          duplicates_skipped: duplicatesSkipped,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: ingest external jobs (manual upload)
    if (action === "ingest-external") {
      const jobs = body.jobs;
      if (!Array.isArray(jobs) || jobs.length === 0) {
        return new Response(
          JSON.stringify({ error: "jobs array required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let ingested = 0;
      for (const job of jobs) {
        const extracted = job.description
          ? await extractSkillsFromDescription(job.title, job.description, lovableKey)
          : { skills: job.extracted_skills || [], certifications: job.extracted_certifications || [] };

        const { error } = await supabase.from("job_market_data").insert({
          title: job.title,
          company: job.company,
          location: job.location || "Saudi Arabia",
          description: (job.description || "").slice(0, 5000),
          source: job.source || "external",
          source_url: job.source_url,
          extracted_skills: normalizeSkills(extracted.skills),
          extracted_certifications: normalizeCerts(extracted.certifications),
          sector: job.sector,
          experience_level: job.experience_level,
        });
        if (!error) ingested++;
      }

      await updateDemandTables(supabase);

      return new Response(
        JSON.stringify({ success: true, ingested }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: refresh demand tables from existing job_market_data
    if (action === "refresh-demand") {
      await updateDemandTables(supabase);
      return new Response(
        JSON.stringify({ success: true, action: "demand-refreshed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use "full-pipeline", "ingest-external", or "refresh-demand".' }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("job-ingestion error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/** Update market_skill_demand and market_cert_demand from job_market_data aggregations */
async function updateDemandTables(supabase: ReturnType<typeof createClient>) {
  // Aggregate skills from last 30 days
  const { data: allJobs } = await supabase
    .from("job_market_data")
    .select("extracted_skills, extracted_certifications, company")
    .gte("scraped_at", new Date(Date.now() - 30 * 86400000).toISOString());

  if (!allJobs || allJobs.length === 0) return;

  const skillCounts: Record<string, { count: number; companies: Set<string> }> = {};
  const certCounts: Record<string, { count: number; companies: Set<string> }> = {};

  for (const job of allJobs) {
    const company = job.company || "Unknown";
    for (const skill of (job.extracted_skills || [])) {
      const key = skill.toLowerCase().trim();
      if (!key) continue;
      if (!skillCounts[key]) skillCounts[key] = { count: 0, companies: new Set() };
      skillCounts[key].count++;
      skillCounts[key].companies.add(company);
    }
    for (const cert of (job.extracted_certifications || [])) {
      const key = cert.trim();
      if (!key) continue;
      if (!certCounts[key]) certCounts[key] = { count: 0, companies: new Set() };
      certCounts[key].count++;
      certCounts[key].companies.add(company);
    }
  }

  // Upsert skill demand
  for (const [skill, data] of Object.entries(skillCounts)) {
    const score = Math.min(data.count * 2 + data.companies.size * 3, 100);
    const { data: existing } = await supabase
      .from("market_skill_demand")
      .select("id, demand_score")
      .eq("skill_name", skill)
      .maybeSingle();

    if (existing) {
      const oldScore = Number(existing.demand_score) || 0;
      const trend = oldScore > 0 ? Math.round(((score - oldScore) / oldScore) * 100 * 10) / 10 : 100;
      await supabase
        .from("market_skill_demand")
        .update({ demand_score: score, weekly_trend: trend, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("market_skill_demand").insert({
        skill_name: skill,
        demand_score: score,
        weekly_trend: 0,
        monthly_trend: 0,
      });
    }
  }

  // Upsert cert demand
  for (const [cert, data] of Object.entries(certCounts)) {
    const score = Math.min(data.count * 3 + data.companies.size * 4, 100);
    const { data: existing } = await supabase
      .from("market_cert_demand")
      .select("id, demand_score")
      .eq("cert_name", cert)
      .maybeSingle();

    if (existing) {
      const oldScore = Number(existing.demand_score) || 0;
      const trend = oldScore > 0 ? Math.round(((score - oldScore) / oldScore) * 100 * 10) / 10 : 100;
      await supabase
        .from("market_cert_demand")
        .update({ demand_score: score, weekly_trend: trend, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("market_cert_demand").insert({
        cert_name: cert,
        demand_score: score,
        weekly_trend: 0,
        monthly_trend: 0,
      });
    }
  }
}
