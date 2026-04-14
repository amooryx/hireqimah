import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { untypedTable } from "@/lib/untypedTable";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { SAUDI_UNIVERSITIES } from "@/lib/leaderboardConstants";
import { getMajorsForUniversity } from "@/lib/authStore";
import { User, Save, Upload } from "lucide-react";

interface SettingsProps { user: AuthUser; }

const Settings = ({ user }: SettingsProps) => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", email: "", nationality: "", avatar_url: "" });
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [hrProfile, setHrProfile] = useState<any>(null);
  const [uniProfile, setUniProfile] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (p) setProfile({ full_name: p.full_name, email: p.email, nationality: p.nationality || "", avatar_url: p.avatar_url || "" });

      if (user.role === "student") {
        const { data: sp } = await supabase.from("student_profiles").select("*").eq("user_id", user.id).single();
        if (sp) setStudentProfile(sp);
      } else if (user.role === "hr") {
        const { data: hp } = await supabase.from("hr_profiles").select("*").eq("user_id", user.id).single();
        if (hp) setHrProfile(hp);
      } else if (user.role === "university") {
        const { data: up } = await supabase.from("university_profiles").select("*").eq("user_id", user.id).single();
        if (up) setUniProfile(up);
      }
    };
    load();
  }, [user.id, user.role]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from("profiles").update({
        full_name: profile.full_name.trim(),
        nationality: profile.nationality || null,
        avatar_url: profile.avatar_url || null,
      }).eq("user_id", user.id);

      if (user.role === "student" && studentProfile) {
        await supabase.from("student_profiles").update({
          university: studentProfile.university,
          major: studentProfile.major,
          gpa: studentProfile.gpa,
          gpa_scale: studentProfile.gpa_scale,
          target_role: studentProfile.target_role || null,
        }).eq("user_id", user.id);
      } else if (user.role === "hr" && hrProfile) {
        await supabase.from("hr_profiles").update({
          company_name: hrProfile.company_name,
          position: hrProfile.position || null,
          industry: hrProfile.industry || null,
        }).eq("user_id", user.id);
      } else if (user.role === "university" && uniProfile) {
        await supabase.from("university_profiles").update({
          university_name: uniProfile.university_name,
          official_domain: uniProfile.official_domain || null,
          admin_contact: uniProfile.admin_contact || null,
        }).eq("user_id", user.id);
      }

      toast({ title: t("settings.saved") });
    } catch {
      toast({ title: t("settings.saveFailed"), variant: "destructive" });
    }
    setSaving(false);
  };

  const handleAvatarUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.jpg,.jpeg";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { toast({ title: t("dash.fileTooLarge"), variant: "destructive" }); return; }
      const path = `${user.id}/avatar/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast({ title: t("dash.uploadFailed"), variant: "destructive" }); return; }
      const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
      setProfile(p => ({ ...p, avatar_url: publicUrl }));
      toast({ title: t("settings.avatarUploaded") });
    };
    input.click();
  };

  const majors = studentProfile?.university ? getMajorsForUniversity(studentProfile.university) : [];

  return (
    <div className="container py-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("settings.subtitle")}</p>
      </div>

      {/* Profile Section */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold font-heading">{t("settings.profileInfo")}</h2>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
            <Upload className="h-4 w-4 mr-1" />{t("settings.changeAvatar")}
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>{t("signup.fullName")}</Label>
            <Input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} maxLength={100} />
          </div>
          <div>
            <Label>{t("signup.email")}</Label>
            <Input value={profile.email} disabled className="opacity-60" />
          </div>
          <div>
            <Label>{t("signup.nationality")}</Label>
            <Input value={profile.nationality} onChange={e => setProfile(p => ({ ...p, nationality: e.target.value }))} maxLength={50} />
          </div>
        </div>
      </div>

      {/* Role-specific section */}
      {user.role === "student" && studentProfile && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-semibold font-heading">{t("settings.academicInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("signup.university")}</Label>
              <Select value={studentProfile.university} onValueChange={v => setStudentProfile((p: any) => ({ ...p, university: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {SAUDI_UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("signup.major")}</Label>
              <Select value={studentProfile.major} onValueChange={v => setStudentProfile((p: any) => ({ ...p, major: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {majors.map((m: string) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("signup.gpa")}</Label>
              <Input type="number" step="0.01" min={0} max={5} value={studentProfile.gpa || ""} onChange={e => setStudentProfile((p: any) => ({ ...p, gpa: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>{t("signup.gpaScale")}</Label>
              <Select value={studentProfile.gpa_scale} onValueChange={v => setStudentProfile((p: any) => ({ ...p, gpa_scale: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4.0</SelectItem>
                  <SelectItem value="5">5.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>{t("settings.targetRole")}</Label>
              <Input value={studentProfile.target_role || ""} onChange={e => setStudentProfile((p: any) => ({ ...p, target_role: e.target.value }))} placeholder={t("settings.targetRolePlaceholder")} maxLength={100} />
            </div>
          </div>
        </div>
      )}

      {user.role === "hr" && hrProfile && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-semibold font-heading">{t("settings.companyInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("signup.companyName")}</Label>
              <Input value={hrProfile.company_name} onChange={e => setHrProfile((p: any) => ({ ...p, company_name: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <Label>{t("signup.position")}</Label>
              <Input value={hrProfile.position || ""} onChange={e => setHrProfile((p: any) => ({ ...p, position: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <Label>{t("signup.industry")}</Label>
              <Input value={hrProfile.industry || ""} onChange={e => setHrProfile((p: any) => ({ ...p, industry: e.target.value }))} maxLength={100} />
            </div>
          </div>
        </div>
      )}

      {user.role === "university" && uniProfile && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="font-semibold font-heading">{t("settings.universityInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("signup.uniName")}</Label>
              <Input value={uniProfile.university_name} onChange={e => setUniProfile((p: any) => ({ ...p, university_name: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <Label>{t("signup.officialDomain")}</Label>
              <Input value={uniProfile.official_domain || ""} onChange={e => setUniProfile((p: any) => ({ ...p, official_domain: e.target.value }))} maxLength={100} />
            </div>
            <div>
              <Label>{t("signup.adminContact")}</Label>
              <Input value={uniProfile.admin_contact || ""} onChange={e => setUniProfile((p: any) => ({ ...p, admin_contact: e.target.value }))} maxLength={100} />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !profile.full_name.trim()}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
