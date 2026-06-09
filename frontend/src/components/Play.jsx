import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, Sparkles, Copy, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import SnakeLadder from "@/components/SnakeLadder";

// ============= PASS & PLAY =============
export const PassPlay = () => {
  return <SnakeLadder mode="passplay" />;
};

// ============= ONLINE MULTIPLAYER =============
export const OnlinePlay = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoom = (searchParams.get("room") || "").toUpperCase();

  const [mode, setMode] = useState(initialRoom ? "join" : "choose");
  const [roomCode, setRoomCode] = useState(initialRoom);
  const [joinCode, setJoinCode] = useState(initialRoom);
  const [playerName, setPlayerName] = useState("");
  const [copied, setCopied] = useState(false);

  // Build join URL using current origin + path
  const joinUrl = roomCode
    ? `${window.location.origin}/play/online?room=${roomCode}`
    : "";

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setMode("host");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ECHOMIND - Multiplayer",
          text: `Yuk gabung main ECHOMIND! Room: ${roomCode}`,
          url: joinUrl,
        });
      } catch { /* user cancelled */ }
    } else {
      copyLink();
    }
  };

  const startBoard = () => setMode("board");

  const joinRoom = () => {
    if (!joinCode.trim() || !playerName.trim()) return;
    setRoomCode(joinCode.toUpperCase());
    setMode("board");
  };

  if (mode === "board") {
    return <SnakeLadder mode="online" roomCode={roomCode} />;
  }

  return (
    <div data-testid="online-page" className="relative min-h-screen pb-16">
      <div className="relative z-10 px-4 md:px-10 pt-5 flex items-center justify-between">
        <button data-testid="back-home-btn" onClick={() => navigate("/")} className="retro-btn retro-btn-black !text-xs !px-4 !py-2">
          <ArrowLeft className="w-4 h-4" strokeWidth={3} /> HOME
        </button>
        <div className="font-display text-xl md:text-2xl text-[#5B21B6]" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>
          MULTIPLAYER
        </div>
        <div className="w-[88px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 mt-8">
        {mode === "choose" && (
          <div data-testid="choose-panel" className="grid md:grid-cols-2 gap-6">
            <div className="retro-card-purple p-8">
              <div className="font-pixel text-[10px] text-[#FFD600] mb-3">// HOST //</div>
              <h3 className="font-display text-3xl mb-3 text-white" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>BUAT ROOM</h3>
              <p className="font-body text-white/90 mb-6">Generate kode room 6-digit + QR code untuk diundang ke teman-temanmu, lalu mulai board.</p>
              <button data-testid="host-btn" onClick={generateCode} className="retro-btn retro-btn-lime !text-sm">
                <Sparkles className="w-4 h-4" strokeWidth={3} /> Generate Room
              </button>
            </div>
            <div className="retro-card-magenta p-8">
              <div className="font-pixel text-[10px] text-[#FFD600] mb-3">// JOIN //</div>
              <h3 className="font-display text-3xl mb-3 text-white" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>GABUNG ROOM</h3>
              <p className="font-body text-white/90 mb-6">Scan QR code dari host atau masukkan kode room manual untuk bergabung.</p>
              <button data-testid="join-mode-btn" onClick={() => setMode("join")} className="retro-btn retro-btn-yellow !text-sm">
                <Play className="w-4 h-4" strokeWidth={3} /> Masukkan Kode
              </button>
            </div>
          </div>
        )}

        {mode === "host" && (
          <div data-testid="host-panel" className="retro-card p-6 md:p-10">
            <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// ROOM CODE //</div>
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <div data-testid="room-code" className="font-display text-5xl md:text-7xl text-[#5B21B6]" style={{ WebkitTextStroke: "2px #0A0A0A", textShadow: "5px 5px 0 #FF1493" }}>
                {roomCode}
              </div>
              <button onClick={copyLink} className="retro-btn retro-btn-black !text-xs !px-3 !py-2" data-testid="copy-code-btn">
                <Copy className="w-3 h-3" strokeWidth={3} /> {copied ? "COPIED!" : "COPY LINK"}
              </button>
              <button onClick={shareLink} className="retro-btn retro-btn-magenta !text-xs !px-3 !py-2" data-testid="share-link-btn">
                <Share2 className="w-3 h-3" strokeWidth={3} /> SHARE
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// QR CODE — SCAN PAKAI HP //</div>
                <div data-testid="qr-code-wrapper" className="inline-block p-4 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0_#0A0A0A]">
                  <QRCodeSVG
                    value={joinUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#0A0A0A"
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-2 font-pixel text-[10px] text-[#0A0A0A]/70 break-all max-w-[220px]">
                  {joinUrl}
                </div>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// MULAI //</div>
                <ol className="font-body text-sm space-y-2 mb-4 list-decimal pl-5 text-[#0A0A0A]/85">
                  <li>Share QR / link / kode ke pemain lain</li>
                  <li>Pemain scan QR atau buka link di HP mereka</li>
                  <li>Klik tombol &quot;Mulai Board&quot; di bawah saat semua siap</li>
                </ol>
                <button data-testid="start-board-btn" onClick={startBoard} className="retro-btn retro-btn-purple !text-sm">
                  <Play className="w-4 h-4" strokeWidth={3} /> Mulai Board
                </button>
                <div className="mt-4 p-3 rounded-lg border-2 border-black bg-[#FFD600]/60">
                  <div className="font-pixel text-[10px] mb-1">★ NOTE</div>
                  <p className="font-body text-xs">
                    Realtime sync multi-device akan ditambahkan di update berikutnya. Saat ini QR scan akan mengarahkan ke halaman join — untuk demo, board berjalan satu device (gantian seperti Pass & Play).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button data-testid="back-to-choose" onClick={() => { setMode("choose"); setRoomCode(""); }} className="retro-btn retro-btn-yellow !text-sm">
                <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Kembali
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div data-testid="join-panel" className="retro-card p-6 md:p-10">
            <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// JOIN ROOM //</div>
            <h2 className="font-display text-3xl md:text-5xl mb-6" style={{ textShadow: "4px 4px 0 #84CC16" }}>MASUKKAN KODE</h2>
            {initialRoom && (
              <div className="mb-4 p-3 rounded-lg border-2 border-black bg-[#84CC16]/40">
                <div className="font-pixel text-[10px] mb-1">// AUTO-DETECTED //</div>
                <p className="font-body text-sm">Kode room dari link: <strong>{initialRoom}</strong></p>
              </div>
            )}
            <div className="space-y-4 mb-6">
              <input
                data-testid="join-code-input"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="retro-input w-full !text-2xl font-display tracking-widest"
              />
              <input
                data-testid="join-name-input"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Nama kamu"
                maxLength={20}
                className="retro-input w-full"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <button data-testid="join-confirm-btn" onClick={joinRoom} className="retro-btn retro-btn-purple !text-sm">
                <Play className="w-4 h-4" strokeWidth={3} /> Gabung &amp; Mulai Board
              </button>
              <button onClick={() => setMode("choose")} className="retro-btn retro-btn-yellow !text-sm">
                <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
