import { useState } from "react";
import { Volume2, Square } from "lucide-react";
import { speakTurkish, stopSpeaking, isTTSAvailable } from "@/lib/tts";

const WaiterDialog = ({ lines = [], children, accentColor = "#D68C45" }) => {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const text = lines.join(" ");
    setSpeaking(true);
    speakTurkish(text, { onEnd: () => setSpeaking(false) });
  };

  return (
    <div className="relative" data-testid="waiter-dialog">
      <div className="flex items-start gap-4">
        {/* Waiter avatar */}
        <div
          className="hidden md:flex shrink-0 w-20 h-20 rounded-full border-4 border-[#D4AF37] items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(160deg,#3E2723,#5C4A42)" }}
          aria-hidden
        >
          <span className="text-[#D4AF37] font-serif-display text-3xl font-bold">
            SB
          </span>
        </div>

        <div className="relative flex-1">
          <div
            className="relative bg-[#FFFDF7] border-2 rounded-[28px] rounded-tl-sm p-6 md:p-8 shadow-[4px_6px_20px_rgba(62,39,35,0.12)]"
            style={{ borderColor: accentColor }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className="font-serif-display text-sm tracking-widest uppercase"
                style={{ color: accentColor }}
              >
                Sıfat Bey
              </span>
              <span className="h-px flex-1 bg-[#E8DCC4]" />
              {isTTSAvailable() && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  data-testid="audio-play-button"
                  aria-label={speaking ? "Durdur" : "Sesli dinle"}
                  className="p-2 rounded-full border transition-colors hover:bg-[#D68C45] hover:text-white"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  {speaking ? (
                    <Square size={18} fill="currentColor" />
                  ) : (
                    <Volume2 size={18} />
                  )}
                </button>
              )}
            </div>

            <div className="font-body text-lg md:text-xl leading-relaxed text-[#2A2421] space-y-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaiterDialog;
