import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Terms = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2">{t("terms.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("terms.updated")}</p>
        </div>

        <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s1.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("terms.s1.i1")}</li>
            <li>{t("terms.s1.i2")}</li>
            <li>{t("terms.s1.i3")}</li>
            <li>{t("terms.s1.i4")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s2.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("terms.s2.i1")}</li>
            <li>{t("terms.s2.i2")}</li>
            <li>{t("terms.s2.i3")}</li>
            <li>{t("terms.s2.i4")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s3.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("terms.s3.i1")}</li>
            <li>{t("terms.s3.i2")}</li>
            <li>{t("terms.s3.i3")}</li>
            <li>{t("terms.s3.i4")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s4.title")}</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t("terms.s4.i1")}</li>
            <li>{t("terms.s4.i2")}</li>
            <li>{t("terms.s4.i3")}</li>
            <li>{t("terms.s4.i4")}</li>
          </ul>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s5.title")}</h2>
          <p>{t("terms.s5.desc")}</p>

          <h2 className="text-lg font-semibold text-foreground font-heading">{t("terms.s6.title")}</h2>
          <p>{t("terms.s6.desc")} <Link to="/contact" className="text-primary hover:underline">{t("footer.contact")}</Link></p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
