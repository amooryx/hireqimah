import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "hr" | "university" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  avatar_url?: string;
}

// ===== AUTH GUARD (rate limit + lockout) =====
async function callAuthGuard(action: string, email: string, extra?: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.functions.invoke("auth-guard", {
      body: { action, email, ...extra },
    });
    if (error) {
      console.error("auth-guard invoke error:", error);
      return null;
    }
    return data;
  } catch {
    return null; // fail-open to not block login if edge function is down
  }
}

// ===== SIGN UP =====
interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: AppRole;
  university?: string;
  major?: string;
  gpa?: number;
  gpa_scale?: "4" | "5";
  nationality?: string;
  company_name?: string;
  position?: string;
  industry?: string;
  university_name?: string;
  official_domain?: string;
  admin_contact?: string;
}

export async function signUp(data: SignUpData) {
  const pwError = validatePassword(data.password);
  if (pwError) return { success: false, error: pwError };

  // Rate limit check
  const guard = await callAuthGuard("check_lockout", data.email);
  if (guard?.rateLimited) {
    return { success: false, error: "Too many requests. Please try again in a minute." };
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: window.location.origin,
      data: {
        full_name: data.full_name,
        role: data.role,
        university: data.university,
        major: data.major,
        gpa: data.gpa?.toString(),
        gpa_scale: data.gpa_scale,
        company_name: data.company_name,
        position: data.position,
        industry: data.industry,
        university_name: data.university_name,
        official_domain: data.official_domain,
        admin_contact: data.admin_contact,
      },
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, user: authData.user };
}

// ===== SIGN IN (with lockout + audit) =====
export async function signIn(email: string, password: string) {
  // Check lockout first
  const lockoutCheck = await callAuthGuard("check_lockout", email);
  if (lockoutCheck?.locked) {
    const until = new Date(lockoutCheck.until);
    const minutesLeft = Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60000));
    return {
      success: false as const,
      error: `Account temporarily locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
    };
  }
  if (lockoutCheck?.rateLimited) {
    return { success: false as const, error: "Too many login attempts. Please wait a minute." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Record failed attempt
    await callAuthGuard("record_attempt", email, { success: false });
    return { success: false as const, error: error.message };
  }

  // Record successful attempt (clears failures)
  await callAuthGuard("record_attempt", email, { success: true });

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (roleError || !roleData?.role) {
    await supabase.auth.signOut();
    return {
      success: false as const,
      error: "Account role is not provisioned yet. Please contact support.",
    };
  }

  // Audit log: successful login
  try {
    await supabase.from("audit_logs").insert({
      user_id: data.user.id,
      action: "login_success",
      resource_type: "auth",
      details: { email, timestamp: new Date().toISOString() },
    });
  } catch { /* non-blocking */ }

  return { success: true as const, user: { ...data.user, role: roleData.role as AppRole } };
}

// ===== SIGN OUT =====
export async function signOut() {
  await supabase.auth.signOut();
}

// ===== GET CURRENT USER WITH ROLE =====
export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!roleData?.role) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email || "",
    full_name: profile?.full_name || user.user_metadata?.full_name || "",
    role: roleData.role as AppRole,
    avatar_url: profile?.avatar_url || undefined,
  };
}

// ===== PASSWORD VALIDATION =====
export function validatePassword(password: string): string | null {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain a special character.";
  return null;
}

// ===== RESET PASSWORD =====
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ===== UPDATE PASSWORD =====
export async function updatePassword(newPassword: string) {
  const pwError = validatePassword(newPassword);
  if (pwError) return { success: false, error: pwError };
  
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Dashboard path helper
export function getDashboardPath(role: AppRole): string {
  switch (role) {
    case "student": return "/student";
    case "hr": return "/hr";
    case "university":
    case "admin": return "/admin";
  }
}
