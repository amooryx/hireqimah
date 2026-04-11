import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Building2, University, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import logo from "@/assets/hireqimah-logo.png";

const RoleSelect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useI18n();
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  const roles = [
    { key: "student", label: t("role.student"), icon: GraduationCap, desc: t("role.student.desc"), signinPath: "/login/student", signupPath: "/signup?role=student" },
    { key: "hr", label: t("role.hr"), icon: Building2, desc: t("role.hr.desc"), signinPath: "/login/hr", signupPath: "/signup?role=hr" },
    { key: "university", label: t("role.university"), icon: University, desc: t("role.university.desc"), signinPath: "/login/university", signupPath: "/signup?role=university" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <img src={logo} alt="HireQimah" className="mx-auto h-10 mb-4" />
          <h1 className="text-xl font-bold font-heading">
            {isSignUp ? t("role.create") : t("role.welcome")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isSignUp ? t("role.selectSignup") : t("role.selectSignin")}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {roles.map((role, i) => (
            <motion.button
              key={role.key}
              type="button"
              onClick={() => navigate(isSignUp ? role.signupPath : role.signinPath)}
              className="group flex flex-col items-center gap-2.5 rounded-lg border bg-card p-5 text-center transition-all hover:border-primary hover:shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/8 transition-colors group-hover:bg-primary/12">
                <role.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-sm font-semibold font-heading">{role.label}</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{role.desc}</p>
              <span className="mt-auto inline-flex h-8 w-full items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground group-hover:bg-primary/90">
                {t("role.continueAs")} {role.label.split(" /")[0]}
                <ChevronRight className="h-3 w-3 ltr:ml-1 rtl:mr-1" />
              </span>
            </motion.button>
          ))}
        </div>

        <div className="mt-5 text-center space-y-1.5">
          <p className="text-xs text-muted-foreground">
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
            className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
          >
            {t("role.adminAccess")} →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelect;
