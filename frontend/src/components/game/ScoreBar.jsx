import { Utensils } from "lucide-react";

const ScoreBar = ({ studentName, sceneIndex, totalScenes, score, maxScore }) => {
  const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;
  const progressPct = ((sceneIndex + 1) / totalScenes) * 100;

  return (
    <header
      className="sticky top-0 z-30 bg-[#3E2723] text-[#F9F6F0] border-b border-[#D4AF37]/40 shadow-lg"
      data-testid="score-bar"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
            <Utensils size={18} />
          </div>
          <div>
            <div className="font-serif-display text-sm md:text-base tracking-wide">
              Sıfat Restoranı
            </div>
            <div className="text-[10px] md:text-xs text-[#E8DCC4]/70 font-body">
              Misafir: <span data-testid="student-name-badge">{studentName || "—"}</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 max-w-sm mx-4 items-center gap-3">
          <div className="flex-1 h-2 bg-[#5C4A42] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-mono-num text-[#E8DCC4]">
            {sceneIndex + 1}/{totalScenes}
          </span>
        </div>

        <div
          className="flex items-center gap-2 bg-[#F9F6F0] text-[#3E2723] rounded-full px-4 py-1.5 font-mono-num text-sm shadow-inner"
          data-testid="student-score"
        >
          <span className="text-[#C44900] font-bold">{score}</span>
          <span className="text-[#8C7A6B]">/</span>
          <span>{maxScore}</span>
          <span className="hidden sm:inline text-[#8C7A6B] text-xs ml-1">
            (%{Math.round(percent)})
          </span>
        </div>
      </div>
    </header>
  );
};

export default ScoreBar;
