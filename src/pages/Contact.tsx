import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-16">
        <h1 className="text-3xl font-bold font-heading mb-2">{t("contact.title")}</h1>
        <p className="text-muted-foreground mb-10">{t("contact.desc")}</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{t("contact.email")}</p>
                <p className="text-sm text-muted-foreground">contact@hireqimah.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{t("contact.hq")}</p>
                <p className="text-sm text-muted-foreground">{t("contact.hqValue")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{t("contact.phone")}</p>
                <p className="text-sm text-muted-foreground">+966-11-XXX-XXXX</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5 mt-6">
              <h3 className="font-semibold font-heading text-sm mb-2">{t("contact.partnerships")}</h3>
              <p className="text-sm text-muted-foreground">{t("contact.partnerships.desc")} <strong>partnerships@hireqimah.com</strong></p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold font-heading mb-2">{t("contact.sent")}</h3>
                <p className="text-sm text-muted-foreground">{t("contact.sentDesc")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>{t("contact.name")} *</Label><Input placeholder={t("contact.namePlaceholder")} required maxLength={100} /></div>
                <div><Label>{t("contact.email")} *</Label><Input type="email" placeholder={t("contact.emailPlaceholder")} required maxLength={255} /></div>
                <div><Label>{t("contact.subject")} *</Label><Input placeholder={t("contact.subjectPlaceholder")} required maxLength={150} /></div>
                <div><Label>{t("contact.message")} *</Label><Textarea placeholder={t("contact.messagePlaceholder")} required maxLength={1000} rows={5} /></div>
                <Button type="submit" className="w-full">{t("contact.send")}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
