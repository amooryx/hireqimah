import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Globe, Shield, Award } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="container max-w-3xl py-12 md:py-16 space-y-10 flex-1">
        <div className="text-center">
          <img src={logo} alt="HireQimah" className="h-10 mx-auto mb-5" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t("about.title")}</h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">{t("about.desc")}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold font-heading">{t("about.mission")}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("about.mission.desc")}</p>
        </div>

        <div>
          <h2 className="text-base font-bold font-heading mb-4 text-center">{t("about.values")}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: t("about.transparency"), desc: t("about.transparency.desc") },
              { icon: Globe, title: t("about.alignment"), desc: t("about.alignment.desc") },
              { icon: Award, title: t("about.meritocracy"), desc: t("about.meritocracy.desc") },
            ].map((v) => (
              <div key={v.title} className="rounded-lg border bg-card p-5">
                <v.icon className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold font-heading text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-accent/40 p-6 text-center">
          <Globe className="h-5 w-5 text-[hsl(var(--deep-green))] mx-auto mb-3" />
          <h2 className="text-base font-bold font-heading mb-2">{t("about.vision2030")}</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">{t("about.vision2030.desc")}</p>
        </div>

        <div className="text-center">
          <h2 className="text-base font-bold font-heading mb-3">{t("about.cta")}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={() => navigate("/signup?role=student")}>{t("hero.joinStudent")}</Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/signup?role=hr")}>{t("hero.joinEmployer")}</Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/signup?role=university")}>{t("hero.joinUniversity")}</Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
