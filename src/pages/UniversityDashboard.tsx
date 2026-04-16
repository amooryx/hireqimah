import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import {
  Users, BarChart3, Upload, TrendingUp,
  CheckCircle, AlertTriangle, Award, BookOpen, Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UniversityDashboardProps { user: AuthUser; }

const UniversityDashboard = ({ user: authUser }: UniversityDashboardProps) => {
  const { toast } = useToast();
  const { t, lang, dir } = useI18n();
  const isArabic = lang === "ar";
  const [loading, setLoading] = useState(true);
  const [uniProfile, setUniProfile] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [certStats, setCertStats] = useState<any[]>([]);
  const [skillGaps, setSkillGaps] = useState<any[]>([]);

  const loadDashboard = useCallback(async () => {
    const [{ data: uni }, { data: studentsData }, { data: certs }, { data: jobData }] = await Promise.all([
      supabase.from("university_profiles").select("*").eq("user_id", authUser.id).single(),
      supabase.from("student_profiles")
        .select("*, profiles!inner(full_name, email, user_id)")
        .order("ers_score", { ascending: false })
        .limit(500),
      supabase.from("student_certifications")
        .select("user_id, certification_catalog(name, category)")
        .limit(500),
      supabase.from("job_cache").select("required_skills, sector").limit(200),
    ]);

    setUniProfile(uni);
    const uniName = uni?.university_name || "";
    const filtered = uniName
      ? (studentsData || []).filter((s: any) => s.university?.toLowerCase().includes(uniName.toLowerCase()))
      : (studentsData || []);
    setStudents(filtered);

    const certCounts: Record<string, number> = {};
    (certs || []).forEach((c: any) => {
      const name = c.certification_catalog?.name || "Other";
      certCounts[name] = (certCounts[name] || 0) + 1;
    });
    setCertStats(Object.entries(certCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10));

    const demandedSkills: Record<string, number> = {};
    (jobData || []).forEach((j: any) => {
      (j.required_skills || []).forEach((s: string) => {
        demandedSkills[s] = (demandedSkills[s] || 0) + 1;
      });
    });
    setSkillGaps(Object.entries(demandedSkills).map(([skill, demand]) => ({ skill, demand })).sort((a, b) => b.demand - a.demand).slice(0, 10));

    setLoading(false);
  }, [authUser.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleUpload = useCallback((type: "conduct" | "attendance") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.csv,.xlsx";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { toast({ title: t("uniDash.fileTooLarge"), description: t("uniDash.maxSize"), variant: "destructive" }); return; }
      const path = `${authUser.id}/${type}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast({ title: t("uniDash.uploadFailed"), description: error.message, variant: "destructive" }); return; }
      await supabase.from("audit_logs").insert({
        user_id: authUser.id, action: `${type}_records_uploaded`, resource_type: type, resource_id: path,
      });
      toast({ title: t("uniDash.recordsUploaded", { type }) });
    };
    input.click();
  }, [authUser.id, toast, t]);

  if (loading) {
    return (
      <div dir={dir} className={`container py-6 space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const avgERS = students.length > 0
    ? Math.round(students.reduce((a, s) => a + (s.ers_score || 0), 0) / students.length) : 0;
  const topPerformers = students.filter(s => (s.ers_score || 0) > 80).length;
  const atRisk = students.filter(s => (s.ers_score || 0) < 40).length;

  const majorStats = [...new Set(students.map(s => s.major))].map(major => {
    const group = students.filter(s => s.major === major);
    const avg = Math.round(group.reduce((a, s) => a + (s.ers_score || 0), 0) / group.length);
    return { major, count: group.length, avgERS: avg };
  }).sort((a, b) => b.avgERS - a.avgERS);

  return (
    <div dir={dir} className={`container py-6 space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
      <div>
        <h1 className="text-2xl font-bold font-heading">{t("uniDash.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("uniDash.welcome", { name: authUser.full_name, uni: uniProfile?.university_name || "" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={t("uniDash.totalStudents")} value={students.length} delay={0} />
        <StatCard icon={TrendingUp} label={t("uniDash.avgERS")} value={avgERS} delay={0.1} />
        <StatCard icon={CheckCircle} label={t("uniDash.topPerformers")} value={topPerformers} delay={0.2} />
        <StatCard icon={AlertTriangle} label={t("uniDash.atRisk")} value={atRisk} delay={0.3} />
      </div>

      <Tabs defaultValue="cohort" className="space-y-4">
        <TabsList dir={dir} className="grid w-full grid-cols-3">
          <TabsTrigger value="cohort"><BarChart3 className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("uniDash.cohort")}</TabsTrigger>
          <TabsTrigger value="intelligence"><Target className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("uniDash.intelligence")}</TabsTrigger>
          <TabsTrigger value="uploads"><Upload className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("uniDash.records")}</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">{t("uniDash.ersDistribution")}</h3>
              <div className="space-y-3">
                {[
                  { range: "90-100", min: 90, max: 101 },
                  { range: "80-89", min: 80, max: 90 },
                  { range: "70-79", min: 70, max: 80 },
                  { range: "60-69", min: 60, max: 70 },
                  { range: "<60", min: 0, max: 60 },
                ].map(d => {
                  const count = students.filter(s => (s.ers_score || 0) >= d.min && (s.ers_score || 0) < d.max).length;
                  return (
                    <div key={d.range}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>ERS {d.range}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                      <Progress value={students.length > 0 ? (count / students.length) * 100 : 0} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">{t("uniDash.majorReadinessRankings")}</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {majorStats.slice(0, 15).map((m) => (
                  <div key={m.major} className={`flex items-center justify-between rounded-lg border p-3 ${isArabic ? "flex-row-reverse" : ""}`}>
                    <div>
                      <p className="text-sm font-medium">{m.major}</p>
                      <p className="text-xs text-muted-foreground">{t("uniDash.studentsLabel", { count: m.count })}</p>
                    </div>
                    <div className={isArabic ? "text-left" : "text-right"}>
                      <p className="font-bold text-primary">{m.avgERS}</p>
                      <p className="text-[10px] text-muted-foreground">{t("uniDash.avgERSLabel")}</p>
                    </div>
                  </div>
                ))}
                {majorStats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("uniDash.noStudentData")}</p>}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 md:col-span-2">
              <h3 className="font-semibold font-heading mb-4">{t("uniDash.studentRoster")}</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.slice(0, 50).map((s, i) => (
                  <motion.div key={s.user_id} className={`flex items-center gap-4 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{s.profiles?.full_name || t("hr.student")}</p>
                      <p className="text-xs text-muted-foreground">{s.major} · {t("hr.gpa")} {s.gpa}/{s.gpa_scale === "5" ? "5.0" : "4.0"}</p>
                    </div>
                    <div className={isArabic ? "text-left" : "text-right"}>
                      <p className="font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                      <p className="text-[10px] text-muted-foreground">ERS</p>
                    </div>
                    {(s.ers_score || 0) < 40 && <Badge variant="destructive" className="text-[10px]">{t("uniDash.atRiskBadge")}</Badge>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="intelligence">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">
                <Award className="h-4 w-4 inline ltr:mr-2 rtl:ml-2" />{t("uniDash.topCertTrends")}
              </h3>
              {certStats.length > 0 ? (
                <div className="space-y-3">
                  {certStats.map((c, i) => (
                    <div key={c.name} className={`flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                        <span className="text-sm">{c.name}</span>
                      </div>
                      <Badge variant="secondary">{t("uniDash.studentsLabel", { count: c.count })}</Badge>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">{t("uniDash.noCertDataYet")}</p>}
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">
                <BookOpen className="h-4 w-4 inline ltr:mr-2 rtl:ml-2" />{t("uniDash.marketSkillGaps")}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{t("uniDash.marketSkillGapsDesc")}</p>
              {skillGaps.length > 0 ? (
                <div className="space-y-3">
                  {skillGaps.map((g) => (
                    <div key={g.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{g.skill}</span>
                        <span className="font-semibold text-primary">{g.demand} {t("uniDash.jobs")}</span>
                      </div>
                      <Progress value={Math.min((g.demand / (skillGaps[0]?.demand || 1)) * 100, 100)} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">{t("uniDash.noJobMarketDataYet")}</p>}
            </div>

            <div className="rounded-xl border bg-card p-6 md:col-span-2">
              <h3 className="font-semibold font-heading mb-4">{t("uniDash.gradEmployability")}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{avgERS}</p>
                  <p className="text-xs text-muted-foreground">{t("uniDash.avgERSScore")}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-[hsl(var(--success))]">{topPerformers}</p>
                  <p className="text-xs text-muted-foreground">{t("uniDash.jobReady")}</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">{atRisk}</p>
                  <p className="text-xs text-muted-foreground">{t("uniDash.needSupport")}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uploads">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("uniDash.uploadTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("uniDash.uploadDesc")}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 border-dashed flex flex-col gap-2" onClick={() => handleUpload("conduct")}>
                <Upload className="h-6 w-6" />
                <span>{t("uniDash.uploadConductBtn")}</span>
                <span className="text-[10px] text-muted-foreground">{t("uniDash.fileFormats")}</span>
              </Button>
              <Button variant="outline" className="h-24 border-dashed flex flex-col gap-2" onClick={() => handleUpload("attendance")}>
                <Upload className="h-6 w-6" />
                <span>{t("uniDash.uploadAttendanceBtn")}</span>
                <span className="text-[10px] text-muted-foreground">{t("uniDash.fileFormats")}</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityDashboard;
