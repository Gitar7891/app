import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { UtensilsCrossed, Users, GraduationCap, ArrowRight } from "lucide-react";
import { createSession } from "@/lib/api";

const Landing = () => {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const start = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast("Lütfen adını yaz (en az 2 harf).", { icon: "✋" });
      return;
    }
    setLoading(true);
    try {
      const session = await createSession(trimmed, className.trim() || null);
      navigate(`/oyun/${session.id}`);
    } catch (err) {
      toast.error("Oturum oluşturulamadı. Lütfen tekrar dene.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/18727377/pexels-photo-18727377.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)",
        }}
      />
      <div className="absolute inset-0 bg-[#3E2723]/80" />
      <div className="absolute inset-0 cini-bg opacity-40" />

      {/* Lantern accents */}
      <div className="absolute top-8 left-8 w-6 h-6 rounded-full bg-[#D4AF37] animate-lantern opacity-80" />
      <div
        className="absolute top-16 right-12 w-4 h-4 rounded-full bg-[#D4AF37] animate-lantern opacity-70"
        style={{ animationDelay: "0.8s" }}
      />
      <div
        className="absolute bottom-20 left-16 w-5 h-5 rounded-full bg-[#D68C45] animate-lantern opacity-60"
        style={{ animationDelay: "1.4s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen grid md:grid-cols-12 gap-10 items-center py-12">
        {/* Left: Branding */}
        <div className="md:col-span-7 text-[#F9F6F0] animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-serif-display text-xs tracking-[0.3em] uppercase mb-6">
            <UtensilsCrossed size={14} />
            6. Sınıf Türkçe · Sıfat Türleri
          </div>
          <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
            Lezzet Dolu
            <br />
            <span className="italic text-[#D4AF37]">Sıfatlar</span>
          </h1>
          <p className="font-body text-base sm:text-lg lg:text-xl text-[#E8DCC4] mt-6 max-w-xl leading-relaxed">
            Sıfat Restoranı'na hoş geldin! Garson{" "}
            <strong className="text-[#D4AF37]">Sıfat Bey</strong>, seni niteleme,
            işaret ve sayı sıfatlarıyla dolu bir akşam yemeğine davet ediyor.
            Her masada yeni bir keşif var.
          </p>

          <ul className="mt-8 space-y-2 font-body text-sm text-[#E8DCC4]/90">
            <li>• 3 sahnelik interaktif restoran deneyimi (MVP)</li>
            <li>• Sesli anlatım (Türkçe)</li>
            <li>• Anlık geri bildirim ve öğretmen raporu</li>
          </ul>
        </div>

        {/* Right: Reservation form */}
        <div className="md:col-span-5 animate-scale-in">
          <form
            onSubmit={start}
            className="rounded-3xl bg-[#FFFDF7] p-8 md:p-10 shadow-2xl border-4 border-[#D4AF37] relative"
            data-testid="landing-form"
          >
            <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-[#3E2723] text-[#D4AF37] font-serif-display text-xs tracking-[0.3em] uppercase">
              Rezervasyon
            </div>

            <h2 className="font-serif-display text-2xl text-[#2A2421] mb-1">
              Masaya Buyurun
            </h2>
            <p className="font-body text-sm text-[#8C7A6B] mb-6">
              Adını yaz, sana özel masanı hazırlayalım.
            </p>

            <label className="block font-body text-xs tracking-widest uppercase text-[#5C4A42] mb-1">
              Adın
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="örn. Ayşe Yılmaz"
              data-testid="student-name-input"
              className="w-full bg-transparent border-0 border-b-2 border-[#D68C45]/60 focus:border-[#C44900] outline-none font-serif-display text-2xl text-[#2A2421] py-2 placeholder:text-[#8C7A6B]/50"
              maxLength={60}
            />

            <label className="block font-body text-xs tracking-widest uppercase text-[#5C4A42] mt-5 mb-1">
              Sınıfın (opsiyonel)
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="örn. 6/A"
              data-testid="student-class-input"
              className="w-full bg-transparent border-0 border-b-2 border-[#D68C45]/40 focus:border-[#C44900] outline-none font-body text-base text-[#2A2421] py-2 placeholder:text-[#8C7A6B]/50"
              maxLength={40}
            />

            <button
              type="submit"
              disabled={loading}
              data-testid="start-game-button"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-[#C44900] hover:bg-[#A33D00] text-white px-6 py-4 rounded-full font-serif-display text-xl shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? "Hazırlanıyor..." : "Oyuna Başla"}
              <ArrowRight size={20} />
            </button>

            <div className="mt-6 flex items-center gap-3 text-[10px] tracking-widest uppercase text-[#8C7A6B]">
              <div className="flex-1 h-px bg-[#E8DCC4]" />
              <span>veya</span>
              <div className="flex-1 h-px bg-[#E8DCC4]" />
            </div>

            <Link
              to="/ogretmen"
              data-testid="teacher-dashboard-link"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#F9F6F0] text-[#3E2723] border-2 border-[#3E2723] px-6 py-3 rounded-full font-serif-display text-base hover:bg-[#3E2723] hover:text-[#F9F6F0] transition-colors"
            >
              <GraduationCap size={18} /> Öğretmen Paneli
            </Link>
          </form>

          <div className="mt-4 text-center text-xs text-[#E8DCC4]/60 font-body flex items-center justify-center gap-1.5">
            <Users size={12} /> Çok kullanıcılı · Skorlar saklanır
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
