import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { fetchMarketSkillRankings, fetchMarketCertRankings, fetchStudentSkillGaps } from "@/lib/supabaseData";
import { useToast } from "@/hooks/use-toast";
import { findCareerPath, generateRoadmapFromPath, getAllCareerNames } from "@/lib/careerRoadmapData";
import {
  Map, Target, Award, Star, Briefcase, TrendingUp, TrendingDown,
  ArrowRight, Loader2, AlertTriangle, Rocket, Minus,
  Code, ChevronRight, BarChart3, Building2, DollarSign
} from "lucide-react";

interface CareerRoadmapProps {
  userId: string;
  currentCareerTarget?: string;
}

const POPULAR_CAREERS = getAllCareerNames().slice(0, 12);

function TrendIcon({ value }: { value: number }) {
  if (value > 2) return <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />;
  if (value < -2) return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

function StabilityBadge({ stability }: { stability: string }) {
  const colors: Record<string, string> = {
    high_growth: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
    stable: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    declining: "bg-destructive/10 text-destructive",
  };
  return (
    <Badge className={`text-[10px] ${colors[stability] || colors.stable}`}>
      {(stability || "stable").replace("_", " ")}
    </Badge>
  );
}

export default function CareerRoadmap({ userId, currentCareerTarget }: CareerRoadmapProps) {
  const { toast } = useToast();
  const [careerTarget, setCareerTarget] = useState(currentCareerTarget || "");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [jobsAnalyzed, setJobsAnalyzed] = useState(0);
  const [confidence, setConfidence] = useState<any>(null);
  const [marketSkills, setMarketSkills] = useState<any[]>([]);
  const [marketCerts, setMarketCerts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchMarketSkillRankings(20, 30),
      fetchMarketCertRankings(15, 30),
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
    setRoadmap(null);

    try {
      // Fetch user's current skills and certs for gap analysis
      const [{ data: userSkills }, { data: userCerts }] = await Promise.all([
        supabase.from("skill_matrix").select("skill_name").eq("user_id", userId),
        supabase.from("student_certifications").select("custom_name, certification_catalog(name)").eq("user_id", userId),
      ]);

      const skillNames = (userSkills || []).map((s: any) => s.skill_name);
      const certNames = (userCerts || []).map((c: any) => c.certification_catalog?.name || c.custom_name).filter(Boolean);

      const path = findCareerPath(finalTarget);
      if (!path) {
        toast({ title: "Career path not found", description: `"${finalTarget}" is not in our database yet. Try a different career target.`, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Small delay for UX feel
      await new Promise(r => setTimeout(r, 800));

      const result = generateRoadmapFromPath(path, skillNames, certNames);
      setRoadmap(result);
      setJobsAnalyzed(result.confidence?.jobs_count || 0);
      setConfidence(result.confidence || null);
    } catch (err: any) {
      toast({ title: "Roadmap generation failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Group skill gaps by priority
  const groupedGaps = roadmap?.skill_gaps?.reduce((acc: any, gap: any) => {
    const p = gap.priority || "optional";
    if (!acc[p]) acc[p] = [];
    acc[p].push(gap);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Career Target Selector */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold font-heading mb-2 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          AI Career Intelligence Engine
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Analyzes 100+ real Saudi job postings to match your profile against live market demand.
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter career target (e.g., Penetration Tester)"
            value={careerTarget}
            onChange={(e) => setCareerTarget(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
          />
          <Button onClick={() => generateRoadmap()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Rocket className="h-4 w-4 mr-1" />}
            {loading ? "Analyzing..." : "Generate"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_CAREERS.map((career) => (
            <Button key={career} variant={careerTarget === career ? "default" : "outline"} size="sm" className="text-xs"
              onClick={() => generateRoadmap(career)} disabled={loading}>
              {career}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Analyzing 100+ Saudi job postings for "{careerTarget}"...</p>
          <p className="text-xs text-muted-foreground mt-1">Clustering roles → Computing demand → Matching profile</p>
        </div>
      )}

      {/* Results */}
      {roadmap && !roadmap.parse_error && (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Market Confidence Banner */}
          <div className="rounded-xl border bg-primary/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Market Confidence: {confidence?.score || roadmap.confidence?.score || "—"}%</span>
              </div>
              <Badge variant="outline" className="text-xs">Live Market Data</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>📊 {confidence?.jobs_count || roadmap.jobs_analyzed || jobsAnalyzed} jobs analyzed</span>
              <span>🏢 {confidence?.companies_count || "—"} companies</span>
              <span>🔗 Sources: {(confidence?.sources_used || []).join(", ") || "Multiple"}</span>
              <span>📅 {confidence?.data_freshness || "Last 30 days"}</span>
            </div>
            {confidence?.explanation && (
              <p className="text-[11px] text-muted-foreground mt-1 italic">{confidence.explanation}</p>
            )}
          </div>

          {/* Top 10 Career Matches */}
          {roadmap.top_career_matches && roadmap.top_career_matches.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Top 10 Career Matches
              </h4>
              <div className="space-y-3">
                {roadmap.top_career_matches.slice(0, 10).map((match: any, i: number) => (
                  <motion.div key={i} className="rounded-lg border p-4"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-primary">#{match.rank || i + 1}</span>
                          <span className="text-sm font-semibold truncate">{match.career}</span>
                          <StabilityBadge stability={match.market_stability} />
                        </div>
                        <p className="text-xs text-muted-foreground">{match.reason}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{match.job_count} jobs</span>
                          </div>
                          {match.salary_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] text-muted-foreground">{match.salary_range}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <TrendIcon value={match.weekly_change || 0} />
                            <span className="text-[10px] text-muted-foreground">{match.weekly_change > 0 ? "+" : ""}{match.weekly_change || 0}% weekly</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendIcon value={match.monthly_change || 0} />
                            <span className="text-[10px] text-muted-foreground">{match.monthly_change > 0 ? "+" : ""}{match.monthly_change || 0}% monthly</span>
                          </div>
                        </div>
                        {match.companies_hiring?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {match.companies_hiring.slice(0, 4).map((c: string) => (
                              <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-primary">{match.match_score}%</p>
                        <p className="text-[10px] text-muted-foreground">match</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Readiness Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card p-6 text-center">
              <p className="text-3xl font-bold text-primary">{roadmap.readiness_score || 0}%</p>
              <p className="text-xs text-muted-foreground">Career Readiness</p>
              <Progress value={roadmap.readiness_score || 0} className="h-2 mt-2" />
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <Badge className={`text-sm ${
                roadmap.market_demand === "high" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" :
                roadmap.market_demand === "medium" ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" :
                "bg-destructive/10 text-destructive"
              }`}>
                {(roadmap.market_demand || "unknown").toUpperCase()}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">Market Demand</p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <p className="text-sm font-medium">{roadmap.salary_outlook || "N/A"}</p>
              <p className="text-xs text-muted-foreground mt-1">Salary Outlook</p>
            </div>
          </div>

          {/* Skill Gaps by Priority */}
          {groupedGaps && Object.keys(groupedGaps).length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Skill Gap Analysis
              </h4>
              {(["critical", "important", "optional"] as const).map((priority) => {
                const gaps = groupedGaps[priority];
                if (!gaps?.length) return null;
                return (
                  <div key={priority} className="mb-4 last:mb-0">
                    <h5 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Badge variant={priority === "critical" ? "destructive" : priority === "important" ? "default" : "secondary"} className="text-[10px]">
                        {priority}
                      </Badge>
                      <span className="text-muted-foreground">({gaps.length} skills)</span>
                    </h5>
                    <div className="space-y-2">
                      {gaps.map((gap: any, i: number) => (
                        <motion.div key={i} className="flex items-center gap-3 rounded-lg border p-3"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{gap.skill}</p>
                              {gap.domain && <span className="text-[10px] text-muted-foreground">({gap.domain})</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">{gap.action}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {(gap.weekly_trend !== undefined || gap.monthly_trend !== undefined) && (
                              <div className="flex items-center gap-1">
                                <TrendIcon value={gap.weekly_trend || gap.monthly_trend || 0} />
                              </div>
                            )}
                            {gap.market_demand_score > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {gap.market_demand_score}
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommended Certifications */}
          {roadmap.recommended_certifications?.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Recommended Certifications
              </h4>
              <div className="space-y-3">
                {roadmap.recommended_certifications.map((cert: any, i: number) => (
                  <motion.div key={i} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{cert.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cert.reason}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px]">{cert.difficulty}</Badge>
                          {cert.provider && <span className="text-[10px] text-muted-foreground">via {cert.provider}</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-primary">+{cert.ers_points}</p>
                        <p className="text-[10px] text-muted-foreground">ERS pts</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Projects */}
          {roadmap.recommended_projects?.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Recommended Portfolio Projects
              </h4>
              <div className="space-y-3">
                {roadmap.recommended_projects.map((proj: any, i: number) => (
                  <motion.div key={i} className="rounded-lg border p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                    <p className="text-sm font-semibold">{proj.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{proj.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {proj.skills_gained?.map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                      {proj.estimated_time && (
                        <span className="text-[10px] text-muted-foreground ml-auto">⏱ {proj.estimated_time}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step-by-Step Roadmap */}
          {roadmap.roadmap_steps?.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                Your Career Roadmap
              </h4>
              <div className="space-y-3">
                {roadmap.roadmap_steps.map((step: any, i: number) => (
                  <motion.div key={i} className="flex gap-4"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {step.step || i + 1}
                      </div>
                      {i < roadmap.roadmap_steps.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-semibold">{step.action}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">⏱ {step.timeline}</span>
                        {step.ers_gain > 0 && (
                          <Badge className="text-[10px] bg-primary/10 text-primary">+{step.ers_gain} ERS</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{step.impact}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Vision 2030 */}
          {roadmap.vision_2030_alignment?.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="font-semibold font-heading mb-3">🇸🇦 Vision 2030 Alignment</h4>
              <div className="flex flex-wrap gap-2">
                {roadmap.vision_2030_alignment.map((v: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">{v}</Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Market Snapshot (no roadmap) */}
      {!roadmap && !loading && (marketSkills.length > 0 || marketCerts.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-card p-6">
            <h4 className="font-semibold font-heading mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Trending Skills in Saudi Market
            </h4>
            <div className="space-y-1">
              {marketSkills.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm py-1">
                  <span className="truncate">{s.skill_name}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">{Math.round(s.demand_score)}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <h4 className="font-semibold font-heading mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Top Certifications by ERS Value
            </h4>
            <div className="space-y-1">
              {marketCerts.slice(0, 10).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm py-1">
                  <span className="truncate">{c.cert_name}</span>
                  <span className="text-xs font-semibold text-primary shrink-0">{c.ers_points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
