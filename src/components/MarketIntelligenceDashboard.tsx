import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp, TrendingDown, Minus, RefreshCw, Award,
  Briefcase, Star, BarChart3, Loader2, ArrowUp, ArrowDown,
  Download, Zap, Database, Shield
} from "lucide-react";

export default function MarketIntelligenceDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [demandRes, sectorRes] = await Promise.all([
        supabase.functions.invoke("market-intelligence", {
          body: { action: "get-demand", days: 30 },
        }),
        supabase.functions.invoke("market-intelligence", {
          body: { action: "get-sectors" },
        }),
      ]);

      if (demandRes.data) {
        setSkills(demandRes.data.skills || []);
        setCerts(demandRes.data.certifications || []);
        setTotalJobs(demandRes.data.total_jobs || 0);
        setLastRefresh(demandRes.data.last_refresh);
      }
      if (sectorRes.data) {
        setSectors(sectorRes.data.sectors || []);
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleIngest = async () => {
    setIngesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("job-ingestion", {
        body: { action: "full-pipeline", count: 100 },
      });
      if (error) throw error;
      toast({
        title: "Job Ingestion Complete",
        description: `Generated ${data.generated || 0} jobs · Parsed ${data.parsed || 0} · Ingested ${data.ingested || 0}`,
      });
      await loadData();
    } catch (err: any) {
      toast({ title: "Ingestion failed", description: err.message, variant: "destructive" });
    } finally {
      setIngesting(false);
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

  const maxSkillFreq = skills.length > 0 ? skills[0].frequency : 1;
  const maxCertFreq = certs.length > 0 ? certs[0].frequency : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold font-heading flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Intelligence Dashboard
          </h3>
          <p className="text-xs text-muted-foreground">
            Real-time Saudi labor market analysis from {totalJobs} job postings
            {lastRefresh && ` · Last updated: ${new Date(lastRefresh.completed_at || lastRefresh.started_at).toLocaleDateString()}`}
          </p>
        </div>
        <Button onClick={handleIngest} disabled={ingesting} size="sm">
          {ingesting ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Download className="h-4 w-4 mr-1.5" />}
          {ingesting ? "Fetching & Parsing..." : "Fetch New Jobs (100+)"}
        </Button>
      </div>

      {/* Pipeline info */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
            <span className="font-medium">Pipeline Active</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Fetch → AI Parse (skills & certs only) → Normalize → Store → Aggregate → Update ERS
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-card p-4 text-center">
          <Database className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{totalJobs}</p>
          <p className="text-xs text-muted-foreground">Jobs Analyzed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Star className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{skills.length}</p>
          <p className="text-xs text-muted-foreground">Unique Skills</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Shield className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{certs.length}</p>
          <p className="text-xs text-muted-foreground">Certifications</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <Briefcase className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary">{sectors.length}</p>
          <p className="text-xs text-muted-foreground">Sectors</p>
        </div>
      </div>

      {/* Sector breakdown */}
      {sectors.length > 0 && (
        <div className="rounded-lg border bg-card p-5">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Sector Distribution
          </h4>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <Badge key={s.sector} variant="secondary" className="text-xs">
                {s.sector} <span className="ml-1 text-muted-foreground">({s.count})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="rounded-lg border bg-card p-5">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Most In-Demand Skills
            <span className="text-muted-foreground font-normal">(by job frequency)</span>
          </h4>
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet. Click "Fetch New Jobs" to populate.
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {skills.map((s, i) => (
                <div key={`${s.skill_name}-${i}`} className="flex items-center gap-3 p-2 rounded border">
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{s.skill_name}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {s.frequency} jobs ({s.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={(s.frequency / maxSkillFreq) * 100}
                      className="h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Certifications */}
        <div className="rounded-lg border bg-card p-5">
          <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Most In-Demand Certifications
            <span className="text-muted-foreground font-normal">(by job frequency)</span>
          </h4>
          {certs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No data yet. Click "Fetch New Jobs" to populate.
            </p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {certs.map((c, i) => (
                <div key={`${c.cert_name}-${i}`} className="flex items-center gap-3 p-2 rounded border">
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{c.cert_name}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {c.frequency} jobs ({c.percentage}%)
                      </span>
                    </div>
                    <Progress
                      value={(c.frequency / maxCertFreq) * 100}
                      className="h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
