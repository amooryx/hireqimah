import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Target, Briefcase, ChevronRight, ChevronLeft, CheckCircle, Search, Plus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

const SAUDI_UNIVERSITIES = [
  "King Saud University", "King Abdulaziz University", "KFUPM",
  "Princess Nourah University", "Imam Mohammad Ibn Saud University",
  "King Fahd University of Petroleum & Minerals", "Umm Al-Qura University",
  "King Khalid University", "Taibah University", "Qassim University",
  "Jazan University", "Tabuk University", "Hail University",
  "Najran University", "Northern Borders University", "Shaqra University",
  "Majmaah University", "Prince Sattam bin Abdulaziz University",
  "Jeddah University", "Bisha University", "Hafr Al Batin University",
  "Prince Mohammad bin Fahd University", "Alfaisal University",
  "Effat University", "Dar Al Hekma University", "Arab Open University",
].sort();

const MAJORS = [
  { name: "Computer Science", sector: "IT" },
  { name: "Cybersecurity", sector: "IT" },
  { name: "Software Engineering", sector: "IT" },
  { name: "Data Science", sector: "IT" },
  { name: "Artificial Intelligence", sector: "IT" },
  { name: "Information Systems", sector: "IT" },
  { name: "Mechanical Engineering", sector: "Engineering" },
  { name: "Electrical Engineering", sector: "Engineering" },
  { name: "Civil Engineering", sector: "Engineering" },
  { name: "Chemical Engineering", sector: "Engineering" },
  { name: "Industrial Engineering", sector: "Engineering" },
  { name: "Petroleum Engineering", sector: "Engineering" },
  { name: "Architecture", sector: "Engineering" },
  { name: "Medicine", sector: "Medical" },
  { name: "Pharmacy", sector: "Medical" },
  { name: "Dentistry", sector: "Medical" },
  { name: "Nursing", sector: "Healthcare" },
  { name: "Public Health", sector: "Healthcare" },
  { name: "Business Administration", sector: "Business" },
  { name: "Finance", sector: "Business" },
  { name: "Marketing", sector: "Business" },
  { name: "Accounting", sector: "Business" },
  { name: "Human Resources", sector: "Business" },
  { name: "Supply Chain Management", sector: "Business" },
  { name: "Law", sector: "Law" },
  { name: "Islamic Studies", sector: "Humanities" },
  { name: "Arabic Language", sector: "Humanities" },
  { name: "English Language", sector: "Humanities" },
  { name: "Psychology", sector: "Humanities" },
  { name: "Mass Communication", sector: "Humanities" },
  { name: "Graphic Design", sector: "Arts" },
  { name: "Interior Design", sector: "Arts" },
  { name: "Mathematics", sector: "Science" },
  { name: "Physics", sector: "Science" },
  { name: "Chemistry", sector: "Science" },
  { name: "Biology", sector: "Science" },
  { name: "Education", sector: "Education" },
  { name: "Special Education", sector: "Education" },
].sort((a, b) => a.name.localeCompare(b.name));

const STEPS = [
  { title: "Academic Info", icon: GraduationCap, desc: "University, major & GPA" },
  { title: "Career Target", icon: Target, desc: "What role are you aiming for?" },
  { title: "Skills & Projects", icon: Briefcase, desc: "Add at least 1 project and skills" },
];

