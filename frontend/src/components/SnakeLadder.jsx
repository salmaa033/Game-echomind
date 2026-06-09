import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dices, Trophy, Plus, Trash2, Play, RotateCcw, Sparkles, ClipboardList, X } from "lucide-react";
import { ASPECTS, CARDS, CARD_TYPES, TWIST_EFFECTS, BOOST_EFFECTS } from "@/constants/cards";
import { Star, Sparkle, PixelHeart, Lightning, Diamond } from "@/components/RetroIcons";

/**
 * 60-cell serpentine board: 6 rows × 10 cols.
 * Row 0 (bottom) = 1..10 LTR, Row 1 = 20..11 RTL, etc. Row 5 (top) starts at 51.
 * Wait: 6 rows × 10 = 60. Top row (row 5) = 60..51 RTL.
 */
const COLS = 10;
const ROWS = 6;
const TOTAL = COLS * ROWS; // 60

// Snakes (head -> tail going DOWN)
const SNAKES = {
  59: 21,
  47: 14,
  44: 6,
  38: 18,
  29: 9,
};
// Ladders (foot -> top going UP)
const LADDERS = {
  3: 22,
  8: 31,
  17: 36,
  25: 44,
  42: 55,
};

const PLAYER_COLORS = ["#FF1493", "#5B21B6", "#84CC16", "#06B6D4", "#FB923C", "#FFD600"];

// Compute col/row (from bottom) for a cell number (1..60)
const cellToCoord = (n) => {
  const row = Math.floor((n - 1) / COLS);
  const colInRow = (n - 1) % COLS;
  const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow;
  return { col, rowFromBottom: row };
};

// Map cell to its card (CARDS index = cell - 1)
const cardForCell = (n) => CARDS[(n - 1) % CARDS.length];

