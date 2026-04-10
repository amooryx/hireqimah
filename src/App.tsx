import { useState, useEffect, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
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
import { getCurrentAuthUser, signOut, type AuthUser, type AppRole } from "@/lib/supabaseAuth";

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

const App = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  const loadUser = useCallback(async () => {
    const authUser = await getCurrentAuthUser();
    setUser(authUser);
    setChecked(true);
  }, []);

  useEffect(() => {
    // Set up auth listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Defer to avoid Supabase client deadlock
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
    await signOut();
    setUser(null);
  };

  const effectiveRole: AppRole | null = user ? user.role : null;

  if (!checked) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            {/* Homepage always accessible, even when logged in */}
            <Route path="/" element={<Index />} />

            {/* Role selection */}
            <Route path="/auth/select-role" element={<RoleSelect />} />

            {/* Legacy /login redirects to role selection */}
            <Route path="/login" element={<Navigate to="/auth/select-role?mode=signin" />} />

            {/* Role-specific login routes */}
            <Route path="/login/student" element={user ? <Navigate to={`/${effectiveRole}`} /> : <RoleLogin role="student" onLogin={handleLogin} />} />
            <Route path="/login/hr" element={user ? <Navigate to={`/${effectiveRole}`} /> : <RoleLogin role="hr" onLogin={handleLogin} />} />
            <Route path="/login/university" element={user ? <Navigate to={`/${effectiveRole}`} /> : <RoleLogin role="university" onLogin={handleLogin} />} />

            {/* Admin separate route */}
            <Route path="/admin/login" element={user ? <Navigate to={`/${effectiveRole}`} /> : <RoleLogin role="admin" onLogin={handleLogin} />} />

            {/* Sign up — always accessible, handles logged-in modal internally */}
            <Route path="/signup" element={<SignUp currentUser={user} onLogout={handleLogout} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected dashboards with strict role checks */}
            <Route path="/student" element={effectiveRole === "student" ? <StudentDashboard user={user!} /> : user ? <AccessDenied /> : <Navigate to="/login/student" />} />
            <Route path="/hr" element={effectiveRole === "hr" ? <HRDashboard user={user!} /> : user ? <AccessDenied /> : <Navigate to="/login/hr" />} />
            <Route path="/university" element={effectiveRole === "university" ? <UniversityDashboard user={user!} /> : user ? <AccessDenied /> : <Navigate to="/login/university" />} />
            <Route path="/admin" element={effectiveRole === "admin" ? <AdminDashboard user={user!} /> : user ? <AccessDenied /> : <Navigate to="/admin/login" />} />

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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
