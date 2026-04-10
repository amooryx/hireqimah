import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, Award, Briefcase,
  Star, BarChart3, Loader2, ArrowUp, ArrowDown, Download, Clock,
  Zap, Calendar
} from "lucide-react";

const trendIcon = (trend: string) => {
  if (trend === "rising") return <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />;
  if (trend === "declining") return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const trendBadge = (trend: string) => {
  const colors = {
    rising: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
    declining: "bg-destructive/10 text-destructive",
    stable: "bg-muted text-muted-foreground",
  };
  return colors[trend as keyof typeof colors] || colors.stable;
};

const changeIndicator = (change: number | null) => {
  if (!change || change === 0) return null;
  return (
    <span className={`text-[10px] font-medium flex items-center gap-0.5 ${change > 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
      {change > 0 ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
      {Math.abs(change).toFixed(1)}
    </span>
  );
};

export default function MarketIntelligenceDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [refreshLogs, setRefreshLogs] = useState<any[]>([]);
  const [jobCount, setJobCount] = useState(0);
  const [certMappings, setCertMappings] = useState<any[]>([]);
  const [synonymCount, setSynonymCount] = useState(0);

  const loadData = useCallback(async () => {
    const [
      { data: skillData },
      { data: certData },
      { data: roleData },
      { data: logData },
      { count },
      { data: mappings },
      { count: synCount },
    ] = await Promise.all([
      untypedTable("market_skill_demand").select("*").order("demand_score", { ascending: false }).limit(30),
      untypedTable("market_cert_demand").select("*").order("demand_score", { ascending: false }).limit(20),
      untypedTable("market_role_taxonomy").select("*").order("role_name"),
      untypedTable("market_refresh_log").select("*").order("started_at", { ascending: false }).limit(5),
      supabase.from("job_cache").select("*", { count: "exact", head: true }),
      untypedTable("skill_cert_mapping").select("*").order("relevance_score", { ascending: false }).limit(50),
      untypedTable("skill_synonyms").select("*", { count: "exact", head: true }),
    ]);
    setSkills(skillData || []);
    setCerts(certData || []);
    setRoles(roleData || []);
    setRefreshLogs(logData || []);
    setJobCount(count || 0);
    setCertMappings(mappings || []);
    setSynonymCount(synCount || 0);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleIngest = async () => {
    setIngesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("job-ingestion");
      if (error) throw error;
      const source = data.data_source === "firecrawl" ? "🔍 Scraped" : "🤖 AI Generated";
      toast({
        title: "Job Ingestion Complete",
        description: `${source} · Parsed ${data.parsed} jobs · Ingested ${data.ingested} new · ${data.duplicates_skipped} duplicates skipped`,
      });
      await loadData();
    } catch (err: any) {
      toast({ title: "Ingestion failed", description: err.message, variant: "destructive" });
    } finally {
      setIngesting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-intelligence");
      if (error) throw error;
      toast({
        title: "Market Intelligence Refreshed",
        description: `Analyzed ${data.jobs_analyzed} jobs · Found ${data.skills_found} skills · ${data.certs_found} certifications`,
      });
      await loadData();
    } catch (err: any) {
      toast({ title: "Refresh failed", description: err.message, variant: "destructive" });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const lastRefresh = refreshLogs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            ERS Market Intelligence Engine
          </h3>
          <p className="text-xs text-muted-foreground">
            Live Saudi labor market analysis · {jobCount} jobs indexed · {synonymCount} skill synonyms
            {lastRefresh && ` · Last refresh: ${new Date(lastRefresh.started_at).toLocaleString()}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleIngest} disabled={ingesting || refreshing} size="sm" variant="outline">
            {ingesting ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
            {ingesting ? "Ingesting..." : "Ingest Jobs"}
          </Button>
          <Button onClick={handleRefresh} disabled={refreshing || ingesting} size="sm">
            {refreshing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            {refreshing ? "Analyzing..." : "Analyze Market"}
          </Button>
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="rounded-xl border bg-card p-4">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Automated Pipeline
        </h4>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
            <span>24h Auto-Refresh Active</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Sources: LinkedIn, Bayt, GulfTalent, Indeed (via Firecrawl)</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">Pipeline: Scrape → Parse → Normalize → Analyze → Score → Update ERS</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{jobCount}</p>
          <p className="text-xs text-muted-foreground">Jobs Indexed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{skills.length}</p>
          <p className="text-xs text-muted-foreground">Skills Tracked</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{certs.length}</p>
          <p className="text-xs text-muted-foreground">Certifications</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{roles.length}</p>
          <p className="text-xs text-muted-foreground">Roles Detected</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{certMappings.length}</p>
          <p className="text-xs text-muted-foreground">Skill→Cert Maps</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="rounded-xl border bg-card p-6">
          <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Top Skills by Demand
          </h4>
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet. Click "Ingest Jobs" then "Analyze Market".</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {skills.map((s, i) => (
                <motion.div key={s.id} className="flex items-center gap-3 rounded-lg border p-3"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.skill_name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.mention_count} mentions · {s.company_diversity} companies</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {changeIndicator(s.weekly_change)}
                    {trendIcon(s.trend)}
                    <Badge className={`text-[10px] ${trendBadge(s.trend)}`}>{Math.round(s.demand_score)}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Top Certifications */}
        <div className="rounded-xl border bg-card p-6">
          <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Top Certifications by Demand
          </h4>
          {certs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data yet. Click "Ingest Jobs" then "Analyze Market".</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {certs.map((c, i) => (
                <motion.div key={c.id} className="flex items-center gap-3 rounded-lg border p-3"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.cert_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{c.difficulty_level}</Badge>
                      <span className="text-[10px] text-muted-foreground">{c.mention_count} mentions</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {changeIndicator(c.weekly_change)}
                      {trendIcon(c.trend)}
                      <Badge className={`text-[10px] ${trendBadge(c.trend)}`}>{Math.round(c.demand_score)}</Badge>
                    </div>
                    <span className="text-[10px] font-semibold text-primary">{c.ers_points} ERS pts</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skill → Certification Mapping */}
      {certMappings.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Skill → Certification Recommendations
          </h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {certMappings.slice(0, 15).map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-lg border p-2">
                <Badge variant="secondary" className="text-[10px] shrink-0">{m.skill_name}</Badge>
                <span className="text-muted-foreground text-[10px]">→</span>
                <span className="text-xs font-medium truncate">{m.cert_name}</span>
                <Badge variant="outline" className="text-[10px] ml-auto shrink-0">{m.relevance_score}%</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Roles */}
      <div className="rounded-xl border bg-card p-6">
        <h4 className="font-semibold font-heading mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Detected Career Roles in Saudi Market
        </h4>
        {roles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No roles detected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <Badge key={r.id} variant="secondary" className="text-xs">
                {r.role_name}
                <span className="ml-1 text-[10px] text-muted-foreground">({r.role_category})</span>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Refresh History */}
      {refreshLogs.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h4 className="font-semibold font-heading mb-3">Refresh History</h4>
          <div className="space-y-2">
            {refreshLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 text-sm rounded-lg border p-3">
                <Badge variant={log.status === "completed" ? "secondary" : log.status === "running" ? "default" : "destructive"} className="text-[10px]">
                  {log.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(log.started_at).toLocaleString()}</span>
                <span className="text-xs">
                  {log.jobs_analyzed} jobs · {log.skills_updated} skills · {log.certs_updated} certs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
