import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const Terms = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-3xl py-12 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading mb-1">{t("terms.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("terms.updated")}</p>
        </div>

        <section className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: t("terms.s1.title"), items: [t("terms.s1.i1"), t("terms.s1.i2"), t("terms.s1.i3"), t("terms.s1.i4")] },
            { title: t("terms.s2.title"), items: [t("terms.s2.i1"), t("terms.s2.i2"), t("terms.s2.i3"), t("terms.s2.i4")] },
            { title: t("terms.s3.title"), items: [t("terms.s3.i1"), t("terms.s3.i2"), t("terms.s3.i3"), t("terms.s3.i4")] },
            { title: t("terms.s4.title"), items: [t("terms.s4.i1"), t("terms.s4.i2"), t("terms.s4.i3"), t("terms.s4.i4")] },
            { title: t("terms.s5.title"), intro: t("terms.s5.desc") },
            { title: t("terms.s6.title"), intro: t("terms.s6.desc") },
          ].map((section) => (
            <div key={section.title} className="rounded-lg border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground font-heading mb-2">{section.title}</h2>
              {section.intro && <p className="text-xs">{section.intro}</p>}
              {section.items && (
                <ul className="list-disc ltr:pl-5 rtl:pr-5 space-y-1 text-xs">
                  {section.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
          <p className="text-xs">
            <Link to="/contact" className="text-primary hover:underline">{t("footer.contact")}</Link>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
