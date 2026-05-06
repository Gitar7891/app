import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import WaiterDialog from "./WaiterDialog";
import RuleBox from "./RuleBox";
import { ADJ_COLORS } from "@/lib/gameContent";

/**
 * Generic identify-and-classify scene used by Scene 1, 4 and 5.
 * Phase 1: click adjectives in waiter dialog
 * Phase 2: identify adjectives in 3 short sentences
 */
const IdentifyScene = ({ scene, accentKey, onFinish, testIdPrefix }) => {
  const accentColor = ADJ_COLORS[accentKey] || ADJ_COLORS.niteleme;
  const [phase, setPhase] = useState(1);
  const [picked, setPicked] = useState(new Set());
  const [showRule, setShowRule] = useState(false);

  const correctSet = useMemo(
    () => new Set(scene.dialogTokens.filter((t) => t.isAdj).map((t) => t.t)),
    [scene],
  );

  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [sentencePicks, setSentencePicks] = useState({});
  const [sentenceResults, setSentenceResults] = useState([]);

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
      toast.success("Harika! Tüm sıfatları doğru buldun.");
      setShowRule(true);
    } else if (correctPicks === 0) {
      toast("İpucu: İsimleri belirten kelimeleri ara.", { icon: "💡" });
    } else {
      toast(
        `${correctPicks}/${total} doğru. ${wrongPicks > 0 ? "Bazı seçimlerini tekrar düşün." : "Devam!"}`,
        { icon: "🍽️" },
      );
    }
  };

  const sentence = scene.multiSentence[sentenceIdx];
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

    if (perfect) toast.success("Mükemmel!");
    else if (score > 0)
      toast(`${score}/${correctArr.length} doğru — devam!`, { icon: "👏" });
    else toast(`Doğru cevap: ${correctArr.join(", ")}`, { icon: "💡" });

    if (sentenceIdx < scene.multiSentence.length - 1) {
      setSentenceIdx(sentenceIdx + 1);
    } else {
      const finalResults = [...sentenceResults, result];
      const totalPoints = finalResults.reduce((s, r) => s + r.correct, 0);
      const maxPoints = finalResults.reduce((s, r) => s + r.total, 0);
      const phase1Correct = [...picked].filter((w) => correctSet.has(w)).length;
      const phase1Wrong = [...picked].filter((w) => !correctSet.has(w)).length;
      const phase1Score = Math.max(0, phase1Correct - phase1Wrong);
      const phase1Max = correctSet.size;
      onFinish({
        score: totalPoints + phase1Score,
        max_score: maxPoints + phase1Max,
        answers: [
          { phase: "identify", picked: [...picked], correct: [...correctSet] },
          ...finalResults,
        ],
      });
    }
  };

  return (
    <section
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10"
      data-testid={`${testIdPrefix}-scene`}
    >
      <div className="mb-6 animate-slide-up">
        <div
          className="flex items-center gap-2 font-serif-display text-xs tracking-[0.3em] uppercase"
          style={{ color: accentColor }}
        >
          <Sparkles size={14} />
          {scene.subtitle}
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#2A2421] mt-2">
          {scene.title}
        </h1>
      </div>

      {phase === 1 && (
        <>
          <WaiterDialog lines={scene.waiterIntro} accentColor={accentColor}>
            <p>
              {scene.dialogTokens.map((token, i) => {
                if (!token.isAdj) return <span key={i} className="mx-0.5">{token.t}</span>;
                const isPicked = picked.has(token.t);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => togglePick(token.t)}
                    data-testid={`${testIdPrefix}-adj-${token.t}`}
                    className="adj-pill mx-0.5 select-none text-[#2A2421] bg-[#FFF5E6] border border-[#E8DCC4]"
                    style={
                      isPicked
                        ? {
                            background: accentColor,
                            color: "#FFFDF7",
                            borderColor: accentColor,
                          }
                        : {}
                    }
                  >
                    {correctSet.has(token.t) && isPicked && (
                      <CheckCircle2 size={14} className="inline mr-1 -mt-0.5" />
                    )}
                    {token.t}
                  </button>
                );
              })}
            </p>
          </WaiterDialog>

          <div className="mt-6 p-5 rounded-2xl border-2 border-dashed border-[#D68C45]/50 bg-[#FFF5E6]/50 animate-slide-up">
            <p className="font-body text-[#5C4A42] text-sm md:text-base mb-4">
              <strong style={{ color: accentColor }}>Görev:</strong> Garsonun
              konuşmasında ilgili sıfatlara tıkla.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={checkPhase1}
                data-testid={`${testIdPrefix}-check-btn`}
                className="px-6 py-3 rounded-full text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
                style={{ background: accentColor }}
              >
                Seçimi Kontrol Et
              </button>
              {showRule && (
                <button
                  type="button"
                  onClick={() => setPhase(2)}
                  data-testid={`${testIdPrefix}-continue-btn`}
                  className="px-6 py-3 rounded-full bg-[#3E2723] text-[#F9F6F0] font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform flex items-center gap-2"
                >
                  Devam Et <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          {showRule && (
            <div className="mt-6">
              <RuleBox accentColor={accentColor}>{scene.rule}</RuleBox>
            </div>
          )}
        </>
      )}

      {phase === 2 && sentence && (
        <div className="animate-slide-up">
          <WaiterDialog
            lines={[`Alıştırma ${sentenceIdx + 1}. ${sentence.sentence}`]}
            accentColor={accentColor}
          >
            <p className="mb-2 text-sm text-[#8C7A6B] font-body italic">
              Alıştırma {sentenceIdx + 1} / {scene.multiSentence.length}
            </p>
            <p className="mb-3">Aşağıdaki cümlede ilgili sıfatları seçin:</p>
            <p className="flex flex-wrap items-center gap-1 text-lg">
              {sentence.words.map((w, i) => {
                const isPunct = [".", ",", "!", "?"].includes(w);
                if (isPunct) return <span key={i}>{w}</span>;
                const isPicked = currentPicks.has(w);
                return (
                  <button
                    key={i}
                    type="button"
                    data-testid={`${testIdPrefix}-p2-word-${w}`}
                    onClick={() => togglePickSentence(w)}
                    className="adj-pill bg-[#FFF5E6] border border-[#E8DCC4] text-[#2A2421]"
                    style={
                      isPicked
                        ? {
                            background: accentColor,
                            color: "#FFFDF7",
                            borderColor: accentColor,
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
              data-testid={`${testIdPrefix}-submit-sentence-btn`}
              className="px-6 py-3 rounded-full text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
              style={{ background: accentColor }}
            >
              Cevabı Gönder
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default IdentifyScene;
