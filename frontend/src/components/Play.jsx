import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Sparkles } from "lucide-react";
import SnakeLadder from "@/components/SnakeLadder";

// ============= PASS & PLAY =============
// Uses the snake-ladder board directly. (1 device, gantian.)
export const PassPlay = () => {
  return <SnakeLadder mode="passplay" />;
};

// ============= ONLINE MULTIPLAYER =============
// Lobby creates a room code → board appears. (Backend realtime not wired yet.)
export const OnlinePlay = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("choose"); // choose | host | join | board
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setMode("host");
  };

  const startBoard = () => setMode("board");

  const joinRoom = () => {
    if (!joinCode.trim() || !playerName.trim()) return;
    setRoomCode(joinCode.toUpperCase());
    setMode("board");
  };

  // ASCII QR-ish pixel grid
  const qr = (text) => {
    const grid = [];
    const size = 9;
    const seed = text.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push(((seed + x * 7 + y * 13 + x * y) % 3) === 0);
      }
      grid.push(row);
    }
    return grid;
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
              <p className="font-body text-white/90 mb-6">Generate kode room + QR untuk diundang ke teman-temanmu, lalu mulai board ular tangga.</p>
              <button data-testid="host-btn" onClick={generateCode} className="retro-btn retro-btn-lime !text-sm">
                <Sparkles className="w-4 h-4" strokeWidth={3} /> Generate Room
              </button>
            </div>
            <div className="retro-card-magenta p-8">
              <div className="font-pixel text-[10px] text-[#FFD600] mb-3">// JOIN //</div>
              <h3 className="font-display text-3xl mb-3 text-white" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>GABUNG ROOM</h3>
              <p className="font-body text-white/90 mb-6">Masukkan kode room yang dikirim host dan lanjut ke board.</p>
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
              <button onClick={() => navigator.clipboard?.writeText(roomCode)} className="retro-btn retro-btn-black !text-xs !px-3 !py-2" data-testid="copy-code-btn">
                COPY
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// QR CODE //</div>
                <div className="inline-block p-4 bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0_#0A0A0A]">
                  <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(9, 18px)" }}>
                    {qr(roomCode).flatMap((row, y) =>
                      row.map((on, x) => (
                        <div key={`${x}-${y}`} style={{ width: 18, height: 18, background: on ? "#0A0A0A" : "#fff" }} />
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// MULAI //</div>
                <p className="font-body mb-4 text-[#0A0A0A]/80">
                  Setelah semua bergabung, mulai board ular tangga. <br/><span className="font-pixel text-[10px]">★ Backend realtime belum di-wire. Saat ini board berjalan satu device untuk demo.</span>
                </p>
                <button data-testid="start-board-btn" onClick={startBoard} className="retro-btn retro-btn-purple !text-sm">
                  <Play className="w-4 h-4" strokeWidth={3} /> Mulai Board
                </button>
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
