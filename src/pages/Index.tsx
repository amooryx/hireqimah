import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap, Building2, University, BarChart3,
  ArrowRight, Trophy, TrendingUp, Globe, Shield,
  FileCheck, Compass, Award, Target, Users, BookOpen,
  ChevronRight,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/hireqimah-logo.png";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

const Index = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 hero-gradient opacity-95" />

        <div className="relative container py-16 md:py-24 z-10">
          <div className="max-w-xl">
            <motion.img
              src={logo}
              alt="HireQimah"
              className="h-10 md:h-12 mb-5 brightness-0 invert"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            />

            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            >
              {t("hero.headline").split("\n").map((line, i) => (
                <h1 key={i} className={`text-2xl md:text-4xl lg:text-[2.75rem] font-bold font-heading text-white leading-tight ${i > 0 ? "mt-2" : ""}`}>
                  {line}
                </h1>
              ))}
            </motion.div>

            <motion.p
              className="text-sm md:text-base text-white/85 mb-6 leading-relaxed max-w-lg"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div className="flex flex-wrap gap-2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Button
                size="lg"
                className="bg-white text-secondary shadow hover:bg-white/95 font-semibold h-11 px-5 text-sm"
                onClick={() => navigate("/signup?role=student")}
              >
                <GraduationCap className="h-4 w-4" />{t("hero.joinStudent")}
              </Button>
              <Button
                size="lg"
                className="bg-white/12 backdrop-blur text-white border border-white/25 font-semibold h-11 px-5 text-sm hover:bg-white/20"
                onClick={() => navigate("/signup?role=hr")}
              >
                <Building2 className="h-4 w-4" />{t("hero.joinEmployer")}
              </Button>
              <Button
                size="lg"
                className="bg-white/12 backdrop-blur text-white border border-white/25 font-semibold h-11 px-5 text-sm hover:bg-white/20"
                onClick={() => navigate("/signup?role=university")}
              >
                <University className="h-4 w-4" />{t("hero.joinUniversity")}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────── FOR STUDENTS ───────── */}
      <section id="for-students" className="container py-14 md:py-16">
        <motion.div className="text-center mb-8" {...fadeUp}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary mb-3">
            <GraduationCap className="h-3.5 w-3.5" />{t("students.title")}
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("students.title")}</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("students.desc")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: BarChart3, title: t("students.f1.title"), desc: t("students.f1.desc") },
            { icon: Compass, title: t("students.f2.title"), desc: t("students.f2.desc") },
            { icon: Trophy, title: t("students.f3.title"), desc: t("students.f3.desc") },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-lg border bg-card p-5" {...fadeUp} transition={{ delay: i * 0.08 }}>
              <item.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-semibold font-heading text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── FOR EMPLOYERS ───────── */}
      <section id="for-companies" className="bg-accent/40 py-14 md:py-16">
        <div className="container">
          <motion.div className="text-center mb-8" {...fadeUp}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary mb-3">
              <Building2 className="h-3.5 w-3.5" />{t("employers.title")}
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("employers.title")}</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("employers.desc")}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: FileCheck, title: t("employers.f1.title"), desc: t("employers.f1.desc") },
              { icon: Target, title: t("employers.f2.title"), desc: t("employers.f2.desc") },
              { icon: Users, title: t("employers.f3.title"), desc: t("employers.f3.desc") },
            ].map((item, i) => (
              <motion.div key={i} className="rounded-lg border bg-card p-5" {...fadeUp} transition={{ delay: i * 0.08 }}>
                <item.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold font-heading text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FOR UNIVERSITIES ───────── */}
      <section className="container py-14 md:py-16">
        <motion.div className="text-center mb-8" {...fadeUp}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary mb-3">
            <University className="h-3.5 w-3.5" />{t("uni.title")}
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("uni.title")}</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("uni.desc")}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { icon: BarChart3, title: t("uni.f1.title"), desc: t("uni.f1.desc") },
            { icon: TrendingUp, title: t("uni.f2.title"), desc: t("uni.f2.desc") },
            { icon: Award, title: t("uni.f3.title"), desc: t("uni.f3.desc") },
          ].map((item, i) => (
            <motion.div key={i} className="rounded-lg border bg-card p-5" {...fadeUp} transition={{ delay: i * 0.08 }}>
              <item.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-semibold font-heading text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── WHAT IS ERS ───────── */}
      <section id="features" className="bg-accent/40 py-14 md:py-16">
        <div className="container">
          <motion.div className="text-center mb-8" {...fadeUp}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary mb-3">
              <Shield className="h-3.5 w-3.5" />ERS
            </span>
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("ers.title")}</h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("ers.desc")}</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { step: "1", icon: BookOpen, title: t("ers.step1.title"), desc: t("ers.step1.desc") },
              { step: "2", icon: TrendingUp, title: t("ers.step2.title"), desc: t("ers.step2.desc") },
              { step: "3", icon: Trophy, title: t("ers.step3.title"), desc: t("ers.step3.desc") },
            ].map((s, i) => (
              <motion.div key={s.step} className="relative rounded-lg border bg-card p-5 text-center" {...fadeUp} transition={{ delay: i * 0.08 }}>
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-0.5">{s.step}</span>
                <s.icon className="h-5 w-5 text-primary mx-auto mb-2 mt-1" />
                <h3 className="font-semibold font-heading text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── RANKINGS ───────── */}
      <section className="container py-14 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <Trophy className="h-7 w-7 text-primary mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("leaderboard.title")}</h2>
            <p className="text-sm text-muted-foreground mb-5">{t("leaderboard.desc")}</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/leaderboard")}>
              {t("leaderboard.cta")} <ChevronRight className="ltr:ml-1 rtl:mr-1 h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ───────── VISION 2030 ───────── */}
      <section className="bg-accent/40 py-14 md:py-16">
        <div className="container max-w-2xl text-center">
          <motion.div {...fadeUp}>
            <Globe className="h-7 w-7 text-[hsl(var(--deep-green))] mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("vision.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("vision.desc")}</p>
          </motion.div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="container py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-xl md:text-2xl font-bold font-heading mb-2">{t("cta.title")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t("cta.subtitle")}</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <Button className="font-semibold h-10 px-6 text-sm" onClick={() => navigate("/auth/select-role?mode=signup")}>
                <GraduationCap className="ltr:mr-1.5 rtl:ml-1.5 h-4 w-4" />{t("hero.cta.start")}
              </Button>
              <Button variant="outline" className="font-semibold h-10 px-6 text-sm" onClick={() => navigate("/leaderboard")}>
                <Trophy className="ltr:mr-1.5 rtl:ml-1.5 h-4 w-4" />{t("hero.cta.rankings")}
              </Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              {t("cta.already")}{" "}
              <button onClick={() => navigate("/auth/select-role?mode=signin")} className="text-primary hover:underline font-medium">
                {t("nav.signin")}
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
