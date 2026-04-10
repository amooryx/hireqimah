import { motion } from "framer-motion";

interface ERSGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

const ERSGauge = ({ score, size = 160, label = "ERS Score" }: ERSGaugeProps) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 85 ? "hsl(var(--success))" : score >= 70 ? "hsl(var(--primary))" : "hsl(var(--secondary))";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 1.2, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-3xl font-bold font-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{score}</motion.span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

export default ERSGauge;
