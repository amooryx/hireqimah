import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface Props {
  uni: { name: string; count: number; avgERS: number };
  rank: number;
  index: number;
}

const LeaderboardUniversityRow = ({ uni, rank, index }: Props) => {
  const { t } = useI18n();
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <motion.div
      className="flex items-center gap-4 rounded-lg border p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <span className={`w-8 text-center font-bold text-lg ${rank <= 3 ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}>
        {medal}
      </span>
      <div className="flex-1">
        <p className="font-medium text-sm">{uni.name}</p>
        <p className="text-xs text-muted-foreground">{uni.count} {t("leaderboard.studentsCount")}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary">{uni.avgERS}</p>
        <p className="text-[10px] text-muted-foreground">{t("leaderboard.avgERS")}</p>
      </div>
    </motion.div>
  );
};

export default LeaderboardUniversityRow;
