import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hireqimah-logo.png";
import { LogOut, Menu, X, LayoutDashboard, Sun, Moon, Globe } from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "@/lib/supabaseAuth";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

interface NavbarProps {
  user?: AuthUser | null;
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();

  const effectiveRole = user ? (user.role === "university" ? "admin" : user.role) : null;
  const dashboardLink = effectiveRole ? `/${effectiveRole}` : null;

  const anchorLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.forStudents"), href: "/#for-students" },
    { label: t("nav.forCompanies"), href: "/#for-companies" },
  ];

  const handleAnchorClick = (href: string) => {
    setMobileOpen(false);
    if (href === "/") {
      navigate("/");
      return;
    }
    const [path, hash] = href.split("#");
    if (location.pathname !== path) {
      navigate(href);
    } else if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HireQimah" className="h-9 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {!user && anchorLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleAnchorClick(link.href)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${
                location.pathname === "/" && link.href === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="hidden md:flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="gap-1.5 text-xs font-semibold h-8"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "ar" ? "EN" : "عربي"}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2 ltr:ml-2 rtl:mr-2 ltr:pl-2 rtl:pr-2 border-s">
              {dashboardLink && (
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => navigate(dashboardLink)}>
                  <LayoutDashboard className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1" /> {t("nav.dashboard")}
                </Button>
              )}
              <span className="text-xs text-muted-foreground max-w-[120px] truncate">{user.full_name}</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize">{user.role}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2 ltr:pl-2 rtl:pr-2 border-s">
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => navigate("/auth/select-role?mode=signin")}>{t("nav.signin")}</Button>
              <Button size="sm" className="h-8 text-xs" onClick={() => navigate("/auth/select-role?mode=signup")}>{t("nav.signup")}</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="h-8 w-8">
            <Globe className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {!user && anchorLinks.map(link => (
            <button key={link.href} onClick={() => handleAnchorClick(link.href)} className="block w-full text-start text-sm font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-md hover:bg-accent">
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="space-y-2 pt-2 border-t">
              {dashboardLink && (
                <Button size="sm" variant="outline" className="w-full h-9 text-xs" onClick={() => { navigate(dashboardLink); setMobileOpen(false); }}>
                  <LayoutDashboard className="h-3.5 w-3.5 ltr:mr-2 rtl:ml-2" /> {t("nav.dashboard")}
                </Button>
              )}
              <Button variant="ghost" size="sm" className="w-full h-9 text-xs justify-start" onClick={() => { onLogout?.(); setMobileOpen(false); }}>
                <LogOut className="h-3.5 w-3.5 ltr:mr-2 rtl:ml-2" /> {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t">
              <Button size="sm" variant="outline" className="w-full h-9 text-xs" onClick={() => { navigate("/auth/select-role?mode=signin"); setMobileOpen(false); }}>{t("nav.signin")}</Button>
              <Button size="sm" className="w-full h-9 text-xs" onClick={() => { navigate("/auth/select-role?mode=signup"); setMobileOpen(false); }}>{t("nav.signup")}</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
