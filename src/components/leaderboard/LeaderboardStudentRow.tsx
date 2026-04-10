import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

interface Props {
  student: any;
  rank: number;
  index: number;
  certCount: number;
  projCount: number;
  hasTranscript: boolean;
  isCurrentUser: boolean;
}

const LeaderboardStudentRow = ({ student, rank, index, certCount, projCount, hasTranscript, isCurrentUser }: Props) => {
  const { t } = useI18n();
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return (
    <motion.div
      className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
        isCurrentUser
          ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
          : "hover:bg-muted/30"
      }`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <span className={`w-8 text-center font-bold text-lg ${rank <= 3 ? "text-[hsl(var(--gold))]" : "text-muted-foreground"}`}>
        {medal}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={`/profile/${student.user_id}`}
            className="font-medium text-sm truncate hover:text-primary transition-colors"
          >
            {student.full_name}
          </Link>
          {isCurrentUser && (
            <Badge variant="default" className="text-[10px]">
              {t("leaderboard.you") || "You"}
            </Badge>
          )}
          {certCount > 0 && (
            <Badge variant="outline" className="text-[10px] bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30 gap-0.5">
              <ShieldCheck className="h-3 w-3" />{certCount}
            </Badge>
          )}
          {hasTranscript && (
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 gap-0.5">
              <FileCheck className="h-3 w-3" />
            </Badge>
          )}
          {projCount > 0 && (
            <Badge variant="outline" className="text-[10px] bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30 gap-0.5">
              <Award className="h-3 w-3" />{projCount}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {student.university} · {student.major}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-primary">{Math.round(student.ers_score || 0)}</p>
        <p className="text-[10px] text-muted-foreground">ERS</p>
      </div>
    </motion.div>
  );
};

export default LeaderboardStudentRow;
