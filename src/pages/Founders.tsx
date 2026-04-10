import { motion } from "framer-motion";
import { Linkedin, Globe, Award } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const founders = [
  {
    name: "Founding Team",
    role: "HireQimah Leadership",
    bio: "HireQimah was founded by a team of Saudi technologists and workforce development experts who saw a critical gap between what universities measure and what employers actually need. With backgrounds in AI, HR technology, and education policy, the founding team built HireQimah to create the first transparent employability infrastructure for Saudi Arabia.",
  },
];

const Founders = () => (
  <div className="min-h-screen bg-background">
    <section className="container max-w-3xl py-16 md:py-24 space-y-12">
      <motion.div className="text-center" {...fadeUp}>
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Our Team</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          The people building Saudi Arabia's employability intelligence infrastructure.
        </p>
      </motion.div>

      {founders.map((f, i) => (
        <motion.div key={f.name} className="rounded-xl border bg-card p-8" {...fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">{f.name}</h2>
              <p className="text-sm text-muted-foreground">{f.role}</p>
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed">{f.bio}</p>
        </motion.div>
      ))}

      <motion.div className="rounded-xl border bg-accent/50 p-8 text-center" {...fadeUp}>
        <h3 className="font-semibold font-heading mb-2">Join Our Mission</h3>
        <p className="text-sm text-muted-foreground">
          We're always looking for talented individuals passionate about transforming employability in Saudi Arabia.
          Reach out at <a href="mailto:team@hireqimah.com" className="text-primary hover:underline">team@hireqimah.com</a>
        </p>
      </motion.div>
    </section>
  </div>
);

export default Founders;
