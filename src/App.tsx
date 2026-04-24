import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ImpersonationBanner from "@/components/ImpersonationBanner";
import { ImpersonationProvider, useImpersonation } from "@/lib/impersonation";
import Index from "./pages/Index";
import RoleLogin from "./pages/RoleLogin";
import SignUp from "./pages/SignUp";
import RoleSelect from "./pages/RoleSelect";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import HRDashboard from "./pages/HRDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UniversityDashboard from "./pages/UniversityDashboard";
import AccessDenied from "./components/AccessDenied";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Founders from "./pages/Founders";
import SecurityStatement from "./pages/SecurityStatement";
import PublicProfile from "./pages/PublicProfile";
import PublicLeaderboard from "./pages/PublicLeaderboard";
import Settings from "./pages/Settings";
import { getCurrentAuthUser, signOut, type AuthUser } from "@/lib/supabaseAuth";

const queryClient = new QueryClient();

// Scroll to hash on route change
const ScrollToHash = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);
  return null;
};

interface AppRoutesProps {
  realUser: AuthUser | null;
  onLogout: () => void;
  onLogin: () => void;
}

// Inner routes — uses impersonation context for effective role
const AppRoutes = ({ realUser, onLogout, onLogin }: AppRoutesProps) => {
  const location = useLocation();
  const { effectiveUser } = useImpersonation();
  const role = effectiveUser?.role ?? null;

  // Public-style routes where the dashboard navbar should NOT appear
  // even when the user is signed in. Home + marketing pages stay clean.
  const publicLayoutPaths = ["/", "/about", "/founders", "/contact", "/privacy", "/terms", "/security", "/leaderboard"];
  const isPublicPath =
    publicLayoutPaths.includes(location.pathname) ||
    location.pathname.startsWith("/profile/");

  // Show navbar only when NOT on a public marketing path while signed in.
  // Always show it on auth pages and dashboards.
  const showNavbar = !(realUser && isPublicPath);

  return (
    <>
      {showNavbar && <Navbar user={effectiveUser} onLogout={onLogout} />}
      <ImpersonationBanner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth/select-role" element={<RoleSelect />} />
        <Route path="/login" element={<Navigate to="/auth/select-role?mode=signin" />} />
        <Route path="/login/student" element={realUser ? <Navigate to={`/${role}`} /> : <RoleLogin role="student" onLogin={onLogin} />} />
        <Route path="/login/hr" element={realUser ? <Navigate to={`/${role}`} /> : <RoleLogin role="hr" onLogin={onLogin} />} />
        <Route path="/login/university" element={realUser ? <Navigate to={`/${role}`} /> : <RoleLogin role="university" onLogin={onLogin} />} />
        <Route path="/admin/login" element={realUser ? <Navigate to={`/${role}`} /> : <RoleLogin role="admin" onLogin={onLogin} />} />
        <Route path="/signup" element={<SignUp currentUser={realUser} onLogout={onLogout} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/student"
          element={role === "student" ? <StudentDashboard user={effectiveUser!} /> : effectiveUser ? <AccessDenied /> : <Navigate to="/login/student" />}
        />
        <Route
          path="/hr"
          element={role === "hr" ? <HRDashboard user={effectiveUser!} /> : effectiveUser ? <AccessDenied /> : <Navigate to="/login/hr" />}
        />
        <Route
          path="/university"
          element={role === "university" ? <UniversityDashboard user={effectiveUser!} /> : effectiveUser ? <AccessDenied /> : <Navigate to="/login/university" />}
        />
        <Route
          path="/admin"
          element={role === "admin" ? <AdminDashboard user={effectiveUser!} /> : effectiveUser ? <AccessDenied /> : <Navigate to="/admin/login" />}
        />
        <Route path="/settings" element={effectiveUser ? <Settings user={effectiveUser} /> : <Navigate to="/auth/select-role?mode=signin" />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        <Route path="/leaderboard" element={<PublicLeaderboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/founders" element={<Founders />} />
        <Route path="/security" element={<SecurityStatement />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* suppress unused var lint */}
      <span hidden>{isImpersonating ? "" : ""}</span>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  const loadUser = useCallback(async () => {
    const authUser = await getCurrentAuthUser();
    setUser(authUser);
    setChecked(true);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setTimeout(() => loadUser(), 0);
      } else {
        setUser(null);
        setChecked(true);
      }
    });

    loadUser();

    return () => subscription.unsubscribe();
  }, [loadUser]);

  useEffect(() => {
    if (!user) return;

    const inactivityTimeoutMs = 20 * 60 * 1000;
    let timeoutId: number;

    const forceLogout = async () => {
      await signOut();
      setUser(null);
      window.location.assign("/auth/select-role?mode=signin");
    };

    const resetTimer = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        void forceLogout();
      }, inactivityTimeoutMs);
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimer);
      });
    };
  }, [user]);

  const handleLogin = () => loadUser();
  const handleLogout = async () => {
    // Clear any impersonation when the real user signs out
    sessionStorage.removeItem("hq_impersonation_v1");
    await signOut();
    setUser(null);
  };

  if (!checked) return null;

  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToHash />
              <ImpersonationProvider realUser={user}>
                <AppRoutes realUser={user} onLogin={handleLogin} onLogout={handleLogout} />
              </ImpersonationProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
