import { supabase } from "@/integrations/supabase/client";

export type LiveJobPosting = {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  sector: string | null;
  source: string | null;
  source_url: string;
  description: string | null;
  required_skills: string[];
  required_certifications: string[];
  fetched_at?: string | null;
};

export type LiveJobSearchResponse = {
  match_type: string;
  searched_role: string;
  job_count: number;
  source: string;
  skills: Array<{ skill_name: string; frequency: number; percentage: number }>;
  certifications: Array<{ cert_name: string; frequency: number; percentage: number }>;
  companies: string[];
  sectors: string[];
  student_gaps: any[];
  message: string;
  job_postings: LiveJobPosting[];
};

export type LiveJobSearchErrorCode = "timeout" | "request_failed" | "invalid_response";

export type LiveJobSearchResult = {
  data: LiveJobSearchResponse | null;
  error: { code: LiveJobSearchErrorCode; message: string } | null;
};

export type StudentJobPreferences = {
  searchRole: string;
  keywords: string[];
};

const REQUEST_TIMEOUT_MS = 16000;

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const asNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => asNonEmptyString(item))
        .filter((item): item is string => Boolean(item))
    )
  );
};

const sanitizeJobPosting = (value: unknown, index: number): LiveJobPosting | null => {
  if (!isRecord(value)) return null;

  const title = asNonEmptyString(value.title);
  const sourceUrl = asNonEmptyString(value.source_url) || asNonEmptyString(value.url);

  if (!title || !sourceUrl) return null;

  return {
    id: asNonEmptyString(value.id) || `live-job-${index}`,
    title,
    company: asNonEmptyString(value.company),
    location: asNonEmptyString(value.location),
    sector: asNonEmptyString(value.sector),
    source: asNonEmptyString(value.source),
    source_url: sourceUrl,
    description: asNonEmptyString(value.description) || asNonEmptyString(value.text),
    required_skills: asStringArray(value.required_skills || value.extracted_skills),
    required_certifications: asStringArray(
      value.required_certifications || value.extracted_certifications
    ),
    fetched_at: asNonEmptyString(value.fetched_at),
  };
};

const sanitizeStatItems = (
  items: unknown,
  nameKey: "skill_name" | "cert_name"
) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!isRecord(item)) return null;
      const name = asNonEmptyString(item[nameKey]);
      if (!name) return null;

      return {
        [nameKey]: name,
        frequency: asNumber(item.frequency),
        percentage: asNumber(item.percentage),
      };
    })
    .filter(Boolean) as Array<{ [K in typeof nameKey]: string } & {
      frequency: number;
      percentage: number;
    }>;
};

export const sanitizeLiveJobSearchResponse = (
  payload: unknown
): LiveJobSearchResponse | null => {
  if (!isRecord(payload)) return null;

  const jobPostings = Array.isArray(payload.job_postings)
    ? payload.job_postings
        .map((item, index) => sanitizeJobPosting(item, index))
        .filter(Boolean) as LiveJobPosting[]
    : [];

  return {
    match_type: asNonEmptyString(payload.match_type) || "none",
    searched_role: asNonEmptyString(payload.searched_role) || "",
    job_count: asNumber(payload.job_count),
    source: asNonEmptyString(payload.source) || "none",
    skills: sanitizeStatItems(payload.skills, "skill_name") as Array<{
      skill_name: string;
      frequency: number;
      percentage: number;
    }>,
    certifications: sanitizeStatItems(payload.certifications, "cert_name") as Array<{
      cert_name: string;
      frequency: number;
      percentage: number;
    }>,
    companies: asStringArray(payload.companies),
    sectors: asStringArray(payload.sectors),
    student_gaps: Array.isArray(payload.student_gaps) ? payload.student_gaps : [],
    message: asNonEmptyString(payload.message) || "",
    job_postings: jobPostings,
  };
};

const withTimeout = async <T>(factory: () => Promise<T>, timeoutMs: number) => {
  return await new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error("timeout"));
    }, timeoutMs);

    factory()
      .then((value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      });
  });
};

const normalizeError = (error: unknown): { code: LiveJobSearchErrorCode; message: string } => {
  const message = error instanceof Error ? error.message : String(error || "request_failed");
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("timeout")) {
    return { code: "timeout", message };
  }

  if (
    normalizedMessage.includes("failed to send") ||
    normalizedMessage.includes("failed to fetch") ||
    normalizedMessage.includes("network")
  ) {
    return { code: "request_failed", message };
  }

  return { code: "invalid_response", message };
};

