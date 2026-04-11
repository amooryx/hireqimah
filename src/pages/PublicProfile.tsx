import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import ERSGauge from "@/components/ERSGauge";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import {
  Award, CheckCircle, Trophy, Share2, Star, Briefcase, BookOpen,
  ExternalLink, Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [ers, setErs] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const [{ data: prof }, { data: sp }, { data: ersData }, { data: sk }, { data: cr }, { data: pr }, { data: bd }] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url, email").eq("user_id", userId).single(),
        supabase.from("student_profiles").select("*").eq("user_id", userId).eq("visibility_public", true).single(),
        supabase.from("ers_scores").select("*").eq("user_id", userId).single(),
        supabase.from("skill_matrix").select("*").eq("user_id", userId),
        supabase.from("student_certifications").select("*, certification_catalog(name, category, is_hadaf_reimbursed)").eq("user_id", userId),
        supabase.from("student_projects").select("*").eq("user_id", userId),
        untypedTable("student_badges").select("*").eq("user_id", userId).order("earned_at", { ascending: false }),
      ]);
      setProfile(prof);
      setStudent(sp);
      setErs(ersData);
      setSkills(sk || []);
      setCerts(cr || []);
      setProjects(pr || []);
      setBadges(bd || []);
      setLoading(false);
    };
    load();
  }, [userId]);

  const shareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: "Share this profile anywhere." });
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-12 space-y-6">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-1"><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div>
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!student || !profile) {
    return (
      <div className="container max-w-3xl py-24 text-center">
        <h1 className="text-2xl font-bold font-heading mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground">This profile is private or does not exist.</p>
      </div>
    );
  }

  const totalScore = ers?.total_score || student.ers_score || 0;
  const explanation = ers?.explanation as any;

  return (
    <div className="container max-w-3xl py-8 space-y-8">
      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
          {profile.full_name?.charAt(0) || "S"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold font-heading">{profile.full_name}</h1>
            {student.onboarding_completed && (
              <Badge className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">
                <CheckCircle className="h-3 w-3 mr-1" />Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{student.university} · {student.major}</p>
          <p className="text-muted-foreground text-xs">GPA {student.gpa}/{student.gpa_scale === "5" ? "5.0" : "4.0"}
            {student.career_target && <span> · Target: {student.career_target}</span>}
          </p>
        </div>
        <Button variant="outline" onClick={shareProfile}>
          <Share2 className="h-4 w-4 mr-1" />Share
        </Button>
      </motion.div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map(b => (
            <Badge key={b.id} variant="secondary" className="text-xs">
              <span className="mr-1">{b.badge_icon}</span>{b.badge_label}
            </Badge>
          ))}
        </div>
      )}

      {/* ERS + Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div className="flex flex-col items-center rounded-xl border bg-card p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <ERSGauge score={Math.round(totalScore)} size={160} />
          <p className="text-xs text-muted-foreground mt-2">Employability Readiness Score</p>
          {explanation?.major_category && (
            <Badge variant="outline" className="mt-2 text-[10px] capitalize">{explanation.major_category} track</Badge>
          )}
        </motion.div>
        <div className="md:col-span-2 rounded-xl border bg-card p-6">
          <h3 className="font-semibold font-heading mb-4">Score Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Academic", value: ers?.academic_score || 0 },
              { label: "Certifications", value: ers?.certification_score || 0 },
              { label: "Projects", value: ers?.project_score || 0 },
              { label: "Soft Skills", value: ers?.soft_skills_score || 0 },
              { label: "Conduct", value: ers?.conduct_score || 0 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.label}</span>
                  <span className="font-semibold">{Math.round(item.value)}/100</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
            {(ers?.synergy_bonus || 0) > 0 && (
              <div className="flex justify-between text-sm text-[hsl(var(--success))]">
                <span>Cross-Sector Synergy</span><span>+{ers.synergy_bonus}%</span>
              </div>
            )}
            {(ers?.national_readiness_bonus || 0) > 0 && (
              <div className="flex justify-between text-sm text-[hsl(var(--primary))]">
                <span>National Readiness</span><span>+{ers.national_readiness_bonus}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold font-heading mb-3"><Star className="h-4 w-4 inline mr-2" />Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <Badge key={s.id} variant="secondary" className={s.verified ? "" : "opacity-60"}>
                {s.skill_name}
                {s.verified && <CheckCircle className="h-3 w-3 ml-1 text-[hsl(var(--success))]" />}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certs.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold font-heading mb-3"><Award className="h-4 w-4 inline mr-2" />Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {certs.map(c => (
              <Badge key={c.id} variant="secondary" className={c.verified ? "" : "opacity-60"}>
                <Award className="h-3 w-3 mr-1" />
                {c.certification_catalog?.name || c.custom_name || "Certificate"}
                {c.verified && <CheckCircle className="h-3 w-3 ml-1 text-[hsl(var(--success))]" />}
                {c.certification_catalog?.is_hadaf_reimbursed && <span className="ml-1 text-[10px] text-[hsl(var(--primary))]">🇸🇦</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="font-semibold font-heading mb-3"><Briefcase className="h-4 w-4 inline mr-2" />Projects</h3>
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="flex items-start gap-3 rounded-lg border p-3">
                <BookOpen className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                </div>
                {p.verified && <Badge className="ml-auto text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">Verified</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="text-center py-6 border-t">
        <p className="text-sm text-muted-foreground mb-2">Powered by HireQimah · Employability Intelligence Platform</p>
        <Button variant="outline" size="sm" onClick={shareProfile}>
          <Copy className="h-4 w-4 mr-1" />Copy Profile Link
        </Button>
      </div>
    </div>
  );
};

export default PublicProfile;
