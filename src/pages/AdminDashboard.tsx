import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import {
  Users, BarChart3, Activity, TrendingUp, Briefcase
} from "lucide-react";
import MarketIntelligenceDashboard from "@/components/MarketIntelligenceDashboard";

interface AdminDashboardProps { user: AuthUser; }

const AdminDashboard = ({ user: authUser }: AdminDashboardProps) => {
  const { t, lang, dir } = useI18n();
  const isArabic = lang === "ar";
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

  const roleLabel = (role: string) => {
    const map: Record<string, string> = {
      student: t("admin.students"),
      hr: t("admin.hrUsers"),
      university: t("admin.universities"),
      admin: t("admin.title"),
    };
    return map[role] || role;
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

  const roleCounts = roles.reduce((acc: Record<string, number>, r: any) => {
    acc[r.role] = (acc[r.role] || 0) + 1; return acc;
  }, {});

  return (
    <div dir={dir} className={`container py-6 space-y-6 ${isArabic ? "text-right" : "text-left"}`}>
      <div>
        <h1 className="text-2xl font-bold font-heading">{t("admin.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("dash.welcomeName", { name: authUser.full_name })} · {t("admin.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label={t("admin.totalUsers")} value={stats.users} delay={0} />
        <StatCard icon={BarChart3} label={t("admin.students")} value={stats.students} delay={0.1} />
        <StatCard icon={Briefcase} label={t("admin.hrUsers")} value={stats.hrUsers} delay={0.2} />
        <StatCard icon={Activity} label={t("admin.auditEntries")} value={stats.auditCount} delay={0.3} />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList dir={dir} className="grid w-full grid-cols-4">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("admin.overview")}</TabsTrigger>
          <TabsTrigger value="market"><TrendingUp className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("admin.market")}</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("admin.users")}</TabsTrigger>
          <TabsTrigger value="audit"><Activity className="h-4 w-4 ltr:mr-1 rtl:ml-1 hidden sm:inline" />{t("admin.audit")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(roleCounts).map(([role, count]) => (
              <div key={role} className="rounded-lg border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">{count as number}</p>
                <p className="text-xs text-muted-foreground">{roleLabel(role)}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold font-heading mb-4">{t("admin.ersWeightConfig")}</h3>
              <p className="text-xs text-muted-foreground mb-4">{t("admin.weightsAutoAdjust")}</p>
              <div className="space-y-4">
                {[
                  { label: t("admin.academicPerformance"), weight: 40 },
                  { label: t("admin.certifications"), weight: 25 },
                  { label: t("admin.projects"), weight: 15 },
                  { label: t("admin.softSkillsActivities"), weight: 10 },
                  { label: t("admin.conductAttendance"), weight: 10 },
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
              <h3 className="font-semibold font-heading mb-4">{t("admin.advancedModifiers")}</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔄", title: t("admin.skillDecayFactor"), desc: t("admin.skillDecayDesc") },
                  { icon: "🔗", title: t("admin.crossSectorSynergy"), desc: t("admin.crossSectorDesc") },
                  { icon: "🇸🇦", title: t("admin.nationalReadiness"), desc: t("admin.nationalReadinessDesc") },
                  { icon: "🏷️", title: t("admin.hadafReimbursement"), desc: t("admin.hadafDesc") },
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
            <h4 className="font-semibold mb-3">{t("admin.topStudentsByERS")}</h4>
            <div className="space-y-2">
              {students.slice(0, 20).map((s, i) => (
                <div key={s.user_id} className={`flex items-center gap-3 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                  <span className="w-6 text-center text-sm font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{s.profiles?.full_name || t("hr.student")}</p>
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
            <h3 className="text-lg font-semibold font-heading mb-4">{t("admin.auditLog")}</h3>
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t("admin.noAuditEntries")}</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className={`flex items-start gap-3 rounded-lg border p-3 ${isArabic ? "flex-row-reverse text-right" : ""}`}>
                    <Activity className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.resource_type && `${log.resource_type} · `}
                        {new Date(log.created_at).toLocaleString(isArabic ? "ar-SA" : "en-US")}
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
