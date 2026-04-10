import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/lib/supabaseAuth";
import {
  ShieldCheck, Users, FileCheck, Settings, CheckCircle, XCircle, Clock,
  Award, BarChart3, Activity, TrendingUp, Globe, Calendar, AlertTriangle
} from "lucide-react";
import MarketIntelligenceDashboard from "@/components/MarketIntelligenceDashboard";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps { user: AuthUser; }

const AdminDashboard = ({ user: authUser }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, students: 0, hrUsers: 0, universities: 0, auditCount: 0 });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  const loadDashboard = useCallback(async () => {
    const [
      { count: usersCount },
      { data: studentsData },
      { data: auditData },
      { data: rolesData },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("student_profiles").select("*, profiles!inner(full_name, email, user_id)").order("ers_score", { ascending: false }).limit(100),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("user_roles").select("role"),
    ]);

    const roleCounts = (rolesData || []).reduce((acc: Record<string, number>, r: any) => {
      acc[r.role] = (acc[r.role] || 0) + 1; return acc;
    }, {});

    setStats({
      users: usersCount || 0,
      students: roleCounts["student"] || 0,
      hrUsers: roleCounts["hr"] || 0,
      universities: roleCounts["university"] || 0,
      auditCount: (auditData || []).length,
    });
    setStudents(studentsData || []);
    setAuditLogs(auditData || []);
    setRoles(rolesData || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

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

  const roleCounts = roles.reduce((acc: Record<string, number>, r: any) => {
    acc[r.role] = (acc[r.role] || 0) + 1; return acc;
  }, {});

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">Platform Administration</h1>
        <p className="text-muted-foreground text-sm">Welcome, {authUser.full_name} · Centralized governance & monitoring</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.users} delay={0} />
        <StatCard icon={BarChart3} label="Students" value={stats.students} delay={0.1} />
        <StatCard icon={Briefcase} label="HR Users" value={stats.hrUsers} delay={0.2} />
        <StatCard icon={Activity} label="Audit Entries" value={stats.auditCount} delay={0.3} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-1 hidden sm:inline" />Overview</TabsTrigger>
          <TabsTrigger value="market"><TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />Market</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-1 hidden sm:inline" />Users</TabsTrigger>
          <TabsTrigger value="audit"><Activity className="h-4 w-4 mr-1 hidden sm:inline" />Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="rounded-lg border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">{count as number}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}s</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">ERS Weight Configuration</h3>
              <p className="text-xs text-muted-foreground mb-4">Weights auto-adjust per major track</p>
              <div className="space-y-4">
                {[
                  { label: "Academic Performance", weight: 40 },
                  { label: "Certifications", weight: 25 },
                  { label: "Projects", weight: 15 },
                  { label: "Soft Skills & Activities", weight: 10 },
                  { label: "Conduct & Attendance", weight: 10 },
                ].map(w => (
                  <div key={w.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{w.label}</span>
                      <span className="font-semibold">{w.weight}%</span>
                    </div>
                    <Progress value={w.weight} className="h-3" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">Advanced Modifiers</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔄", title: "Skill Decay Factor", desc: "15% annual decay for volatile fields" },
                  { icon: "🔗", title: "Cross-Sector Synergy", desc: "5-10% bonus for multi-sector skills" },
                  { icon: "🇸🇦", title: "National Readiness", desc: "+5% for Arabic mastery & Saudi history" },
                  { icon: "🏷️", title: "Hadaf Reimbursement", desc: "Auto-tagged in certification catalog" },
                ].map(m => (
                  <div key={m.title} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{m.icon} {m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market">
          <MarketIntelligenceDashboard />
        </TabsContent>

        <TabsContent value="users">
          <div className="rounded-xl border bg-card p-6">
            <h4 className="font-semibold mb-3">Top Students by ERS</h4>
            <div className="space-y-2">
              {students.slice(0, 20).map((s, i) => (
                <div key={s.user_id} className="flex items-center gap-3 rounded-lg border p-3">
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.profiles?.full_name || "Student"}</p>
                    <p className="text-xs text-muted-foreground">{s.university} · {s.major}</p>
                  </div>
                  <p className="font-bold text-primary">{Math.round(s.ers_score || 0)}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audit">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold font-heading mb-4">Audit Log</h3>
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No audit entries.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.resource_type && `${log.resource_type} · `}
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {typeof log.details === "object" ? JSON.stringify(log.details).slice(0, 100) : log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
