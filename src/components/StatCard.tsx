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
    className="rounded-lg border bg-card p-4 shadow-sm"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/8">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold font-heading leading-tight">{value}</p>
        {trend && <p className="text-[11px] text-success font-medium">{trend}</p>}
      </div>
    </div>
  </motion.div>
);

export default StatCard;
