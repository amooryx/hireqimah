import { Link } from "react-router-dom";

const Terms = () => (
  <div className="min-h-screen bg-background">
    <div className="container max-w-3xl py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
      </div>

      <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground font-heading">1. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All information provided must be accurate and truthful.</li>
          <li>Students must use their official university email to register.</li>
          <li>Users must not attempt to manipulate ERS scores, leaderboards, or certification records.</li>
          <li>Any attempt to falsify academic records, certifications, or conduct history will result in account suspension.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">2. Misconduct Consequences</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cheating incidents reported by partner universities are recorded and reduce ERS scores.</li>
          <li>Case history is visible to HR during the application review process.</li>
          <li>Repeated misconduct may lead to permanent account suspension by the system admin.</li>
          <li>Falsified certifications will be flagged and removed, with scoring adjustments applied retroactively.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">3. Certification Verification</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All certifications must be submitted with valid Credly IDs or verification links when available.</li>
          <li>Certification approval and point assignment is managed exclusively by the System Admin.</li>
          <li>Point values are fixed, difficulty-based, and standardized across all students for fairness.</li>
          <li>Universities do not have authority to approve or assign certification points.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">4. HR Usage Guidelines</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>HR accounts must represent legitimate organizations.</li>
          <li>Student data accessed through the platform must be used solely for recruitment purposes.</li>
          <li>HR cannot modify student academic records or ERS scores.</li>
          <li>Talent pool data must not be shared outside the hiring organization without consent.</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground font-heading">5. Platform Governance</h2>
        <p>HireQimah reserves the right to modify scoring weights, certification point values, and platform features to maintain fairness and alignment with Saudi market needs and Vision 2030 objectives.</p>

        <h2 className="text-lg font-semibold text-foreground font-heading">6. Contact</h2>
        <p>For questions about these terms, visit our <Link to="/contact" className="text-primary hover:underline">Contact page</Link> or email <strong>legal@hireqimah.com</strong>.</p>
      </section>
    </div>
  </div>
);

export default Terms;
