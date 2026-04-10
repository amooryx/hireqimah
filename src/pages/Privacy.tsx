import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Privacy = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">{t("privacy.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("privacy.updated")}</p>
        </div>

        <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s1.title")}</h2>
          <p>{t("privacy.s1.intro")}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("privacy.s1.i1")}</li>
            <li>{t("privacy.s1.i2")}</li>
            <li>{t("privacy.s1.i3")}</li>
            <li>{t("privacy.s1.i4")}</li>
            <li>{t("privacy.s1.i5")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s2.title")}</h2>
          <p>{t("privacy.s2.desc")}</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("privacy.s2.i1")}</li>
            <li>{t("privacy.s2.i2")}</li>
            <li>{t("privacy.s2.i3")}</li>
            <li>{t("privacy.s2.i4")}</li>
            <li>{t("privacy.s2.i5")}</li>
          </ul>
          <p>{t("privacy.s2.note")}</p>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s3.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("privacy.s3.i1")}</li>
            <li>{t("privacy.s3.i2")}</li>
            <li>{t("privacy.s3.i3")}</li>
            <li>{t("privacy.s3.i4")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s4.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("privacy.s4.i1")}</li>
            <li>{t("privacy.s4.i2")}</li>
            <li>{t("privacy.s4.i3")}</li>
            <li>{t("privacy.s4.i4")}</li>
            <li>{t("privacy.s4.i5")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s5.title")}</h2>
          <p>{t("privacy.s5.desc")}</p>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("privacy.s6.title")}</h2>
          <p>{t("privacy.s6.desc")} <Link to="/contact" className="text-primary hover:underline">{t("privacy.contactPage")}</Link>.</p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
