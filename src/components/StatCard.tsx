import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, label, value, trend, delay = 0 }: StatCardProps) => (
  <motion.div
    className="rounded-lg border bg-card p-5 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold font-heading">{value}</p>
        {trend && <p className="text-xs text-success">{trend}</p>}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
