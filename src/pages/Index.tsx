import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap, Building2, University, BarChart3, CheckCircle,
  ArrowRight, Trophy, TrendingUp, Globe, Users, Shield,
  FileCheck, Compass, Award, Briefcase, BookOpen, Target,
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
  const { t, lang } = useI18n();

  return (
    <div className="min-h-screen bg-background">

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(203,79%,10%)/0.95] via-[hsl(203,79%,15%)/0.90] to-[hsl(217,80%,30%)/0.75]" />

        <div className="relative container py-20 md:py-28 z-10">
          <div className="max-w-2xl">
            <motion.img src={logo} alt="HireQimah" className="h-14 md:h-16 mb-6 drop-shadow-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

            <motion.h1
              className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold font-heading text-white mb-5 leading-tight whitespace-pre-line"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
            >
              {t("hero.headline")}
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <Button
                size="lg"
                className="bg-white text-[hsl(203,79%,10%)] shadow-lg hover:shadow-xl font-semibold px-6 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-white/90"
                onClick={() => navigate("/signup?role=student")}
              >
                <GraduationCap className="h-5 w-5" />{t("hero.joinStudent")}
              </Button>
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur text-white border border-white/30 shadow-lg hover:shadow-xl font-semibold px-6 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-white/25"
                onClick={() => navigate("/signup?role=hr")}
              >
                <Building2 className="h-5 w-5" />{t("hero.joinEmployer")}
              </Button>
              <Button
                size="lg"
                className="bg-white/15 backdrop-blur text-white border border-white/30 shadow-lg hover:shadow-xl font-semibold px-6 h-12 text-base hover:-translate-y-0.5 transition-all hover:bg-white/25"
                onClick={() => navigate("/signup?role=university")}
              >
                <University className="h-5 w-5" />{t("hero.joinUniversity")}
              </Button>
            </motion.div>
            <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Button
                size="lg"
                variant="link"
                className="text-white/80 hover:text-white font-medium px-0"
                onClick={() => navigate("/leaderboard")}
              >
                <Trophy className="h-5 w-5" />{t("hero.cta.rankings")}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── FOR STUDENTS ───────── */}
      <section id="for-students" className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("students.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("students.desc")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: BarChart3, title: t("students.f1.title"), desc: t("students.f1.desc") },
            { icon: Compass, title: t("students.f2.title"), desc: t("students.f2.desc") },
            { icon: Trophy, title: t("students.f3.title"), desc: t("students.f3.desc") },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── FOR EMPLOYERS ───────── */}
      <section id="for-companies" className="bg-accent/50 py-16 md:py-20">
        <div className="container">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("employers.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("employers.desc")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: FileCheck, title: t("employers.f1.title"), desc: t("employers.f1.desc") },
              { icon: Target, title: t("employers.f2.title"), desc: t("employers.f2.desc") },
              { icon: Users, title: t("employers.f3.title"), desc: t("employers.f3.desc") },
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

      {/* ───────── FOR UNIVERSITIES ───────── */}
      <section className="container py-16 md:py-20">
        <motion.div className="text-center mb-10" {...fadeUp}>
          <University className="h-8 w-8 text-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("uni.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("uni.desc")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: BarChart3, title: t("uni.f1.title"), desc: t("uni.f1.desc") },
            { icon: TrendingUp, title: t("uni.f2.title"), desc: t("uni.f2.desc") },
            { icon: Award, title: t("uni.f3.title"), desc: t("uni.f3.desc") },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
              <item.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold font-heading mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── WHAT IS ERS ───────── */}
      <section id="features" className="bg-accent/50 py-16 md:py-20">
        <div className="container">
          <motion.div className="text-center mb-10" {...fadeUp}>
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("ers.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("ers.desc")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", icon: BookOpen, title: t("ers.step1.title"), desc: t("ers.step1.desc") },
              { step: "2", icon: TrendingUp, title: t("ers.step2.title"), desc: t("ers.step2.desc") },
              { step: "3", icon: Trophy, title: t("ers.step3.title"), desc: t("ers.step3.desc") },
            ].map((s, i) => (
              <motion.div key={s.step} className="relative rounded-xl border bg-card p-6 text-center shadow-sm" {...fadeUp} transition={{ delay: i * 0.1 }}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1">{s.step}</span>
                <s.icon className="h-8 w-8 text-primary mx-auto mb-3 mt-2" />
                <h3 className="font-semibold font-heading mb-1 text-sm">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── RANKINGS ───────── */}
      <section className="container py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t("leaderboard.title")}</h2>
            <p className="text-muted-foreground mb-6">{t("leaderboard.desc")}</p>
            <Button variant="outline" onClick={() => navigate("/leaderboard")}>
              {t("leaderboard.cta")} <ArrowRight className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── VISION 2030 ───────── */}
      <section className="bg-accent/50 py-16 md:py-20">
        <div className="container max-w-3xl text-center">
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
            <h2 className="text-2xl md:text-4xl font-bold font-heading mb-3">{t("cta.title")}</h2>
            <p className="text-muted-foreground mb-8">{t("cta.subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="font-semibold px-8 h-12" onClick={() => navigate("/auth/select-role?mode=signup")}>
                <GraduationCap className="ltr:mr-2 rtl:ml-2 h-5 w-5" />{t("hero.cta.start")}
              </Button>
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12" onClick={() => navigate("/leaderboard")}>
                <Trophy className="ltr:mr-2 rtl:ml-2 h-5 w-5" />{t("hero.cta.rankings")}
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
