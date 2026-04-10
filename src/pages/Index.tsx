import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap, Building2, University, BarChart3, CheckCircle,
  ArrowRight, Trophy, Brain, Cpu, TrendingUp, Map, Briefcase,
  BookOpen, Award, Globe, Target, Users, Shield, Zap, Eye,
  FileCheck, Lock
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/hireqimah-logo.png";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden min-h-[640px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(203,79%,10%)/0.95] via-[hsl(203,79%,15%)/0.90] to-[hsl(217,80%,30%)/0.75]" />

        <div className="relative container py-20 md:py-28 z-10">
          <div className="max-w-2xl">
            <motion.img src={logo} alt="HireQimah" className="h-14 md:h-18 mb-6 drop-shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            >
              AI-Powered<br />Employability<br /><span className="text-[hsl(207,89%,80%)]">Intelligence</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              HireQimah helps companies identify the most job-ready graduates and helps students prepare for real Saudi labor market demand — powered by verified data and AI analysis of 100+ live job postings.
            </motion.p>

            <motion.div className="space-y-1 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {[
                "Transparent Employment Readiness Scores (ERS)",
                "Market-driven certification and skill valuations",
                "Verified academic records and project portfolios",
              ].map((t) => (
                <p key={t} className="text-sm text-white/80 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--gold))] shrink-0" />{t}
                </p>
              ))}
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 justify-center sm:justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Button size="lg" className="bg-[hsl(207,89%,80%)] text-[hsl(203,79%,10%)] shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-[hsl(207,89%,85%)]" onClick={() => navigate("/signup?role=student")}>
                <GraduationCap className="h-5 w-5" />Sign Up as Student
              </Button>
              <Button size="lg" className="bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-secondary/90" onClick={() => navigate("/signup?role=hr")}>
                <Briefcase className="h-5 w-5" />Sign Up as HR
              </Button>
              <Button size="lg" className="bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-secondary/90" onClick={() => navigate("/signup?role=university")}>
                <Building2 className="h-5 w-5" />Sign Up as University
              </Button>
            </motion.div>

            <motion.p className="mt-6 text-white/50 text-xs tracking-wide uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              The first Employment Readiness Infrastructure for Saudi Arabia
            </motion.p>
          </div>
        </div>
      </section>

      {/* ───────── HOW ERS WORKS ───────── */}
      <section id="features" className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">How ERS Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Employment Readiness Score combines multiple verified data sources into one transparent, market-driven score.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: "1", icon: BookOpen, title: "Upload Verified Records", desc: "Transcripts, certifications, and projects are verified with SHA-256 integrity checks." },
            { step: "2", icon: TrendingUp, title: "AI Market Analysis", desc: "We analyze 100+ real Saudi job postings to determine which skills and certifications matter." },
            { step: "3", icon: Cpu, title: "Dynamic Scoring", desc: "Each category (Academic, Certifications, Projects, Soft Skills) is scored with market-driven weights." },
            { step: "4", icon: Trophy, title: "Ranked & Discoverable", desc: "Students appear on leaderboards. Employers filter by ERS, major, and certifications." },
          ].map((s, i) => (
            <motion.div key={s.step} className="relative rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1">{s.step}</span>
              <s.icon className="h-8 w-8 text-primary mx-auto mb-3 mt-2" />
              <h3 className="font-semibold font-heading mb-1 text-sm">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── WHY COMPANIES TRUST ERS ───────── */}
      <section id="for-companies" className="bg-accent/50 py-16 md:py-20">
        <div className="container">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Why Companies Trust ERS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ERS eliminates guesswork in graduate hiring by providing verified, market-calibrated readiness signals.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileCheck, title: "Verified Documents", desc: "Every transcript and certification is integrity-checked. No inflated credentials pass through." },
              { icon: TrendingUp, title: "Real Market Data", desc: "Scores reflect actual Saudi job demand from LinkedIn, Bayt, GulfTalent, Indeed, and Jadarat." },
              { icon: Eye, title: "Full Transparency", desc: "HR can see exactly how each score component was calculated — no black boxes." },
            ].map((item, i) => (
              <motion.div key={item.title} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW UNIVERSITIES BENEFIT ───────── */}
      <section className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <University className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">How Universities Benefit</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: BarChart3, title: "Cohort Analytics", desc: "Track average ERS by department and identify underperforming programs before graduation." },
            { icon: Target, title: "Market Congruence", desc: "See if your graduate supply matches employer demand with the Market Congruence Index." },
            { icon: Map, title: "Curriculum Alignment", desc: "Skill demand heatmaps show which certifications and skills employers actually require." },
          ].map((item, i) => (
            <motion.div key={item.title} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── STAKEHOLDER CTAs ───────── */}
      <section id="for-students" className="bg-accent/50 py-16 md:py-20">
        <div className="container">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Built for Every Stakeholder</h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
            {[
              { icon: GraduationCap, emoji: "🎓", title: "Students", desc: "Build a verified employability profile. Get AI career roadmaps. Track your ERS against peers.", cta: "Sign Up as Student", path: "/signup?role=student" },
              { icon: Building2, emoji: "🏢", title: "Employers", desc: "Discover ranked talent. Filter by skills, certifications, and ERS. Manage a full hiring pipeline.", cta: "Sign Up as HR", path: "/signup?role=hr" },
              { icon: University, emoji: "🏛️", title: "Universities", desc: "Monitor student readiness by cohort. Align curriculum with market demand. Verify records.", cta: "Sign Up as University", path: "/signup?role=university" },
            ].map((r, i) => (
              <motion.div key={r.title} className="rounded-xl border bg-card p-6 shadow-sm flex flex-col h-full" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-heading mb-1">{r.emoji} {r.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{r.desc}</p>
                <Button variant="outline" className="w-full mt-auto" onClick={() => navigate(r.path)}>
                  {r.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PLATFORM CAPABILITIES ───────── */}
      <section className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">Platform Capabilities</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            { icon: Cpu, label: "Dynamic ERS Engine" },
            { icon: Brain, label: "AI Career Roadmaps" },
            { icon: Award, label: "Certification Intelligence" },
            { icon: TrendingUp, label: "Live Market Dashboard" },
            { icon: Trophy, label: "National Leaderboards" },
          ].map((cap, i) => (
            <motion.div key={cap.label} className="rounded-xl border bg-card p-5 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.08 }}>
              <cap.icon className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">{cap.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── LEADERBOARDS ───────── */}
      <section className="bg-accent/50 py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <Trophy className="h-10 w-10 text-[hsl(var(--gold))] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">National Talent Leaderboards</h2>
            <p className="text-muted-foreground mb-4">
              Ranked by ERS with verification badges for certified transcripts, projects, and credentials.
            </p>
            <Button variant="outline" className="mt-2" onClick={() => navigate("/leaderboard")}>
              View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── VISION 2030 ───────── */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Globe className="h-10 w-10 text-[hsl(var(--deep-green))] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">Aligned with Saudi Vision 2030</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireQimah supports Saudi Arabia's workforce transformation by connecting education outcomes with labor market demand and enabling transparent employability signals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="container py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6">Start Building Your Qimah</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=student")}>
                <GraduationCap className="mr-2 h-5 w-5" />Sign Up as Student
              </Button>
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=hr")}>
                <Building2 className="mr-2 h-5 w-5" />Sign Up as HR
              </Button>
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=university")}>
                <University className="mr-2 h-5 w-5" />Sign Up as University
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <button onClick={() => navigate("/auth/select-role?mode=signin")} className="text-primary hover:underline font-medium">
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t bg-card py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="HireQimah" className="h-8" />
              <span className="text-sm text-muted-foreground">Employability Intelligence Platform</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">About</button>
              <button onClick={() => navigate("/founders")} className="hover:text-primary transition-colors">Team</button>
              <button onClick={() => navigate("/security")} className="hover:text-primary transition-colors">Security</button>
              <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">Privacy</button>
              <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">Terms</button>
              <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">Contact</button>
              <button onClick={() => navigate("/leaderboard")} className="hover:text-primary transition-colors">Leaderboard</button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">© {new Date().getFullYear()} HireQimah. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
