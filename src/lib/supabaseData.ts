import { supabase } from "@/integrations/supabase/client";

// ===== Fetch student dashboard data =====
export async function fetchStudentDashboard(userId: string) {
  const [profileRes, studentRes, ersRes, skillsRes, projectsRes, certsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).single(),
    supabase.from("student_profiles").select("*").eq("user_id", userId).single(),
    supabase.from("ers_scores").select("*").eq("user_id", userId).single(),
    supabase.from("skill_matrix").select("*").eq("user_id", userId),
    supabase.from("student_projects").select("*").eq("user_id", userId),
    supabase.from("student_certifications").select("*, certification_catalog(name, weight, category, is_hadaf_reimbursed, sector)")
      .eq("user_id", userId),
  ]);

  return {
    profile: profileRes.data,
    studentProfile: studentRes.data,
    ers: ersRes.data,
    skills: skillsRes.data || [],
    projects: projectsRes.data || [],
    certifications: certsRes.data || [],
  };
}

// ===== Calculate ERS dynamically =====
export function calculateERSFromData(data: {
  studentProfile: any;
  certifications: any[];
  projects: any[];
  skills: any[];
  ers: any;
}) {
  if (!data.studentProfile) return { total: 0, breakdown: {} };

  const academic = data.studentProfile.academic_score || 0;
  const certification = data.studentProfile.certification_score || 0;
  const project = data.studentProfile.project_score || 0;
  const softSkills = data.studentProfile.soft_skills_score || 0;
  const conduct = data.studentProfile.conduct_score || 100;

  // If we have an ERS record, use it (includes decay, synergy, etc.)
  if (data.ers) {
    return {
      total: Math.round(data.ers.total_score || 0),
      breakdown: {
        academic: data.ers.academic_score || academic,
        certification: data.ers.certification_score || certification,
        project: data.ers.project_score || project,
        softSkills: data.ers.soft_skills_score || softSkills,
        conduct: data.ers.conduct_score || conduct,
        decayApplied: data.ers.decay_applied || 0,
        synergyBonus: data.ers.synergy_bonus || 0,
        nationalReadiness: data.ers.national_readiness_bonus || 0,
        interview: data.ers.interview_score || 0,
      },
      explanation: data.ers.explanation,
    };
  }

  // Fallback: calculate from raw scores
  const total = Math.round(
    academic * 0.4 +
    certification * 0.25 +
    project * 0.15 +
    softSkills * 0.1 +
    conduct * 0.1
  );

  return {
    total,
    breakdown: { academic, certification, project, softSkills, conduct, decayApplied: 0, synergyBonus: 0, nationalReadiness: 0, interview: 0 },
  };
}

// ===== Fetch leaderboard =====
export async function fetchLeaderboard(filter?: { university?: string; major?: string }) {
  let query = supabase
    .from("student_profiles")
    .select("user_id, university, major, ers_score, gpa, gpa_scale, visibility_public")
    .eq("visibility_public", true)
    .order("ers_score", { ascending: false })
    .limit(50);

  if (filter?.university) query = query.eq("university", filter.university);
  if (filter?.major) query = query.eq("major", filter.major);

  const { data } = await query;
  if (!data) return [];

  // Fetch profile names
  const userIds = data.map(d => d.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, full_name, avatar_url")
    .in("user_id", userIds);

  const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

  return data.map((s, i) => ({
    ...s,
    rank: i + 1,
    full_name: profileMap.get(s.user_id)?.full_name || "Unknown",
    avatar_url: profileMap.get(s.user_id)?.avatar_url,
  }));
}

// ===== Fetch certification catalog =====
export async function fetchCertificationCatalog() {
  const { data } = await supabase
    .from("certification_catalog")
    .select("*")
    .order("category");
  return data || [];
}

// ===== Fetch job cache =====
export async function fetchJobCache(sector?: string) {
  let query = supabase.from("job_cache").select("*").order("fetched_at", { ascending: false }).limit(100);
  if (sector) query = query.eq("sector", sector);
  const { data } = await query;
  return data || [];
}

// ===== Fetch market skill rankings from job_market_data =====
export async function fetchMarketSkillRankings(limit = 50, days = 30) {
  const { data } = await supabase.rpc("get_market_skill_rankings", { _limit: limit, _days: days });
  return data || [];
}

// ===== Fetch market cert rankings from job_market_data =====
export async function fetchMarketCertRankings(limit = 30, days = 30) {
  const { data } = await supabase.rpc("get_market_cert_rankings", { _limit: limit, _days: days });
  return data || [];
}

// ===== Fetch student skill gaps vs market =====
export async function fetchStudentSkillGaps(userId: string, limit = 20) {
  const { data } = await supabase.rpc("get_student_skill_gaps", { _user_id: userId, _limit: limit });
  return data || [];
}
