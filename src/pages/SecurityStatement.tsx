import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const SecurityStatement = () => {
  const { t } = useI18n();

  const sections = [
    {
      icon: Lock, title: t("security.auth"),
      items: [t("security.auth.i1"), t("security.auth.i2"), t("security.auth.i3"), t("security.auth.i4"), t("security.auth.i5")],
    },
    {
      icon: Eye, title: t("security.privacy"),
      items: [t("security.privacy.i1"), t("security.privacy.i2"), t("security.privacy.i3"), t("security.privacy.i4")],
    },
    {
      icon: Server, title: t("security.infra"),
      items: [t("security.infra.i1"), t("security.infra.i2"), t("security.infra.i3"), t("security.infra.i4")],
    },
    {
      icon: FileCheck, title: t("security.docs"),
      items: [t("security.docs.i1"), t("security.docs.i2"), t("security.docs.i3"), t("security.docs.i4")],
    },
    {
      icon: AlertTriangle, title: t("security.owasp"),
      items: [t("security.owasp.i1"), t("security.owasp.i2"), t("security.owasp.i3"), t("security.owasp.i4"), t("security.owasp.i5")],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="container max-w-3xl py-16 md:py-24 space-y-10">
        <motion.div className="text-center" {...fadeUp}>
          <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">{t("security.title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("security.desc")}</p>
        </motion.div>

        {sections.map((section) => (
          <motion.div key={section.title} className="rounded-xl border bg-card p-6" {...fadeUp}>
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold font-heading">{section.title}</h2>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>{item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div className="text-center text-sm text-muted-foreground" {...fadeUp}>
          <p>{t("security.contact")} <a href="mailto:security@hireqimah.com" className="text-primary hover:underline">security@hireqimah.com</a></p>
        </motion.div>
      </section>
    </div>
  );
};

export default SecurityStatement;
