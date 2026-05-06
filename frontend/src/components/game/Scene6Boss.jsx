import { useState } from "react";
import { toast } from "sonner";
import { ChefHat, ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import WaiterDialog from "./WaiterDialog";
import { SCENE_6, ADJ_COLORS, ADJ_LABELS } from "@/lib/gameContent";

const TYPES = ["niteleme", "isaret", "sayi", "soru", "belgisiz"];

const scoreJustification = (text, keywords) => {
  if (!text) return 0;
  const trimmed = text.trim().toLowerCase();
  const len = trimmed.length;
  if (len < 5) return 0;
  const hasKeyword = keywords.some((kw) => trimmed.includes(kw.toLowerCase()));
  if (hasKeyword && len >= 10) return 3;
  if (len >= 15) return 2;
  return 1;
};

const Scene6Boss = ({ onFinish }) => {
  const [qIdx, setQIdx] = useState(0);
  const [step, setStep] = useState(1); // 1=tespit, 2=tür, 3=gerekçe, 4=feedback
  const [pickedWord, setPickedWord] = useState(null);
  const [pickedType, setPickedType] = useState(null);
  const [justification, setJustification] = useState("");
  const [results, setResults] = useState([]);

  const q = SCENE_6.questions[qIdx];
  const total = SCENE_6.questions.length;

  const submit = () => {
    const detectScore = pickedWord === q.correctAdj ? 1 : 0;
    const typeScore = pickedType === q.correctType ? 2 : 0;
    const justScore = scoreJustification(justification, q.justKeywords);
    const totalScore = detectScore + typeScore + justScore;

    const result = {
      qId: q.id,
      sentence: q.sentence,
      pickedWord,
      correctAdj: q.correctAdj,
      pickedType,
      correctType: q.correctType,
      justification,
      detectScore,
      typeScore,
      justScore,
      total: totalScore,
    };
    setResults((prev) => [...prev, result]);
    setStep(4);

    if (totalScore === 6) toast.success(`Mükemmel! +${totalScore} puan`);
    else if (totalScore >= 3) toast(`+${totalScore} puan — devam et!`, { icon: "👏" });
    else toast(`+${totalScore} puan. Doğru cevap: "${q.correctAdj}" (${ADJ_LABELS[q.correctType]})`, { icon: "💡" });
  };

  const nextQuestion = () => {
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1);
      setStep(1);
      setPickedWord(null);
      setPickedType(null);
      setJustification("");
    } else {
      const finalResults = results;
      const score = finalResults.reduce((s, r) => s + r.total, 0);
      onFinish({
        score,
        max_score: total * 6,
        answers: finalResults,
      });
    }
  };

  const stepHint = {
    1: "1️⃣ Tespit Et: Cümledeki sıfatı bul ve tıkla.",
    2: "2️⃣ Tür Seç: Bu sıfat hangi türdendir?",
    3: "3️⃣ Gerekçe: Neden bu türde olduğunu kısaca yaz.",
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10" data-testid="scene6-scene">
      <div className="mb-6 animate-slide-up">
        <div className="flex items-center gap-2 font-serif-display text-xs tracking-[0.3em] uppercase text-[#D4AF37]">
          <Sparkles size={14} />
          {SCENE_6.subtitle}
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#2A2421] mt-2 flex items-center gap-3">
          <ChefHat className="text-[#3E2723]" size={36} />
          {SCENE_6.title}
        </h1>
      </div>

      {qIdx === 0 && step === 1 && (
        <WaiterDialog lines={SCENE_6.intro} accentColor="#3E2723">
          <p className="font-serif-display italic text-[#3E2723]">
            "Akşam bitti, şefimiz son bir sınav hazırladı."
          </p>
          <p className="mt-2 text-sm text-[#5C4A42]">
            Her cümlede üç adım var: <strong>Tespit (+1)</strong> ·{" "}
            <strong>Tür (+2)</strong> · <strong>Gerekçe (+3)</strong>. Maksimum: 6 puan/soru.
          </p>
        </WaiterDialog>
      )}

      {/* Progress */}
      <div className="mt-6 flex items-center gap-3" data-testid="scene6-progress">
        <span className="font-mono-num text-sm text-[#8C7A6B]">
          Soru {qIdx + 1} / {total}
        </span>
        <div className="flex-1 h-1.5 bg-[#E8DCC4] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-500"
            style={{ width: `${((qIdx + (step === 4 ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <span className="font-mono-num text-sm text-[#C44900]">
          {results.reduce((s, r) => s + r.total, 0)} / {total * 6}
        </span>
      </div>

      {/* Question card */}
      <div className="mt-6 rounded-3xl bg-[#FFFDF7] border-2 border-[#D4AF37]/40 shadow-xl overflow-hidden">
        <div className="bg-[#3E2723] text-[#F9F6F0] px-6 py-3 text-sm font-serif-display tracking-widest uppercase">
          {step <= 3 ? stepHint[step] : "Sonuç"}
        </div>

        <div className="p-6 md:p-8">
          {/* Sentence with word buttons */}
          <p className="font-serif-display text-2xl md:text-3xl text-[#2A2421] leading-relaxed flex flex-wrap items-center gap-2">
            {q.words.map((w, i) => {
              const cleaned = w.replace(/[.,!?]$/, "");
              const isPicked = pickedWord === cleaned;
              const isCorrectWord = cleaned === q.correctAdj;
              let style = {};
              if (step === 1) {
                if (isPicked) style = { background: ADJ_COLORS[q.correctType] || "#D68C45", color: "#FFFDF7" };
              } else if (isPicked) {
                style = isCorrectWord
                  ? { background: "#4A6741", color: "#FFFDF7" }
                  : { background: "#C44900", color: "#FFFDF7" };
              } else if (step >= 4 && isCorrectWord) {
                style = { background: "#4A6741", color: "#FFFDF7" };
              }
              return (
                <button
                  type="button"
                  key={i}
                  data-testid={`scene6-q${qIdx}-word-${cleaned}`}
                  disabled={step !== 1}
                  onClick={() => {
                    setPickedWord(cleaned);
                    setStep(2);
                  }}
                  className="adj-pill border-2 border-[#E8DCC4] text-[#2A2421] disabled:cursor-default"
                  style={style}
                >
                  {w}
                </button>
              );
            })}
          </p>

          {/* Step 2: type picker */}
          {step >= 2 && (
            <div className="mt-8 animate-slide-up">
              <p className="text-xs uppercase tracking-widest text-[#5C4A42] font-serif-display mb-3">
                Sıfat Türü
              </p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => {
                  const active = pickedType === t;
                  const isCorrect = t === q.correctType;
                  let bg = "#F9F6F0";
                  let color = ADJ_COLORS[t];
                  let border = ADJ_COLORS[t];
                  if (step >= 3 && active) {
                    if (isCorrect) {
                      bg = "#4A6741";
                      color = "#FFFDF7";
                      border = "#4A6741";
                    } else {
                      bg = "#C44900";
                      color = "#FFFDF7";
                      border = "#C44900";
                    }
                  } else if (step >= 4 && !active && isCorrect) {
                    bg = "#4A6741";
                    color = "#FFFDF7";
                    border = "#4A6741";
                  } else if (active) {
                    bg = ADJ_COLORS[t];
                    color = "#FFFDF7";
                  }
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={step !== 2}
                      onClick={() => {
                        setPickedType(t);
                        setStep(3);
                      }}
                      data-testid={`scene6-q${qIdx}-type-${t}`}
                      className="px-5 py-2 rounded-full border-2 font-serif-display text-base transition-all hover:-translate-y-0.5 disabled:cursor-default"
                      style={{ background: bg, color, borderColor: border }}
                    >
                      {ADJ_LABELS[t]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: justification */}
          {step >= 3 && (
            <div className="mt-8 animate-slide-up">
              <p className="text-xs uppercase tracking-widest text-[#5C4A42] font-serif-display mb-3">
                Gerekçe (kısa açıklama)
              </p>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                disabled={step !== 3}
                data-testid={`scene6-q${qIdx}-justification`}
                placeholder="örn. 'Niteleme sıfatıdır çünkü ismin özelliğini bildiriyor.'"
                rows={3}
                className="w-full p-4 rounded-xl bg-[#FFF8EC] border-2 border-[#E8DCC4] focus:border-[#D68C45] outline-none font-body text-base text-[#2A2421] resize-none disabled:bg-[#F9F6F0]/60"
                maxLength={300}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#8C7A6B] font-mono-num">
                  {justification.trim().length}/300 karakter
                </span>
                {step === 3 && (
                  <button
                    type="button"
                    onClick={submit}
                    data-testid={`scene6-q${qIdx}-submit`}
                    className="px-6 py-2.5 rounded-full bg-[#C44900] text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
                  >
                    Cevabı Gönder
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: feedback */}
          {step === 4 && (
            <div
              className="mt-8 p-5 rounded-2xl bg-[#FFF8EC] border-2 border-dashed border-[#D68C45] animate-scale-in"
              data-testid={`scene6-q${qIdx}-feedback`}
            >
              <div className="grid sm:grid-cols-3 gap-3 text-sm font-body">
                {[
                  { label: "Tespit", got: results[results.length - 1]?.detectScore, max: 1 },
                  { label: "Tür", got: results[results.length - 1]?.typeScore, max: 2 },
                  { label: "Gerekçe", got: results[results.length - 1]?.justScore, max: 3 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-[#FFFDF7] border border-[#E8DCC4]">
                    {r.got === r.max ? (
                      <CheckCircle2 className="text-[#4A6741]" size={20} />
                    ) : r.got > 0 ? (
                      <Sparkles className="text-[#D68C45]" size={20} />
                    ) : (
                      <XCircle className="text-[#C44900]" size={20} />
                    )}
                    <div className="flex-1">
                      <div className="text-xs text-[#8C7A6B] tracking-widest uppercase">
                        {r.label}
                      </div>
                      <div className="font-mono-num text-[#2A2421]">
                        +{r.got} / {r.max}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={nextQuestion}
                  data-testid={`scene6-q${qIdx}-next`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E2723] text-[#F9F6F0] font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
                >
                  {qIdx < total - 1 ? "Sonraki Soru" : "Sınavı Bitir"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Scene6Boss;
