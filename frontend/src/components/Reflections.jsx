import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Trophy, ChevronDown, ChevronUp, ClipboardList, BookOpen, Flame, MessageCircle, Zap, Heart } from "lucide-react";
import { ASPECTS, CARD_TYPES } from "@/constants/cards";

const ICONS = { flame: Flame, "message-circle": MessageCircle, zap: Zap, heart: Heart };
const TypeIcon = ({ iconKey, ...rest }) => { const I = ICONS[iconKey] || Flame; return <I {...rest} />; };

const REFLECTION_PROMPTS = [
  "Bagian permainan mana yang paling membuatmu nyaman membuka diri?",
  "Apakah ada pertanyaan yang sulit kamu jawab? Apa yang membuatnya sulit?",
  "Hal baru apa yang kamu pelajari tentang dirimu sendiri lewat permainan ini?",
  "Hal baru apa yang kamu pelajari tentang temanmu?",
  "Setelah bermain, apa satu hal kecil yang ingin kamu coba ubah dalam hidupmu?",
  "Bagaimana perasaanmu saat mendapat kartu Challenge / Twist?",
  "Topik (aspek) mana yang menurutmu paling menarik untuk dibahas lebih dalam di sesi BK?",
];

const formatTime = (ts) => {
  try {
    return new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  } catch { return "-"; }
};

