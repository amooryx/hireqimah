import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, Globe, Shield, Award } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { useI18n } from "@/lib/i18n";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const About = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <section className="container max-w-4xl py-16 md:py-24 space-y-16">
        <motion.div className="text-center" {...fadeUp}>
          <img src={logo} alt="HireQimah" className="h-14 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t("about.title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("about.desc")}</p>
        </motion.div>

        <motion.div className="rounded-xl border bg-card p-8" {...fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold font-heading">{t("about.mission")}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("about.mission.desc")}</p>
        </motion.div>

        <motion.div {...fadeUp}>
          <h2 className="text-xl font-bold font-heading mb-6 text-center">{t("about.values")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t("about.transparency"), desc: t("about.transparency.desc") },
              { icon: Globe, title: t("about.alignment"), desc: t("about.alignment.desc") },
              { icon: Award, title: t("about.meritocracy"), desc: t("about.meritocracy.desc") },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border bg-card p-6 text-center">
                <v.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold font-heading mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="rounded-xl border bg-accent/50 p-8 text-center" {...fadeUp}>
          <Globe className="h-8 w-8 text-[hsl(var(--deep-green))] mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-3">{t("about.vision2030")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("about.vision2030.desc")}</p>
        </motion.div>

        <motion.div className="text-center" {...fadeUp}>
          <h2 className="text-xl font-bold font-heading mb-4">{t("about.cta")}</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/signup?role=student")}>{t("hero.joinStudent")}</Button>
            <Button variant="outline" onClick={() => navigate("/signup?role=hr")}>{t("hero.joinEmployer")}</Button>
            <Button variant="outline" onClick={() => navigate("/signup?role=university")}>{t("hero.joinUniversity")}</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