const StudentOnboarding = ({ userId, onComplete }: OnboardingProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form
  const [selectedUni, setSelectedUni] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [gpa, setGpa] = useState("");
  const [gpaScale, setGpaScale] = useState<"4" | "5">("4");
  const [careerTarget, setCareerTarget] = useState("");
  const [careerSearch, setCareerSearch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projects, setProjects] = useState<{ title: string; description: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: profileData } = await supabase
      .from("student_profiles")
      .select("university, major, gpa, gpa_scale, target_role")
      .eq("user_id", userId)
      .single();

    if (profileData) {
      setSelectedUni(profileData.university || "");
      setSelectedMajor(profileData.major || "");
      setGpa(profileData.gpa?.toString() || "");
      setGpaScale((profileData.gpa_scale as "4" | "5") || "4");
      setCareerTarget(profileData.target_role || "");
    }

    const { data: skillData } = await supabase
      .from("skill_matrix")
      .select("skill_name")
      .eq("user_id", userId);
    if (skillData) setSkills(skillData.map(s => s.skill_name));

    const { data: projData } = await supabase
      .from("student_projects")
      .select("title, description")
      .eq("user_id", userId);
    if (projData) setProjects(projData.map(p => ({ title: p.title, description: p.description || "" })));

    setLoading(false);
  };

  const progress = (() => {
    let p = 0;
    if (selectedUni) p += 15;
    if (selectedMajor) p += 15;
    if (gpa) p += 10;
    if (gpaScale) p += 5;
    if (careerTarget) p += 15;
    if (skills.length > 0) p += 15;
    if (projects.length > 0) p += 25;
    return Math.min(100, p);
  })();

  const canProceed = step === 0
    ? !!(selectedUni && selectedMajor && gpa && gpaScale)
    : step === 1
    ? !!careerTarget
    : skills.length > 0 && projects.length > 0;

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addProject = () => {
    if (projectTitle.trim()) {
      setProjects([...projects, { title: projectTitle.trim(), description: projectDesc.trim() }]);
      setProjectTitle("");
      setProjectDesc("");
    }
  };

  const handleComplete = async () => {
    if (progress < 90) {
      toast({ title: "Incomplete", description: "Please complete at least 90% of your profile.", variant: "destructive" });
      return;
    }
    setSaving(true);

    try {
      await supabase.from("student_profiles").update({
        university: selectedUni,
        major: selectedMajor,
        gpa: parseFloat(gpa) || 0,
        gpa_scale: gpaScale,
        target_role: careerTarget,
      }).eq("user_id", userId);

      for (const skillName of skills) {
        await supabase.from("skill_matrix").upsert({
          user_id: userId,
          skill_name: skillName,
          source: "self",
        }, { onConflict: "user_id,skill_name" });
      }

      const { data: existingProjects } = await supabase
        .from("student_projects")
        .select("title")
        .eq("user_id", userId);
      const existingTitles = new Set((existingProjects || []).map(p => p.title));

      for (const proj of projects) {
        if (!existingTitles.has(proj.title)) {
          await supabase.from("student_projects").insert({
            user_id: userId,
            title: proj.title,
            description: proj.description,
          });
        }
      }

      toast({ title: "Profile Complete!", description: "Welcome to HireQimah." });
      onComplete();
    } catch {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const selectedMajorData = MAJORS.find(m => m.name === selectedMajor);
  const careerSuggestions = selectedMajorData
    ? getCareerSuggestions(selectedMajorData.sector)
    : [];
  const filteredSuggestions = careerSearch
    ? careerSuggestions.filter(s => s.toLowerCase().includes(careerSearch.toLowerCase()))
    : careerSuggestions;

  if (loading) {
    return (
      <div className="container max-w-2xl py-12 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold font-heading">Complete Your Profile</h1>
        <p className="text-sm text-muted-foreground">90% completion required to access your dashboard</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{progress}% Complete</span>
          {progress >= 90 && <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"><CheckCircle className="h-3 w-3 mr-1" />Ready</Badge>}
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      <div className="flex gap-2 justify-center">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              step === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <s.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={step}
        className="rounded-xl border bg-card p-6 space-y-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold font-heading">{STEPS[step].title}</h2>
        <p className="text-sm text-muted-foreground">{STEPS[step].desc}</p>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>University *</Label>
              <Select value={selectedUni} onValueChange={setSelectedUni}>
                <SelectTrigger><SelectValue placeholder="Select university" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {SAUDI_UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Major *</Label>
              <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger><SelectValue placeholder="Select major" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {MAJORS.map(m => <SelectItem key={m.name} value={m.name}>{m.name} <span className="text-muted-foreground ml-1">({m.sector})</span></SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>GPA Scale *</Label>
                <Select value={gpaScale} onValueChange={v => setGpaScale(v as "4" | "5")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4.0 Scale</SelectItem>
                    <SelectItem value="5">5.0 Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>GPA *</Label>
                <Input
                  type="number" step="0.01" min="0" max={gpaScale === "5" ? 5 : 4}
                  placeholder={gpaScale === "5" ? "e.g. 4.50" : "e.g. 3.50"}
                  value={gpa} onChange={e => setGpa(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Search or type your target career role *</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="e.g., Cybersecurity Analyst, Data Scientist..."
                  value={careerTarget || careerSearch}
                  onChange={e => { setCareerSearch(e.target.value); setCareerTarget(e.target.value); }}
                />
              </div>
            </div>
            {filteredSuggestions.length > 0 && !careerTarget && (
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.slice(0, 12).map(s => (
                  <button key={s} onClick={() => { setCareerTarget(s); setCareerSearch(""); }}
                    className="px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {careerTarget && (
              <Badge className="text-sm bg-primary/10 text-primary">
                <Target className="h-3 w-3 mr-1" />{careerTarget}
                <button onClick={() => setCareerTarget("")} className="ml-2"><X className="h-3 w-3" /></button>
              </Badge>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Skills (add at least 1) *</Label>
              <div className="flex gap-2">
                <Input placeholder="e.g., Python, Project Management" value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                <Button type="button" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => (
                  <Badge key={s} variant="secondary">
                    {s}
                    <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="ml-1"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Projects (add at least 1) *</Label>
              <div className="space-y-2">
                <Input placeholder="Project title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
                <Input placeholder="Brief description (optional)" value={projectDesc} onChange={e => setProjectDesc(e.target.value)} />
                <Button type="button" size="sm" variant="outline" onClick={addProject} disabled={!projectTitle.trim()}>
                  <Plus className="h-4 w-4 mr-1" />Add Project
                </Button>
              </div>
              {projects.map((p, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--success))] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.title}</p>
                    {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                  </div>
                  <button onClick={() => setProjects(projects.filter((_, j) => j !== i))}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed}>
            Next<ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleComplete} disabled={progress < 90 || saving}>
            {saving ? "Saving..." : "Complete & Enter Dashboard"}
          </Button>
        )}
      </div>
    </div>
  );
};

function getCareerSuggestions(sector: string): string[] {
  const map: Record<string, string[]> = {
    IT: ["Software Engineer", "Cybersecurity Analyst", "Data Scientist", "AI Engineer", "Cloud Architect", "DevOps Engineer", "Full Stack Developer", "Systems Administrator", "IT Consultant", "Mobile Developer"],
    Engineering: ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Petroleum Engineer", "Chemical Engineer", "Project Engineer", "Quality Engineer", "Process Engineer"],
    Medical: ["Physician", "Surgeon", "Medical Researcher", "Clinical Specialist", "Pathologist"],
    Healthcare: ["Registered Nurse", "Pharmacist", "Physical Therapist", "Health Informatics Specialist", "Lab Technician", "Radiologist"],
    Business: ["Financial Analyst", "Marketing Manager", "HR Manager", "Management Consultant", "Accountant", "Supply Chain Manager", "Entrepreneur", "Business Analyst"],
    Law: ["Corporate Lawyer", "Legal Consultant", "Compliance Officer", "Contract Specialist", "Arbitration Specialist"],
    Humanities: ["Translator", "Content Writer", "Researcher", "Psychologist", "Social Worker", "Media Specialist"],
    Arts: ["UX Designer", "Graphic Designer", "Architect", "Interior Designer", "Art Director", "Media Producer"],
    Education: ["Teacher", "Curriculum Developer", "Education Consultant", "Special Education Specialist"],
    Science: ["Research Scientist", "Lab Analyst", "Environmental Scientist", "Statistician", "Data Analyst"],
  };
  return map[sector] || Object.values(map).flat().slice(0, 15);
}

export default StudentOnboarding;
