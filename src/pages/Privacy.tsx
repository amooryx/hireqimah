import { Link } from "react-router-dom";
import logo from "@/assets/hireqimah-logo.png";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <div className="container max-w-3xl py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground font-heading">1. Data We Collect</h2>
        <p>HireQimah collects the following data to provide career readiness scoring and opportunity matching:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Academic Records:</strong> University transcripts, GPA, major, and degree information.</li>
          <li><strong>Conduct & Attendance:</strong> Disciplinary records, attendance history, and academic warnings provided by partner universities.</li>
          <li><strong>Professional Certifications:</strong> Certification names, verification IDs, and difficulty-weighted point values.</li>
          <li><strong>Activities & Soft Skills:</strong> University events, leadership roles, competitions, research publications, and community contributions.</li>
          <li><strong>Account Information:</strong> Name, university email, role, and encrypted password.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">2. Employment Readiness Score (ERS)</h2>
        <p>The ERS is calculated using a transparent, weighted formula:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>40% Academic Performance (from verified transcripts)</li>
          <li>25% Certifications (fixed difficulty-based points)</li>
          <li>15% Projects</li>
          <li>10% Soft Skills & Activities</li>
          <li>10% Conduct & Attendance</li>
        </ul>
        <p>The scoring model, certification point values, and activity point system are standardized and publicly transparent.</p>

        <h2 className="text-lg font-semibold text-foreground font-heading">3. Who Can See Your Data</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>HR & Companies:</strong> Can view your verified transcript, ERS breakdown, certifications, conduct records, and case history when you apply to opportunities or appear in search results.</li>
          <li><strong>University Admins:</strong> Can upload and manage attendance, conduct, and activity records for their students.</li>
          <li><strong>System Admin:</strong> Manages platform governance, certification approval, and scoring weights.</li>
          <li><strong>Other Students:</strong> Can see your leaderboard ranking and badges, but not your detailed records.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">4. Security Practices</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Passwords are hashed and never stored in plain text.</li>
          <li>Session management with automatic timeout after 30 minutes of inactivity.</li>
          <li>Rate limiting on login attempts to prevent brute-force attacks.</li>
          <li>Role-based access control (RBAC) preventing unauthorized data access.</li>
          <li>Input sanitization to prevent XSS and injection attacks.</li>
          <li>CSRF token simulation for form submissions.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">5. Data Retention</h2>
        <p>Your data is retained for the duration of your active account. You may request account deletion by contacting our admin team. Upon deletion, all personal data, academic records, and scoring history will be permanently removed.</p>

        <h2 className="text-lg font-semibold text-foreground font-heading">6. Contact</h2>
        <p>For privacy concerns, contact us at <strong>privacy@hireqimah.com</strong> or visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link>.</p>
      </section>
    </div>
  </div>
);

export default Privacy;
