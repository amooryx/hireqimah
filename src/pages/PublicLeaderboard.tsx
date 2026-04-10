import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import { Trophy, Users, TrendingUp, Building2, ShieldCheck, FileCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";

const PublicLeaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [uniStats, setUniStats] = useState<any[]>([]);
  const [tab, setTab] = useState<"students" | "universities">("students");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterUni, setFilterUni] = useState("all");
  const [majors, setMajors] = useState<string[]>([]);
  const [unis, setUnis] = useState<string[]>([]);
  const [badges, setBadges] = useState<Map<string, any[]>>(new Map());
  const [verifiedCerts, setVerifiedCerts] = useState<Map<string, number>>(new Map());
  const [verifiedProjects, setVerifiedProjects] = useState<Map<string, number>>(new Map());
  const [verifiedTranscripts, setVerifiedTranscripts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const [{ data: studentsData }, { data: badgesData }, { data: certsData }, { data: projectsData }, { data: transcriptsData }] = await Promise.all([
        supabase.from("student_profiles")
          .select("user_id, university, major, ers_score, gpa, gpa_scale, visibility_public, profiles!inner(full_name, avatar_url)")
          .eq("visibility_public", true)
          .order("ers_score", { ascending: false })
          .limit(200),
        untypedTable("student_badges").select("*"),
        supabase.from("student_certifications").select("user_id, verified"),
        supabase.from("student_projects").select("user_id, verified"),
        supabase.from("transcript_uploads").select("user_id"),
      ]);
      const data = studentsData || [];
      setStudents(data);
      setMajors([...new Set(data.map((s: any) => s.major).filter(Boolean))]);
      setUnis([...new Set(data.map((s: any) => s.university).filter(Boolean))]);

      // Badge map
      const bMap = new Map<string, any[]>();
      (badgesData || []).forEach((b: any) => {
        const arr = bMap.get(b.user_id) || [];
        arr.push(b);
        bMap.set(b.user_id, arr);
      });
      setBadges(bMap);

      // Verified certs count per user
      const vcMap = new Map<string, number>();
      (certsData || []).forEach((c: any) => {
        if (c.verified) vcMap.set(c.user_id, (vcMap.get(c.user_id) || 0) + 1);
      });
      setVerifiedCerts(vcMap);

      // Verified projects count per user
      const vpMap = new Map<string, number>();
      (projectsData || []).forEach((p: any) => {
        if (p.verified) vpMap.set(p.user_id, (vpMap.get(p.user_id) || 0) + 1);
      });
      setVerifiedProjects(vpMap);

      // Users with transcripts
      const tSet = new Set<string>();
      (transcriptsData || []).forEach((t: any) => tSet.add(t.user_id));
      setVerifiedTranscripts(tSet);

      // University aggregation
      const uniMap = new Map<string, { count: number; totalERS: number }>();
      data.forEach((s: any) => {
        const entry = uniMap.get(s.university) || { count: 0, totalERS: 0 };
        entry.count++;
        entry.totalERS += s.ers_score || 0;
        uniMap.set(s.university, entry);
      });
      setUniStats(
        [...uniMap.entries()].map(([name, v]) => ({
          name, count: v.count, avgERS: Math.round(v.totalERS / v.count),
        })).sort((a, b) => b.avgERS - a.avgERS)
      );

      setLoading(false);
    };
    load();
  }, []);

  const filtered = students.filter(s => {
    if (filterMajor !== "all" && s.major !== filterMajor) return false;
    if (filterUni !== "all" && s.university !== filterUni) return false;
    return true;
  });

  // Compute rankings by university and major
  const uniRankMap = new Map<string, number>();
  const majorRankMap = new Map<string, number>();
  const uniCounters = new Map<string, number>();
  const majorCounters = new Map<string, number>();
  students.forEach((s) => {
    const uniKey = s.university;
    const majorKey = `${s.university}|${s.major}`;
    uniCounters.set(uniKey, (uniCounters.get(uniKey) || 0) + 1);
    majorCounters.set(majorKey, (majorCounters.get(majorKey) || 0) + 1);
    uniRankMap.set(s.user_id, uniCounters.get(uniKey)!);
    majorRankMap.set(s.user_id, majorCounters.get(majorKey)!);
  });

  if (loading) {
    return (
      <div className="container max-w-4xl py-12 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-heading">
          <Trophy className="h-8 w-8 inline mr-2 text-[hsl(var(--gold))]" />
          National Leaderboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Top students ranked by Employability Readiness Score</p>
      </div>

      <div className="flex gap-2 justify-center">
        <Button size="sm" variant={tab === "students" ? "default" : "outline"} onClick={() => setTab("students")}>
          <Users className="h-4 w-4 mr-1" />Students
        </Button>
        <Button size="sm" variant={tab === "universities" ? "default" : "outline"} onClick={() => setTab("universities")}>
          <Building2 className="h-4 w-4 mr-1" />Universities
        </Button>
      </div>

      {tab === "students" && (
        <>
          <div className="flex gap-3 justify-center flex-wrap">
            <Select value={filterUni} onValueChange={setFilterUni}>
              <SelectTrigger className="w-48"><SelectValue placeholder="University" /></SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">All Universities</SelectItem>
                {unis.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMajor} onValueChange={setFilterMajor}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Major" /></SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">All Majors</SelectItem>
                {majors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border bg-card p-6 space-y-2">
            {filtered.slice(0, 100).map((s, i) => {
              const sBadges = badges.get(s.user_id) || [];
              const certCount = verifiedCerts.get(s.user_id) || 0;
              const projCount = verifiedProjects.get(s.user_id) || 0;
              const hasTranscript = verifiedTranscripts.has(s.user_id);
              const uniRank = uniRankMap.get(s.user_id);
              const majorRank = majorRankMap.get(s.user_id);

              return (
                <motion.div key={s.user_id}
                  className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                  <span className={`w-8 text-center font-bold text-lg ${i < 3 ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/profile/${s.user_id}`} className="font-medium text-sm truncate hover:text-primary transition-colors">
                        {(s as any).profiles?.full_name || "Student"}
                      </Link>
                      {/* Verification badges */}
                      {certCount > 0 && (
                        <Badge variant="outline" className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30 gap-0.5">
                          <ShieldCheck className="h-3 w-3" />{certCount} Cert{certCount > 1 ? "s" : ""}
                        </Badge>
                      )}
                      {hasTranscript && (
                        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 gap-0.5">
                          <FileCheck className="h-3 w-3" />Transcript
                        </Badge>
                      )}
                      {projCount > 0 && (
                        <Badge variant="outline" className="text-[10px] bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30 gap-0.5">
                          <Award className="h-3 w-3" />{projCount} Proj
                        </Badge>
                      )}
                      {sBadges.slice(0, 2).map(b => (
                        <span key={b.id} className="text-xs" title={b.badge_label}>{b.badge_icon}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {s.university} · {s.major}
                      {uniRank && <span className="ml-2 text-primary">Uni #{uniRank}</span>}
                      {majorRank && <span className="ml-2 text-[hsl(var(--gold))]">Major #{majorRank}</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                    <p className="text-[10px] text-muted-foreground">ERS</p>
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No students found.</p>}
          </div>
        </>
      )}

      {tab === "universities" && (
        <div className="rounded-xl border bg-card p-6 space-y-2">
          {uniStats.map((u, i) => (
            <motion.div key={u.name} className="flex items-center gap-4 rounded-lg border p-4"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <span className={`w-8 text-center font-bold text-lg ${i < 3 ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <div className="flex-1">
                <p className="font-medium text-sm">{u.name}</p>
                <p className="text-xs text-muted-foreground">{u.count} students</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">{u.avgERS}</p>
                <p className="text-[10px] text-muted-foreground">Avg ERS</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">Powered by HireQimah · Updated in real-time · Rankings include Global, University, and Major positions</p>
      </div>
    </div>
  );
};

export default PublicLeaderboard;
