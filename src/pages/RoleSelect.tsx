import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Building2, University } from "lucide-react";
import { useI18n } from "@/lib/i18n";

import logo from "@/assets/hireqimah-logo.png";

const RoleSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  const roles = [
    {
      key: "student",
      label: t("role.student"),
      icon: GraduationCap,
      desc: t("role.student.desc"),
      signinPath: "/login/student",
      signupPath: "/signup?role=student",
    },
    {
      key: "hr",
      label: t("role.hr"),
      icon: Building2,
      desc: t("role.hr.desc"),
      signinPath: "/login/hr",
      signupPath: "/signup?role=hr",
    },
    {
      key: "university",
      label: t("role.university"),
      icon: University,
      desc: t("role.university.desc"),
      signinPath: "/login/university",
      signupPath: "/signup?role=university",
    },
  ];

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
            {isSignUp ? t("role.create") : t("role.welcome")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignUp ? t("role.selectSignup") : t("role.selectSignin")}
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
                  {t("role.continueAs")} {role.label.split(" /")[0]}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? t("role.alreadyHave") : t("role.noAccount")}{" "}
            <button
              onClick={() => navigate(`/auth/select-role?mode=${isSignUp ? "signin" : "signup"}`)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? t("nav.signin") : t("nav.signup")}
            </button>
          </p>
          <button
            onClick={() => navigate("/admin/login")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {t("role.adminAccess")} →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelect;
