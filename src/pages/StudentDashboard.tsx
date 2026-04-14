import { useState, useEffect, useCallback } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import { fetchStudentDashboard, calculateERSFromData, fetchLeaderboard } from "@/lib/supabaseData";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import {
  Trophy, Target, Briefcase, Map, Bell, Upload, Award,
  TrendingUp, Star, CheckCircle, Circle, Clock, Info,
  MessageSquare, Calendar, User, Link as LinkIcon, Share2, Copy,
  GraduationCap, ExternalLink, Send
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
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderFilter, setLeaderFilter] = useState<"global" | "university" | "major">("global");
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [jobCache, setJobCache] = useState<any[]>([]);
  const [certCatalog, setCertCatalog] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

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

  // Realtime notifications
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
    supabase.from("certification_catalog").select("*").order("category")
      .then(({ data }) => setCertCatalog(data || []));
    untypedTable("student_badges").select("*").eq("user_id", authUser.id).order("earned_at", { ascending: false })
      .then(({ data }: any) => setBadges(data || []));
    untypedTable("activity_feed").select("*").order("created_at", { ascending: false }).limit(20)
      .then(({ data }: any) => setActivityFeed(data || []));
    untypedTable("job_postings").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(50)
      .then(({ data }: any) => setJobPostings(data || []));
    untypedTable("applications").select("*").eq("student_user_id", authUser.id)
      .then(({ data }: any) => setApplications(data || []));
  }, [authUser.id]);

  const handleApply = async (jobPostingId: string) => {
    if (applications.some(a => a.job_posting_id === jobPostingId)) {
      toast({ title: t("dash.alreadyApplied") }); return;
    }
    setApplyingTo(jobPostingId);
    try {
      const { error } = await untypedTable("applications").insert({
        student_user_id: authUser.id,
        job_posting_id: jobPostingId,
        status: "applied",
      });
      if (error) throw error;
      setApplications(prev => [...prev, { student_user_id: authUser.id, job_posting_id: jobPostingId, status: "applied" }]);
      toast({ title: t("dash.applicationSent") });
    } catch (e: any) {
      toast({ title: t("dash.uploadFailed"), description: e.message, variant: "destructive" });
    }
    setApplyingTo(null);
  };

  const handleFileUpload = useCallback((type: "transcript" | "certificate" | "project") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.png,.jpg,.jpeg";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { toast({ title: "File too large", description: "Max 10MB", variant: "destructive" }); return; }
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "png", "jpg", "jpeg"].includes(ext || "")) { toast({ title: "Invalid format", description: "Only PDF, PNG, JPG", variant: "destructive" }); return; }

      const path = `${authUser.id}/${type}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return; }

      if (type === "transcript") {
        await supabase.from("transcript_uploads").insert({ user_id: authUser.id, file_path: path });
      } else if (type === "certificate") {
        await supabase.from("student_certifications").insert({ user_id: authUser.id, custom_name: file.name.replace(/\.[^.]+$/, ""), file_path: path });
      } else if (type === "project") {
        const title = file.name.replace(/\.[^.]+$/, "");
        await supabase.from("student_projects").insert({ user_id: authUser.id, title, file_path: path });
      }
      toast({ title: "Uploaded", description: `${type} uploaded successfully. Pending verification.` });
      loadDashboard();
    };
    input.click();
  }, [authUser.id, toast, loadDashboard]);

  const handleInterviewResponse = async (id: string, response: "accepted" | "declined") => {
    await untypedTable("interview_requests").update({ status: response, student_response: response, updated_at: new Date().toISOString() }).eq("id", id);
    toast({ title: `Interview ${response}` });
    loadDashboard();
  };

  const markNotificationsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await untypedTable("notifications").update({ read: true }).in("id", unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
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

  const sp = dashData?.studentProfile;
  const ers = calculateERSFromData(dashData || {});
  const myRank = leaderboard.findIndex(s => s.user_id === authUser.id) + 1;

  // Profile completeness
  const completenessChecks = [
    { label: "Profile Name", done: !!authUser.full_name },
    { label: "University", done: !!sp?.university },
    { label: "Major", done: !!sp?.major },
    { label: "GPA", done: (sp?.gpa || 0) > 0 },
    { label: "Transcript", done: (dashData?.certifications?.length || 0) > 0 || (dashData?.projects?.length || 0) > 0 },
    { label: "Certifications", done: (dashData?.certifications?.length || 0) > 0 },
    { label: "Projects", done: (dashData?.projects?.length || 0) > 0 },
    { label: "Skills", done: (dashData?.skills?.length || 0) > 0 },
    { label: "Career Target", done: !!sp?.career_target },
  ];
  const completeness = Math.round((completenessChecks.filter(c => c.done).length / completenessChecks.length) * 100);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Welcome, {authUser.full_name}</h1>
          <p className="text-muted-foreground text-sm">
            {sp?.university || "—"} · {sp?.major || "—"} · GPA {sp?.gpa || "N/A"}/{sp?.gpa_scale === "5" ? "5.0" : "4.0"}
            {sp?.career_target && <span className="ml-2 text-primary font-medium">· Target: {sp.career_target}</span>}
          </p>
          {(sp?.github_url || sp?.linkedin_url || sp?.portfolio_url) && (
            <div className="flex gap-3 mt-1">
              {sp?.github_url && <a href={sp.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />GitHub</a>}
              {sp?.linkedin_url && <a href={sp.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />LinkedIn</a>}
              {sp?.portfolio_url && <a href={sp.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" />Portfolio</a>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/profile/${authUser.id}`);
            toast({ title: "Profile link copied!" });
          }}>
            <Share2 className="h-4 w-4 mr-1" />Share
          </Button>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Profile</p>
            <p className="text-sm font-semibold">{completeness}%</p>
          </div>
          <Progress value={completeness} className="h-2 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="ERS Score" value={ers.total} delay={0} />
        <StatCard icon={Trophy} label="Rank" value={myRank > 0 ? `#${myRank}` : "—"} delay={0.1} />
        <StatCard icon={Award} label="Certifications" value={dashData?.certifications?.length || 0} delay={0.2} />
        <StatCard icon={Briefcase} label="Interviews" value={interviews.length} delay={0.3} />
      </div>

      <Tabs defaultValue="ers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="ers"><Target className="h-4 w-4 mr-1 hidden sm:inline" />ERS</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="h-4 w-4 mr-1 hidden sm:inline" />Rank</TabsTrigger>
          <TabsTrigger value="uploads"><Upload className="h-4 w-4 mr-1 hidden sm:inline" />Docs</TabsTrigger>
          <TabsTrigger value="opportunities" className="relative">
            <Briefcase className="h-4 w-4 mr-1 hidden sm:inline" />Opps
            {interviews.filter(i => i.status === "requested").length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {interviews.filter(i => i.status === "requested").length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="roadmap"><Map className="h-4 w-4 mr-1 hidden sm:inline" />Road</TabsTrigger>
          <TabsTrigger value="jobs"><TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />Jobs</TabsTrigger>
          <TabsTrigger value="skills"><Star className="h-4 w-4 mr-1 hidden sm:inline" />Skills</TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-4 w-4 mr-1 hidden sm:inline" />Alerts
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
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
              {myRank > 0 && <p className="mt-2 text-sm text-muted-foreground">Rank #{myRank}</p>}
              {ers.breakdown.synergyBonus > 0 && (
                <Badge className="mt-2 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]">
                  <Star className="h-3 w-3 mr-1" />+{ers.breakdown.synergyBonus}% Synergy
                </Badge>
              )}
              {ers.breakdown.nationalReadiness > 0 && (
                <Badge className="mt-1 bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] shadow-[0_0_8px_hsl(var(--gold)/0.3)]">
                  <Star className="h-3 w-3 mr-1" />+{ers.breakdown.nationalReadiness}% National
                </Badge>
              )}
              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {badges.map(b => (
                    <Badge key={b.id} variant="secondary" className="text-[10px]">
                      <span className="mr-1">{b.badge_icon}</span>{b.badge_label}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Profile Completeness */}
              <div className="w-full mt-4 border-t pt-4">
                <p className="text-xs font-semibold mb-2">Profile Completeness</p>
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
                  <h3 className="font-semibold font-heading">Explainable Score Breakdown</h3>
                  <Tooltip>
                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Every score component is transparent. Weights adjust based on your major track. Verified documents score higher.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Academic Performance", value: ers.breakdown.academic || 0, weight: ers.explanation?.weights?.academic ? `${Math.round(ers.explanation.weights.academic * 100)}%` : "40%", color: "bg-primary" },
                    { label: "Certifications", value: ers.breakdown.certification || 0, weight: ers.explanation?.weights?.cert ? `${Math.round(ers.explanation.weights.cert * 100)}%` : "25%", color: "bg-[hsl(var(--success))]" },
                    { label: "Projects", value: ers.breakdown.project || 0, weight: ers.explanation?.weights?.project ? `${Math.round(ers.explanation.weights.project * 100)}%` : "15%", color: "bg-secondary" },
                    { label: "Soft Skills", value: ers.breakdown.softSkills || 0, weight: ers.explanation?.weights?.soft ? `${Math.round(ers.explanation.weights.soft * 100)}%` : "10%", color: "bg-accent-foreground" },
                    { label: "Conduct & Attendance", value: ers.breakdown.conduct || 0, weight: ers.explanation?.weights?.conduct ? `${Math.round(ers.explanation.weights.conduct * 100)}%` : "10%", color: "bg-[hsl(var(--primary))]" },
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
                      <span>Skill Decay Applied</span>
                      <span>-{ers.breakdown.decayApplied}%</span>
                    </div>
                  )}
                </div>
                {ers.explanation?.major_category && (
                  <p className="text-xs text-muted-foreground mt-4 border-t pt-3">
                    Major Track: <span className="font-semibold capitalize">{ers.explanation.major_category}</span> — weights customized for your field
                  </p>
                )}
              </div>
              <div className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold font-heading mb-3">Certifications</h3>
                {dashData?.certifications?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dashData.certifications.map((c: any) => (
                      <Badge key={c.id} variant="secondary" className={c.verified ? "" : "opacity-60"}>
                        <Award className="h-3 w-3 mr-1" />
                        {c.certification_catalog?.name || c.custom_name || "Certificate"}
                        {c.verified && <CheckCircle className="h-3 w-3 ml-1 text-[hsl(var(--success))]" />}
                        {c.certification_catalog?.is_hadaf_reimbursed && (
                          <span className="ml-1 text-[10px] text-[hsl(var(--primary))]">🇸🇦 Hadaf</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No certifications yet. Upload to boost your ERS.</p>}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-lg font-semibold font-heading">Leaderboard</h3>
              <div className="flex gap-2">
                {(["global", "university", "major"] as const).map(f => (
                  <Button key={f} size="sm" variant={leaderFilter === f ? "default" : "outline"} onClick={() => setLeaderFilter(f)} className="capitalize text-xs">{f}</Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {leaderboard.map((s, i) => (
                <motion.div key={s.user_id}
                  className={`flex items-center gap-4 rounded-lg p-3 ${s.user_id === authUser.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"}`}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <span className={`w-8 text-center font-bold text-lg ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.full_name}</p>
                    <p className="text-xs text-muted-foreground">{s.university} · {s.major}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                    <p className="text-xs text-muted-foreground">ERS</p>
                  </div>
                </motion.div>
              ))}
              {leaderboard.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No students found.</p>}
            </div>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="uploads">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Upload Documents</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("transcript")}>
                <Upload className="h-5 w-5 mr-2" /> Upload Transcript
              </Button>
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("certificate")}>
                <Upload className="h-5 w-5 mr-2" /> Upload Certificate
              </Button>
              <Button variant="outline" className="h-20 border-dashed" onClick={() => handleFileUpload("project")}>
                <Upload className="h-5 w-5 mr-2" /> Upload Project
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Accepted: PDF, PNG, JPEG · Max 10 MB · Documents require verification</p>

            <h4 className="font-semibold mt-6 mb-3">Projects</h4>
            {dashData?.projects?.length > 0 ? (
              <div className="space-y-2">
                {dashData.projects.map((p: any) => (
                  <div key={p.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <CheckCircle className={`h-4 w-4 mt-0.5 shrink-0 ${p.verified ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`} />
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                    </div>
                    {p.verified ? <Badge className="ml-auto text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">Verified</Badge> : <Badge variant="outline" className="ml-auto text-[10px]">Pending</Badge>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </div>
        </TabsContent>

        {/* Opportunities - Interview Requests */}
        <TabsContent value="opportunities">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Interview Requests & Opportunities</h3>
            {interviews.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No interview requests yet. Keep improving your ERS to attract recruiters!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv, i) => (
                  <motion.div key={iv.id} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{iv.job_title || "Interview Request"}</p>
                          <Badge variant={
                            iv.status === "requested" ? "default" :
                            iv.status === "accepted" ? "secondary" :
                            iv.status === "declined" ? "destructive" : "outline"
                          } className="text-[10px]">{iv.status}</Badge>
                        </div>
                        {iv.job_description && <p className="text-xs text-muted-foreground mt-1">{iv.job_description}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(iv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {iv.status === "requested" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleInterviewResponse(iv.id, "accepted")}>
                            <CheckCircle className="h-4 w-4 mr-1" />Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleInterviewResponse(iv.id, "declined")}>
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Job matches based on profile */}
            <h4 className="font-semibold mt-8 mb-3">Recommended Opportunities</h4>
            {jobCache.length > 0 ? (
              <div className="space-y-2">
                {jobCache.filter(job => {
                  const majorLower = (sp?.major || "").toLowerCase();
                  const sectorLower = (job.sector || "").toLowerCase();
                  return sectorLower.includes(majorLower.split(" ")[0]) || majorLower.includes(sectorLower.split(" ")[0]) || true;
                }).slice(0, 10).map((job: any) => (
                  <div key={job.id} className="rounded-lg border p-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company || "—"} · {job.location} · {job.sector}</p>
                      {job.required_skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.required_skills.slice(0, 4).map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>
                      )}
                    </div>
                    {job.source_url && (
                      <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">View</Button>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No opportunities available yet.</p>}
          </div>
        </TabsContent>

        {/* Roadmap - AI Career Intelligence */}
        <TabsContent value="roadmap">
          <CareerRoadmap userId={authUser.id} currentCareerTarget={sp?.career_target} />
        </TabsContent>

        {/* Jobs */}
        <TabsContent value="jobs">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-2">Job Market Insights</h3>
            <p className="text-sm text-muted-foreground mb-4">Live job postings from the Saudi market relevant to your profile.</p>
            {jobCache.length > 0 ? (
              <div className="space-y-3">
                {jobCache.map((job: any) => (
                  <div key={job.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.company || "—"} · {job.location} · {job.sector}</p>
                        {job.experience_level && <Badge variant="outline" className="text-[10px] mt-1">{job.experience_level}</Badge>}
                      </div>
                      {job.source_url && (
                        <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">View</Button>
                        </a>
                      )}
                    </div>
                    {(job.required_skills?.length > 0 || job.required_certifications?.length > 0) && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.required_skills?.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        {job.required_certifications?.map((c: string) => <Badge key={c} className="text-[10px] bg-primary/10 text-primary">{c}</Badge>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center py-8">No job data available yet.</p>}
          </div>
        </TabsContent>

        {/* Skills */}
        <TabsContent value="skills">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Skill Matrix</h3>
            {dashData?.skills?.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashData.skills.map((s: any) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <div className={`h-3 w-3 rounded-full ${
                      s.proficiency_level === "expert" ? "bg-[hsl(var(--success))]" :
                      s.proficiency_level === "advanced" ? "bg-primary" :
                      s.proficiency_level === "intermediate" ? "bg-[hsl(var(--primary))]" :
                      "bg-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.skill_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{s.proficiency_level} · {s.source}</p>
                    </div>
                    {s.verified && <CheckCircle className="h-4 w-4 text-[hsl(var(--success))]" />}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No skills added yet.</p>}
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading">Notifications</h3>
              {unreadCount > 0 && (
                <Button size="sm" variant="outline" onClick={markNotificationsRead}>Mark all read</Button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n, i) => (
                  <motion.div key={n.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${!n.read ? "bg-primary/5 border-primary/20" : ""}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <Bell className={`h-4 w-4 mt-0.5 shrink-0 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</p>
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
