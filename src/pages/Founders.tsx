import { Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const Founders = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="container max-w-3xl py-12 md:py-16 space-y-8 flex-1">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-3">{t("founders.title")}</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("founders.desc")}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-md bg-primary/8 flex items-center justify-center">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-heading">{t("founders.teamName")}</h2>
              <p className="text-xs text-muted-foreground">{t("founders.teamRole")}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("founders.teamBio")}</p>
        </div>

        <div className="rounded-lg border bg-accent/40 p-6 text-center">
          <h3 className="font-semibold font-heading text-sm mb-1">{t("founders.joinMission")}</h3>
          <p className="text-xs text-muted-foreground">
            {t("founders.joinDesc")}{" "}
            <a href="mailto:team@hireqimah.com" className="text-primary hover:underline">team@hireqimah.com</a>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Founders;
