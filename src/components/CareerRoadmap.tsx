import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fetchMarketSkillRankings, fetchMarketCertRankings } from "@/lib/supabaseData";
import { useToast } from "@/hooks/use-toast";
import {
  Map, Target, Award, Star, Briefcase, TrendingUp,
  ArrowRight, Loader2, AlertTriangle, Rocket,
  Code, BarChart3, Building2, Info
} from "lucide-react";

interface CareerRoadmapProps {
  userId: string;
  currentCareerTarget?: string;
}

export default function CareerRoadmap({ userId, currentCareerTarget }: CareerRoadmapProps) {
  const { toast } = useToast();
  const [careerTarget, setCareerTarget] = useState(currentCareerTarget || "");
  const [loading, setLoading] = useState(false);
  const [roleData, setRoleData] = useState<any>(null);
  const [studentGaps, setStudentGaps] = useState<any[]>([]);
  const [marketSkills, setMarketSkills] = useState<any[]>([]);
  const [marketCerts, setMarketCerts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchMarketSkillRankings(15, 30),
      fetchMarketCertRankings(10, 30),
    ]).then(([sd, cd]) => {
      setMarketSkills(sd);
      setMarketCerts(cd);
    });

    if (currentCareerTarget?.trim()) {
      setCareerTarget(currentCareerTarget);
      generateRoadmap(currentCareerTarget);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const generateRoadmap = async (target?: string) => {
    const finalTarget = target || careerTarget;
    if (!finalTarget.trim()) {
      toast({ title: "Enter a career target", variant: "destructive" });
      return;
    }
    setCareerTarget(finalTarget);
    setLoading(true);
    setRoleData(null);

    try {
      // Fetch role insights from market-intelligence + student gaps in parallel
      const [roleRes, gapsRes] = await Promise.all([
        supabase.functions.invoke("market-intelligence", {
          body: { action: "get-role-insights", role: finalTarget, days: 30 },
        }),
        supabase.functions.invoke("market-intelligence", {
          body: { action: "get-student-gaps", user_id: userId },
        }),
      ]);

      if (roleRes.data) setRoleData(roleRes.data);
      if (gapsRes.data) setStudentGaps(gapsRes.data.gaps || []);

      if (roleRes.data?.match_type === "none") {
        toast({
          title: "No market data found",
          description: `No jobs matching "${finalTarget}" in our dataset. Try a different role.`,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Compute skill gap overlay: which of the role's required skills does the student lack?
  const missingSkillSet = new Set(studentGaps.filter(g => g.is_missing).map(g => g.skill_name));
  const roleSkills = roleData?.skills || [];
  const roleCerts = roleData?.certifications || [];

  return (
    <div className="space-y-6">
      {/* Career Target Selector */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-base font-semibold font-heading mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Career Intelligence Engine
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Analyzes real Saudi job postings to show skills &amp; certifications demand for any role.
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter career target (e.g., Penetration Tester, Data Analyst)"
            value={careerTarget}
            onChange={(e) => setCareerTarget(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
          />
          <Button onClick={() => generateRoadmap()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Rocket className="h-4 w-4 mr-1" />}
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Software Engineer", "Cybersecurity Analyst", "Data Analyst", "Cloud Engineer", "AI Engineer", "DevOps Engineer", "SOC Analyst", "Penetration Tester", "Product Manager", "FinTech Developer"].map((career) => (
            <Button key={career} variant={careerTarget === career ? "default" : "outline"} size="sm" className="text-xs"
              onClick={() => generateRoadmap(career)} disabled={loading}>
              {career}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Querying market data for "{careerTarget}"...</p>
        </div>
      )}

      {/* Results */}
      {roleData && !loading && (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* Similarity fallback banner */}
          {roleData.match_type === "similar" && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-700">No exact data for "{roleData.searched_role}"</p>
                  <p className="text-xs text-muted-foreground mt-1">Showing nearest matches. Closest role: <span className="font-medium">{roleData.closest_role}</span></p>
                  {roleData.similar_roles?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {roleData.similar_roles.slice(0, 6).map((r: any) => (
                        <Badge key={r.role_title} variant="outline" className="text-[10px] cursor-pointer hover:bg-primary/10"
                          onClick={() => generateRoadmap(r.role_title)}>
                          {r.role_title} ({r.job_count})
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {roleData.match_type === "none" && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium">No data yet for "{roleData.searched_role}"</p>
              <p className="text-xs text-muted-foreground mt-1">This role isn't in our current dataset. Try a different target or check back after the next data refresh.</p>
            </div>
          )}

          {/* Summary stats */}
          {(roleData.match_type === "exact" || roleData.match_type === "similar") && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Briefcase className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleData.job_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Jobs Found</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Star className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleSkills.length}</p>
                  <p className="text-xs text-muted-foreground">Required Skills</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Award className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleCerts.length}</p>
                  <p className="text-xs text-muted-foreground">Certifications</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Building2 className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleData.companies?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Companies</p>
                </div>
              </div>

              {/* Companies hiring */}
              {roleData.companies?.length > 0 && (
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Companies Hiring
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {roleData.companies.map((c: string) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills required — frequency-based */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Required Skills
                    <span className="text-muted-foreground font-normal text-xs">(by job frequency)</span>
                  </h4>
                  {roleSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No skill data available.</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {roleSkills.map((s: any, i: number) => {
                        const isMissing = missingSkillSet.has(s.skill_name);
                        return (
                          <div key={`${s.skill_name}-${i}`} className={`flex items-center gap-3 p-2 rounded border ${isMissing ? "border-destructive/30 bg-destructive/5" : ""}`}>
                            <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-medium truncate">{s.skill_name}</p>
                                  {isMissing && <Badge variant="destructive" className="text-[9px] px-1">GAP</Badge>}
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                  {s.frequency} jobs ({s.percentage}%)
                                </span>
                              </div>
                              <Progress value={roleSkills.length > 0 ? (s.frequency / roleSkills[0].frequency) * 100 : 0} className="h-1.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Certifications required */}
                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    Required Certifications
                    <span className="text-muted-foreground font-normal text-xs">(by job frequency)</span>
                  </h4>
                  {roleCerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No certification data available.</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {roleCerts.map((c: any, i: number) => (
                        <div key={`${c.cert_name}-${i}`} className="flex items-center gap-3 p-2 rounded border">
                          <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">{c.cert_name}</p>
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                {c.frequency} jobs ({c.percentage}%)
                              </span>
                            </div>
                            <Progress value={roleCerts.length > 0 ? (c.frequency / roleCerts[0].frequency) * 100 : 0} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Student skill gaps vs market */}
              {studentGaps.length > 0 && (
                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Your Skill Gap vs Market Demand
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {studentGaps.filter(g => g.is_missing).slice(0, 15).map((g, i) => (
                      <div key={g.skill_name} className="flex items-center justify-between p-2 rounded border border-destructive/20 bg-destructive/5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                          <p className="text-sm font-medium">{g.skill_name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground">{g.market_frequency} jobs ({g.market_percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Market Snapshot (no role selected) */}
      {!roleData && !loading && (marketSkills.length > 0 || marketCerts.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border bg-card p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Top Skills in Saudi Market
              <span className="text-muted-foreground font-normal text-xs">(last 30 days)</span>
            </h4>
            <div className="space-y-1.5">
              {marketSkills.map((s, i) => (
                <div key={s.skill_name} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                    <span className="truncate">{s.skill_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{s.frequency} jobs ({s.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Top Certifications
              <span className="text-muted-foreground font-normal text-xs">(last 30 days)</span>
            </h4>
            <div className="space-y-1.5">
              {marketCerts.map((c, i) => (
                <div key={c.cert_name} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                    <span className="truncate">{c.cert_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{c.frequency} jobs ({c.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
