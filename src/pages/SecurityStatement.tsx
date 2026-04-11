import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const SecurityStatement = () => {
  const { t } = useI18n();

  const sections = [
    { icon: Lock, title: t("security.auth"), items: [t("security.auth.i1"), t("security.auth.i2"), t("security.auth.i3"), t("security.auth.i4"), t("security.auth.i5")] },
    { icon: Eye, title: t("security.privacy"), items: [t("security.privacy.i1"), t("security.privacy.i2"), t("security.privacy.i3"), t("security.privacy.i4")] },
    { icon: Server, title: t("security.infra"), items: [t("security.infra.i1"), t("security.infra.i2"), t("security.infra.i3"), t("security.infra.i4")] },
    { icon: FileCheck, title: t("security.docs"), items: [t("security.docs.i1"), t("security.docs.i2"), t("security.docs.i3"), t("security.docs.i4")] },
    { icon: AlertTriangle, title: t("security.owasp"), items: [t("security.owasp.i1"), t("security.owasp.i2"), t("security.owasp.i3"), t("security.owasp.i4"), t("security.owasp.i5")] },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <section className="container max-w-3xl py-12 md:py-16 space-y-6 flex-1">
        <div className="text-center">
          <Shield className="h-7 w-7 text-primary mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-2">{t("security.title")}</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{t("security.desc")}</p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <section.icon className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold font-heading">{section.title}</h2>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 text-[10px]">●</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="text-center text-xs text-muted-foreground">
          {t("security.contact")} <a href="mailto:security@hireqimah.com" className="text-primary hover:underline">security@hireqimah.com</a>
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default SecurityStatement;
