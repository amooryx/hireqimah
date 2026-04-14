import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { fetchMarketSkillRankings, fetchMarketCertRankings } from "@/lib/supabaseData";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { fetchLiveJobSearch, type LiveJobSearchResponse } from "@/lib/liveJobs";
import {
  Target, Award, Star, Briefcase,
  Loader2, AlertTriangle, Rocket,
  BarChart3, Building2, Info, Globe, Database, Zap
} from "lucide-react";

interface CareerRoadmapProps {
  userId: string;
  currentCareerTarget?: string;
}

type SourceType = "firecrawl" | "database" | "ai-generated" | "firecrawl+database" | "database-similar" | "none" | string;

function SourceBadge({ source }: { source: SourceType }) {
  const { t } = useI18n();

  if (source.includes("firecrawl")) {
    return <Badge variant="outline" className="text-[10px] gap-1"><Globe className="h-3 w-3" />{t("roadmap.source.liveWebSearch")}</Badge>;
  }
  if (source.includes("database")) {
    return <Badge variant="outline" className="text-[10px] gap-1"><Database className="h-3 w-3" />{t("roadmap.source.marketDatabase")}</Badge>;
  }
  if (source === "ai-generated") {
    return <Badge variant="outline" className="text-[10px] gap-1"><Zap className="h-3 w-3" />{t("roadmap.source.aiAnalysis")}</Badge>;
  }
  return null;
}

