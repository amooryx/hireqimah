import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import CareerRoadmap from "@/components/CareerRoadmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ERSGauge from "@/components/ERSGauge";
import StatCard from "@/components/StatCard";
import StudentOnboarding from "@/components/StudentOnboarding";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import { fetchStudentDashboard, calculateERSFromData, fetchLeaderboard } from "@/lib/supabaseData";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import {
  buildFallbackExternalJobs,
  buildStudentJobPreferences,
  fetchLiveJobSearch,
  scoreJobTextMatch,
  sortLiveJobPostingsByPreferences,
  type LiveJobPosting,
} from "@/lib/liveJobs";
import {
  Trophy, Target, Briefcase, Map, Bell, Upload, Award,
  TrendingUp, Star, CheckCircle, Circle, Clock, Info,
  GraduationCap, ExternalLink, Send, Share2, Link as LinkIcon, Loader2, AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentDashboardProps { user: AuthUser; }

const StudentDashboard = ({ user: authUser }: StudentDashboardProps) => {
  const { toast } = useToast();
  const { t, lang, dir } = useI18n();
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderFilter, setLeaderFilter] = useState<"global" | "university" | "major">("global");
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [jobCache, setJobCache] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ers");
  const [externalJobs, setExternalJobs] = useState<LiveJobPosting[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsSourceMode, setJobsSourceMode] = useState<"live" | "cache" | "none">("none");
  const [jobsErrorCode, setJobsErrorCode] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const [data, { data: interviewData }, { data: notifData }] = await Promise.all([
      fetchStudentDashboard(authUser.id),
      untypedTable("interview_requests").select("*").eq("student_user_id", authUser.id).order("created_at", { ascending: false }),
      untypedTable("notifications").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }).limit(20),
    ]);
    setDashData(data);
    setOnboardingComplete(data.studentProfile ? true : false);
    setInterviews(interviewData || []);
    setNotifications(notifData || []);
    setUnreadCount((notifData || []).filter((n: any) => !n.read).length);
    setLoading(false);
  }, [authUser.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel('student-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${authUser.id}` },
        (payload) => {
          setNotifications(prev => [payload.new as any, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast({ title: (payload.new as any).title, description: (payload.new as any).body });
        })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'interview_requests', filter: `student_user_id=eq.${authUser.id}` },
        () => { loadDashboard(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authUser.id, toast, loadDashboard]);

  useEffect(() => {
    if (!dashData?.studentProfile) return;
    const filter = leaderFilter === "university"
      ? { university: dashData.studentProfile.university }
      : leaderFilter === "major"
      ? { major: dashData.studentProfile.major }
      : {};
    fetchLeaderboard(filter).then(setLeaderboard);
  }, [leaderFilter, dashData?.studentProfile]);

  useEffect(() => {
    supabase.from("job_cache").select("*").order("fetched_at", { ascending: false }).limit(50)
      .then(({ data }) => setJobCache(data || []));
    untypedTable("student_badges").select("*").eq("user_id", authUser.id).order("earned_at", { ascending: false })
      .then(({ data }: any) => setBadges(data || []));
    untypedTable("job_postings").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(50)
      .then(({ data }: any) => setJobPostings(data || []));
    untypedTable("applications").select("*").eq("student_user_id", authUser.id)
      .then(({ data }: any) => setApplications(data || []));
  }, [authUser.id]);

  const sp = dashData?.studentProfile;
  const isArabic = lang === "ar";
  const emptyValue = t("common.notAvailable");

  const studentJobPreferences = useMemo(
    () => buildStudentJobPreferences(sp, dashData?.skills || []),
    [sp, dashData?.skills]
  );

  const scorePosting = useCallback(
    (posting: {
      title?: string | null;
      company?: string | null;
      location?: string | null;
      sector?: string | null;
      description?: string | null;
      required_skills?: string[] | null;
      required_certifications?: string[] | null;
    }) => {
      return scoreJobTextMatch(
        [
          posting.title,
          posting.company,
          posting.location,
          posting.sector,
          posting.description,
          ...(posting.required_skills || []),
          ...(posting.required_certifications || []),
        ]
          .filter(Boolean)
          .join(" "),
        studentJobPreferences.keywords
      );
    },
    [studentJobPreferences.keywords]
  );

  const personalizedInternships = useMemo(
    () =>
      [...jobPostings.filter((jp: any) => jp.type === "internship")].sort(
        (a, b) => scorePosting(b) - scorePosting(a)
      ),
    [jobPostings, scorePosting]
  );

  const personalizedInternalJobs = useMemo(
    () =>
      [...jobPostings.filter((jp: any) => jp.type === "job" || !jp.type)].sort(
        (a, b) => scorePosting(b) - scorePosting(a)
      ),
    [jobPostings, scorePosting]
  );

  const mergedJobs = useMemo(() => {
    const internalJobs = personalizedInternalJobs.map((job: any) => ({
      ...job,
      card_type: "internal" as const,
      relevance_score: scorePosting(job),
    }));

    const rankedExternal = sortLiveJobPostingsByPreferences(
      externalJobs,
      studentJobPreferences,
      12
    ).map((job) => ({
      ...job,
      card_type: "external" as const,
      relevance_score: scorePosting(job),
    }));

    return [...internalJobs, ...rankedExternal].sort((a, b) => {
      if (b.relevance_score !== a.relevance_score) {
        return b.relevance_score - a.relevance_score;
      }

      if (a.card_type === b.card_type) return 0;
      return a.card_type === "internal" ? -1 : 1;
    });
  }, [externalJobs, personalizedInternalJobs, scorePosting, studentJobPreferences]);

  const loadPersonalizedJobs = useCallback(async () => {
    const fallbackJobs = buildFallbackExternalJobs(jobCache, studentJobPreferences, 12);

    if (!studentJobPreferences.searchRole) {
      setExternalJobs(fallbackJobs);
      setJobsSourceMode(fallbackJobs.length > 0 ? "cache" : "none");
      setJobsErrorCode(null);
      return;
    }

    setJobsLoading(true);
    setJobsErrorCode(null);

    const { data, error } = await fetchLiveJobSearch({
      role: studentJobPreferences.searchRole,
      userId: authUser.id,
      timeoutMs: 16000,
      retries: 1,
    });

    if (data?.job_postings?.length) {
      setExternalJobs(
        sortLiveJobPostingsByPreferences(data.job_postings, studentJobPreferences, 12)
      );
      setJobsSourceMode("live");
      setJobsErrorCode(null);
      setJobsLoading(false);
      return;
    }

    setExternalJobs(fallbackJobs);
    setJobsSourceMode(fallbackJobs.length > 0 ? "cache" : "none");
    setJobsErrorCode(error?.code || (data ? null : "request_failed"));
    setJobsLoading(false);
  }, [authUser.id, jobCache, studentJobPreferences]);

  useEffect(() => {
    if (activeTab !== "jobs") return;
    void loadPersonalizedJobs();
  }, [activeTab, loadPersonalizedJobs]);

  const handleApply = async (jobPostingId: string) => {
    if (applications.some(a => a.job_posting_id === jobPostingId)) {
      toast({ title: t("dash.alreadyApplied") }); return;
    }

    const optimisticId = `optimistic-${jobPostingId}`;
    setApplications(prev => [
      ...prev,
      {
        id: optimisticId,
        student_user_id: authUser.id,
        job_posting_id: jobPostingId,
        status: "applied",
        created_at: new Date().toISOString(),
      },
    ]);
    setApplyingTo(jobPostingId);

    try {
      const { error } = await untypedTable("applications").insert({
        student_user_id: authUser.id,
        job_posting_id: jobPostingId,
        status: "applied",
      });
      if (error) throw error;
      toast({ title: t("dash.applicationSent") });
    } catch (e: any) {
      setApplications(prev => prev.filter(app => app.id !== optimisticId));
      toast({ title: t("dash.uploadFailed"), description: e.message, variant: "destructive" });
    } finally {
      setApplyingTo(null);
    }
  };

  const handleFileUpload = useCallback((type: "transcript" | "certificate" | "project") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.png,.jpg,.jpeg";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { toast({ title: t("dash.fileTooLarge"), description: t("dash.maxSize"), variant: "destructive" }); return; }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "png", "jpg", "jpeg"].includes(ext || "")) { toast({ title: t("dash.invalidFormat"), description: t("dash.onlyPdfPngJpg"), variant: "destructive" }); return; }

      const path = `${authUser.id}/${type}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast({ title: t("dash.uploadFailed"), description: error.message, variant: "destructive" }); return; }

      if (type === "transcript") {
        await supabase.from("transcript_uploads").insert({ user_id: authUser.id, file_path: path });
      } else if (type === "certificate") {
        await supabase.from("student_certifications").insert({ user_id: authUser.id, custom_name: file.name.replace(/\.[^.]+$/, ""), file_path: path });
      } else if (type === "project") {
        const title = file.name.replace(/\.[^.]+$/, "");
        await supabase.from("student_projects").insert({ user_id: authUser.id, title, file_path: path });
      }
      toast({ title: t("dash.uploaded"), description: t("dash.pendingVerification") });
      loadDashboard();
    };
    input.click();
  }, [authUser.id, toast, loadDashboard, t]);

  const handleInterviewResponse = async (id: string, response: "accepted" | "declined") => {
    await untypedTable("interview_requests").update({ status: response, student_response: response, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: response === "accepted" ? t("dash.interviewAccepted") : t("dash.interviewDeclined") });
    loadDashboard();
  };

  const markNotificationsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await untypedTable("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      requested: t("dash.statusRequested"),
      accepted: t("dash.statusAccepted"),
      declined: t("dash.statusDeclined"),
      applied: t("dash.statusApplied"),
    };
    return map[status] || status;
  };

  const filterLabel = (f: "global" | "university" | "major") => {
    const map = { global: t("dash.globalFilter"), university: t("dash.universityFilter"), major: t("dash.majorFilter") };
    return map[f];
  };

  const proficiencyLabel = (value?: string | null) => {
    const normalized = value?.toLowerCase() || "";
    const map: Record<string, string> = {
      expert: t("dash.skillLevelExpert"),
      advanced: t("dash.skillLevelAdvanced"),
      intermediate: t("dash.skillLevelIntermediate"),
      beginner: t("dash.skillLevelBeginner"),
    };
    return map[normalized] || value || emptyValue;
  };

  const skillSourceLabel = (value?: string | null) => {
    const normalized = value?.toLowerCase() || "";
    const map: Record<string, string> = {
      transcript: t("dash.skillSourceTranscript"),
      certification: t("dash.skillSourceCertificate"),
      certificate: t("dash.skillSourceCertificate"),
      project: t("dash.skillSourceProject"),
      manual: t("dash.skillSourceManual"),
      self_reported: t("dash.skillSourceSelfReported"),
      selfreported: t("dash.skillSourceSelfReported"),
      imported: t("dash.skillSourceImported"),
      onboarding: t("dash.skillSourceOnboarding"),
      settings: t("dash.skillSourceSettings"),
      ai: t("dash.skillSourceAi"),
    };
    return map[normalized] || value || emptyValue;
  };

  const majorTrackLabel = (value?: string | null) => {
    const normalized = value?.toLowerCase() || "";
    const map: Record<string, string> = {
      engineering: t("dash.majorTrackEngineering"),
      technology: t("dash.majorTrackTechnology"),
      business: t("dash.majorTrackBusiness"),
      health: t("dash.majorTrackHealth"),
      science: t("dash.majorTrackScience"),
      general: t("dash.majorTrackGeneral"),
    };
    return map[normalized] || value || t("dash.majorTrackGeneral");
  };

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

  if (onboardingComplete === false) {
    return <StudentOnboarding userId={authUser.id} onComplete={loadDashboard} />;
  }

  const ers = calculateERSFromData(dashData || {});
  const myRank = leaderboard.findIndex(s => s.user_id === authUser.id) + 1;

  const completenessChecks = [
    { label: t("signup.fullName"), done: !!authUser.full_name },
    { label: t("signup.university"), done: !!sp?.university },
    { label: t("signup.major"), done: !!sp?.major },
    { label: t("signup.gpa"), done: (sp?.gpa || 0) > 0 },
    { label: t("dash.transcripts"), done: (dashData?.certifications?.length || 0) > 0 || (dashData?.projects?.length || 0) > 0 },
    { label: t("dash.certifications"), done: (dashData?.certifications?.length || 0) > 0 },
    { label: t("dash.projects"), done: (dashData?.projects?.length || 0) > 0 },
    { label: t("dash.skills"), done: (dashData?.skills?.length || 0) > 0 },
  ];
  const completeness = Math.round((completenessChecks.filter(c => c.done).length / completenessChecks.length) * 100);

  return (
    <div dir={dir} className={`container py-6 space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">{t("dash.welcomeName", { name: authUser.full_name })}</h1>
          <p className="text-muted-foreground text-sm">
            {sp?.university || emptyValue} · {sp?.major || emptyValue} · {t("signup.gpa")} {sp?.gpa || emptyValue}/{sp?.gpa_scale === "5" ? "5.0" : "4.0"}
          </p>
          {(sp?.github_url || sp?.linkedin_url || sp?.portfolio_url) && (
            <div className={`flex flex-wrap gap-3 mt-1 ${isArabic ? "justify-end" : ""}`}>
              {sp?.github_url && <a href={sp.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />{t("dash.githubProfile")}</a>}
              {sp?.linkedin_url && <a href={sp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />{t("dash.linkedinProfile")}</a>}
              {sp?.portfolio_url && <a href={sp.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />{t("dash.portfolioLink")}</a>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/profile/${authUser.id}`);
            toast({ title: t("dash.profileLinkCopiedMsg") });
          }}>
            <Share2 className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("dash.shareProfile")}
          </Button>
          <div className="text-end">
            <p className="text-xs text-muted-foreground">{t("dash.profile")}</p>
            <p className="text-sm font-semibold">{completeness}%</p>
          </div>
          <Progress value={completeness} className="h-2 w-24" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label={t("dash.ersScore")} value={ers.total} delay={0} />
        <StatCard icon={Trophy} label={t("dash.rank")} value={myRank > 0 ? `#${myRank}` : "—"} delay={0.1} />
        <StatCard icon={Award} label={t("dash.certifications")} value={dashData?.certifications?.length || 0} delay={0.2} />
        <StatCard icon={Briefcase} label={t("dash.interviews")} value={interviews.length} delay={0.3} />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList dir={dir} className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="ers"><Target className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.ers")}</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.leaderboard")}</TabsTrigger>
          <TabsTrigger value="uploads"><Upload className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.docs")}</TabsTrigger>
          <TabsTrigger value="internships"><GraduationCap className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.internships")}</TabsTrigger>
          <TabsTrigger value="jobs"><TrendingUp className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.jobs")}</TabsTrigger>
          <TabsTrigger value="interviews" className="relative">
            <Send className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.interviewRequests")}
            {interviews.filter(i => i.status === "requested").length > 0 && (
              <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 bg-destructive text-destructive-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {interviews.filter(i => i.status === "requested").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="roadmap"><Map className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.roadmap")}</TabsTrigger>
          <TabsTrigger value="skills"><Star className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.skills")}</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.notifications")}
            {unreadCount > 0 && (
              <span className="absolute -top-1 ltr:-right-1 rtl:-left-1 bg-destructive text-destructive-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ERS Tab */}
        <TabsContent value="ers">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div className="md:col-span-1 rounded-xl border bg-card p-6 flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ERSGauge score={ers.total} size={180} />
              {myRank > 0 && <p className="mt-2 text-sm text-muted-foreground">{t("dash.rankLabel")} #{myRank}</p>}
              {ers.breakdown.synergyBonus > 0 && (
                <Badge className="mt-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                  <Star className="h-3 w-3 ltr:mr-1 rtl:ml-1" />+{ers.breakdown.synergyBonus}% {t("dash.synergy")}
                </Badge>
              )}
              {ers.breakdown.nationalReadiness > 0 && (
                <Badge className="mt-1 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))]">
                  <Star className="h-3 w-3 ltr:mr-1 rtl:ml-1" />+{ers.breakdown.nationalReadiness}% {t("dash.national")}
                </Badge>
              )}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {badges.map(b => (
                    <Badge key={b.id} variant="secondary" className="text-[10px]">
                      <span className="ltr:mr-1 rtl:ml-1">{b.badge_icon}</span>{b.badge_label}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="w-full mt-4 border-t pt-4">
                <p className="text-xs font-semibold mb-2">{t("dash.profileCompleteness")}</p>
                <Progress value={completeness} className="h-2 mb-2" />
                <div className="grid grid-cols-1 gap-1">
                  {completenessChecks.map(c => (
                    <div key={c.label} className="flex items-center gap-2 text-xs">
                      {c.done ? <CheckCircle className="h-3 w-3 text-[hsl(var(--success))]" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
                      <span className={c.done ? "" : "text-muted-foreground"}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <div className="md:col-span-2 space-y-4">
              <div className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold font-heading">{t("dash.scoreBreakdownTitle")}</h3>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">{t("dash.scoreTooltip")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-4">
                  {[
                    { label: t("dash.academicPerformance"), value: ers.breakdown.academic || 0, weight: ers.explanation?.weights?.academic ? `${Math.round(ers.explanation.weights.academic * 100)}%` : "40%", color: "bg-primary" },
                    { label: t("dash.certificationsLabel"), value: ers.breakdown.certification || 0, weight: ers.explanation?.weights?.cert ? `${Math.round(ers.explanation.weights.cert * 100)}%` : "25%", color: "bg-[hsl(var(--success))]" },
                    { label: t("dash.projectsLabel"), value: ers.breakdown.project || 0, weight: ers.explanation?.weights?.project ? `${Math.round(ers.explanation.weights.project * 100)}%` : "15%", color: "bg-secondary" },
                    { label: t("dash.softSkillsLabel"), value: ers.breakdown.softSkills || 0, weight: ers.explanation?.weights?.soft ? `${Math.round(ers.explanation.weights.soft * 100)}%` : "10%", color: "bg-accent-foreground" },
                    { label: t("dash.conductLabel"), value: ers.breakdown.conduct || 0, weight: ers.explanation?.weights?.conduct ? `${Math.round(ers.explanation.weights.conduct * 100)}%` : "10%", color: "bg-[hsl(var(--primary))]" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label} <span className="text-muted-foreground">({item.weight})</span></span>
                        <span className="font-semibold">{Math.round(item.value)}/100</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                  {ers.breakdown.decayApplied > 0 && (
                    <div className="flex justify-between text-sm text-destructive">
                      <span>{t("dash.skillDecay")}</span>
                      <span>-{ers.breakdown.decayApplied}%</span>
                    </div>
                  )}
                </div>
                {ers.explanation?.major_category && (
                  <p className="text-xs text-muted-foreground mt-4 border-t pt-3">
                    {t("dash.majorTrackLabel")}: <span className="font-semibold capitalize">{majorTrackLabel(ers.explanation.major_category)}</span> — {t("dash.weightsNote")}
                  </p>
                )}
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold font-heading mb-3">{t("dash.certificationsLabel")}</h3>
                {dashData?.certifications?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dashData.certifications.map((c: any) => (
                      <Badge key={c.id} variant="secondary" className={c.verified ? "" : "opacity-60"}>
                        <Award className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
                        {c.certification_catalog?.name || c.custom_name || t("dash.certificate")}
                        {c.verified && <CheckCircle className="h-3 w-3 ltr:ml-1 rtl:mr-1 text-[hsl(var(--success))]" />}
                        {c.certification_catalog?.is_hadaf_reimbursed && (
                          <span className="ltr:ml-1 rtl:mr-1 text-[10px] text-[hsl(var(--primary))]">🇸🇦 {t("dash.hadaf")}</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">{t("dash.noCertsYet")}</p>}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-lg font-semibold font-heading">{t("dash.leaderboardTitle")}</h3>
              <div className="flex gap-2">
                {(["global", "university", "major"] as const).map(f => (
                  <Button key={f} size="sm" variant={leaderFilter === f ? "default" : "outline"} onClick={() => setLeaderFilter(f)} className="text-xs">{filterLabel(f)}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {leaderboard.map((s, i) => (
                <motion.div key={s.user_id}
                      className={`flex items-center gap-4 rounded-lg p-3 ${isArabic ? "flex-row-reverse text-right" : ""} ${s.user_id === authUser.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"}`}
                  initial={{ opacity: 0, x: lang === "ar" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <span className={`w-8 text-center font-bold text-lg ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.full_name}</p>
                    <p className="text-xs text-muted-foreground">{s.university} · {s.major}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                    <p className="text-xs text-muted-foreground">{t("dash.ersLabel")}</p>
                  </div>
                </motion.div>
              ))}
              {leaderboard.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">{t("dash.noStudents")}</p>}
            </div>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="uploads">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("dash.uploadDocs")}</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("transcript")}>
                <Upload className="h-5 w-5 ltr:mr-2 rtl:ml-2" /> {t("dash.uploadTranscript")}
              </Button>
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("certificate")}>
                <Upload className="h-5 w-5 ltr:mr-2 rtl:ml-2" /> {t("dash.uploadCertificate")}
              </Button>
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("project")}>
                <Upload className="h-5 w-5 ltr:mr-2 rtl:ml-2" /> {t("dash.uploadProject")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t("dash.uploadHint")}</p>

            <h4 className="font-semibold mt-6 mb-3">{t("dash.projectsTitle")}</h4>
            {dashData?.projects?.length > 0 ? (
              <div className="space-y-2">
                {dashData.projects.map((p: any) => (
                    <div key={p.id} className={`flex items-start gap-3 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${p.verified ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                    </div>
                    {p.verified
                      ? <Badge className="ms-auto text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">{t("dash.verified")}</Badge>
                      : <Badge variant="outline" className="ms-auto text-[10px]">{t("dash.pending")}</Badge>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">{t("dash.noProjectsYet")}</p>}
          </div>
        </TabsContent>

        {/* Internships Tab */}
        <TabsContent value="internships">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("dash.internships")}</h3>
            {(() => {
              const internships = personalizedInternships;
              return internships.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">{t("dash.noInternships")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {internships.map((jp: any) => {
                    const hasApplied = applications.some(a => a.job_posting_id === jp.id);
                    return (
                      <div key={jp.id} className={`rounded-lg border p-4 flex flex-col gap-3 ${isArabic ? "sm:flex-row-reverse sm:items-center text-right" : "sm:flex-row sm:items-center"}`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                            <p className="font-medium text-sm">{jp.title}</p>
                            <Badge variant="secondary" className="text-[10px]">{t("dash.internal")}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{jp.company || emptyValue} · {jp.location || emptyValue} · {jp.sector || t("dash.general")}</p>
                          {jp.required_skills?.length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-1 ${isArabic ? "justify-end" : ""}`}>
                              {jp.required_skills.slice(0, 4).map((s: string) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                            </div>
                          )}
                        </div>
                        <Button size="sm" className="min-w-28" disabled={hasApplied || applyingTo === jp.id} onClick={() => handleApply(jp.id)}>
                          {hasApplied ? <><CheckCircle className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("dash.applied")}</> : t("dash.apply")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </TabsContent>

        {/* Jobs Tab - Internal + External */}
        <TabsContent value="jobs">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className={`flex flex-col gap-3 ${isArabic ? "md:flex-row-reverse md:items-start" : "md:flex-row md:items-start"} md:justify-between`}>
              <div>
                <h3 className="text-lg font-semibold font-heading mb-2">{t("dash.jobs")}</h3>
                <p className="text-sm text-muted-foreground">{t("dash.jobsDescription")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("dash.jobsSearchRole", { role: studentJobPreferences.searchRole || t("dash.general") })}</p>
              </div>
              <Badge variant="outline" className="w-fit text-[10px]">
                {jobsSourceMode === "live"
                  ? t("dash.liveJobsSource")
                  : jobsSourceMode === "cache"
                    ? t("dash.cachedJobsSource")
                    : t("dash.external")}
              </Badge>
            </div>

            {jobsLoading && (
              <div className={`rounded-lg border bg-accent/40 p-4 flex items-center gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                <div>
                  <p className="text-sm font-medium">{t("dash.fetchingJobs")}</p>
                  <p className="text-xs text-muted-foreground">{t("dash.jobsSearchRole", { role: studentJobPreferences.searchRole || t("dash.general") })}</p>
                </div>
              </div>
            )}

            {!jobsLoading && jobsSourceMode === "cache" && (
              <div className={`rounded-lg border border-accent bg-accent/30 p-4 flex items-start gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                <AlertTriangle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">{t("dash.cachedJobsNotice")}</p>
              </div>
            )}

            {!jobsLoading && jobsErrorCode && jobsSourceMode === "none" && (
              <div className={`rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
                <p className="text-sm text-muted-foreground">{t("dash.jobsUnavailableDescription")}</p>
              </div>
            )}

            {mergedJobs.length > 0 ? (
              <div className="space-y-3">
                {mergedJobs.map((job: any) => {
                  const hasApplied = job.card_type === "internal" && applications.some(a => a.job_posting_id === job.id);

                  return (
                    <div key={`${job.card_type}-${job.id}`} className="rounded-lg border p-4">
                      <div className={`flex flex-col gap-3 ${isArabic ? "sm:flex-row-reverse sm:items-start text-right" : "sm:flex-row sm:items-start"} sm:justify-between`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex flex-wrap items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                            <p className="font-medium text-sm">{job.title}</p>
                            <Badge className={job.card_type === "internal" ? "text-[10px] bg-primary/10 text-primary" : "text-[10px]"} variant={job.card_type === "internal" ? undefined : "outline"}>
                              {job.card_type === "internal" ? t("dash.internal") : t("dash.external")}
                            </Badge>
                            {job.card_type === "external" && job.source && (
                              <Badge variant="outline" className="text-[10px]">{job.source}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.company || emptyValue} · {job.location || emptyValue} · {job.sector || t("dash.general")}
                          </p>
                          {job.description && (
                            <p className="text-xs text-muted-foreground mt-2">{job.description}</p>
                          )}
                          {job.required_skills?.length > 0 && (
                            <div className={`flex flex-wrap gap-1 mt-2 ${isArabic ? "justify-end" : ""}`}>
                              {job.required_skills.slice(0, 4).map((skill: string) => (
                                <Badge key={`${job.id}-${skill}`} variant={job.card_type === "internal" ? "outline" : "secondary"} className="text-[10px]">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {job.card_type === "internal" ? (
                          <Button size="sm" className="min-w-28" disabled={hasApplied || applyingTo === job.id} onClick={() => handleApply(job.id)}>
                            {hasApplied ? <><CheckCircle className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("dash.applied")}</> : t("dash.apply")}
                          </Button>
                        ) : (
                          <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="min-w-36">
                              <ExternalLink className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("dash.applyExternally")}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">{t("dash.noJobs")}</p>
                <p className="text-xs text-muted-foreground mt-1">{jobsErrorCode ? t("dash.jobsUnavailableDescription") : t("dash.noJobsDescription")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Interview Requests & Opportunities */}
        <TabsContent value="interviews">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("dash.interviewRequests")}</h3>
            {interviews.length === 0 ? (
              <div className="text-center py-12">
                <Send className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">{t("dash.noInterviews")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv, i) => (
                  <motion.div key={iv.id} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className={`flex flex-col gap-3 ${isArabic ? "sm:flex-row-reverse sm:items-center text-right" : "sm:flex-row sm:items-center"}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                          <p className="font-medium text-sm">{iv.job_title || t("dash.interviewRequests")}</p>
                          <Badge variant={
                            iv.status === "requested" ? "default" :
                            iv.status === "accepted" ? "secondary" :
                            iv.status === "declined" ? "destructive" : "outline"
                          } className="text-[10px]">{statusLabel(iv.status)}</Badge>
                        </div>
                        {iv.job_description && <p className="text-xs text-muted-foreground mt-1">{iv.job_description}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline ltr:mr-1 rtl:ml-1" />
                          {new Date(iv.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                        </p>
                      </div>
                      {iv.status === "requested" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleInterviewResponse(iv.id, "accepted")}>
                            <CheckCircle className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("dash.accept")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleInterviewResponse(iv.id, "declined")}>
                            {t("dash.decline")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Roadmap */}
        <TabsContent value="roadmap">
          <CareerRoadmap userId={authUser.id} currentCareerTarget={sp?.career_target} />
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("dash.skillMatrix")}</h3>
            {dashData?.skills?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashData.skills.map((s: any) => (
                  <div key={s.id} className={`flex items-center gap-3 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                    <div className={`h-3 w-3 rounded-full ${
                      s.proficiency_level === "expert" ? "bg-[hsl(var(--success))]" :
                      s.proficiency_level === "advanced" ? "bg-primary" :
                      s.proficiency_level === "intermediate" ? "bg-[hsl(var(--primary))]" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.skill_name}</p>
                      <p className="text-xs text-muted-foreground">{proficiencyLabel(s.proficiency_level)} · {skillSourceLabel(s.source)}</p>
                    </div>
                    {s.verified && <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">{t("dash.noSkillsYet")}</p>}
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading">{t("dash.notificationsTitle")}</h3>
              {unreadCount > 0 && (
                <Button size="sm" variant="outline" onClick={markNotificationsRead}>{t("dash.markAllRead")}</Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">{t("dash.noNotificationsYet")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n, i) => (
                  <motion.div key={n.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""} ${!n.read ? "bg-primary/5 border-primary/20" : ""}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
