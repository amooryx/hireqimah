import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const Founders = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <section className="container max-w-3xl py-16 md:py-24 space-y-12">
        <motion.div className="text-center" {...fadeUp}>
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t("founders.title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("founders.desc")}</p>
        </motion.div>

        <motion.div className="rounded-xl border bg-card p-8" {...fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">{t("founders.teamName")}</h2>
              <p className="text-sm text-muted-foreground">{t("founders.teamRole")}</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("founders.teamBio")}</p>
        </motion.div>

        <motion.div className="rounded-xl border bg-accent/50 p-8 text-center" {...fadeUp}>
          <h3 className="font-semibold font-heading mb-2">{t("founders.joinMission")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("founders.joinDesc")}{" "}
            <a href="mailto:team@hireqimah.com" className="text-primary hover:underline">team@hireqimah.com</a>
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Founders;
