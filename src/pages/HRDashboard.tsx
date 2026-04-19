import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatCard from "@/components/StatCard";
import ERSGauge from "@/components/ERSGauge";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import { SAUDI_UNIVERSITIES } from "@/lib/leaderboardConstants";
import {
  Search, Users, BarChart3, Star, Award, Eye, TrendingUp, Briefcase,
  CheckCircle, X, ShieldCheck, MessageSquare, Calendar, Bell, Send, Target, Zap,
  Link as LinkIcon, Video
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface HRDashboardProps { user: AuthUser; }

function MarketTrustPanel() {
  const { t } = useI18n();
  const [metrics, setMetrics] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      supabase.from("job_cache").select("*", { count: "exact", head: true }),
      supabase.from("job_cache").select("company, source").order("fetched_at", { ascending: false }).limit(500),
      untypedTable("market_refresh_log").select("started_at, status, jobs_analyzed").order("started_at", { ascending: false }).limit(1),
    ]).then(([{ count }, { data: jobs }, { data: logs }]) => {
      const companies = new Set((jobs || []).map((j: any) => j.company).filter(Boolean));
      const sources = new Set((jobs || []).map((j: any) => j.source).filter(Boolean));
      setMetrics({
        jobsAnalyzed: count || 0,
        companiesAnalyzed: companies.size,
        sourcesUsed: [...sources],
        lastRefresh: logs?.[0]?.started_at || null,
      });
    });
  }, []);

  if (!metrics) return <Skeleton className="h-16" />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xl font-bold text-primary">{metrics.jobsAnalyzed}</p>
        <p className="text-[10px] text-muted-foreground">{t("hr.jobsAnalyzed")}</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xl font-bold text-primary">{metrics.companiesAnalyzed}</p>
        <p className="text-[10px] text-muted-foreground">{t("hr.companies")}</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xl font-bold text-primary">{metrics.sourcesUsed.length}</p>
        <p className="text-[10px] text-muted-foreground">{t("hr.sources")} ({metrics.sourcesUsed.slice(0, 3).join(", ")})</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xs font-bold text-primary">{metrics.lastRefresh ? new Date(metrics.lastRefresh).toLocaleDateString() : "—"}</p>
        <p className="text-[10px] text-muted-foreground">{t("hr.lastRefresh")}</p>
      </div>
    </div>
  );
}

