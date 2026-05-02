import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import WaiterDialog from "./WaiterDialog";
import RuleBox from "./RuleBox";
import { SCENE_1, ADJ_COLORS } from "@/lib/gameContent";

const AdjToken = ({ token, onClick, picked, correct }) => {
  if (!token.isAdj) {
    return <span className="mx-0.5">{token.t}</span>;
  }
  const base =
    "adj-pill mx-0.5 select-none text-[#2A2421] bg-[#FFF5E6] border border-[#E8DCC4]";
  const pickedStyle = picked
    ? "text-white border-transparent"
    : "hover:bg-[#FFE8CC]";
  return (
    <button
      type="button"
      onClick={() => onClick(token.t)}
      data-testid={`adj-word-${token.t}`}
      className={`${base} ${pickedStyle}`}
      style={
        picked
          ? {
              background: ADJ_COLORS.niteleme,
              color: "#FFFDF7",
              borderColor: ADJ_COLORS.niteleme,
            }
          : {}
      }
    >
      {correct && picked && (
        <CheckCircle2 size={14} className="inline mr-1 -mt-0.5" />
      )}
      {token.t}
    </button>
  );
};

const Scene1Greeting = ({ onFinish }) => {
  // Phase 1: click to identify adjectives inside dialog
  const [phase, setPhase] = useState(1); // 1: intro identify, 2: multi sentence, 3: done
  const [picked, setPicked] = useState(new Set());
  const [showRule, setShowRule] = useState(false);

  const correctSet = useMemo(
    () => new Set(SCENE_1.dialogTokens.filter((t) => t.isAdj).map((t) => t.t)),
    [],
  );

  // Phase 2: sentence exercises
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [sentencePicks, setSentencePicks] = useState({}); // {sentenceId: Set<word>}
  const [sentenceResults, setSentenceResults] = useState([]); // per-sentence {correct, total}

  const togglePick = (word) => {
    setPicked((prev) => {
      const n = new Set(prev);
      if (n.has(word)) n.delete(word);
      else n.add(word);
      return n;
    });
  };

  const checkPhase1 = () => {
    const correctPicks = [...picked].filter((w) => correctSet.has(w)).length;
    const wrongPicks = [...picked].filter((w) => !correctSet.has(w)).length;
    const total = correctSet.size;
    if (correctPicks === total && wrongPicks === 0) {
      toast.success("Harika! Tüm niteleme sıfatlarını buldun.");
      setShowRule(true);
    } else if (correctPicks === 0) {
      toast("İpucu: Varlıkların özelliğini bildiren kelimelere bak.", {
        icon: "💡",
      });
    } else {
      toast(
        `${correctPicks}/${total} doğru. ${wrongPicks > 0 ? "Bazı seçimlerini tekrar düşün." : "Biraz daha var, devam!"}`,
        { icon: "🍽️" },
      );
    }
  };

  const sentence = SCENE_1.multiSentence[sentenceIdx];
  const currentPicks = sentencePicks[sentence?.id] || new Set();

  const togglePickSentence = (word) => {
    setSentencePicks((prev) => {
      const existing = prev[sentence.id] ? new Set(prev[sentence.id]) : new Set();
      if (existing.has(word)) existing.delete(word);
      else existing.add(word);
      return { ...prev, [sentence.id]: existing };
    });
  };

  const submitSentence = () => {
    const correctArr = sentence.correct;
    const picksArr = [...currentPicks];
    const correctPicks = picksArr.filter((w) => correctArr.includes(w)).length;
    const wrongPicks = picksArr.filter((w) => !correctArr.includes(w)).length;

    const perfect = correctPicks === correctArr.length && wrongPicks === 0;
    const score = Math.max(0, correctPicks - wrongPicks);

    const result = {
      sentenceId: sentence.id,
      correct: score,
      total: correctArr.length,
      perfect,
    };
    setSentenceResults((prev) => [...prev, result]);

    if (perfect) {
      toast.success("Mükemmel!");
    } else if (score > 0) {
      toast(`${score}/${correctArr.length} doğru — devam!`, { icon: "👏" });
    } else {
      toast(`Doğru cevap: ${correctArr.join(", ")}`, { icon: "💡" });
    }

    if (sentenceIdx < SCENE_1.multiSentence.length - 1) {
      setSentenceIdx(sentenceIdx + 1);
    } else {
      // All done — compute final scene score
      const finalResults = [...sentenceResults, result];
      const totalPoints = finalResults.reduce((sum, r) => sum + r.correct, 0);
      const maxPoints = finalResults.reduce((sum, r) => sum + r.total, 0);
      // Add phase 1 bonus
      const phase1Correct = [...picked].filter((w) => correctSet.has(w)).length;
      const phase1Wrong = [...picked].filter((w) => !correctSet.has(w)).length;
      const phase1Score = Math.max(0, phase1Correct - phase1Wrong);
      const phase1Max = correctSet.size;

      const totalScore = totalPoints + phase1Score;
      const totalMax = maxPoints + phase1Max;
      onFinish({
        score: totalScore,
        max_score: totalMax,
        answers: [
          { phase: "identify", picked: [...picked], correct: [...correctSet] },
          ...finalResults,
        ],
      });
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 text-[#C44900] font-serif-display text-xs tracking-[0.3em] uppercase">
          <Sparkles size={14} />
          {SCENE_1.subtitle}
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#2A2421] mt-2">
          {SCENE_1.title}
        </h1>
      </div>

      {/* Phase 1: Identify in dialog */}
      {phase === 1 && (
        <>
          <WaiterDialog lines={SCENE_1.waiterIntro} accentColor={ADJ_COLORS.niteleme}>
            <p>
              {SCENE_1.dialogTokens.map((token, i) => (
                <AdjToken
                  key={i}
                  token={token}
                  onClick={togglePick}
                  picked={picked.has(token.t)}
                  correct={correctSet.has(token.t)}
                />
              ))}
            </p>
          </WaiterDialog>

          <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-[#D68C45]/50 bg-[#FFF5E6]/50 animate-slide-up">
            <p className="font-body text-[#5C4A42] text-sm md:text-base mb-4">
              <strong className="text-[#C44900]">Görev:</strong> Garsonun konuşmasında
              <em> varlıkları nasıl (nitelik/özellik) olduklarını bildiren</em> kelimelere tıkla.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={checkPhase1}
                data-testid="scene1-check-btn"
                className="px-6 py-3 rounded-full bg-[#C44900] text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
              >
                Seçimi Kontrol Et
              </button>
              {showRule && (
                <button
                  type="button"
                  onClick={() => setPhase(2)}
                  data-testid="scene1-continue-btn"
                  className="px-6 py-3 rounded-full bg-[#3E2723] text-[#F9F6F0] font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform flex items-center gap-2"
                >
                  Devam Et <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {showRule && (
            <div className="mt-6">
              <RuleBox accentColor={ADJ_COLORS.niteleme}>{SCENE_1.rule}</RuleBox>
            </div>
          )}
        </>
      )}

      {/* Phase 2: Sentence exercises */}
      {phase === 2 && sentence && (
        <div className="animate-slide-up">
          <WaiterDialog
            lines={[`Alıştırma ${sentenceIdx + 1}. ${sentence.sentence}`]}
            accentColor={ADJ_COLORS.niteleme}
          >
            <p className="mb-2 text-sm text-[#8C7A6B] font-body italic">
              Alıştırma {sentenceIdx + 1} / {SCENE_1.multiSentence.length}
            </p>
            <p className="mb-3">Aşağıdaki cümlede niteleme sıfatlarını seçin:</p>
            <p className="flex flex-wrap items-center gap-1 text-lg">
              {sentence.words.map((w, i) => {
                const isPunct = [".", ",", "!", "?"].includes(w);
                if (isPunct) return <span key={i}>{w}</span>;
                const isPicked = currentPicks.has(w);
                return (
                  <button
                    key={i}
                    type="button"
                    data-testid={`s1-p2-word-${w}`}
                    onClick={() => togglePickSentence(w)}
                    className="adj-pill bg-[#FFF5E6] border border-[#E8DCC4] text-[#2A2421]"
                    style={
                      isPicked
                        ? {
                            background: ADJ_COLORS.niteleme,
                            color: "#FFFDF7",
                            borderColor: ADJ_COLORS.niteleme,
                          }
                        : {}
                    }
                  >
                    {w}
                  </button>
                );
              })}
            </p>
          </WaiterDialog>

          <div className="mt-6">
            <button
              type="button"
              onClick={submitSentence}
              data-testid="scene1-submit-sentence-btn"
              className="px-6 py-3 rounded-full bg-[#C44900] text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Cevabı Gönder
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Scene1Greeting;
