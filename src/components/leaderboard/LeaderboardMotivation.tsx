import { TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Props {
  rank: number | null;
  total: number;
}

const LeaderboardMotivation = ({ rank, total }: Props) => {
  const { t, lang } = useI18n();

  if (!rank) return null;

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
      <TrendingUp className="h-5 w-5 inline ltr:mr-2 rtl:ml-2 text-primary" />
      <span className="text-sm font-medium">
        {lang === "ar" ? (
          <>مركزك الحالي: <strong className="text-primary">#{rank}</strong> من {total} — حاول تتقدّم أكثر</>
        ) : (
          <>Your current rank: <strong className="text-primary">#{rank}</strong> of {total} — keep pushing higher</>
        )}
      </span>
    </div>
  );
};

export default LeaderboardMotivation;