const Reflections = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    try {
      const arr = JSON.parse(localStorage.getItem("echomind_history") || "[]");
      setHistory(arr);
    } catch { setHistory([]); }
  };

  useEffect(() => { load(); }, []);

  const clearAll = () => {
    if (!window.confirm("Hapus seluruh riwayat permainan?")) return;
    localStorage.removeItem("echomind_history");
    setHistory([]);
  };

  const deleteOne = (id) => {
    const next = history.filter((h) => h.id !== id);
    localStorage.setItem("echomind_history", JSON.stringify(next));
    setHistory(next);
  };

  return (
    <div data-testid="reflections-page" className="relative min-h-screen pb-16">
      <div className="relative z-10 px-4 md:px-10 pt-5 flex items-center justify-between">
        <button onClick={() => navigate("/")} data-testid="back-home-btn" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">
          <ArrowLeft className="w-4 h-4" strokeWidth={3} /> HOME
        </button>
        <div className="font-display text-xl md:text-2xl text-[#5B21B6]" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>
          REFLEKSI &amp; RIWAYAT
        </div>
        <div className="w-[88px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 mt-6">
        {/* Header card */}
        <div className="retro-card-purple p-6 md:p-8 mb-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8" strokeWidth={3} />
            <h1 className="font-display text-3xl md:text-4xl" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #FF1493" }}>UNTUK GURU BK</h1>
          </div>
          <p className="font-body text-sm md:text-base text-white/90">
            Halaman ini mendukung guru bimbingan &amp; konseling melakukan <strong>refleksi pasca-permainan</strong>:
            buka riwayat poin tiap pemain, kartu yang dijawab, dan gunakan daftar pertanyaan refleksi di bawah untuk diskusi.
          </p>
        </div>

        {/* Reflection prompts */}
        <div className="retro-card p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-6 h-6" strokeWidth={3} />
            <h2 className="font-display text-2xl md:text-3xl" style={{ textShadow: "3px 3px 0 #84CC16" }}>Pertanyaan Refleksi</h2>
          </div>
          <p className="font-body text-sm text-[#0A0A0A]/80 mb-4">Gunakan pertanyaan-pertanyaan berikut bersama peserta didik setelah permainan selesai:</p>
          <ol className="list-decimal pl-5 space-y-2 font-body">
            {REFLECTION_PROMPTS.map((p, i) => (
              <li key={i} data-testid={`reflection-prompt-${i}`}>{p}</li>
            ))}
          </ol>
        </div>

        {/* History */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-2xl md:text-3xl text-[#5B21B6]" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #FFD600" }}>
            Riwayat Permainan
          </h2>
          {history.length > 0 && (
            <button data-testid="clear-history-btn" onClick={clearAll} className="retro-btn retro-btn-magenta !text-xs !px-3 !py-2">
              <Trash2 className="w-4 h-4" strokeWidth={3} /> Hapus Semua
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div data-testid="empty-history" className="retro-card p-8 text-center">
            <div className="text-5xl mb-2">📭</div>
            <p className="font-body text-[#0A0A0A]/80">Belum ada riwayat. Mainkan satu sesi → riwayatnya akan otomatis tersimpan di sini.</p>
            <button onClick={() => navigate("/play/passplay")} className="retro-btn retro-btn-purple !text-sm mt-4">
              Mulai Bermain
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((h) => {
              const isOpen = expanded === h.id;
              return (
                <div key={h.id} data-testid={`history-${h.id}`} className="retro-card p-4 md:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-pixel text-[10px] text-[#5B21B6]">{formatTime(h.startedAt)} · MODE: {h.mode?.toUpperCase()}{h.roomCode ? ` · ROOM ${h.roomCode}` : ""}</div>
                      <div className="font-display text-lg flex items-center gap-2 mt-1">
                        <Trophy className="w-5 h-5" strokeWidth={3} />
                        Pemenang: <span className="text-[#FF1493]">{h.winner}</span>
                      </div>
                      <div className="font-body text-sm text-[#0A0A0A]/80 mt-1">Pemain: {h.players.join(", ")}</div>
                    </div>
                    <div className="flex gap-2">
                      <button data-testid={`toggle-${h.id}`} onClick={() => setExpanded(isOpen ? null : h.id)} className="retro-btn retro-btn-yellow !text-xs !px-3 !py-2">
                        {isOpen ? <><ChevronUp className="w-4 h-4" strokeWidth={3} /> Tutup</> : <><ChevronDown className="w-4 h-4" strokeWidth={3} /> Detail</>}
                      </button>
                      <button data-testid={`delete-${h.id}`} onClick={() => deleteOne(h.id)} className="retro-btn retro-btn-black !text-xs !px-3 !py-2">
                        <Trash2 className="w-4 h-4" strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 border-t-2 border-black pt-4 space-y-3">
                      <div>
                        <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// SKOR AKHIR (POSISI DI BOARD) //</div>
                        <div className="flex flex-wrap gap-2">
                          {h.players.map((name, i) => (
                            <span key={i} className="font-pixel text-[10px] bg-[#5B21B6] text-white px-3 py-2 rounded-full border-2 border-black">
                              {name}: kotak {h.positions?.[i] ?? "-"}
                            </span>
                          ))}
                        </div>
                      </div>

                      {h.cards && h.cards.length > 0 && (
                        <div>
                          <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// KARTU YANG DIJAWAB ({h.cards.length}) //</div>
                          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                            {h.cards.map((c, idx) => {
                              const aspect = ASPECTS.find((a) => a.id === c.aspect);
                              const type = CARD_TYPES[c.type];
                              return (
                                <div key={idx} className="border-2 border-black rounded-lg p-3" style={{ borderLeft: `8px solid ${aspect?.color || "#000"}` }}>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-pixel text-[10px] bg-black text-yellow-300 px-2 py-1 rounded">#{c.cell}</span>
                                    <span className="font-pixel text-[10px] flex items-center gap-1" style={{ color: type?.color }}>
                                      <TypeIcon iconKey={type?.iconKey} className="w-3 h-3" strokeWidth={3} /> {type?.label}
                                    </span>
                                    <span className="font-pixel text-[10px] text-[#5B21B6]">{aspect?.icon} {aspect?.name}</span>
                                    <span className="font-pixel text-[10px] bg-[#FFD600] px-2 py-1 rounded border border-black">{c.player}</span>
                                    <span className="font-pixel text-[10px] bg-white px-2 py-1 rounded border border-black">{c.action}</span>
                                  </div>
                                  <div className="font-display text-sm mt-1">{c.title}</div>
                                  <div className="font-body text-xs text-[#0A0A0A]/80 mt-1">{c.prompt}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflections;
