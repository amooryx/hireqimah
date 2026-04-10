import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Building2, University } from "lucide-react";

import logo from "@/assets/hireqimah-logo.png";

const roles = [
  {
    key: "student",
    label: "Student",
    icon: GraduationCap,
    desc: "Build your Qimah, track your readiness, apply for CO-OP & internships.",
    signinPath: "/login/student",
    signupPath: "/signup?role=student",
  },
  {
    key: "hr",
    label: "HR / Company",
    icon: Building2,
    desc: "Post opportunities, filter verified candidates, hire Qimah students.",
    signinPath: "/login/hr",
    signupPath: "/signup?role=hr",
  },
  {
    key: "university",
    label: "University",
    icon: University,
    desc: "Upload attendance, conduct, and student engagement records.",
    signinPath: "/login/university",
    signupPath: "/signup?role=university",
  },
] as const;

const RoleSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <img src={logo} alt="HireQimah" className="mx-auto h-14 mb-4" />
          <h1 className="text-2xl font-bold font-heading">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? "Select your role to get started" : "Select your role to sign in"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((role, i) => (
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <button
                type="button"
                onClick={() => navigate(isSignUp ? role.signupPath : role.signinPath)}
                className="group flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <role.icon className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-lg font-semibold font-heading">{role.label}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
                <span className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors group-hover:bg-primary/90">
                  Continue as {role.label.split(" /")[0]}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => navigate(`/auth/select-role?mode=${isSignUp ? "signin" : "signup"}`)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Administrator Access →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelect;
