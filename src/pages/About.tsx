import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, Users, Globe, Shield, Award, ArrowRight } from "lucide-react";
import logo from "@/assets/hireqimah-logo.png";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <section className="container max-w-4xl py-16 md:py-24 space-y-16">
        {/* Hero */}
        <motion.div className="text-center" {...fadeUp}>
          <img src={logo} alt="HireQimah" className="h-14 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">About HireQimah</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            HireQimah is an AI-powered employability intelligence platform that connects Saudi Arabia's graduating talent with the companies that need them most.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div className="rounded-xl border bg-card p-8" {...fadeUp}>
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold font-heading">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We believe that grades alone don't predict job readiness. HireQimah's Employment Readiness Score (ERS) 
            combines verified academic records, industry certifications, real projects, and market-driven skill 
            analysis to give every stakeholder a transparent, trustworthy signal of graduate employability.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div {...fadeUp}>
          <h2 className="text-xl font-bold font-heading mb-6 text-center">What We Stand For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Transparency", desc: "Every ERS score is explainable. Students, employers, and universities can see exactly how readiness is measured." },
              { icon: Globe, title: "Market Alignment", desc: "Our scoring engine is driven by real Saudi labor market demand — not static rubrics or outdated benchmarks." },
              { icon: Award, title: "Meritocracy", desc: "Rankings are based on verified accomplishments. We fight credential inflation with document integrity checks." },
            ].map((v, i) => (
              <div key={v.title} className="rounded-xl border bg-card p-6 text-center">
                <v.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold font-heading mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vision 2030 */}
        <motion.div className="rounded-xl border bg-accent/50 p-8 text-center" {...fadeUp}>
          <Globe className="h-8 w-8 text-[hsl(var(--deep-green))] mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-3">Aligned with Saudi Vision 2030</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HireQimah directly supports the Kingdom's goals of increasing youth employment, 
            improving education-to-employment pathways, and building a knowledge-based economy.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div className="text-center" {...fadeUp}>
          <h2 className="text-xl font-bold font-heading mb-4">Ready to experience it?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/signup?role=student")}>Sign Up as Student</Button>
            <Button variant="outline" onClick={() => navigate("/signup?role=hr")}>Sign Up as HR</Button>
            <Button variant="outline" onClick={() => navigate("/signup?role=university")}>Sign Up as University</Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
