import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, TrendingUp, Building2, ShieldCheck, FileCheck, Award, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { SAUDI_UNIVERSITIES, COMMON_MAJORS, SAUDI_REGIONS, UNIVERSITY_REGION_MAP } from "@/lib/leaderboardConstants";
import LeaderboardStudentRow from "@/components/leaderboard/LeaderboardStudentRow";
import LeaderboardUniversityRow from "@/components/leaderboard/LeaderboardUniversityRow";
import LeaderboardMotivation from "@/components/leaderboard/LeaderboardMotivation";

const PublicLeaderboard = () => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [tab, setTab] = useState<"students" | "universities">("students");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterUni, setFilterUni] = useState("all");
  const [verifiedCerts, setVerifiedCerts] = useState<Map<string, number>>(new Map());
  const [verifiedProjects, setVerifiedProjects] = useState<Map<string, number>>(new Map());
  const [verifiedTranscripts, setVerifiedTranscripts] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);

    // Fetch student profiles (public only, sorted by ERS)
    const { data: studentsData } = await supabase
      .from("student_profiles")
      .select("user_id, university, major, ers_score, gpa, gpa_scale, visibility_public")
      .eq("visibility_public", true)
      .order("ers_score", { ascending: false })
      .limit(200);

    const data = studentsData || [];

    // Fetch profile names separately (no FK relationship)
    const userIds = data.map(s => s.user_id);
    const [profilesRes, certsRes, projectsRes, transcriptsRes] = await Promise.all([
      userIds.length > 0
        ? supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds)
        : { data: [] },
      supabase.from("student_certifications").select("user_id, verified"),
      supabase.from("student_projects").select("user_id, verified"),
      supabase.from("transcript_uploads").select("user_id"),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p: any) => [p.user_id, p]));

    // Merge profile data into students
    const merged = data.map(s => ({
      ...s,
      full_name: profileMap.get(s.user_id)?.full_name || "Student",
      avatar_url: profileMap.get(s.user_id)?.avatar_url,
    }));

    setStudents(merged);

    // Verified certs count
    const vcMap = new Map<string, number>();
    (certsRes.data || []).forEach((c: any) => {
      if (c.verified) vcMap.set(c.user_id, (vcMap.get(c.user_id) || 0) + 1);
    });
    setVerifiedCerts(vcMap);

    // Verified projects count
    const vpMap = new Map<string, number>();
    (projectsRes.data || []).forEach((p: any) => {
      if (p.verified) vpMap.set(p.user_id, (vpMap.get(p.user_id) || 0) + 1);
    });
    setVerifiedProjects(vpMap);

    // Transcripts
    const tSet = new Set<string>();
    (transcriptsRes.data || []).forEach((tr: any) => tSet.add(tr.user_id));
    setVerifiedTranscripts(tSet);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    // Realtime subscriptions for live updates
    const channel = supabase
      .channel("leaderboard-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_profiles" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "ers_scores" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "student_certifications" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "skill_matrix" }, () => loadData())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => loadData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadData]);

  // Filtered students
  const filtered = useMemo(() => {
    return students.filter(s => {
      if (filterMajor !== "all" && s.major !== filterMajor) return false;
      if (filterUni !== "all" && s.university !== filterUni) return false;
      return true;
    });
  }, [students, filterMajor, filterUni]);

  // University stats
  const uniStats = useMemo(() => {
    const uniMap = new Map<string, { count: number; totalERS: number }>();
    students.forEach(s => {
      const entry = uniMap.get(s.university) || { count: 0, totalERS: 0 };
      entry.count++;
      entry.totalERS += s.ers_score || 0;
      uniMap.set(s.university, entry);
    });
    return [...uniMap.entries()]
      .map(([name, v]) => ({ name, count: v.count, avgERS: Math.round(v.totalERS / v.count) }))
      .sort((a, b) => b.avgERS - a.avgERS);
  }, [students]);

  // Current user rank
  const currentUserRank = useMemo(() => {
    if (!currentUserId) return null;
    const idx = filtered.findIndex(s => s.user_id === currentUserId);
    return idx >= 0 ? idx + 1 : null;
  }, [filtered, currentUserId]);

  if (loading) {
    return (
      <div className="container max-w-4xl py-12 space-y-6">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading">
          <Trophy className="h-8 w-8 inline ltr:mr-2 rtl:ml-2 text-[hsl(var(--primary))]" />
          {t("leaderboard.heading")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{t("leaderboard.subtitle")}</p>
      </div>

      {/* Current user motivation */}
      <LeaderboardMotivation rank={currentUserRank} total={filtered.length} />

      {/* Tabs */}
      <div className="flex gap-2 justify-center">
        <Button size="sm" variant={tab === "students" ? "default" : "outline"} onClick={() => setTab("students")}>
          <Users className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("leaderboard.students")}
        </Button>
        <Button size="sm" variant={tab === "universities" ? "default" : "outline"} onClick={() => setTab("universities")}>
          <Building2 className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("leaderboard.universities")}
        </Button>
      </div>

      {tab === "students" && (
        <>
          {/* Filters */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Select value={filterUni} onValueChange={setFilterUni}>
              <SelectTrigger className="w-56"><SelectValue placeholder={t("leaderboard.allUnis")} /></SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">{t("leaderboard.allUnis")}</SelectItem>
                {SAUDI_UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMajor} onValueChange={setFilterMajor}>
              <SelectTrigger className="w-56"><SelectValue placeholder={t("leaderboard.allMajors")} /></SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">{t("leaderboard.allMajors")}</SelectItem>
                {COMMON_MAJORS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Student list */}
          <div className="rounded-xl border bg-card p-6 space-y-2">
            {filtered.slice(0, 100).map((s, i) => (
              <LeaderboardStudentRow
                key={s.user_id}
                student={s}
                rank={i + 1}
                index={i}
                certCount={verifiedCerts.get(s.user_id) || 0}
                projCount={verifiedProjects.get(s.user_id) || 0}
                hasTranscript={verifiedTranscripts.has(s.user_id)}
                isCurrentUser={s.user_id === currentUserId}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">{t("leaderboard.noStudents")}</p>
            )}
          </div>
        </>
      )}

      {tab === "universities" && (
        <div className="rounded-xl border bg-card p-6 space-y-2">
          {uniStats.map((u, i) => (
            <LeaderboardUniversityRow key={u.name} uni={u} rank={i + 1} index={i} />
          ))}
        </div>
      )}

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">{t("leaderboard.footer")}</p>
      </div>
    </div>
  );
};

export default PublicLeaderboard;
