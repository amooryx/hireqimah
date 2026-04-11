import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { resetPassword } from "@/lib/supabaseAuth";
import { useI18n } from "@/lib/i18n";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError(t("login.email")); return; }
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (!result.success) { setError(result.error || "Failed to send reset email."); return; }
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div className="w-full max-w-md rounded-lg border bg-card p-7 shadow-sm" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="text-center mb-5">
          <img src={logo} alt="HireQimah" className="mx-auto h-10 mb-4" />
          <h1 className="text-lg font-bold font-heading">{sent ? t("forgot.checkEmail") : t("forgot.title")}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {sent ? t("forgot.sent") : t("forgot.desc")}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">{t("forgot.checkInbox")} <strong>{email}</strong> {t("forgot.followLink")}</p>
            <Button onClick={() => navigate("/auth/select-role?mode=signin")} className="w-full h-9 text-sm">{t("forgot.backToSignIn")}</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="email" className="text-xs">{t("login.email")}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} className="h-9 text-sm" />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
              <Mail className="h-3.5 w-3.5 ltr:mr-1.5 rtl:ml-1.5" /> {loading ? t("forgot.sending") : t("forgot.sendReset")}
            </Button>
            <button type="button" onClick={() => navigate("/auth/select-role?mode=signin")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mx-auto">
              <ArrowLeft className="h-3 w-3" /> {t("forgot.backToSignIn")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
