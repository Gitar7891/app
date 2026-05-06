import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ChevronLeft, RefreshCcw, Users, CheckCircle, Percent } from "lucide-react";
import { listTeacherSessions, teacherStats } from "@/lib/api";

const SCENE_META = {
  scene_1: { label: "Niteleme", color: "#C44900" },
  scene_2: { label: "İşaret", color: "#D68C45" },
  scene_3: { label: "Sayı", color: "#4A6741" },
  scene_4: { label: "Soru", color: "#2C4251" },
  scene_5: { label: "Belgisiz", color: "#8C7A6B" },
  scene_6: { label: "Boss · Şef", color: "#3E2723" },
};

const SCENE_KEYS = ["scene_1", "scene_2", "scene_3", "scene_4", "scene_5", "scene_6"];

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const StatCard = ({ icon: Icon, label, value, accent = "#D68C45" }) => (
  <div className="rounded-2xl bg-[#FFFDF7] border border-[#E8DCC4] p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-2" style={{ color: accent }}>
      <Icon size={16} />
      <span className="font-serif-display text-xs tracking-[0.25em] uppercase">
        {label}
      </span>
    </div>
    <div className="font-serif-display text-3xl text-[#2A2421]">{value}</div>
  </div>
);

const TeacherDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(""); // class filter

  const load = async () => {
    setLoading(true);
    try {
      const [s, st] = await Promise.all([listTeacherSessions(), teacherStats()]);
      setSessions(s);
      setStats(st);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter
    ? sessions.filter(
        (s) =>
          (s.class_name || "").toLowerCase().includes(filter.toLowerCase()) ||
          (s.student_name || "").toLowerCase().includes(filter.toLowerCase()),
      )
    : sessions;

  return (
    <div className="min-h-screen bg-[#F9F6F0] cini-bg">
      {/* Header */}
      <div className="bg-[#3E2723] text-[#F9F6F0] border-b-4 border-[#D4AF37]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#D4AF37]/15 text-[#D4AF37]">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="font-serif-display text-xs tracking-[0.3em] uppercase text-[#D4AF37]">
                Öğretmen Paneli
              </div>
              <h1 className="font-serif-display text-2xl md:text-3xl">
                Sıfat Restoranı — Sınıf Raporu
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              data-testid="refresh-btn"
              className="p-2 rounded-full border border-[#D4AF37]/30 hover:bg-[#D4AF37]/15 transition-colors"
              aria-label="Yenile"
            >
              <RefreshCcw size={16} />
            </button>
            <Link
              to="/"
              data-testid="back-home-link"
              className="inline-flex items-center gap-1 text-sm text-[#E8DCC4] hover:text-[#D4AF37] font-body"
            >
              <ChevronLeft size={16} /> Ana Sayfa
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Toplam Öğrenci"
            value={stats?.total_students ?? "—"}
          />
          <StatCard
            icon={CheckCircle}
            label="Tamamlanan"
            value={stats?.total_completed ?? "—"}
            accent="#4A6741"
          />
          <StatCard
            icon={Percent}
            label="Ortalama %"
            value={stats ? `%${stats.avg_percent}` : "—"}
            accent="#C44900"
          />
          <StatCard
            icon={GraduationCap}
            label="Ort. Puan"
            value={stats?.avg_score ?? "—"}
            accent="#2C4251"
          />
        </div>

        {/* Scene breakdown */}
        {stats?.scene_stats && (
          <div className="rounded-2xl bg-[#FFFDF7] border border-[#E8DCC4] p-6 shadow-sm">
            <h2 className="font-serif-display text-lg text-[#2A2421] mb-4">
              Sahne Bazında Ortalama
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(stats.scene_stats).map(([key, s]) => {
                const meta = SCENE_META[key];
                return (
                  <div
                    key={key}
                    className="p-4 rounded-xl border-2"
                    style={{ borderColor: `${meta.color}40`, background: `${meta.color}08` }}
                  >
                    <div
                      className="font-serif-display text-sm tracking-widest uppercase mb-1"
                      style={{ color: meta.color }}
                    >
                      {meta.label}
                    </div>
                    <div className="font-mono-num text-2xl text-[#2A2421]">
                      {s.avg_score} / {s.avg_max}
                    </div>
                    <div className="text-xs font-body text-[#8C7A6B] mt-1">
                      Ortalama başarı: <strong>%{s.avg_percent}</strong> ·{" "}
                      {s.participants} katılımcı
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sessions table */}
        <div className="rounded-2xl bg-[#FFFDF7] border border-[#E8DCC4] shadow-sm overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 justify-between p-5 border-b border-[#E8DCC4]">
            <h2 className="font-serif-display text-lg text-[#2A2421]">
              Öğrenci Oturumları
            </h2>
            <input
              type="text"
              placeholder="Öğrenci veya sınıf ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              data-testid="sessions-filter"
              className="px-4 py-2 rounded-full bg-[#F9F6F0] border border-[#E8DCC4] font-body text-sm outline-none focus:border-[#D68C45] w-60"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm" data-testid="sessions-table">
              <thead className="bg-[#F9F6F0]">
                <tr className="text-left text-[#5C4A42] text-xs tracking-widest uppercase">
                  <th className="px-5 py-3 font-serif-display">Öğrenci</th>
                  <th className="px-5 py-3 font-serif-display">Sınıf</th>
                  <th className="px-5 py-3 font-serif-display">Başlangıç</th>
                  <th className="px-5 py-3 font-serif-display">Durum</th>
                  <th className="px-5 py-3 font-serif-display">S1</th>
                  <th className="px-5 py-3 font-serif-display">S2</th>
                  <th className="px-5 py-3 font-serif-display">S3</th>
                  <th className="px-5 py-3 font-serif-display">S4</th>
                  <th className="px-5 py-3 font-serif-display">S5</th>
                  <th className="px-5 py-3 font-serif-display">S6</th>
                  <th className="px-5 py-3 font-serif-display text-right">
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-[#8C7A6B]">
                      Yükleniyor...
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-12 text-[#8C7A6B]">
                      Henüz oturum yok.
                    </td>
                  </tr>
                )}
                {filtered.map((s, idx) => {
                  const pct =
                    s.max_score > 0
                      ? Math.round((s.total_score / s.max_score) * 100)
                      : 0;
                  return (
                    <tr
                      key={s.id}
                      data-testid={`session-row-${idx}`}
                      className="border-t border-[#E8DCC4]/70 hover:bg-[#FFF8EC] transition-colors"
                    >
                      <td className="px-5 py-3 text-[#2A2421] font-semibold">
                        {s.student_name}
                      </td>
                      <td className="px-5 py-3 text-[#5C4A42]">
                        {s.class_name || "—"}
                      </td>
                      <td className="px-5 py-3 text-[#8C7A6B] font-mono-num text-xs">
                        {formatDate(s.started_at)}
                      </td>
                      <td className="px-5 py-3">
                        {s.completed_at ? (
                          <span className="inline-flex items-center gap-1 text-[#4A6741] text-xs">
                            <CheckCircle size={12} /> Tamam
                          </span>
                        ) : (
                          <span className="text-[#D68C45] text-xs">Devam</span>
                        )}
                      </td>
                      {SCENE_KEYS.map((sk) => {
                        const sc = s.scenes?.[sk];
                        return (
                          <td
                            key={sk}
                            className="px-5 py-3 font-mono-num text-[#2A2421]"
                          >
                            {sc ? `${sc.score}/${sc.max_score}` : "—"}
                          </td>
                        );
                      })}
                      <td className="px-5 py-3 text-right">
                        <span className="font-mono-num">
                          <span className="text-[#C44900] font-bold">
                            {s.total_score}
                          </span>
                          <span className="text-[#8C7A6B]">
                            {" "}
                            / {s.max_score}
                          </span>
                        </span>
                        <div className="text-[10px] text-[#8C7A6B]">%{pct}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