const HRDashboard = ({ user: authUser }: HRDashboardProps) => {
  const { toast } = useToast();
  const { t, lang, dir } = useI18n();
  const isArabic = lang === "ar";
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [hrProfile, setHrProfile] = useState<any>(null);
  const [shortlists, setShortlists] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minERS, setMinERS] = useState("");
  const [filterMajor, setFilterMajor] = useState("all");
  const [filterCert, setFilterCert] = useState("all");
  const [majors, setMajors] = useState<string[]>([]);
  const [certNames, setCertNames] = useState<string[]>([]);
  const [studentCerts, setStudentCerts] = useState<any[]>([]);
  const [viewingProfile, setViewingProfile] = useState<any>(null);
  const [interviewDialog, setInterviewDialog] = useState<any>(null);
  const [interviewTitle, setInterviewTitle] = useState("");
  const [interviewDesc, setInterviewDesc] = useState("");
  const [interviewScheduledAt, setInterviewScheduledAt] = useState("");
  const [interviewProvider, setInterviewProvider] = useState<string>("Google Meet");
  const [interviewMeetingUrl, setInterviewMeetingUrl] = useState("");
  const [interviewExistingId, setInterviewExistingId] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", location: "Saudi Arabia", sector: "", required_skills: "", min_ers_score: "" });
  const [messageDialog, setMessageDialog] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filterUni, setFilterUni] = useState("all");
  const [smartMatchResults, setSmartMatchResults] = useState<any[] | null>(null);
  const [smartMatchLoading, setSmartMatchLoading] = useState(false);
  const [smartMatchJob, setSmartMatchJob] = useState<any>(null);

  const openInterviewDialog = (student: any, existing?: any) => {
    setInterviewDialog(student);
    setInterviewTitle(existing?.job_title || "");
    setInterviewDesc(existing?.job_description || "");
    setInterviewProvider(existing?.meeting_provider || "Google Meet");
    setInterviewMeetingUrl(existing?.meeting_url || "");
    setInterviewExistingId(existing?.id || null);
    if (existing?.scheduled_at) {
      const d = new Date(existing.scheduled_at);
      const pad = (n: number) => String(n).padStart(2, "0");
      setInterviewScheduledAt(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      );
    } else {
      setInterviewScheduledAt("");
    }
  };

  const closeInterviewDialog = () => {
    setInterviewDialog(null);
    setInterviewTitle("");
    setInterviewDesc("");
    setInterviewScheduledAt("");
    setInterviewProvider("Google Meet");
    setInterviewMeetingUrl("");
    setInterviewExistingId(null);
  };

  const generateMeetLink = () => {
    const seg = (n: number) => Array.from({ length: n }, () => "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]).join("");
    setInterviewMeetingUrl(`https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`);
    setInterviewProvider("Google Meet");
  };

  const stageLabel = (stage: string) => {
    const map: Record<string, string> = {
      discovered: t("hr.stageDiscovered"),
      shortlisted: t("hr.stageShortlisted"),
      interview: t("hr.stageInterview"),
      offer: t("hr.stageOffer"),
      hired: t("hr.stageHired"),
    };
    return map[stage] || stage;
  };

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      requested: t("dash.statusRequested"),
      scheduled: t("interview.scheduledFor"),
      accepted: t("dash.statusAccepted"),
      declined: t("dash.statusDeclined"),
    };
    return map[status] || status;
  };

  const loadDashboard = useCallback(async () => {
    const [{ data: hr }, { data: students }, { data: sl }, { data: majorsList }, { data: certs }, { data: sCerts }, { data: ivs }, { data: jp }, { data: notifs }, { data: pipelineData }] = await Promise.all([
      supabase.from("hr_profiles").select("*").eq("user_id", authUser.id).single(),
      supabase.from("student_profiles")
        .select("*, profiles!inner(full_name, avatar_url, email, user_id)")
        .eq("visibility_public", true)
        .order("ers_score", { ascending: false })
        .limit(200),
      supabase.from("hr_shortlists").select("*").eq("hr_user_id", authUser.id),
      supabase.from("student_profiles").select("major").order("major"),
      supabase.from("certification_catalog").select("id, name").order("name"),
      supabase.from("student_certifications").select("user_id, certification_id, certification_catalog(name)"),
      untypedTable("interview_requests").select("*").eq("hr_user_id", authUser.id).order("created_at", { ascending: false }),
      untypedTable("job_postings").select("*").eq("hr_user_id", authUser.id).order("created_at", { ascending: false }),
      untypedTable("notifications").select("*").eq("user_id", authUser.id).order("created_at", { ascending: false }).limit(20),
      untypedTable("hr_candidate_pipeline").select("*").eq("hr_user_id", authUser.id).order("updated_at", { ascending: false }),
    ]);

    setHrProfile(hr);
    setCandidates(students || []);
    setShortlists(sl || []);
    setPipeline(pipelineData || []);
    setMajors([...new Set((majorsList || []).map((m: any) => m.major).filter(Boolean))]);
    setCertNames([...new Set((certs || []).map((c: any) => c.name))]);
    setStudentCerts(sCerts || []);
    setInterviews(ivs || []);
    setJobPostings(jp || []);
    setNotifications(notifs || []);
    setLoading(false);
  }, [authUser.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel('hr-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interview_requests', filter: `hr_user_id=eq.${authUser.id}` },
        () => { loadDashboard(); })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${authUser.id}` },
        (payload) => {
          setNotifications(prev => [payload.new as any, ...prev]);
          toast({ title: (payload.new as any).title });
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authUser.id, loadDashboard, toast]);

  const handleShortlist = async (studentUserId: string) => {
    const exists = shortlists.find(s => s.student_user_id === studentUserId);
    if (exists) {
      await supabase.from("hr_shortlists").delete().eq("id", exists.id);
      toast({ title: t("hr.removedFromShortlist") });
    } else {
      await supabase.from("hr_shortlists").insert({ hr_user_id: authUser.id, student_user_id: studentUserId });
      await untypedTable("notifications").insert({
        user_id: studentUserId,
        type: "shortlisted",
        title: t("hr.notifiedShortlisted"),
        body: `${hrProfile?.company_name || t("hr.companies")} ${isArabic ? "أضافتك للقائمة المختصرة." : "has added you to their shortlist."}`,
      });
      toast({ title: t("hr.addedToShortlist") });
    }
    const { data: sl } = await supabase.from("hr_shortlists").select("*").eq("hr_user_id", authUser.id);
    setShortlists(sl || []);
  };

  const PIPELINE_STAGES = ["discovered", "shortlisted", "interview", "offer", "hired"] as const;
  const STAGE_COLORS: Record<string, string> = {
    discovered: "bg-muted text-muted-foreground",
    shortlisted: "bg-primary/10 text-primary",
    interview: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    offer: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
    hired: "bg-[hsl(var(--deep-green))]/10 text-[hsl(var(--deep-green))]",
  };

  const movePipelineStage = async (entryId: string, newStage: string) => {
    await untypedTable("hr_candidate_pipeline").update({ stage: newStage }).eq("id", entryId);
    toast({ title: t("hr.movedTo", { stage: stageLabel(newStage) }) });
    loadDashboard();
  };

  const addToPipeline = async (studentUserId: string, jobTitle?: string) => {
    const exists = pipeline.find((p: any) => p.student_user_id === studentUserId && p.job_title === (jobTitle || null));
    if (exists) {
      toast({ title: t("hr.alreadyInPipeline") });
      return;
    }
    await untypedTable("hr_candidate_pipeline").insert({
      hr_user_id: authUser.id,
      student_user_id: studentUserId,
      stage: "discovered",
      job_title: jobTitle || null,
    });
    await untypedTable("notifications").insert({
      user_id: studentUserId,
      type: "pipeline",
      title: t("hr.notifiedDiscovered"),
      body: `${hrProfile?.company_name || t("hr.companies")} ${isArabic ? "أضافتك لمسار التوظيف." : "added you to their hiring pipeline."}`,
    });
    toast({ title: t("hr.addedToPipeline") });
    loadDashboard();
  };

  const sendInterviewRequest = async () => {
    if (!interviewDialog) return;

    // Validate scheduled_at if provided
    let scheduledIso: string | null = null;
    if (interviewScheduledAt) {
      const d = new Date(interviewScheduledAt);
      if (isNaN(d.getTime())) { toast({ title: t("interview.dateTimeRequired"), variant: "destructive" }); return; }
      scheduledIso = d.toISOString();
    }

    // Validate URL if provided
    if (interviewMeetingUrl) {
      try {
        const u = new URL(interviewMeetingUrl);
        if (!["http:", "https:"].includes(u.protocol)) throw new Error("invalid");
      } catch {
        toast({ title: t("interview.invalidUrl"), variant: "destructive" });
        return;
      }
    }

    const payload: any = {
      hr_user_id: authUser.id,
      student_user_id: interviewDialog.user_id,
      job_title: interviewTitle || t("hr.requestInterview"),
      job_description: interviewDesc || null,
      meeting_url: interviewMeetingUrl || null,
      meeting_provider: interviewMeetingUrl ? interviewProvider : null,
      scheduled_at: scheduledIso,
      status: scheduledIso && interviewMeetingUrl ? "scheduled" : "requested",
    };

    let id = interviewExistingId;
    if (id) {
      await untypedTable("interview_requests").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", id);
    } else {
      const { data: inserted } = await untypedTable("interview_requests").insert(payload).select("id").single();
      id = (inserted as any)?.id || null;
    }

    const whenLabel = scheduledIso
      ? new Date(scheduledIso).toLocaleString(isArabic ? "ar-SA" : "en-US", { dateStyle: "medium", timeStyle: "short" })
      : t("interview.notScheduled");

    await untypedTable("notifications").insert({
      user_id: interviewDialog.user_id,
      type: scheduledIso ? "interview_scheduled" : "interview_request",
      title: scheduledIso ? t("interview.notifyTitle") : t("hr.newInterviewRequest"),
      body: t("interview.notifyBody", {
        company: hrProfile?.company_name || t("hr.companies"),
        title: interviewTitle || "",
        when: whenLabel,
      }),
    });
    await supabase.from("audit_logs").insert({
      user_id: authUser.id,
      action: scheduledIso ? "interview_scheduled" : "interview_requested",
      resource_type: "student",
      resource_id: interviewDialog.user_id,
      details: { student_name: interviewDialog.profiles?.full_name, job_title: interviewTitle, scheduled_at: scheduledIso, meeting_provider: interviewProvider },
    });
    toast({
      title: scheduledIso ? t("interview.inviteSent") : t("hr.interviewSent"),
      description: t("interview.studentNotified", { name: interviewDialog.profiles?.full_name || "" }),
    });
    closeInterviewDialog();
    loadDashboard();
  };

  const sendMessage = async () => {
    if (!messageDialog || !messageText.trim()) return;
    await untypedTable("messages").insert({
      sender_id: authUser.id,
      recipient_id: messageDialog.user_id,
      content: messageText.trim(),
    });
    await untypedTable("notifications").insert({
      user_id: messageDialog.user_id,
      type: "message",
      title: t("hr.newMessage"),
      body: `${hrProfile?.company_name || t("hr.companies")} ${isArabic ? "أرسلت لك رسالة." : "sent you a message."}`,
    });
    toast({ title: t("hr.messageSent") });
    setMessageDialog(null);
    setMessageText("");
  };

  const createJobPosting = async () => {
    await untypedTable("job_postings").insert({
      hr_user_id: authUser.id,
      title: jobForm.title,
      company: hrProfile?.company_name || "",
      description: jobForm.description || null,
      location: jobForm.location,
      sector: jobForm.sector || null,
      required_skills: jobForm.required_skills ? jobForm.required_skills.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      min_ers_score: jobForm.min_ers_score ? parseInt(jobForm.min_ers_score) : 0,
    });
    toast({ title: t("hr.jobPostingCreated") });
    setShowJobForm(false);
    setJobForm({ title: "", description: "", location: "Saudi Arabia", sector: "", required_skills: "", min_ers_score: "" });
    loadDashboard();
  };

  const runSmartMatch = async (jp: any) => {
    setSmartMatchLoading(true);
    setSmartMatchJob(jp);
    try {
      const { data, error } = await supabase.functions.invoke("hr-smart-filter", {
        body: {
          action: "match-candidates",
          job_posting_id: jp.id,
          required_skills: jp.required_skills || [],
          min_ers: jp.min_ers_score || 0,
          limit: 20,
        },
      });
      if (error) throw error;
      setSmartMatchResults(data?.candidates || []);
    } catch (e) {
      console.error("Smart match error:", e);
      toast({ title: t("hr.smartMatchFailed"), variant: "destructive" });
    }
    setSmartMatchLoading(false);
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

  const filtered = candidates.filter(s => {
    if (searchQuery && !s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (minERS && (s.ers_score || 0) < parseInt(minERS)) return false;
    if (filterMajor !== "all" && s.major !== filterMajor) return false;
    if (filterUni !== "all" && s.university !== filterUni) return false;
    if (filterCert !== "all") {
      const hasCert = studentCerts.some(sc => sc.user_id === s.user_id && (sc as any).certification_catalog?.name === filterCert);
      if (!hasCert) return false;
    }
    return true;
  });

  const avgERS = candidates.length > 0
    ? Math.round(candidates.reduce((a, s) => a + (s.ers_score || 0), 0) / candidates.length) : 0;

  return (
    <div dir={dir} className={`container py-6 space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
      <div>
        <h1 className="text-2xl font-bold font-heading">{t("hr.dashTitle")}</h1>
        <p className="text-muted-foreground text-sm">{t("hr.welcome", { name: authUser.full_name, company: hrProfile?.company_name || "" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label={t("hr.candidates")} value={candidates.length} delay={0} />
        <StatCard icon={TrendingUp} label={t("hr.avgERS")} value={avgERS} delay={0.1} />
        <StatCard icon={Star} label={t("hr.inPipeline")} value={pipeline.length} delay={0.2} />
        <StatCard icon={Calendar} label={t("dash.interviews")} value={interviews.length} delay={0.3} />
        <StatCard icon={CheckCircle} label={t("hr.hired")} value={pipeline.filter((p: any) => p.stage === "hired").length} delay={0.4} />
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList dir={dir} className="grid w-full grid-cols-6">
          <TabsTrigger value="search"><Search className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("hr.candidates")}</TabsTrigger>
          <TabsTrigger value="pipeline"><Target className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("hr.pipeline")}</TabsTrigger>
          <TabsTrigger value="shortlist"><Star className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("hr.shortlisted")}</TabsTrigger>
          <TabsTrigger value="jobs"><Briefcase className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("hr.postings")}</TabsTrigger>
          <TabsTrigger value="interviews"><Calendar className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("dash.interviews")}</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("hr.analytics")}</TabsTrigger>
        </TabsList>

        {/* Search */}
        <TabsContent value="search">
          <div className="rounded-xl border bg-card p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground ${isArabic ? "right-3" : "left-3"}`} />
                <Input placeholder={t("hr.searchByName")} className={isArabic ? "pr-9" : "pl-9"} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} maxLength={100} />
              </div>
              <Input placeholder={t("hr.minERSPlaceholder")} type="number" min={0} max={100} value={minERS} onChange={e => setMinERS(e.target.value)} />
              <Select value={filterUni} onValueChange={setFilterUni}>
                <SelectTrigger><SelectValue placeholder={t("hr.filterUni")} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">{t("hr.allUniversities")}</SelectItem>
                  {SAUDI_UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterMajor} onValueChange={setFilterMajor}>
                <SelectTrigger><SelectValue placeholder={t("hr.filterMajor")} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">{t("hr.allMajors")}</SelectItem>
                  {majors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterCert} onValueChange={setFilterCert}>
                <SelectTrigger><SelectValue placeholder={t("hr.certifications")} /></SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">{t("hr.allCertifications")}</SelectItem>
                  {certNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">{t("hr.results", { count: filtered.length })}</div>
            </div>
            <div className="space-y-3">
              {filtered.slice(0, 50).map((s, i) => {
                const isShortlisted = shortlists.some(sl => sl.student_user_id === s.user_id);
                return (
                  <motion.div key={s.user_id} className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors ${isArabic ? "sm:flex-row-reverse text-right" : ""}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="flex-1 min-w-0">
                      <div className={`flex items-center gap-2 flex-wrap ${isArabic ? "justify-end" : ""}`}>
                        <span className="font-medium text-sm">{s.profiles?.full_name || t("hr.student")}</span>
                        {s.onboarding_completed && <Badge className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">{t("dash.verified")}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{s.university} · {s.major} · {t("hr.gpa")} {s.gpa}/{s.gpa_scale === "5" ? "5.0" : "4.0"}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                      <div className="text-center ltr:mr-2 rtl:ml-2">
                        <p className="text-xl font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                        <p className="text-[10px] text-muted-foreground">ERS</p>
                      </div>
                      <Button size="sm" variant={isShortlisted ? "default" : "outline"} onClick={() => handleShortlist(s.user_id)}>
                        <Star className={`h-4 w-4 ${isShortlisted ? "fill-current" : ""}`} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addToPipeline(s.user_id)}>
                        <Target className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setViewingProfile(s)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openInterviewDialog(s)}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setMessageDialog(s)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noCandidates")}</p>}
            </div>
          </div>
        </TabsContent>

        {/* Pipeline */}
        <TabsContent value="pipeline">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("hr.hiringPipeline")}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {PIPELINE_STAGES.map(stage => {
                const count = pipeline.filter((p: any) => p.stage === stage).length;
                return (
                  <Badge key={stage} variant="outline" className={`${STAGE_COLORS[stage]} px-3 py-1`}>
                    {stageLabel(stage)} ({count})
                  </Badge>
                );
              })}
            </div>
            {pipeline.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noPipelineCandidates")}</p>
            ) : (
              <div className="space-y-4">
                {PIPELINE_STAGES.map(stage => {
                  const stageEntries = pipeline.filter((p: any) => p.stage === stage);
                  if (stageEntries.length === 0) return null;
                  const stageIdx = PIPELINE_STAGES.indexOf(stage);
                  return (
                    <div key={stage}>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${stage === 'hired' ? 'bg-[hsl(var(--deep-green))]' : stage === 'offer' ? 'bg-[hsl(var(--success))]' : stage === 'interview' ? 'bg-[hsl(var(--primary))]' : 'bg-primary'}`} />
                        {stageLabel(stage)} ({stageEntries.length})
                      </h4>
                      {stageEntries.map((entry: any) => {
                        const student = candidates.find(c => c.user_id === entry.student_user_id);
                        return (
                          <motion.div key={entry.id} className={`flex items-center gap-3 rounded-lg border p-3 mb-2 ${isArabic ? "flex-row-reverse text-right" : ""}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{student?.profiles?.full_name || t("hr.student")}</p>
                              <p className="text-xs text-muted-foreground">{entry.job_title || t("dash.general")} · {student?.university || ""}</p>
                            </div>
                            {student && <p className="font-bold text-primary text-sm">{Math.round(student.ers_score || 0)}</p>}
                            <div className="flex gap-1">
                              {stageIdx > 0 && (
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => movePipelineStage(entry.id, PIPELINE_STAGES[stageIdx - 1])}>{t("hr.backBtn")}</Button>
                              )}
                              {stageIdx < PIPELINE_STAGES.length - 1 && (
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => movePipelineStage(entry.id, PIPELINE_STAGES[stageIdx + 1])}>→ {stageLabel(PIPELINE_STAGES[stageIdx + 1])}</Button>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Shortlist */}
        <TabsContent value="shortlist">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("hr.shortlistedCount", { count: shortlists.length })}</h3>
            {shortlists.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noShortlistYet")}</p>
            ) : (
              <div className="space-y-3">
                {shortlists.map((sl, i) => {
                  const student = candidates.find(c => c.user_id === sl.student_user_id);
                  if (!student) return null;
                  return (
                    <motion.div key={sl.id} className={`flex items-center gap-4 rounded-lg border p-4 ${isArabic ? "flex-row-reverse text-right" : ""}`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.profiles?.full_name || t("hr.student")}</p>
                        <p className="text-xs text-muted-foreground">{student.university} · {student.major}</p>
                      </div>
                      <p className="font-bold text-primary">{Math.round(student.ers_score || 0)} ERS</p>
                      <Button size="sm" variant="outline" onClick={() => openInterviewDialog(student)}><Calendar className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setMessageDialog(student)}><MessageSquare className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleShortlist(sl.student_user_id)}><X className="h-4 w-4" /></Button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Job Postings */}
        <TabsContent value="jobs">
          <div className="rounded-xl border bg-card p-6">
            <div className={`flex items-center justify-between mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
              <h3 className="text-lg font-semibold font-heading">{t("hr.jobPostingsCount", { count: jobPostings.length })}</h3>
              <Button size="sm" onClick={() => setShowJobForm(!showJobForm)}>
                {showJobForm ? t("hr.cancelBtn") : t("hr.newPosting")}
              </Button>
            </div>
            {showJobForm && (
              <div className="rounded-lg border p-4 mb-4 space-y-3">
                <Input placeholder={t("hr.jobTitleRequired")} value={jobForm.title} onChange={e => setJobForm(f => ({...f, title: e.target.value}))} maxLength={200} />
                <Textarea placeholder={t("hr.jobDescPlaceholder")} value={jobForm.description} onChange={e => setJobForm(f => ({...f, description: e.target.value}))} maxLength={2000} />
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input placeholder={t("hr.locationPlaceholder")} value={jobForm.location} onChange={e => setJobForm(f => ({...f, location: e.target.value}))} />
                  <Input placeholder={t("hr.sectorPlaceholder")} value={jobForm.sector} onChange={e => setJobForm(f => ({...f, sector: e.target.value}))} />
                  <Input placeholder={t("hr.minERSPlaceholder")} type="number" min={0} max={100} value={jobForm.min_ers_score} onChange={e => setJobForm(f => ({...f, min_ers_score: e.target.value}))} />
                </div>
                <Input placeholder={t("hr.skillsComma")} value={jobForm.required_skills} onChange={e => setJobForm(f => ({...f, required_skills: e.target.value}))} />
                <Button onClick={createJobPosting} disabled={!jobForm.title.trim()}>
                  <Send className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.publishJob")}
                </Button>
              </div>
            )}
            {jobPostings.length === 0 && !showJobForm ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noPostingsYet")}</p>
            ) : (
              <div className="space-y-3">
                {jobPostings.map((jp: any, i: number) => (
                  <motion.div key={jp.id} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className={`flex items-start justify-between gap-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                          <p className="font-medium text-sm">{jp.title}</p>
                          <Badge variant={jp.is_active ? "default" : "outline"} className="text-[10px]">{jp.is_active ? t("hr.active") : t("hr.closed")}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{jp.company || "—"} · {jp.location} · {jp.sector || t("dash.general")}</p>
                        {jp.min_ers_score > 0 && <p className="text-xs text-muted-foreground">{t("hr.minERS")}: {jp.min_ers_score}</p>}
                        {jp.required_skills?.length > 0 && (
                          <div className={`flex flex-wrap gap-1 mt-1 ${isArabic ? "justify-end" : ""}`}>
                            {jp.required_skills.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                        <Button size="sm" variant="outline" onClick={() => runSmartMatch(jp)} disabled={smartMatchLoading}>
                          <Zap className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.smartMatch")}
                        </Button>
                        <p className="text-xs text-muted-foreground">{new Date(jp.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interviews">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">{t("hr.interviewPipeline", { count: interviews.length })}</h3>
            {interviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noInterviewsYet")}</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv, i) => {
                  const student = candidates.find(c => c.user_id === iv.student_user_id);
                  const whenLabel = iv.scheduled_at
                    ? new Date(iv.scheduled_at).toLocaleString(isArabic ? "ar-SA" : "en-US", { dateStyle: "medium", timeStyle: "short" })
                    : t("interview.notScheduled");
                  const canSchedule = iv.status === "accepted" || iv.status === "requested" || iv.status === "scheduled";
                  return (
                    <motion.div key={iv.id} className="rounded-lg border p-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div className={`flex flex-col gap-3 ${isArabic ? "sm:flex-row-reverse sm:items-center text-right" : "sm:flex-row sm:items-center"} sm:justify-between`}>
                        <div className="flex-1 min-w-0">
                          <div className={`flex flex-wrap items-center gap-2 ${isArabic ? "justify-end" : ""}`}>
                            <p className="font-medium text-sm">{student?.profiles?.full_name || t("hr.student")}</p>
                            <Badge variant={
                              iv.status === "requested" ? "default" :
                              iv.status === "scheduled" ? "default" :
                              iv.status === "accepted" ? "secondary" :
                              iv.status === "declined" ? "destructive" : "outline"
                            } className="text-[10px]">{statusLabel(iv.status)}</Badge>
                            {iv.meeting_provider && (
                              <Badge variant="outline" className="text-[10px]">{t("interview.viaProvider", { provider: iv.meeting_provider })}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{iv.job_title || "—"}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 inline ltr:mr-1 rtl:ml-1" />
                            {iv.scheduled_at ? `${t("interview.scheduledFor")}: ${whenLabel}` : whenLabel}
                          </p>
                          {iv.meeting_url && (
                            <a href={iv.meeting_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline break-all inline-flex items-center gap-1 mt-1">
                              <LinkIcon className="h-3 w-3" />
                              {iv.meeting_url}
                            </a>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                          {student && <p className="font-bold text-primary text-sm">{Math.round(student.ers_score || 0)} ERS</p>}
                          {iv.meeting_url && (
                            <a href={iv.meeting_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">
                                <Send className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("interview.joinMeeting")}
                              </Button>
                            </a>
                          )}
                          {canSchedule && student && (
                            <Button size="sm" onClick={() => openInterviewDialog(student, iv)}>
                              <Calendar className="h-4 w-4 ltr:mr-1 rtl:ml-1" />
                              {iv.scheduled_at && iv.meeting_url ? t("common.edit") : t("interview.scheduleFromAccepted")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-primary/5 p-6 md:col-span-2">
              <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t("hr.marketValidation")}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">{t("hr.marketValidationDesc")}</p>
              <MarketTrustPanel />
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">{t("hr.recruiterActivity")}</h3>
              <div className="space-y-4">
                {[
                  { label: t("hr.candidatesViewed"), value: candidates.length },
                  { label: t("hr.shortlisted"), value: shortlists.length },
                  { label: t("hr.interviewsRequested"), value: interviews.length },
                  { label: t("hr.interviewsAccepted"), value: interviews.filter(i => i.status === "accepted").length },
                  { label: t("hr.avgERSShortlisted"), value: (() => {
                    const slStudents = shortlists.map(s => candidates.find(c => c.user_id === s.student_user_id)).filter(Boolean);
                    return slStudents.length > 0 ? Math.round(slStudents.reduce((a, s) => a + (s?.ers_score || 0), 0) / slStudents.length) : 0;
                  })() },
                ].map(m => (
                  <div key={m.label} className="flex justify-between items-center">
                    <span className="text-sm">{m.label}</span>
                    <span className="font-bold text-primary">{m.value}</span>
                  </div>
                ))}
              </div>
              {interviews.filter(i => i.status === "accepted").length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-[hsl(var(--success))]/5 border border-[hsl(var(--success))]/20">
                  <p className="text-xs text-[hsl(var(--success))]">💡 {t("hr.highERSTip")}</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">{t("hr.ersDistribution")}</h3>
              <div className="space-y-3">
                {[
                  { range: "90-100", count: candidates.filter(s => s.ers_score >= 90).length },
                  { range: "80-89", count: candidates.filter(s => s.ers_score >= 80 && s.ers_score < 90).length },
                  { range: "70-79", count: candidates.filter(s => s.ers_score >= 70 && s.ers_score < 80).length },
                  { range: "60-69", count: candidates.filter(s => s.ers_score >= 60 && s.ers_score < 70).length },
                  { range: "<60", count: candidates.filter(s => s.ers_score < 60).length },
                ].map(d => (
                  <div key={d.range}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ERS {d.range}</span>
                      <span className="font-semibold">{d.count}</span>
                    </div>
                    <Progress value={candidates.length > 0 ? (d.count / candidates.length) * 100 : 0} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 md:col-span-2">
              <h3 className="font-semibold font-heading mb-4">{t("hr.topMajorsByERS")}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...new Set(candidates.map(c => c.major))].map(major => {
                  const group = candidates.filter(c => c.major === major);
                  const avg = Math.round(group.reduce((a, s) => a + (s.ers_score || 0), 0) / group.length);
                  return { major, avg, count: group.length };
                }).sort((a, b) => b.avg - a.avg).slice(0, 9).map((m) => (
                  <div key={m.major} className={`flex items-center justify-between rounded-lg border p-3 ${isArabic ? "flex-row-reverse" : ""}`}>
                    <div>
                      <p className="text-sm font-medium">{m.major}</p>
                      <p className="text-xs text-muted-foreground">{t("uniDash.studentsLabel", { count: m.count })}</p>
                    </div>
                    <p className="font-bold text-primary">{m.avg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Profile Viewer Modal */}
      {viewingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingProfile(null)}>
          <motion.div className="bg-card rounded-xl border shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`flex items-center justify-between mb-4 ${isArabic ? "flex-row-reverse" : ""}`}>
              <h3 className="text-lg font-bold font-heading">{viewingProfile.profiles?.full_name || t("hr.studentProfile")}</h3>
              <Button size="sm" variant="ghost" onClick={() => setViewingProfile(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <ERSGauge score={Math.round(viewingProfile.ers_score || 0)} size={140} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{t("hr.filterUni")}</p><p className="text-sm font-medium">{viewingProfile.university}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{t("hr.filterMajor")}</p><p className="text-sm font-medium">{viewingProfile.major}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{t("hr.gpa")}</p><p className="text-sm font-medium">{viewingProfile.gpa}/{viewingProfile.gpa_scale === "5" ? "5.0" : "4.0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{t("hr.careerTarget")}</p><p className="text-sm font-medium">{viewingProfile.career_target || "—"}</p></div>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-2">{t("hr.scoreBreakdown")}</p>
                {[
                  { label: t("hr.academic"), value: viewingProfile.academic_score || 0 },
                  { label: t("hr.certifications"), value: viewingProfile.certification_score || 0 },
                  { label: t("hr.projects"), value: viewingProfile.project_score || 0 },
                  { label: t("hr.softSkills"), value: viewingProfile.soft_skills_score || 0 },
                  { label: t("hr.conduct"), value: viewingProfile.conduct_score || 0 },
                ].map(item => (
                  <div key={item.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{Math.round(item.value)}/100</span>
                    </div>
                    <Progress value={item.value} className="h-1.5" />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { const s = viewingProfile; setViewingProfile(null); openInterviewDialog(s); }}>
                  <Calendar className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.requestInterview")}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { setViewingProfile(null); setMessageDialog(viewingProfile); }}>
                  <MessageSquare className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.sendMessage")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Interview Request Dialog */}
      <Dialog open={!!interviewDialog} onOpenChange={() => setInterviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("hr.requestInterviewTitle")}</DialogTitle>
            <DialogDescription>{t("hr.requestInterviewDesc", { name: interviewDialog?.profiles?.full_name || t("hr.student") })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder={t("hr.jobTitlePosition")} value={interviewTitle} onChange={e => setInterviewTitle(e.target.value)} maxLength={200} />
            <Textarea placeholder={t("hr.jobDescNotes")} value={interviewDesc} onChange={e => setInterviewDesc(e.target.value)} maxLength={1000} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewDialog(null)}>{t("common.cancel")}</Button>
            <Button onClick={sendInterviewRequest}><Send className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.sendRequest")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={!!messageDialog} onOpenChange={() => setMessageDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("hr.messageStudent", { name: messageDialog?.profiles?.full_name || t("hr.student") })}</DialogTitle>
            <DialogDescription>{t("hr.messageStudentDesc")}</DialogDescription>
          </DialogHeader>
          <Textarea placeholder={t("hr.typeMessage")} value={messageText} onChange={e => setMessageText(e.target.value)} maxLength={2000} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(null)}>{t("common.cancel")}</Button>
            <Button onClick={sendMessage} disabled={!messageText.trim()}><Send className="h-4 w-4 ltr:mr-1 rtl:ml-1" />{t("hr.send")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Smart Match Results Dialog */}
      <Dialog open={smartMatchResults !== null} onOpenChange={() => { setSmartMatchResults(null); setSmartMatchJob(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              {t("hr.smartMatchResults")} {smartMatchJob && `— ${smartMatchJob.title}`}
            </DialogTitle>
            <DialogDescription>{t("hr.smartMatchDesc")}</DialogDescription>
          </DialogHeader>
          {smartMatchLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(smartMatchResults || []).map((c: any, i: number) => (
                <motion.div key={c.user_id} className={`flex items-center gap-4 rounded-lg border p-4 ${isArabic ? "flex-row-reverse text-right" : ""}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {c.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground">{c.university} · {c.major}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(c.fit?.matched_skills || []).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-[10px] bg-primary/10 text-primary">{s}</Badge>
                      ))}
                      {(c.fit?.matched_certs || []).map((ct: string) => (
                        <Badge key={ct} variant="secondary" className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">{ct}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{Math.round(c.fit?.fit_score || 0)}</p>
                    <p className="text-[10px] text-muted-foreground">{t("hr.jobFit")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{Math.round(c.ers_score || 0)}</p>
                    <p className="text-[10px] text-muted-foreground">ERS</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => { setSmartMatchResults(null); addToPipeline(c.user_id, smartMatchJob?.title); }}>
                      <Target className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setSmartMatchResults(null); openInterviewDialog({ user_id: c.user_id, profiles: { full_name: c.full_name } }); }}>
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {(smartMatchResults || []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">{t("hr.noMatchingCandidates")}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRDashboard;
