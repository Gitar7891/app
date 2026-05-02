import { useState } from "react";
import { toast } from "sonner";
import { ChefHat, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import WaiterDialog from "./WaiterDialog";
import RuleBox from "./RuleBox";
import { SCENE_3, ADJ_COLORS } from "@/lib/gameContent";

const Scene3Menu = ({ onFinish }) => {
  const [remaining, setRemaining] = useState(SCENE_3.cards);
  const [activeCard, setActiveCard] = useState(null);
  const [placements, setPlacements] = useState({}); // {cardId: {categoryId, correct}}
  const [showRule, setShowRule] = useState(false);

  const total = SCENE_3.cards.length;
  const placedCount = Object.keys(placements).length;

  const handleCategoryClick = (catId) => {
    if (!activeCard) {
      toast("Önce bir sıfat kartı seç", { icon: "✋" });
      return;
    }
    const card = SCENE_3.cards.find((c) => c.id === activeCard);
    const correct = card.answer === catId;
    const result = { cardId: activeCard, chosen: catId, correct_answer: card.answer, correct };
    setPlacements((prev) => ({ ...prev, [activeCard]: result }));
    setRemaining((prev) => prev.filter((c) => c.id !== activeCard));
    setActiveCard(null);

    if (correct) {
      toast.success(`"${card.phrase}" doğru kategori!`);
    } else {
      const corrCat = SCENE_3.categories.find((cc) => cc.id === card.answer);
      toast(`"${card.phrase}" aslında ${corrCat.label}`, { icon: "💡" });
    }

    if (!showRule) setShowRule(true);

    // Check if complete
    if (remaining.length === 1) {
      // this was the last card
      setTimeout(() => {
        const finalPlacements = { ...placements, [activeCard]: result };
        const score = Object.values(finalPlacements).filter((p) => p.correct).length;
        onFinish({
          score,
          max_score: total,
          answers: Object.entries(finalPlacements).map(([cardId, r]) => ({
            cardId,
            ...r,
          })),
        });
      }, 900);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 text-[#4A6741] font-serif-display text-xs tracking-[0.3em] uppercase">
          <Sparkles size={14} />
          {SCENE_3.subtitle}
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#2A2421] mt-2">
          {SCENE_3.title}
        </h1>
      </div>

      <WaiterDialog lines={SCENE_3.waiterIntro} accentColor={ADJ_COLORS.sayi}>
        <p>
          Menümüzde{" "}
          <span className="adj-pill" style={{ background: "#D4AF37", color: "#2A2421" }}>iki</span>{" "}
          çeşit çorba,{" "}
          <span className="adj-pill" style={{ background: "#D4AF37", color: "#2A2421" }}>beş</span>{" "}
          ana yemek var.{" "}
          <span className="adj-pill" style={{ background: "#2C4251", color: "#FFFDF7" }}>Birinci</span>{" "}
          sayfada tatlılar,{" "}
          <span className="adj-pill" style={{ background: "#2C4251", color: "#FFFDF7" }}>üçüncü</span>{" "}
          sayfada içecekler.{" "}
          <span className="adj-pill" style={{ background: "#4A6741", color: "#FFFDF7" }}>İkişer</span>{" "}
          ekmek getireyim mi?{" "}
          <span className="adj-pill" style={{ background: "#C44900", color: "#FFFDF7" }}>Yarım</span>{" "}
          porsiyon isteyen olursa da çekinmeyin.
        </p>
      </WaiterDialog>

      <div className="mt-8 grid lg:grid-cols-12 gap-6">
        {/* Cards pool */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-[#FFFDF7] border-2 border-[#E8DCC4] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat size={20} className="text-[#4A6741]" />
              <h3 className="font-serif-display text-lg text-[#2A2421]">
                Sıfat Kartları
              </h3>
              <span className="ml-auto text-xs font-mono-num text-[#8C7A6B]">
                {placedCount}/{total}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {remaining.length === 0 && (
                <p className="text-[#8C7A6B] font-body text-sm italic">
                  Tüm kartları yerleştirdin! 🎉
                </p>
              )}
              {remaining.map((card) => (
                <button
                  type="button"
                  key={card.id}
                  data-testid={`scene3-card-${card.id}`}
                  onClick={() =>
                    setActiveCard(activeCard === card.id ? null : card.id)
                  }
                  className={`px-4 py-2 rounded-lg border-2 font-body text-base transition-all ${
                    activeCard === card.id
                      ? "bg-[#3E2723] text-[#F9F6F0] border-[#D4AF37] shadow-lg -translate-y-0.5"
                      : "bg-[#FFF5E6] text-[#2A2421] border-[#E8DCC4] hover:border-[#D68C45] hover:-translate-y-0.5"
                  }`}
                >
                  {card.phrase}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category zones */}
        <div className="lg:col-span-8 grid grid-cols-2 gap-4">
          {SCENE_3.categories.map((cat) => {
            const placedHere = Object.entries(placements)
              .filter(([, p]) => p.chosen === cat.id)
              .map(([cardId, p]) => ({
                cardId,
                ...p,
                card: SCENE_3.cards.find((c) => c.id === cardId),
              }));
            return (
              <button
                type="button"
                key={cat.id}
                data-testid={`scene3-cat-${cat.id}`}
                onClick={() => handleCategoryClick(cat.id)}
                disabled={!activeCard}
                className="text-left rounded-2xl p-5 min-h-[180px] border-2 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: `${cat.color}10`,
                  borderColor: cat.color,
                }}
              >
                <div
                  className="font-serif-display text-xl mb-1"
                  style={{ color: cat.color }}
                >
                  {cat.label}
                </div>
                <div className="text-xs font-body text-[#5C4A42] mb-3">
                  {cat.desc}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {placedHere.map((p) => (
                    <span
                      key={p.cardId}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white text-xs font-body border"
                      style={{
                        color: p.correct ? "#4A6741" : "#C44900",
                        borderColor: p.correct ? "#4A6741" : "#C44900",
                      }}
                    >
                      {p.correct && <CheckCircle2 size={12} />}
                      {p.card.phrase}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showRule && (
        <div className="mt-8">
          <RuleBox accentColor={ADJ_COLORS.sayi}>{SCENE_3.rule}</RuleBox>
        </div>
      )}

      {placedCount === total && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2 text-[#4A6741] font-serif-display text-lg">
            <ArrowRight size={20} />
            Sonuç ekranına geçiliyor...
          </div>
        </div>
      )}
    </section>
  );
};

export default Scene3Menu;
