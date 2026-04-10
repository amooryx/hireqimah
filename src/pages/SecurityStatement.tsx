import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, FileCheck, AlertTriangle } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const SecurityStatement = () => (
  <div className="min-h-screen bg-background">
    <section className="container max-w-3xl py-16 md:py-24 space-y-10">
      <motion.div className="text-center" {...fadeUp}>
        <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Security Statement</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          HireQimah is built with enterprise-grade security to protect student data, employer workflows, and institutional records.
        </p>
      </motion.div>

      {[
        {
          icon: Lock, title: "Authentication & Access Control",
          items: [
            "JWT-based authentication with 20-minute inactivity timeout",
            "Role-based access control (RBAC) with server-side enforcement",
            "Account lockout after 5 failed login attempts (15 min cooldown)",
            "Rate limiting on all authentication endpoints (5 req/min)",
            "12-character minimum passwords with complexity requirements",
            "Leaked password protection via HIBP database checks",
          ],
        },
        {
          icon: Eye, title: "Data Privacy & PDPL Compliance",
          items: [
            "Row-Level Security (RLS) on all database tables",
            "Students control visibility of their profiles to employers",
            "Sensitive documents accessible only via signed URLs",
            "National ID fields stored encrypted",
            "Compliant with Saudi Personal Data Protection Law (PDPL)",
          ],
        },
        {
          icon: Server, title: "Infrastructure Security",
          items: [
            "HTTPS enforced with HSTS preloading",
            "Content Security Policy (CSP) headers",
            "X-Frame-Options: DENY to prevent clickjacking",
            "Strict Referrer-Policy and Permissions-Policy",
            "No sensitive data logged to console",
          ],
        },
        {
          icon: FileCheck, title: "Document Integrity",
          items: [
            "SHA-256 hashing of all uploaded documents",
            "Metadata extraction to detect document tampering",
            "File type validation (PDF, PNG, JPG only, max 10MB)",
            "Randomized file storage paths",
            "Audit trail for all document operations",
          ],
        },
        {
          icon: AlertTriangle, title: "OWASP Top 10 Mitigations",
          items: [
            "Zod-based input validation on all forms and API endpoints",
            "Parameterized database queries (no raw SQL)",
            "CSRF protection via SameSite cookie attributes",
            "BOLA prevention through user-scoped RLS policies",
            "Dependency scanning and security audits",
          ],
        },
      ].map((section) => (
        <motion.div key={section.title} className="rounded-xl border bg-card p-6" {...fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <section.icon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold font-heading">{section.title}</h2>
          </div>
          <ul className="space-y-2">
            {section.items.map((item) => (
              <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>{item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      <motion.div className="text-center text-sm text-muted-foreground" {...fadeUp}>
        <p>For security inquiries, contact <a href="mailto:security@hireqimah.com" className="text-primary hover:underline">security@hireqimah.com</a></p>
      </motion.div>
    </section>
  </div>
);

export default SecurityStatement;
