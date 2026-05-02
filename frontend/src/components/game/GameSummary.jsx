import { Link } from "react-router-dom";
import { Trophy, Receipt, Home } from "lucide-react";

const GameSummary = ({ session }) => {
  const scenes = session?.scenes || {};
  const total = session?.total_score || 0;
  const max = session?.max_score || 0;
  const pct = max > 0 ? Math.round((total / max) * 100) : 0;

  const message =
    pct >= 85
      ? "Bu akşam harika bir misafirdiniz! Sıfatları çok iyi tanıyorsunuz."
      : pct >= 60
        ? "Güzel bir akşam oldu. Birkaç tekrar, sıfatlarda daha da ustalaşmanızı sağlayacak."
        : "Sofradan doydunuz ama öğrenmek için biraz daha dolaşalım. Sahneleri tekrar gezebilirsiniz.";

  return (
    <section
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      data-testid="game-summary"
    >
      <div className="rounded-3xl bg-[#3E2723] text-[#F9F6F0] p-8 md:p-12 shadow-2xl border-4 border-[#D4AF37] relative overflow-hidden">
        <div className="absolute inset-0 cini-bg opacity-10" />
        <div className="relative text-center">
          <div className="inline-flex p-4 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] mb-5 animate-lantern">
            <Trophy size={36} />
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl mb-3">
            Hesap Lütfen!
          </h1>
          <p className="font-body text-[#E8DCC4] text-base md:text-lg max-w-xl mx-auto">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#FFFDF7] border-2 border-[#D68C45]/40 shadow-lg p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4 text-[#8C7A6B]">
          <Receipt size={18} />
          <span className="font-serif-display text-xs tracking-[0.25em] uppercase">
            Hesap Fişi
          </span>
          <span className="ml-auto font-body text-xs">
            Misafir: <strong>{session?.student_name}</strong>
          </span>
        </div>

        <ul className="divide-y divide-dashed divide-[#E8DCC4] font-mono-num">
          {[
            { key: "scene_1", label: "1. Karşılama (Niteleme)" },
            { key: "scene_2", label: "2. Masa (İşaret)" },
            { key: "scene_3", label: "3. Menü (Sayı)" },
          ].map((row) => {
            const s = scenes[row.key] || { score: 0, max_score: 0 };
            return (
              <li
                key={row.key}
                className="flex items-baseline justify-between py-3"
                data-testid={`summary-row-${row.key}`}
              >
                <span className="font-body text-[#2A2421]">{row.label}</span>
                <span className="text-[#2A2421]">
                  <span className="text-[#C44900] font-bold">{s.score}</span>
                  <span className="text-[#8C7A6B]"> / {s.max_score}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-4 border-t-2 border-dashed border-[#3E2723] flex items-baseline justify-between font-mono-num">
          <span className="font-serif-display text-lg text-[#2A2421]">
            TOPLAM
          </span>
          <span>
            <span className="text-[#C44900] font-bold text-2xl">{total}</span>
            <span className="text-[#8C7A6B] text-lg"> / {max}</span>
            <span className="ml-2 text-sm text-[#8C7A6B]">(%{pct})</span>
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          data-testid="summary-home-btn"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C44900] text-white font-serif-display shadow-lg hover:-translate-y-0.5 transition-transform"
        >
          <Home size={18} /> Ana Sayfaya Dön
        </Link>
      </div>
    </section>
  );
};

export default GameSummary;
