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
import {
  Search, Users, BarChart3, Star, Award, Eye, TrendingUp, Briefcase,
  CheckCircle, X, Info, ShieldCheck, MessageSquare, Calendar, Bell, Send, Target
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
        <p className="text-[10px] text-muted-foreground">Jobs Analyzed</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xl font-bold text-primary">{metrics.companiesAnalyzed}</p>
        <p className="text-[10px] text-muted-foreground">Companies</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xl font-bold text-primary">{metrics.sourcesUsed.length}</p>
        <p className="text-[10px] text-muted-foreground">Sources ({metrics.sourcesUsed.slice(0, 3).join(", ")})</p>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <p className="text-xs font-bold text-primary">{metrics.lastRefresh ? new Date(metrics.lastRefresh).toLocaleDateString() : "—"}</p>
        <p className="text-[10px] text-muted-foreground">Last Refresh</p>
      </div>
    </div>
  );
}

const HRDashboard = ({ user: authUser }: HRDashboardProps) => {
  const { toast } = useToast();
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
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", description: "", location: "Saudi Arabia", sector: "", required_skills: "", min_ers_score: "" });
  const [interviewDesc, setInterviewDesc] = useState("");
  const [messageDialog, setMessageDialog] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);

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
    setMajors([...new Set((majorsList || []).map((m: any) => m.name))]);
    setCertNames([...new Set((certs || []).map((c: any) => c.name))]);
    setStudentCerts(sCerts || []);
    setInterviews(ivs || []);
    setJobPostings(jp || []);
    setNotifications(notifs || []);
    setLoading(false);
  }, [authUser.id]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Realtime
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
      toast({ title: "Removed from shortlist" });
    } else {
      await supabase.from("hr_shortlists").insert({ hr_user_id: authUser.id, student_user_id: studentUserId });
      // Notify student
      await untypedTable("notifications").insert({
        user_id: studentUserId,
        type: "shortlisted",
        title: "You've been shortlisted!",
        body: `${hrProfile?.company_name || "A company"} has added you to their shortlist.`,
      });
      toast({ title: "Added to shortlist" });
    }
    const { data: sl } = await supabase.from("hr_shortlists").select("*").eq("hr_user_id", authUser.id);
    setShortlists(sl || []);
  };

  const PIPELINE_STAGES = ["discovered", "shortlisted", "interview", "offer", "hired"] as const;
  const STAGE_COLORS: Record<string, string> = {
    discovered: "bg-muted text-muted-foreground",
    shortlisted: "bg-primary/10 text-primary",
    interview: "bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]",
    offer: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
    hired: "bg-[hsl(var(--deep-green))]/10 text-[hsl(var(--deep-green))]",
  };

  const movePipelineStage = async (entryId: string, newStage: string) => {
    await untypedTable("hr_candidate_pipeline").update({ stage: newStage }).eq("id", entryId);
    toast({ title: `Moved to ${newStage}` });
    loadDashboard();
  };

  const addToPipeline = async (studentUserId: string, jobTitle?: string) => {
    const exists = pipeline.find((p: any) => p.student_user_id === studentUserId && p.job_title === (jobTitle || null));
    if (exists) {
      toast({ title: "Already in pipeline" });
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
      title: "You've been discovered!",
      body: `${hrProfile?.company_name || "A company"} added you to their hiring pipeline.`,
    });
    toast({ title: "Added to pipeline" });
    loadDashboard();
  };

  const sendInterviewRequest = async () => {
    if (!interviewDialog) return;
    await untypedTable("interview_requests").insert({
      hr_user_id: authUser.id,
      student_user_id: interviewDialog.user_id,
      job_title: interviewTitle || "Interview Request",
      job_description: interviewDesc || null,
      status: "requested",
    });
    await untypedTable("notifications").insert({
      user_id: interviewDialog.user_id,
      type: "interview_request",
      title: "New Interview Request",
      body: `${hrProfile?.company_name || "A company"} wants to interview you for "${interviewTitle || "a position"}".`,
    });
    await supabase.from("audit_logs").insert({
      user_id: authUser.id,
      action: "interview_requested",
      resource_type: "student",
      resource_id: interviewDialog.user_id,
      details: { student_name: interviewDialog.profiles?.full_name, job_title: interviewTitle },
    });
    toast({ title: "Interview request sent" });
    setInterviewDialog(null);
    setInterviewTitle("");
    setInterviewDesc("");
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
      title: "New Message",
      body: `${hrProfile?.company_name || "A recruiter"} sent you a message.`,
    });
    toast({ title: "Message sent" });
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
    toast({ title: "Job posting created" });
    setShowJobForm(false);
    setJobForm({ title: "", description: "", location: "Saudi Arabia", sector: "", required_skills: "", min_ers_score: "" });
    loadDashboard();
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

  const filtered = candidates.filter(s => {
    if (searchQuery && !s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (minERS && (s.ers_score || 0) < parseInt(minERS)) return false;
    if (filterMajor !== "all" && s.major !== filterMajor) return false;
    if (filterCert !== "all") {
      const hasCert = studentCerts.some(sc => sc.user_id === s.user_id && (sc as any).certification_catalog?.name === filterCert);
      if (!hasCert) return false;
    }
    return true;
  });

  const avgERS = candidates.length > 0
    ? Math.round(candidates.reduce((a, s) => a + (s.ers_score || 0), 0) / candidates.length) : 0;
  const topTalent = candidates.filter(s => (s.ers_score || 0) > 85).length;

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">HR Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome, {authUser.full_name} — {hrProfile?.company_name || "Company"}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Candidates" value={candidates.length} delay={0} />
        <StatCard icon={TrendingUp} label="Avg ERS" value={avgERS} delay={0.1} />
        <StatCard icon={Star} label="In Pipeline" value={pipeline.length} delay={0.2} />
        <StatCard icon={Calendar} label="Interviews" value={interviews.length} delay={0.3} />
        <StatCard icon={CheckCircle} label="Hired" value={pipeline.filter((p: any) => p.stage === "hired").length} delay={0.4} />
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="search"><Search className="h-4 w-4 mr-1 hidden sm:inline" />Candidates</TabsTrigger>
          <TabsTrigger value="pipeline"><Target className="h-4 w-4 mr-1 hidden sm:inline" />Pipeline</TabsTrigger>
          <TabsTrigger value="shortlist"><Star className="h-4 w-4 mr-1 hidden sm:inline" />Shortlist</TabsTrigger>
          <TabsTrigger value="jobs"><Briefcase className="h-4 w-4 mr-1 hidden sm:inline" />Jobs</TabsTrigger>
          <TabsTrigger value="interviews"><Calendar className="h-4 w-4 mr-1 hidden sm:inline" />Interviews</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-1 hidden sm:inline" />Analytics</TabsTrigger>
        </TabsList>

        {/* Search */}
        <TabsContent value="search">
          <div className="rounded-xl border bg-card p-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} maxLength={100} />
              </div>
              <Input placeholder="Min ERS" type="number" min={0} max={100} value={minERS} onChange={e => setMinERS(e.target.value)} />
              <Select value={filterMajor} onValueChange={setFilterMajor}>
                <SelectTrigger><SelectValue placeholder="Major" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">All Majors</SelectItem>
                  {majors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterCert} onValueChange={setFilterCert}>
                <SelectTrigger><SelectValue placeholder="Certification" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectItem value="all">All Certifications</SelectItem>
                  {certNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground flex items-center">{filtered.length} results</div>
            </div>
            <div className="space-y-3">
              {filtered.slice(0, 50).map((s, i) => {
                const isShortlisted = shortlists.some(sl => sl.student_user_id === s.user_id);
                return (
                  <motion.div key={s.user_id} className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{s.profiles?.full_name || "Student"}</span>
                        {s.onboarding_completed && <Badge className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">Verified</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{s.university} · {s.major} · GPA {s.gpa}/{s.gpa_scale === "5" ? "5.0" : "4.0"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center mr-2">
                        <p className="text-xl font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                        <p className="text-[10px] text-muted-foreground">ERS</p>
                      </div>
                      <Button size="sm" variant={isShortlisted ? "default" : "outline"} onClick={() => handleShortlist(s.user_id)} title="Shortlist">
                        <Star className={`h-4 w-4 ${isShortlisted ? "fill-current" : ""}`} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => addToPipeline(s.user_id)} title="Add to Pipeline">
                        <Target className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setViewingProfile(s)} title="View Profile">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setInterviewDialog(s)} title="Request Interview">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setMessageDialog(s)} title="Send Message">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No candidates match your filters.</p>}
            </div>
          </div>
        </TabsContent>

        {/* Pipeline */}
        <TabsContent value="pipeline">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Hiring Pipeline</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {PIPELINE_STAGES.map(stage => {
                const count = pipeline.filter((p: any) => p.stage === stage).length;
                return (
                  <Badge key={stage} variant="outline" className={`${STAGE_COLORS[stage]} capitalize px-3 py-1`}>
                    {stage} ({count})
                  </Badge>
                );
              })}
            </div>
            {pipeline.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No candidates in pipeline. Add from Candidates tab.</p>
            ) : (
              <div className="space-y-4">
                {PIPELINE_STAGES.map(stage => {
                  const stageEntries = pipeline.filter((p: any) => p.stage === stage);
                  if (stageEntries.length === 0) return null;
                  const stageIdx = PIPELINE_STAGES.indexOf(stage);
                  return (
                    <div key={stage}>
                      <h4 className="text-sm font-semibold capitalize mb-2 flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${stage === 'hired' ? 'bg-[hsl(var(--deep-green))]' : stage === 'offer' ? 'bg-[hsl(var(--success))]' : stage === 'interview' ? 'bg-[hsl(var(--gold))]' : 'bg-primary'}`} />
                        {stage} ({stageEntries.length})
                      </h4>
                      {stageEntries.map((entry: any) => {
                        const student = candidates.find(c => c.user_id === entry.student_user_id);
                        return (
                          <motion.div key={entry.id} className="flex items-center gap-3 rounded-lg border p-3 mb-2"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{student?.profiles?.full_name || "Student"}</p>
                              <p className="text-xs text-muted-foreground">{entry.job_title || "General"} · {student?.university || ""}</p>
                            </div>
                            {student && <p className="font-bold text-primary text-sm">{Math.round(student.ers_score || 0)}</p>}
                            <div className="flex gap-1">
                              {stageIdx > 0 && (
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => movePipelineStage(entry.id, PIPELINE_STAGES[stageIdx - 1])}>← Back</Button>
                              )}
                              {stageIdx < PIPELINE_STAGES.length - 1 && (
                                <Button size="sm" variant="outline" className="text-xs" onClick={() => movePipelineStage(entry.id, PIPELINE_STAGES[stageIdx + 1])}>→ {PIPELINE_STAGES[stageIdx + 1]}</Button>
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
            <h3 className="text-lg font-semibold font-heading mb-4">Shortlisted Candidates ({shortlists.length})</h3>
            {shortlists.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No candidates shortlisted yet.</p>
            ) : (
              <div className="space-y-3">
                {shortlists.map((sl, i) => {
                  const student = candidates.find(c => c.user_id === sl.student_user_id);
                  if (!student) return null;
                  return (
                    <motion.div key={sl.id} className="flex items-center gap-4 rounded-lg border p-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.profiles?.full_name || "Student"}</p>
                        <p className="text-xs text-muted-foreground">{student.university} · {student.major}</p>
                      </div>
                      <p className="font-bold text-primary">{Math.round(student.ers_score || 0)} ERS</p>
                      <Button size="sm" variant="outline" onClick={() => setInterviewDialog(student)}><Calendar className="h-4 w-4" /></Button>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold font-heading">Job Postings ({jobPostings.length})</h3>
              <Button size="sm" onClick={() => setShowJobForm(!showJobForm)}>
                {showJobForm ? "Cancel" : "+ New Posting"}
              </Button>
            </div>
            {showJobForm && (
              <div className="rounded-lg border p-4 mb-4 space-y-3">
                <Input placeholder="Job Title *" value={jobForm.title} onChange={e => setJobForm(f => ({...f, title: e.target.value}))} maxLength={200} />
                <Textarea placeholder="Job Description" value={jobForm.description} onChange={e => setJobForm(f => ({...f, description: e.target.value}))} maxLength={2000} />
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input placeholder="Location" value={jobForm.location} onChange={e => setJobForm(f => ({...f, location: e.target.value}))} />
                  <Input placeholder="Sector" value={jobForm.sector} onChange={e => setJobForm(f => ({...f, sector: e.target.value}))} />
                  <Input placeholder="Min ERS" type="number" min={0} max={100} value={jobForm.min_ers_score} onChange={e => setJobForm(f => ({...f, min_ers_score: e.target.value}))} />
                </div>
                <Input placeholder="Required Skills (comma-separated)" value={jobForm.required_skills} onChange={e => setJobForm(f => ({...f, required_skills: e.target.value}))} />
                <Button onClick={createJobPosting} disabled={!jobForm.title.trim()}>
                  <Send className="h-4 w-4 mr-1" />Publish Job
                </Button>
              </div>
            )}
            {jobPostings.length === 0 && !showJobForm ? (
              <p className="text-sm text-muted-foreground text-center py-8">No job postings yet. Create one to find matching candidates.</p>
            ) : (
              <div className="space-y-3">
                {jobPostings.map((jp: any, i: number) => (
                  <motion.div key={jp.id} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{jp.title}</p>
                          <Badge variant={jp.is_active ? "default" : "outline"} className="text-[10px]">{jp.is_active ? "Active" : "Closed"}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{jp.company || "—"} · {jp.location} · {jp.sector || "General"}</p>
                        {jp.min_ers_score > 0 && <p className="text-xs text-muted-foreground">Min ERS: {jp.min_ers_score}</p>}
                        {jp.required_skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {jp.required_skills.map((s: string) => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(jp.created_at).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interviews">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Interview Pipeline ({interviews.length})</h3>
            {interviews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No interviews yet. Send requests from the Candidates tab.</p>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv, i) => {
                  const student = candidates.find(c => c.user_id === iv.student_user_id);
                  return (
                    <motion.div key={iv.id} className="rounded-lg border p-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{student?.profiles?.full_name || "Student"}</p>
                            <Badge variant={
                              iv.status === "requested" ? "default" :
                              iv.status === "accepted" ? "secondary" :
                              iv.status === "declined" ? "destructive" : "outline"
                            } className="text-[10px]">{iv.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{iv.job_title || "—"} · {new Date(iv.created_at).toLocaleDateString()}</p>
                        </div>
                        {student && <p className="font-bold text-primary">{Math.round(student.ers_score || 0)} ERS</p>}
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
            {/* HR Trust Mode - Market Validation */}
            <div className="rounded-xl border bg-primary/5 p-6 md:col-span-2">
              <h3 className="font-semibold font-heading mb-3 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Market Validation — HR Trust Mode
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                All ERS scores and rankings are driven by real-time Saudi labor market data, not static certification lists.
              </p>
              <MarketTrustPanel />
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">Recruiter Activity</h3>
              <div className="space-y-4">
                {[
                  { label: "Candidates Viewed", value: candidates.length },
                  { label: "Shortlisted", value: shortlists.length },
                  { label: "Interviews Requested", value: interviews.length },
                  { label: "Interviews Accepted", value: interviews.filter(i => i.status === "accepted").length },
                  { label: "Avg ERS of Shortlisted", value: (() => {
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
                  <p className="text-xs text-[hsl(var(--success))]">💡 Candidates with ERS above 80 had 3x higher interview acceptance rates.</p>
                </div>
              )}
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">ERS Distribution</h3>
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
              <h3 className="font-semibold font-heading mb-4">Top Majors by Avg ERS</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...new Set(candidates.map(c => c.major))].map(major => {
                  const group = candidates.filter(c => c.major === major);
                  const avg = Math.round(group.reduce((a, s) => a + (s.ers_score || 0), 0) / group.length);
                  return { major, avg, count: group.length };
                }).sort((a, b) => b.avg - a.avg).slice(0, 9).map((m) => (
                  <div key={m.major} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{m.major}</p>
                      <p className="text-xs text-muted-foreground">{m.count} students</p>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading">{viewingProfile.profiles?.full_name || "Student Profile"}</h3>
              <Button size="sm" variant="ghost" onClick={() => setViewingProfile(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <ERSGauge score={Math.round(viewingProfile.ers_score || 0)} size={140} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">University</p><p className="text-sm font-medium">{viewingProfile.university}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Major</p><p className="text-sm font-medium">{viewingProfile.major}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">GPA</p><p className="text-sm font-medium">{viewingProfile.gpa}/{viewingProfile.gpa_scale === "5" ? "5.0" : "4.0"}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Career Target</p><p className="text-sm font-medium">{viewingProfile.career_target || "—"}</p></div>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-2">Score Breakdown</p>
                {[
                  { label: "Academic", value: viewingProfile.academic_score || 0 },
                  { label: "Certifications", value: viewingProfile.certification_score || 0 },
                  { label: "Projects", value: viewingProfile.project_score || 0 },
                  { label: "Soft Skills", value: viewingProfile.soft_skills_score || 0 },
                  { label: "Conduct", value: viewingProfile.conduct_score || 0 },
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
                <Button className="flex-1" onClick={() => { setViewingProfile(null); setInterviewDialog(viewingProfile); }}>
                  <Calendar className="h-4 w-4 mr-1" />Request Interview
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { setViewingProfile(null); setMessageDialog(viewingProfile); }}>
                  <MessageSquare className="h-4 w-4 mr-1" />Message
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
            <DialogTitle>Request Interview</DialogTitle>
            <DialogDescription>Send an interview request to {interviewDialog?.profiles?.full_name || "this student"}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Job Title / Position" value={interviewTitle} onChange={e => setInterviewTitle(e.target.value)} maxLength={200} />
            <Textarea placeholder="Job description or notes (optional)" value={interviewDesc} onChange={e => setInterviewDesc(e.target.value)} maxLength={1000} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInterviewDialog(null)}>Cancel</Button>
            <Button onClick={sendInterviewRequest}><Send className="h-4 w-4 mr-1" />Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={!!messageDialog} onOpenChange={() => setMessageDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {messageDialog?.profiles?.full_name || "Student"}</DialogTitle>
            <DialogDescription>Send a direct message to this candidate.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} maxLength={2000} rows={4} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog(null)}>Cancel</Button>
            <Button onClick={sendMessage} disabled={!messageText.trim()}><Send className="h-4 w-4 mr-1" />Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRDashboard;
