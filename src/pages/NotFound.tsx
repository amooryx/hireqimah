import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { useI18n } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center max-w-sm">
        <img src={logo} alt="HireQimah" className="h-8 mx-auto mb-6 opacity-60" />
        <p className="text-6xl font-bold text-muted-foreground/30 font-heading mb-2">404</p>
        <h1 className="text-lg font-bold font-heading mb-1">Page Not Found</h1>
        <p className="text-sm text-muted-foreground mb-5">The page you're looking for doesn't exist or has been moved.</p>
        <Button size="sm" variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" />
          {t("nav.home")}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