export default function CareerRoadmap({ userId, currentCareerTarget }: CareerRoadmapProps) {
  const { toast } = useToast();
  const { t, dir, lang } = useI18n();
  const [careerTarget, setCareerTarget] = useState(currentCareerTarget || "");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [roleData, setRoleData] = useState<LiveJobSearchResponse | null>(null);
  const [marketSkills, setMarketSkills] = useState<any[]>([]);
  const [marketCerts, setMarketCerts] = useState<any[]>([]);

  const quickTargets = [
    t("roadmap.sample.softwareEngineer"),
    t("roadmap.sample.cybersecurityAnalyst"),
    t("roadmap.sample.dentist"),
    t("roadmap.sample.dataAnalyst"),
    t("roadmap.sample.pharmacist"),
    t("roadmap.sample.aiEngineer"),
    t("roadmap.sample.mechanicalEngineer"),
    t("roadmap.sample.accountant"),
    t("roadmap.sample.nurse"),
    t("roadmap.sample.productManager"),
  ];

  const selectedRoleLabel =
    roleData?.searched_role || careerTarget || t("roadmap.targetRoleFallback");

  const roleSummary = (data: LiveJobSearchResponse) => {
    if (data.match_type === "ai-generated") {
      return t("roadmap.summaryAi", { role: data.searched_role || selectedRoleLabel });
    }

    if (data.match_type === "none") {
      return t("roadmap.noDataDescription", { role: data.searched_role || selectedRoleLabel });
    }

    if ((data.job_count || 0) > 0) {
      return t("roadmap.summaryLive", {
        count: data.job_count,
        role: data.searched_role || selectedRoleLabel,
      });
    }

    return t("roadmap.summaryFallback", { role: data.searched_role || selectedRoleLabel });
  };

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
      analyzeRole(currentCareerTarget);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const analyzeRole = async (target?: string) => {
    const finalTarget = target || careerTarget;
    if (!finalTarget.trim()) {
      toast({ title: t("roadmap.enterCareerTarget"), variant: "destructive" });
      return;
    }
    setCareerTarget(finalTarget);
    setLoading(true);
    setRoleData(null);
    setLoadingMessage(t("dash.fetchingJobs"));

    try {
      setLoadingMessage(t("roadmap.loadingSearching"));
      const { data, error } = await fetchLiveJobSearch({
        role: finalTarget,
        userId,
        timeoutMs: 16000,
        retries: 1,
      });

      if (error || !data) {
        throw new Error(error?.code || "request_failed");
      }

      setRoleData(data);

      if (data.match_type === "none") {
        toast({
          title: t("roadmap.noMarketDataFound"),
          description: t("roadmap.noDataDescription", { role: finalTarget }),
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("Live search failed:", err);
      setRoleData({
        match_type: "none",
        searched_role: finalTarget,
        job_count: 0,
        source: "none",
        skills: [],
        certifications: [],
        companies: [],
        sectors: [],
        student_gaps: [],
        message: "",
        job_postings: [],
      });
      toast({
        title: t("roadmap.analysisFailed"),
        description:
          err?.message === "timeout"
            ? t("roadmap.requestTimeout")
            : t("roadmap.requestFailed"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const missingSkillSet = new Set(
    (roleData?.student_gaps || []).filter((g: any) => g.is_missing).map((g: any) => g.skill_name)
  );
  const roleSkills = roleData?.skills || [];
  const roleCerts = roleData?.certifications || [];
  const studentGaps = roleData?.student_gaps || [];

  return (
    <div dir={dir} className={`space-y-6 ${lang === "ar" ? "text-right" : "text-left"}`}>
      {/* Career Target Input */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-base font-semibold font-heading mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {t("roadmap.title")}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("roadmap.description")}
        </p>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder={t("roadmap.inputPlaceholder")}
            value={careerTarget}
            onChange={(e) => setCareerTarget(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && analyzeRole()}
          />
          <Button onClick={() => analyzeRole()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 ltr:mr-1 rtl:ml-1 animate-spin" /> : <Rocket className="h-4 w-4 ltr:mr-1 rtl:ml-1" />}
            {loading ? t("roadmap.searching") : t("roadmap.search")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickTargets.map((career) => (
            <Button key={career} variant={careerTarget === career ? "default" : "outline"} size="sm" className="text-xs"
              onClick={() => analyzeRole(career)} disabled={loading}>
              {career}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm font-medium">{loadingMessage || t("roadmap.analyzing")}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("roadmap.loadingPipeline")}
          </p>
        </div>
      )}

      {/* Results */}
      {roleData && !loading && (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* AI-generated notice */}
          {roleData.match_type === "ai-generated" && (
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-700">{t("roadmap.aiGeneratedTitle")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("roadmap.aiGeneratedDescription")}</p>
                </div>
              </div>
            </div>
          )}

          {/* No data */}
          {roleData.match_type === "none" && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
              <p className="text-sm font-medium">{t("roadmap.noDataTitle")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("roadmap.noDataDescription", { role: roleData.searched_role || selectedRoleLabel })}</p>
            </div>
          )}

          {/* Summary stats */}
          {roleData.match_type !== "none" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border bg-card p-4 text-center">
                  <BarChart3 className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleData.job_count || 0}</p>
                  <p className="text-xs text-muted-foreground">{t("roadmap.sourcesAnalyzed")}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Star className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleSkills.length}</p>
                  <p className="text-xs text-muted-foreground">{t("roadmap.skillsFound")}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Award className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleCerts.length}</p>
                  <p className="text-xs text-muted-foreground">{t("roadmap.certificationsFound")}</p>
                </div>
                <div className="rounded-lg border bg-card p-4 text-center">
                  <Building2 className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-2xl font-bold text-primary">{roleData.companies?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">{t("roadmap.companies")}</p>
                </div>
              </div>

              {/* Source badge + message */}
              <div className={`rounded-lg border bg-card p-3 flex items-center justify-between gap-3 ${lang === "ar" ? "flex-row-reverse text-right" : ""}`}>
                <p className="text-xs text-muted-foreground">{roleSummary(roleData)}</p>
                <SourceBadge source={roleData.source || "none"} />
              </div>

              {/* Companies */}
              {roleData.companies?.length > 0 && (
                <div className="rounded-lg border bg-card p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {t("roadmap.companiesHiring")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {roleData.companies.map((c: string) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills & Certs columns */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    {t("roadmap.requiredSkills")}
                    <span className="text-muted-foreground font-normal text-xs">({t("roadmap.byFrequency")})</span>
                  </h4>
                  {roleSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">{t("roadmap.noSkillData")}</p>
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
                                  {isMissing && <Badge variant="destructive" className="text-[9px] px-1">{t("roadmap.gapBadge")}</Badge>}
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                  {s.frequency} ({s.percentage}%)
                                </span>
                              </div>
                              <Progress value={roleSkills[0]?.frequency ? (s.frequency / roleSkills[0].frequency) * 100 : 0} className="h-1.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t("roadmap.requiredCertifications")}
                    <span className="text-muted-foreground font-normal text-xs">({t("roadmap.byFrequency")})</span>
                  </h4>
                  {roleCerts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">{t("roadmap.noCertData")}</p>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {roleCerts.map((c: any, i: number) => (
                        <div key={`${c.cert_name}-${i}`} className="flex items-center gap-3 p-2 rounded border">
                          <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium truncate">{c.cert_name}</p>
                              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                {c.frequency} ({c.percentage}%)
                              </span>
                            </div>
                            <Progress value={roleCerts[0]?.frequency ? (c.frequency / roleCerts[0].frequency) * 100 : 0} className="h-1.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Student skill gaps */}
              {studentGaps.filter((g: any) => g.is_missing).length > 0 && (
                <div className="rounded-lg border bg-card p-5">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    {t("roadmap.skillGapsTitle")}
                  </h4>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {studentGaps.filter((g: any) => g.is_missing).slice(0, 15).map((g: any, i: number) => (
                      <div key={g.skill_name} className="flex items-center justify-between p-2 rounded border border-destructive/20 bg-destructive/5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                          <p className="text-sm font-medium">{g.skill_name}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{g.market_frequency} {t("roadmap.jobsLabel")} ({g.market_percentage}%)</span>
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
              {t("roadmap.topMarketSkills")}
              <span className="text-muted-foreground font-normal text-xs">({t("roadmap.last30Days")})</span>
            </h4>
            <div className="space-y-1.5">
              {marketSkills.map((s, i) => (
                <div key={s.skill_name} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                    <span className="truncate">{s.skill_name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{s.frequency} {t("roadmap.jobsLabel")} ({s.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              {t("roadmap.topCertifications")}
              <span className="text-muted-foreground font-normal text-xs">({t("roadmap.last30Days")})</span>
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