const Board = ({ positions, validPlayers, lastRoll }) => {
  // Build cells in render order top-to-bottom, left-to-right
  const cells = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    const rowCells = [];
    for (let c = 0; c < COLS; c++) {
      const cellNum = r % 2 === 0 ? r * COLS + c + 1 : r * COLS + (COLS - c);
      rowCells.push(cellNum);
    }
    cells.push(rowCells);
  }

  return (
    <div data-testid="snake-ladder-board" className="bg-white border-4 border-black rounded-3xl p-3 shadow-[8px_8px_0_#0A0A0A]">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }}>
        {cells.flatMap((row) =>
          row.map((n) => {
            const card = cardForCell(n);
            const aspect = ASPECTS.find((a) => a.id === card.aspect);
            const type = CARD_TYPES[card.type];
            const isSnake = SNAKES[n] !== undefined;
            const isLadder = LADDERS[n] !== undefined;
            const playersHere = validPlayers
              .map((p, idx) => ({ p, idx }))
              .filter(({ idx }) => positions[idx] === n);

            return (
              <div
                key={n}
                data-testid={`cell-${n}`}
                className="relative aspect-square rounded-md border-2 border-black flex flex-col items-center justify-center text-center text-[10px] leading-none overflow-hidden"
                style={{ backgroundColor: aspect.color + "26" /* alpha hex */ }}
                title={`#${n} · ${aspect.name} · ${type.label}`}
              >
                <div className="absolute top-0 left-0 text-[8px] md:text-[10px] font-pixel bg-black text-yellow-300 px-1">{n}</div>
                <div className="text-base md:text-lg">{type.icon}</div>
                {isSnake && <div className="absolute bottom-0 right-0 text-[8px] md:text-[10px]">🐍</div>}
                {isLadder && <div className="absolute bottom-0 right-0 text-[8px] md:text-[10px]">🪜</div>}
                {playersHere.length > 0 && (
                  <div className="absolute inset-0 flex flex-wrap items-end justify-center gap-0.5 p-0.5">
                    {playersHere.map(({ p, idx }) => (
                      <div
                        key={idx}
                        className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black"
                        style={{ backgroundColor: p.color, boxShadow: idx === (lastRoll?.turn ?? -1) ? "0 0 0 2px #FFD600" : "none" }}
                        title={p.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs font-pixel">
        <span>🐍 = Ular</span>
        <span>🪜 = Tangga</span>
        {Object.entries(CARD_TYPES).map(([k, t]) => (
          <span key={k}>{t.icon} {t.label}</span>
        ))}
      </div>
    </div>
  );
};

const Dice = ({ dice, rolling, onRoll, disabled }) => (
  <button
    data-testid="dice-roll-btn"
    onClick={onRoll}
    disabled={disabled || rolling}
    className={`retro-card !p-0 !rounded-2xl w-24 h-24 md:w-28 md:h-28 flex items-center justify-center font-display text-5xl md:text-6xl text-[#5B21B6] ${rolling ? "animate-spin" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:translate-x-[-2px] hover:translate-y-[-2px]"}`}
    style={{ textShadow: "3px 3px 0 #FF1493" }}
    aria-label="Lempar dadu"
  >
    {dice ?? "?"}
  </button>
);

// Save game to localStorage history (for BK Refleksi)
const saveHistory = (entry) => {
  try {
    const key = "echomind_history";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift(entry);
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 50)));
  } catch (e) { /* ignore */ }
};

const SnakeLadder = ({ mode = "passplay", roomCode = null }) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("setup"); // setup | play | end
  const [players, setPlayers] = useState([
    { name: "", color: PLAYER_COLORS[0] },
    { name: "", color: PLAYER_COLORS[1] },
  ]);
  const [positions, setPositions] = useState([]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("Klik DADU untuk memulai!");
  const [activeCard, setActiveCard] = useState(null);
  const [winner, setWinner] = useState(null);
  const [lastRoll, setLastRoll] = useState(null);
  const [skipNext, setSkipNext] = useState({}); // {playerIdx: true} -> skip their next turn
  const [shields, setShields] = useState({}); // {playerIdx: count}
  const [direction, setDirection] = useState(1); // 1 forward in turn list, -1 backward
  const [history, setHistory] = useState([]); // per-game card answers log
  const [startedAt] = useState(() => Date.now());

  const validPlayers = players.filter((p) => p.name.trim());

  const updatePlayer = (i, v) => {
    const arr = [...players];
    arr[i] = { ...arr[i], name: v };
    setPlayers(arr);
  };
  const addPlayer = () => {
    if (players.length < 6) setPlayers([...players, { name: "", color: PLAYER_COLORS[players.length] }]);
  };
  const removePlayer = (i) => {
    if (players.length > 2) setPlayers(players.filter((_, idx) => idx !== i));
  };

  const startGame = () => {
    if (validPlayers.length < 2) return;
    setPositions(validPlayers.map(() => 0));
    setTurn(0);
    setDice(null);
    setWinner(null);
    setActiveCard(null);
    setSkipNext({});
    setShields({});
    setDirection(1);
    setHistory([]);
    setMessage(`Giliran ${validPlayers[0].name}. Klik DADU!`);
    setPhase("play");
  };

  const advanceTurn = (override = null) => {
    setActiveCard(null);
    let next = override !== null ? override : turn;
    let attempts = 0;
    do {
      next = (next + direction + validPlayers.length) % validPlayers.length;
      attempts++;
      if (attempts > validPlayers.length) break;
    } while (skipNext[next]);
    if (skipNext[next]) {
      const ns = { ...skipNext };
      delete ns[next];
      setSkipNext(ns);
    }
    setTurn(next);
    setDice(null);
    setMessage(`Giliran ${validPlayers[next].name}. Klik DADU!`);
  };

  const rollDice = () => {
    if (rolling || activeCard || winner) return;
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll);
        setRolling(false);
        setLastRoll({ turn, value: finalRoll });
        movePlayer(finalRoll);
      }
    }, 90);
  };

  const movePlayer = (steps) => {
    const cur = positions[turn];
    let target = cur + steps;
    if (target > TOTAL) {
      setMessage(`${validPlayers[turn].name} butuh angka pas ke ${TOTAL}. Lewat dari ${TOTAL} → giliran skip.`);
      setTimeout(() => advanceTurn(), 1500);
      return;
    }

    let i = cur;
    const stepInterval = setInterval(() => {
      i++;
      const np = [...positions];
      np[turn] = i;
      setPositions(np);
      if (i >= target) {
        clearInterval(stepInterval);
        finishMove(i);
      }
    }, 180);
  };

  const finishMove = (landed) => {
    let finalPos = landed;
    if (SNAKES[landed] !== undefined) {
      finalPos = SNAKES[landed];
      setMessage(`🐍 Ular! ${validPlayers[turn].name} turun ke ${finalPos}.`);
    } else if (LADDERS[landed] !== undefined) {
      finalPos = LADDERS[landed];
      setMessage(`🪜 Tangga! ${validPlayers[turn].name} naik ke ${finalPos}.`);
    }
    if (finalPos !== landed) {
      const np = [...positions];
      np[turn] = finalPos;
      setPositions(np);
    }

    if (finalPos === TOTAL) {
      setWinner({ idx: turn, name: validPlayers[turn].name });
      // save to history
      const entry = {
        id: `g-${Date.now()}`,
        mode, roomCode,
        startedAt, endedAt: Date.now(),
        players: validPlayers.map((p) => p.name),
        winner: validPlayers[turn].name,
        positions: [...positions.slice(0, turn), finalPos, ...positions.slice(turn + 1)],
        cards: history,
      };
      saveHistory(entry);
      setPhase("end");
      return;
    }

    // Show card for the landed cell
    const card = cardForCell(finalPos);
    setActiveCard({ ...card, cellNumber: finalPos });
  };

  const applyTwist = (card) => {
    const eff = TWIST_EFFECTS[card.title];
    const np = [...positions];
    const sh = { ...shields };
    if (sh[turn] && sh[turn] > 0) {
      sh[turn] -= 1;
      setShields(sh);
      setMessage(`🛡️ Tameng Penalti aktif — Twist dibatalkan!`);
      logCard(card, "shield-blocked");
      return advanceTurn();
    }

    if (eff === "back-3") {
      np[turn] = Math.max(0, np[turn] - 3);
      setPositions(np);
      setMessage(`⚡ Mundur 3 langkah → ke kotak ${np[turn]}`);
    } else if (eff === "skip-1") {
      setSkipNext({ ...skipNext, [turn]: true });
      setMessage(`⚡ ${validPlayers[turn].name} skip giliran berikutnya!`);
    } else if (eff === "reverse") {
      setDirection((d) => -d);
      setMessage(`⚡ Arah giliran berbalik!`);
    } else if (eff === "swap") {
      // swap with name-closest-to-A
      const others = validPlayers
        .map((p, i) => ({ p, i }))
        .filter((x) => x.i !== turn)
        .sort((a, b) => a.p.name.toLowerCase().localeCompare(b.p.name.toLowerCase()));
      if (others[0]) {
        const otherIdx = others[0].i;
        const tmp = np[turn];
        np[turn] = np[otherIdx];
        np[otherIdx] = tmp;
        setPositions(np);
        setMessage(`⚡ Tukar posisi dengan ${others[0].p.name}!`);
      }
    } else if (eff === "back-aspect") {
      // back to first cell of this aspect (cells 1,11,21,31,41,51 are start of each aspect block of 10)
      const cellNumber = activeCard?.cellNumber || np[turn];
      const aspectStart = Math.floor((cellNumber - 1) / 10) * 10 + 1;
      np[turn] = aspectStart;
      setPositions(np);
      setMessage(`⚡ Kembali ke awal aspek (kotak ${aspectStart}). Ambil 1 Boost gratis!`);
      setShields({ ...shields, [turn]: (shields[turn] || 0) + 1 });
    } else if (eff === "swap-boost") {
      const sh2 = { ...shields };
      if ((sh2[turn] || 0) > 0) {
        const rightIdx = (turn + 1) % validPlayers.length;
        sh2[turn] -= 1;
        sh2[rightIdx] = (sh2[rightIdx] || 0) + 1;
        setShields(sh2);
        setMessage(`⚡ Kartu Boost ditukar ke ${validPlayers[rightIdx].name}.`);
      } else {
        setSkipNext({ ...skipNext, [turn]: true });
        setMessage(`⚡ Tidak punya Boost → skip 1 giliran.`);
      }
    }
    logCard(card, "twist-applied");
    setTimeout(() => advanceTurn(), 1400);
  };

  const applyBoost = (card) => {
    const eff = BOOST_EFFECTS[card.title];
    const np = [...positions];
    if (eff === "shield") {
      setShields({ ...shields, [turn]: (shields[turn] || 0) + 1 });
      setMessage(`💖 Tameng Penalti tersimpan untukmu!`);
    } else if (eff === "forward-5") {
      np[turn] = Math.min(TOTAL, np[turn] + 5);
      setPositions(np);
      setMessage(`💖 Lompat maju 5 → ${np[turn]}`);
      if (np[turn] === TOTAL) {
        setWinner({ idx: turn, name: validPlayers[turn].name });
        setPhase("end");
        logCard(card, "boost-win");
        return;
      }
    } else if (eff === "reroll") {
      const roll = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;
      const best = Math.max(roll, roll2);
      np[turn] = Math.min(TOTAL, np[turn] + best);
      setPositions(np);
      setMessage(`💖 Lempar ulang! Hasil terbaik: ${best} → ${np[turn]}`);
    } else if (eff === "skip-q") {
      setMessage(`💖 Skip pertanyaan tanpa penalti.`);
    } else if (eff === "share-3") {
      const target = (turn + 1) % validPlayers.length;
      np[target] = Math.min(TOTAL, np[target] + 3);
      setPositions(np);
      setMessage(`💖 ${validPlayers[target].name} maju 3 langkah berkat kebaikanmu! ✨`);
    }
    logCard(card, "boost-applied");
    setTimeout(() => advanceTurn(), 1400);
  };

  const logCard = (card, action) => {
    setHistory((h) => [
      ...h,
      {
        player: validPlayers[turn].name,
        cell: activeCard?.cellNumber || positions[turn],
        type: card.type,
        title: card.title,
        prompt: card.prompt,
        aspect: card.aspect,
        action,
        at: Date.now(),
      },
    ]);
  };

  const onCardAnswered = () => {
    if (!activeCard) return;
    if (activeCard.type === "twist") return applyTwist(activeCard);
    if (activeCard.type === "boost") return applyBoost(activeCard);
    logCard(activeCard, "answered");
    advanceTurn();
  };

  const onCardSkip = () => {
    if (!activeCard) return;
    logCard(activeCard, "skipped");
    advanceTurn();
  };

  const restart = () => setPhase("setup");

  // ===== RENDER =====
  return (
    <div data-testid="snake-ladder-page" className="relative min-h-screen pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        <Star className="absolute w-16 top-[6%] left-[4%] spin-slow" color="#FF1493" />
        <PixelHeart className="absolute w-12 top-[80%] left-[6%] bounce-soft" color="#84CC16" />
        <Sparkle className="absolute w-10 bottom-[8%] right-[10%] pulse-glow" color="#EC4899" />
        <Diamond className="absolute w-12 top-[40%] right-[6%] wobble" color="#06B6D4" />
        <Lightning className="absolute w-10 top-[24%] right-[16%] float-fast" color="#FFD600" />
      </div>

      <div className="relative z-10 px-4 md:px-10 pt-5 flex items-center justify-between">
        <button onClick={() => navigate("/")} data-testid="back-home-btn" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">
          <ArrowLeft className="w-4 h-4" strokeWidth={3} /> HOME
        </button>
        <div className="font-display text-xl md:text-2xl text-[#5B21B6]" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>
          {mode === "online" ? `MULTIPLAYER${roomCode ? ` · ${roomCode}` : ""}` : "PASS & PLAY"}
        </div>
        <button onClick={() => navigate("/reflections")} data-testid="reflections-btn" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">
          <ClipboardList className="w-4 h-4" strokeWidth={3} /> REFLEKSI
        </button>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 mt-6">
        {phase === "setup" && (
          <div data-testid="setup-panel" className="retro-card p-6 md:p-10">
            <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// SETUP PEMAIN //</div>
            <h2 className="font-display text-3xl md:text-5xl mb-4" style={{ textShadow: "4px 4px 0 #FF1493" }}>
              SIAPA YANG MAIN?
            </h2>
            <p className="font-body mb-6 text-[#0A0A0A]/80">Masukkan nama pemain (2–6 orang). Board ular tangga 60 kotak ECHOMIND.</p>

            <div className="space-y-3 mb-5">
              {players.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-4 border-black flex items-center justify-center font-display text-sm text-white shrink-0" style={{ backgroundColor: p.color }}>
                    P{i + 1}
                  </div>
                  <input
                    data-testid={`player-input-${i}`}
                    value={p.name}
                    onChange={(e) => updatePlayer(i, e.target.value)}
                    placeholder={`Pemain ${i + 1}`}
                    className="retro-input flex-1"
                    maxLength={20}
                  />
                  {players.length > 2 && (
                    <button data-testid={`remove-player-${i}`} onClick={() => removePlayer(i)} className="w-10 h-10 rounded-full bg-[#FF1493] border-3 border-black flex items-center justify-center text-white" aria-label="Remove">
                      <Trash2 className="w-4 h-4" strokeWidth={3} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {players.length < 6 && (
                <button data-testid="add-player-btn" onClick={addPlayer} className="retro-btn retro-btn-yellow !text-sm">
                  <Plus className="w-4 h-4" strokeWidth={3} /> Tambah Pemain
                </button>
              )}
              <button
                data-testid="start-game-btn"
                onClick={startGame}
                disabled={validPlayers.length < 2}
                className={`retro-btn retro-btn-purple !text-sm ${validPlayers.length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Play className="w-4 h-4" strokeWidth={3} /> Mulai Permainan
              </button>
            </div>
          </div>
        )}

        {phase === "play" && (
          <div data-testid="play-panel" className="grid lg:grid-cols-[1fr_320px] gap-6">
            <Board positions={positions} validPlayers={validPlayers} lastRoll={lastRoll} />

            <div className="space-y-4">
              <div className="retro-card !p-4">
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// GILIRAN //</div>
                <div className="font-display text-2xl mb-3" style={{ color: validPlayers[turn]?.color }}>{validPlayers[turn]?.name}</div>
                <div className="flex items-center gap-3">
                  <Dice dice={dice} rolling={rolling} onRoll={rollDice} disabled={!!activeCard || !!winner} />
                  <div className="text-sm font-body flex-1">{message}</div>
                </div>
                {direction === -1 && <div className="font-pixel text-[10px] mt-2 text-[#FF1493]">↺ ARAH GILIRAN TERBALIK</div>}
              </div>

              <div className="retro-card !p-4">
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// SCOREBOARD //</div>
                <div className="space-y-2">
                  {validPlayers.map((p, i) => (
                    <div key={i} data-testid={`scoreboard-${i}`} className={`flex items-center gap-2 p-2 rounded-lg border-2 border-black ${i === turn ? "bg-[#FFD600]" : "bg-white"}`}>
                      <div className="w-6 h-6 rounded-full border-2 border-black" style={{ backgroundColor: p.color }} />
                      <div className="font-display flex-1 truncate">{p.name}</div>
                      <div className="font-pixel text-xs bg-black text-yellow-300 px-2 py-1 rounded-full">{positions[i] ?? 0}/{TOTAL}</div>
                      {shields[i] > 0 && <span title="Tameng" className="text-xs">🛡️{shields[i]}</span>}
                      {skipNext[i] && <span title="Skip giliran" className="text-xs">⏭️</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === "end" && winner && (
          <div data-testid="end-panel" className="retro-card-lime p-8 md:p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4" strokeWidth={3} />
            <div className="font-pixel text-[10px] mb-2">// GAME OVER //</div>
            <h2 className="font-display text-4xl md:text-6xl mb-2" style={{ WebkitTextStroke: "2px #0A0A0A", textShadow: "5px 5px 0 #FF1493" }}>
              {winner.name.toUpperCase()}
            </h2>
            <p className="font-body text-lg mb-6">Selamat! Mencapai kotak ke-{TOTAL} 🏆</p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {validPlayers.map((p, i) => (
                <div key={i} className="px-3 py-2 rounded-full border-3 border-black font-display text-sm bg-white">
                  {p.name} · kotak {positions[i]}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button data-testid="restart-btn" onClick={restart} className="retro-btn retro-btn-purple">
                <RotateCcw className="w-4 h-4" strokeWidth={3} /> MAIN LAGI
              </button>
              <button data-testid="open-reflection" onClick={() => navigate("/reflections")} className="retro-btn retro-btn-magenta">
                <ClipboardList className="w-4 h-4" strokeWidth={3} /> Buka Refleksi BK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CARD MODAL */}
      {activeCard && (
        <div data-testid="card-modal" className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="retro-card max-w-lg w-full p-6 md:p-8 relative" style={{ borderTop: `12px solid ${ASPECTS.find(a => a.id === activeCard.aspect)?.color}` }}>
            <button onClick={onCardSkip} data-testid="card-close-btn" className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black text-yellow-300 flex items-center justify-center" aria-label="Close">
              <X className="w-4 h-4" strokeWidth={3} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{ASPECTS.find(a => a.id === activeCard.aspect)?.icon}</div>
              <div>
                <div className="font-pixel text-[10px] text-[#5B21B6]">KOTAK #{activeCard.cellNumber} · {ASPECTS.find(a => a.id === activeCard.aspect)?.name.toUpperCase()}</div>
                <div className="font-display text-xl" style={{ color: CARD_TYPES[activeCard.type].color }}>
                  {CARD_TYPES[activeCard.type].icon} {CARD_TYPES[activeCard.type].label}
                </div>
              </div>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3" style={{ textShadow: "3px 3px 0 #FFD600" }}>{activeCard.title}</h3>
            <p className="font-body text-base md:text-lg mb-6 text-[#0A0A0A]">{activeCard.prompt}</p>
            <div className="flex flex-wrap gap-3">
              <button data-testid="card-answer-btn" onClick={onCardAnswered} className="retro-btn retro-btn-lime !text-sm">
                <Sparkles className="w-4 h-4" strokeWidth={3} />
                {activeCard.type === "twist" || activeCard.type === "boost" ? "Terapkan Efek" : "Sudah Dijawab"}
              </button>
              {activeCard.type !== "twist" && activeCard.type !== "boost" && (
                <button data-testid="card-skip-btn" onClick={onCardSkip} className="retro-btn retro-btn-yellow !text-sm">
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeLadder;
