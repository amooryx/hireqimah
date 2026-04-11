import { useNavigate } from "react-router-dom";
import logo from "@/assets/hireqimah-logo.png";
import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const links = [
    { label: t("footer.about"), path: "/about" },
    { label: t("footer.team"), path: "/founders" },
    { label: t("footer.leaderboard"), path: "/leaderboard" },
    { label: t("footer.security"), path: "/security" },
    { label: t("footer.privacy"), path: "/privacy" },
    { label: t("footer.terms"), path: "/terms" },
    { label: t("footer.contact"), path: "/contact" },
  ];

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="HireQimah" className="h-8" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t("footer.tagline")}</p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-2">
            {links.map(link => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="text-start text-sm text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("contact.title")}</p>
            <p>contact@hireqimah.com</p>
            <p>{t("contact.hqValue")}</p>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HireQimah. {t("footer.rights")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("vision.title")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
