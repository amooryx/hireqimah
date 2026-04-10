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
      <motion.div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <img src={logo} alt="HireQimah" className="mx-auto h-14 mb-4" />
          <h1 className="text-2xl font-bold font-heading">{sent ? t("forgot.checkEmail") : t("forgot.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {sent ? t("forgot.sent") : t("forgot.desc")}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">{t("forgot.checkInbox")} <strong>{email}</strong> {t("forgot.followLink")}</p>
            <Button onClick={() => navigate("/auth/select-role?mode=signin")} className="w-full">{t("forgot.backToSignIn")}</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={255} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> {loading ? t("forgot.sending") : t("forgot.sendReset")}
            </Button>
            <button type="button" onClick={() => navigate("/auth/select-role?mode=signin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mx-auto">
              <ArrowLeft className="h-4 w-4" /> {t("forgot.backToSignIn")}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
