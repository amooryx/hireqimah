import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { GraduationCap, Building2, University, ShieldCheck, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { signIn, getDashboardPath, type AppRole } from "@/lib/supabaseAuth";
import { loginSchema } from "@/lib/inputValidation";

type LoginRole = "student" | "hr" | "university" | "admin";

const roleMeta: Record<LoginRole, { label: string; icon: typeof GraduationCap; desc: string }> = {
  student: { label: "Student", icon: GraduationCap, desc: "Access your ERS, roadmap & opportunities" },
  hr: { label: "HR / Company", icon: Building2, desc: "Search verified candidates & manage opportunities" },
  university: { label: "University", icon: University, desc: "Manage student verification & records" },
  admin: { label: "Platform Admin", icon: ShieldCheck, desc: "Manage verification & platform settings" },
};

interface RoleLoginProps {
  role: LoginRole;
  onLogin: () => void;
}

const RoleLogin = ({ role, onLogin }: RoleLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const meta = roleMeta[role];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0]?.message || "Invalid input.");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Login failed.");
      return;
    }

    // Verify role matches
    const userRole = result.user.role as AppRole;
    const effectiveRole = userRole === "university" ? "admin" : userRole;
    const expectedRole = role === "university" ? "admin" : role;
    
    if (effectiveRole !== expectedRole && role !== "admin") {
      setError(`This account is registered as ${userRole}. Please use the correct login portal.`);
      return;
    }

    onLogin();
    navigate(getDashboardPath(userRole));
  };

  const otherLinks: Record<LoginRole, { label: string; path: string }[]> = {
    student: [
      { label: "HR Login", path: "/login/hr" },
      { label: "University Login", path: "/login/university" },
    ],
    hr: [
      { label: "Student Login", path: "/login/student" },
      { label: "University Login", path: "/login/university" },
    ],
    university: [
      { label: "Student Login", path: "/login/student" },
      { label: "HR Login", path: "/login/hr" },
    ],
    admin: [],
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="HireQimah" className="mx-auto h-14 mb-4" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-3">
            <meta.icon className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-heading">{meta.label} Login</h1>
          <p className="text-sm text-muted-foreground">{meta.desc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              maxLength={255}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={128}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : `Sign In as ${meta.label}`}
          </Button>
        </form>

        <div className="mt-4 space-y-2 text-center text-sm">
          <button onClick={() => navigate("/forgot-password")} className="text-primary hover:underline font-medium">
            Forgot Password?
          </button>
          {role !== "admin" && (
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => navigate(`/signup?role=${role}`)} className="text-primary hover:underline font-medium">
                Sign Up
              </button>
            </p>
          )}
          {otherLinks[role].length > 0 && (
            <div className="pt-2 border-t mt-3">
              <p className="text-xs text-muted-foreground mb-1">Other login portals:</p>
              <div className="flex justify-center gap-3">
                {otherLinks[role].map(link => (
                  <button key={link.path} onClick={() => navigate(link.path)} className="text-xs text-primary hover:underline">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RoleLogin;
