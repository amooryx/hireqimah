import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Footer from "@/components/Footer";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container max-w-3xl py-12 flex-1">
        <h1 className="text-2xl font-bold font-heading mb-1">{t("contact.title")}</h1>
        <p className="text-sm text-muted-foreground mb-8">{t("contact.desc")}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            {[
              { icon: Mail, label: t("contact.email"), value: "contact@hireqimah.com" },
              { icon: MapPin, label: t("contact.hq"), value: t("contact.hqValue") },
              { icon: Phone, label: t("contact.phone"), value: "+966-11-XXX-XXXX" },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/8 shrink-0 mt-0.5">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-xs">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold font-heading text-xs mb-1">{t("contact.partnerships")}</h3>
              <p className="text-xs text-muted-foreground">{t("contact.partnerships.desc")} <strong>partnerships@hireqimah.com</strong></p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
                <h3 className="font-semibold font-heading text-sm mb-1">{t("contact.sent")}</h3>
                <p className="text-xs text-muted-foreground">{t("contact.sentDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div><Label className="text-xs">{t("contact.name")} *</Label><Input placeholder={t("contact.namePlaceholder")} required maxLength={100} className="h-9 text-sm" /></div>
                <div><Label className="text-xs">{t("contact.email")} *</Label><Input type="email" placeholder={t("contact.emailPlaceholder")} required maxLength={255} className="h-9 text-sm" /></div>
                <div><Label className="text-xs">{t("contact.subject")} *</Label><Input placeholder={t("contact.subjectPlaceholder")} required maxLength={150} className="h-9 text-sm" /></div>
                <div><Label className="text-xs">{t("contact.message")} *</Label><Textarea placeholder={t("contact.messagePlaceholder")} required maxLength={1000} rows={4} className="text-sm" /></div>
                <Button type="submit" className="w-full h-9 text-sm">{t("contact.send")}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
