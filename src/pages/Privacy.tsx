import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const Privacy = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-3xl py-12 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading mb-1">{t("privacy.title")}</h1>
          <p className="text-xs text-muted-foreground">{t("privacy.updated")}</p>
        </div>

        <section className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          {[
            { title: t("privacy.s1.title"), intro: t("privacy.s1.intro"), items: [t("privacy.s1.i1"), t("privacy.s1.i2"), t("privacy.s1.i3"), t("privacy.s1.i4"), t("privacy.s1.i5")] },
            { title: t("privacy.s2.title"), intro: t("privacy.s2.desc"), items: [t("privacy.s2.i1"), t("privacy.s2.i2"), t("privacy.s2.i3"), t("privacy.s2.i4"), t("privacy.s2.i5")], note: t("privacy.s2.note") },
            { title: t("privacy.s3.title"), items: [t("privacy.s3.i1"), t("privacy.s3.i2"), t("privacy.s3.i3"), t("privacy.s3.i4")] },
            { title: t("privacy.s4.title"), items: [t("privacy.s4.i1"), t("privacy.s4.i2"), t("privacy.s4.i3"), t("privacy.s4.i4"), t("privacy.s4.i5")] },
            { title: t("privacy.s5.title"), intro: t("privacy.s5.desc") },
            { title: t("privacy.s6.title"), intro: t("privacy.s6.desc") },
          ].map((section) => (
            <div key={section.title} className="rounded-lg border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground font-heading mb-2">{section.title}</h2>
              {section.intro && <p className="mb-2">{section.intro}</p>}
              {section.items && (
                <ul className="list-disc ltr:pl-5 rtl:pr-5 space-y-1 text-xs">
                  {section.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
              {section.note && <p className="mt-2 text-xs">{section.note}</p>}
            </div>
          ))}
          <p className="text-xs">
            <Link to="/contact" className="text-primary hover:underline">{t("privacy.contactPage")}</Link>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
