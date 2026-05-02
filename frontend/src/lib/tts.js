// Web Speech API helper for Turkish TTS
let currentUtter = null;
let voicesCache = null;

const loadVoices = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length) {
      voicesCache = existing;
      resolve(existing);
      return;
    }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      voicesCache = v;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(v);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // fallback timeout
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1500);
  });

export const isTTSAvailable = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export const speakTurkish = async (text, { onEnd } = {}) => {
  if (!isTTSAvailable()) {
    if (onEnd) onEnd();
    return;
  }
  stopSpeaking();
  const voices = voicesCache || (await loadVoices());
  const trVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith("tr")) ||
    voices.find((v) => v.name?.toLowerCase().includes("turkish"));

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "tr-TR";
  if (trVoice) utter.voice = trVoice;
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  utter.onend = () => {
    currentUtter = null;
    if (onEnd) onEnd();
  };
  utter.onerror = () => {
    currentUtter = null;
    if (onEnd) onEnd();
  };
  currentUtter = utter;
  window.speechSynthesis.speak(utter);
};

export const stopSpeaking = () => {
  if (!isTTSAvailable()) return;
  window.speechSynthesis.cancel();
  currentUtter = null;
};
