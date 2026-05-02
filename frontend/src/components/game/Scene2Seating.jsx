import { useState } from "react";
import { toast } from "sonner";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";
import WaiterDialog from "./WaiterDialog";
import RuleBox from "./RuleBox";
import { SCENE_2, ADJ_COLORS } from "@/lib/gameContent";

const distanceToScale = {
  yakın: 1.0,
  orta: 0.85,
  uzak: 0.7,
};

const Scene2Seating = ({ onFinish }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showRule, setShowRule] = useState(false);
  const [highlightedObj, setHighlightedObj] = useState(null);

  const q = SCENE_2.questions[currentQ];

  const pickOption = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.answer;
    setHighlightedObj(q.targetObject || null);

    if (correct) {
      toast.success(`Doğru! "${opt}" uygun.`);
    } else {
      toast(`Doğru cevap: "${q.answer}". Bu, ${q.text.toLowerCase()}`, {
        icon: "💡",
      });
    }
    const result = {
      id: q.id,
      selected: opt,
      correct_answer: q.answer,
      is_correct: correct,
    };
    setAnswers((prev) => [...prev, result]);
    if (!showRule) setShowRule(true);
  };

  const next = () => {
    if (currentQ < SCENE_2.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setHighlightedObj(null);
    } else {
      const finalAnswers = answers;
      const score = finalAnswers.filter((a) => a.is_correct).length;
      onFinish({
        score,
        max_score: SCENE_2.questions.length,
        answers: finalAnswers,
      });
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 text-[#D68C45] font-serif-display text-xs tracking-[0.3em] uppercase">
          <Sparkles size={14} />
          {SCENE_2.subtitle}
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#2A2421] mt-2">
          {SCENE_2.title}
        </h1>
      </div>

      <WaiterDialog lines={SCENE_2.waiterIntro} accentColor={ADJ_COLORS.isaret}>
        <p>
          Buyurun efendim,{" "}
          <span className="adj-pill" style={{ background: ADJ_COLORS.isaret, color: "#FFFDF7" }}>şuradaki</span>{" "}
          masa sizin yeriniz.{" "}
          <span className="adj-pill" style={{ background: ADJ_COLORS.isaret, color: "#FFFDF7" }}>Bu</span>{" "}
          sandalyeye,{" "}
          <span className="adj-pill" style={{ background: ADJ_COLORS.isaret, color: "#FFFDF7" }}>şu</span>{" "}
          köşe koltuğa ya da{" "}
          <span className="adj-pill" style={{ background: ADJ_COLORS.isaret, color: "#FFFDF7" }}>o</span>{" "}
          pencere kenarına oturabilirsiniz.
        </p>
      </WaiterDialog>

      {/* Distance visualization */}
      <div className="mt-8 rounded-3xl p-6 md:p-10 border border-[#E8DCC4] bg-gradient-to-b from-[#FFF8EC] to-[#F9F6F0] shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 cini-bg opacity-60 pointer-events-none" />
        <div className="relative grid grid-cols-3 items-end gap-4">
          {SCENE_2.objects.map((obj) => (
            <div key={obj.id} className="flex flex-col items-center">
              <div
                data-testid={`scene2-object-${obj.id}`}
                className={`w-full aspect-square max-w-[180px] rounded-2xl bg-white border-2 border-[#D7CCC8] flex flex-col items-center justify-center text-center shadow-md transition-all ${
                  highlightedObj === obj.id ? "object-glow border-[#D68C45]" : ""
                }`}
                style={{
                  transform: `scale(${distanceToScale[obj.distance]})`,
                }}
              >
                <MapPin size={28} className="text-[#D68C45] mb-2" />
                <span className="font-serif-display text-sm md:text-base text-[#2A2421]">
                  {obj.label}
                </span>
                <span className="text-[11px] font-body text-[#8C7A6B] uppercase tracking-widest mt-1">
                  {obj.distance}
                </span>
              </div>
              <div className="mt-3 text-xs font-mono-num text-[#8C7A6B]">
                {obj.correct}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <div
        className="mt-8 p-6 md:p-8 rounded-2xl bg-[#FFFDF7] border-2 border-[#D68C45]/40 shadow-lg animate-slide-up"
        data-testid="scene2-question-box"
      >
        <p className="text-xs tracking-widest uppercase text-[#8C7A6B] font-serif-display mb-2">
          Soru {currentQ + 1} / {SCENE_2.questions.length}
        </p>
        <p className="font-body text-lg md:text-xl text-[#2A2421] mb-5">
          {q.text}
        </p>
        <div className="flex flex-wrap gap-3">
          {q.options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrect = opt === q.answer;
            let bg = "#F9F6F0";
            let color = "#2A2421";
            let border = "#D7CCC8";
            if (selected) {
              if (isSelected && isCorrect) {
                bg = "#4A6741";
                color = "#FFFDF7";
                border = "#4A6741";
              } else if (isSelected && !isCorrect) {
                bg = "#C44900";
                color = "#FFFDF7";
                border = "#C44900";
              } else if (!isSelected && isCorrect) {
                bg = "#4A6741";
                color = "#FFFDF7";
                border = "#4A6741";
              }
            }
            return (
              <button
                type="button"
                key={opt}
                data-testid={`scene2-opt-${opt}`}
                onClick={() => pickOption(opt)}
                disabled={!!selected}
                className="px-6 py-3 rounded-full border-2 font-serif-display text-lg transition-all hover:-translate-y-0.5 disabled:cursor-default"
                style={{ background: bg, color, borderColor: border }}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {selected && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              data-testid="scene2-next-btn"
              onClick={next}
              className="px-6 py-3 rounded-full bg-[#3E2723] text-[#F9F6F0] font-serif-display shadow-lg flex items-center gap-2 hover:-translate-y-0.5 transition-transform"
            >
              {currentQ < SCENE_2.questions.length - 1 ? "Sonraki Soru" : "Sahneyi Bitir"}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {showRule && (
        <div className="mt-6">
          <RuleBox accentColor={ADJ_COLORS.isaret}>{SCENE_2.rule}</RuleBox>
        </div>
      )}
    </section>
  );
};

export default Scene2Seating;
