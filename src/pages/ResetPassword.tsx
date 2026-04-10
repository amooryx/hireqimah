import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";
import { updatePassword } from "@/lib/supabaseAuth";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setValidSession(true);
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setValidSession(true);
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (!result.success) { setError(result.error || "Failed to update password."); return; }
    setSuccess(true);
  };

  if (!validSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <Button className="mt-4" onClick={() => navigate("/forgot-password")}>Request New Reset</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <motion.div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <KeyRound className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2">Password Updated</h2>
          <p className="text-sm text-muted-foreground mb-6">Your password has been successfully changed.</p>
          <Button onClick={() => navigate("/auth/select-role?mode=signin")} className="w-full">Sign In</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-6">
          <img src={logo} alt="HireQimah" className="mx-auto h-14 mb-4" />
          <h1 className="text-2xl font-bold font-heading">Set New Password</h1>
          <p className="text-sm text-muted-foreground">Min 12 chars: uppercase, lowercase, number, special character</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>New Password</Label>
            <div className="relative">
              <Input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} maxLength={128} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} maxLength={128} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