export async function fetchLiveJobSearch({
  role,
  userId,
  timeoutMs = REQUEST_TIMEOUT_MS,
  retries = 1,
}: {
  role: string;
  userId?: string;
  timeoutMs?: number;
  retries?: number;
}): Promise<LiveJobSearchResult> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await withTimeout(
        () =>
          supabase.functions.invoke("live-job-search", {
            body: { role, user_id: userId },
          }),
        timeoutMs
      );

      if (response.error) {
        throw new Error(response.error.message || "request_failed");
      }

      const data = sanitizeLiveJobSearchResponse(response.data);
      if (!data) {
        throw new Error("invalid_response");
      }

      return { data, error: null };
    } catch (error) {
      lastError = error;
    }
  }

  return { data: null, error: normalizeError(lastError) };
}

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#.-]+/u)
    .filter((token) => token.length > 1);

export function scoreJobTextMatch(text: string, keywords: string[]) {
  if (!text.trim() || keywords.length === 0) return 0;

  const haystack = text.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    const normalizedKeyword = keyword.toLowerCase();
    if (!normalizedKeyword) continue;

    if (haystack.includes(normalizedKeyword)) {
      score += normalizedKeyword.length > 4 ? 12 : 6;
    }

    for (const token of tokenize(normalizedKeyword)) {
      if (haystack.includes(token)) {
        score += token.length > 4 ? 5 : 2;
      }
    }
  }

  return score;
}

const MAJOR_ROLE_MAP: Array<[string[], string]> = [
  [["computer science", "علوم الحاسب", "software engineering", "هندسة البرمجيات", "information technology", "تقنية المعلومات"], "Software Engineer"],
  [["cybersecurity", "الأمن السيبراني", "information security", "أمن المعلومات"], "Cybersecurity Analyst"],
  [["data science", "علوم البيانات", "statistics", "الإحصاء"], "Data Analyst"],
  [["artificial intelligence", "الذكاء الاصطناعي", "machine learning", "تعلم الآلة"], "AI Engineer"],
  [["business administration", "إدارة الأعمال", "marketing", "التسويق"], "Business Analyst"],
  [["accounting", "المحاسبة", "finance", "المالية"], "Accountant"],
  [["nursing", "التمريض"], "Nurse"],
  [["pharmacy", "الصيدلة"], "Pharmacist"],
  [["dentistry", "طب الأسنان"], "Dentist"],
  [["mechanical engineering", "الهندسة الميكانيكية"], "Mechanical Engineer"],
];

const inferRoleFromMajor = (major?: string | null) => {
  const normalizedMajor = major?.toLowerCase().trim() || "";

  for (const [patterns, role] of MAJOR_ROLE_MAP) {
    if (patterns.some((pattern) => normalizedMajor.includes(pattern))) {
      return role;
    }
  }

  return major?.trim() || "";
};

export function buildStudentJobPreferences(studentProfile: any, skillRows: any[] = []): StudentJobPreferences {
  const major = asNonEmptyString(studentProfile?.major) || "";
  const targetRole =
    asNonEmptyString(studentProfile?.career_target) ||
    asNonEmptyString(studentProfile?.target_role) ||
    "";

  const skillNames = skillRows
    .map((skill) => asNonEmptyString(skill?.skill_name))
    .filter((skill): skill is string => Boolean(skill))
    .slice(0, 8);

  const inferredRole = inferRoleFromMajor(major);
  const searchRole = targetRole || inferredRole || skillNames[0] || "Graduate";

  const keywords = Array.from(
    new Set(
      [searchRole, targetRole, major, ...skillNames]
        .flatMap((value) => [value, ...tokenize(value || "")])
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );

  return { searchRole, keywords };
}

export function sortLiveJobPostingsByPreferences(
  jobs: LiveJobPosting[],
  preferences: StudentJobPreferences,
  limit = 12
) {
  return [...jobs]
    .sort((a, b) => {
      const aScore = scoreJobTextMatch(
        [a.title, a.company, a.location, a.sector, a.description, ...a.required_skills].filter(Boolean).join(" "),
        preferences.keywords
      );
      const bScore = scoreJobTextMatch(
        [b.title, b.company, b.location, b.sector, b.description, ...b.required_skills].filter(Boolean).join(" "),
        preferences.keywords
      );

      return bScore - aScore;
    })
    .slice(0, limit);
}

export function buildFallbackExternalJobs(
  cachedRows: unknown[],
  preferences: StudentJobPreferences,
  limit = 12
) {
  if (!Array.isArray(cachedRows) || cachedRows.length === 0) return [];

  const sanitized = cachedRows
    .map((row, index) => sanitizeJobPosting(row, index))
    .filter(Boolean) as LiveJobPosting[];

  return sortLiveJobPostingsByPreferences(sanitized, preferences, limit);
}