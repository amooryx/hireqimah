import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/hireqimah-logo.png";
import { LogOut, Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import type { AuthUser } from "@/lib/supabaseAuth";

interface NavbarProps {
  user?: AuthUser | null;
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const effectiveRole = user ? (user.role === "university" ? "admin" : user.role) : null;
  const dashboardLink = effectiveRole ? `/${effectiveRole}` : null;

  const anchorLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "For Students", href: "/#for-students" },
    { label: "For Companies", href: "/#for-companies" },
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
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="HireQimah" className="h-10 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {!user && anchorLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleAnchorClick(link.href)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === "/" && link.href === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              {dashboardLink && (
                <Button size="sm" variant="outline" onClick={() => navigate(dashboardLink)}>
                  <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                </Button>
              )}
              <span className="text-sm text-muted-foreground">{user.full_name}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary capitalize">{user.role}</span>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate("/auth/select-role?mode=signin")}>Sign In</Button>
              <Button size="sm" onClick={() => navigate("/auth/select-role?mode=signup")}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          {!user && anchorLinks.map(link => (
            <button key={link.href} onClick={() => handleAnchorClick(link.href)} className="block text-sm font-medium text-muted-foreground hover:text-primary">
              {link.label}
            </button>
          ))}
          {user ? (
            <>
              {dashboardLink && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => { navigate(dashboardLink); setMobileOpen(false); }}>
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              )}
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { onLogout?.(); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button size="sm" variant="outline" className="w-full" onClick={() => { navigate("/auth/select-role?mode=signin"); setMobileOpen(false); }}>Sign In</Button>
              <Button size="sm" className="w-full" onClick={() => { navigate("/auth/select-role?mode=signup"); setMobileOpen(false); }}>Sign Up</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
