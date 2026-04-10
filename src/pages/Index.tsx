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
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

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
              {t("hero.title1")}<br />{t("hero.title2")}<br /><span className="text-[hsl(207,89%,80%)]">{t("hero.title3")}</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90 mb-6 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div className="space-y-1 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {[t("hero.check1"), t("hero.check2"), t("hero.check3")].map((text) => (
                <p key={text} className="text-sm text-white/80 flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--gold))] shrink-0" />{text}
                </p>
              ))}
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 justify-center sm:justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Button size="lg" className="bg-[hsl(207,89%,80%)] text-[hsl(203,79%,10%)] shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-[hsl(207,89%,85%)]" onClick={() => navigate("/signup?role=student")}>
                <GraduationCap className="h-5 w-5" />{t("hero.cta.student")}
              </Button>
              <Button size="lg" className="bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-secondary/90" onClick={() => navigate("/signup?role=hr")}>
                <Briefcase className="h-5 w-5" />{t("hero.cta.hr")}
              </Button>
              <Button size="lg" className="bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl font-semibold px-8 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-secondary/90" onClick={() => navigate("/signup?role=university")}>
                <Building2 className="h-5 w-5" />{t("hero.cta.university")}
              </Button>
            </motion.div>

            <motion.p className="mt-6 text-white/50 text-xs tracking-wide uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {t("hero.tagline")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ───────── HOW ERS WORKS ───────── */}
      <section id="features" className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("ers.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("ers.desc")}</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: "1", icon: BookOpen, title: t("ers.step1.title"), desc: t("ers.step1.desc") },
            { step: "2", icon: TrendingUp, title: t("ers.step2.title"), desc: t("ers.step2.desc") },
            { step: "3", icon: Cpu, title: t("ers.step3.title"), desc: t("ers.step3.desc") },
            { step: "4", icon: Trophy, title: t("ers.step4.title"), desc: t("ers.step4.desc") },
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
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("companies.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("companies.desc")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileCheck, title: t("companies.verified.title"), desc: t("companies.verified.desc") },
              { icon: TrendingUp, title: t("companies.market.title"), desc: t("companies.market.desc") },
              { icon: Eye, title: t("companies.transparent.title"), desc: t("companies.transparent.desc") },
            ].map((item, i) => (
              <motion.div key={i} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
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
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("uni.title")}</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: BarChart3, title: t("uni.cohort.title"), desc: t("uni.cohort.desc") },
            { icon: Target, title: t("uni.congruence.title"), desc: t("uni.congruence.desc") },
            { icon: Map, title: t("uni.curriculum.title"), desc: t("uni.curriculum.desc") },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
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
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("stakeholders.title")}</h2>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
            {[
              { icon: GraduationCap, emoji: "🎓", title: t("stakeholders.students.title"), desc: t("stakeholders.students.desc"), cta: t("hero.cta.student"), path: "/signup?role=student" },
              { icon: Building2, emoji: "🏢", title: t("stakeholders.employers.title"), desc: t("stakeholders.employers.desc"), cta: t("hero.cta.hr"), path: "/signup?role=hr" },
              { icon: University, emoji: "🏛️", title: t("stakeholders.universities.title"), desc: t("stakeholders.universities.desc"), cta: t("hero.cta.university"), path: "/signup?role=university" },
            ].map((r, i) => (
              <motion.div key={i} className="rounded-xl border bg-card p-6 shadow-sm flex flex-col h-full" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <r.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-heading mb-1">{r.emoji} {r.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{r.desc}</p>
                <Button variant="outline" className="w-full mt-auto" onClick={() => navigate(r.path)}>
                  {r.cta} <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PLATFORM CAPABILITIES ───────── */}
      <section className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("capabilities.title")}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {[
            { icon: Cpu, label: t("cap.ers") },
            { icon: Brain, label: t("cap.ai") },
            { icon: Award, label: t("cap.cert") },
            { icon: TrendingUp, label: t("cap.market") },
            { icon: Trophy, label: t("cap.leaderboard") },
          ].map((cap, i) => (
            <motion.div key={i} className="rounded-xl border bg-card p-5 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.08 }}>
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
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t("leaderboard.title")}</h2>
            <p className="text-muted-foreground mb-4">{t("leaderboard.desc")}</p>
            <Button variant="outline" className="mt-2" onClick={() => navigate("/leaderboard")}>
              {t("leaderboard.cta")} <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── VISION 2030 ───────── */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Globe className="h-10 w-10 text-[hsl(var(--deep-green))] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t("vision.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">{t("vision.desc")}</p>
          </motion.div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="container py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6">{t("cta.title")}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=student")}>
                <GraduationCap className="ltr:mr-2 rtl:ml-2 h-5 w-5" />{t("hero.cta.student")}
              </Button>
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=hr")}>
                <Building2 className="ltr:mr-2 rtl:ml-2 h-5 w-5" />{t("hero.cta.hr")}
              </Button>
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12" onClick={() => navigate("/signup?role=university")}>
                <University className="ltr:mr-2 rtl:ml-2 h-5 w-5" />{t("hero.cta.university")}
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {t("cta.already")}{" "}
              <button onClick={() => navigate("/auth/select-role?mode=signin")} className="text-primary hover:underline font-medium">
                {t("nav.signin")}
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
              <span className="text-sm text-muted-foreground">{t("footer.tagline")}</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate("/about")} className="hover:text-primary transition-colors">{t("footer.about")}</button>
              <button onClick={() => navigate("/founders")} className="hover:text-primary transition-colors">{t("footer.team")}</button>
              <button onClick={() => navigate("/security")} className="hover:text-primary transition-colors">{t("footer.security")}</button>
              <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">{t("footer.privacy")}</button>
              <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">{t("footer.terms")}</button>
              <button onClick={() => navigate("/contact")} className="hover:text-primary transition-colors">{t("footer.contact")}</button>
              <button onClick={() => navigate("/leaderboard")} className="hover:text-primary transition-colors">{t("footer.leaderboard")}</button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">© {new Date().getFullYear()} HireQimah. {t("footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
