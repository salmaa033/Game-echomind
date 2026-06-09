import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Dices, Trophy, Plus, Trash2, Play, RotateCcw, Sparkles, ClipboardList, X, Flame, MessageCircle, Zap, Heart } from "lucide-react";
import { ASPECTS, CARDS, CARD_TYPES, TWIST_EFFECTS, BOOST_EFFECTS } from "@/constants/cards";
import { Star, Sparkle, PixelHeart, Lightning, Diamond } from "@/components/RetroIcons";
import { sfx } from "@/lib/sounds";

const ICON_FOR = {
  flame: Flame,
  "message-circle": MessageCircle,
  zap: Zap,
  heart: Heart,
};
const TypeIcon = ({ iconKey, ...rest }) => {
  const I = ICON_FOR[iconKey] || Flame;
  return <I {...rest} />;
};

// Dice pip layout (1-6) — array of [row,col] in 3x3 grid
const PIP_LAYOUT = {
  1: [[1,1]],
  2: [[0,0],[2,2]],
  3: [[0,0],[1,1],[2,2]],
  4: [[0,0],[0,2],[2,0],[2,2]],
  5: [[0,0],[0,2],[1,1],[2,0],[2,2]],
  6: [[0,0],[0,2],[1,0],[1,2],[2,0],[2,2]],
};
const DiceFace = ({ value }) => {
  if (!value) return <span className="font-display text-4xl text-[#5B21B6]">?</span>;
  const pips = PIP_LAYOUT[value] || [];
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-14 h-14 md:w-16 md:h-16 p-2">
      {Array.from({ length: 9 }).map((_, i) => {
        const r = Math.floor(i / 3), col = i % 3;
        const on = pips.some(([pr, pc]) => pr === r && pc === col);
        return <div key={i} className={`rounded-full ${on ? "bg-black" : "bg-transparent"}`} />;
      })}
    </div>
  );
};

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

const PLAYER_COLORS = ["#FF1493", "#5B21B6", "#84CC16", "#06B6D4", "#FB923C", "#FFD600", "#EC4899", "#10B981", "#8B5CF6", "#F97316"];

// Compute col/row (from bottom) for a cell number (1..60)
const cellToCoord = (n) => {
  const row = Math.floor((n - 1) / COLS);
  const colInRow = (n - 1) % COLS;
  const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow;
  return { col, rowFromBottom: row };
};

// Map cell to its card (CARDS index = cell - 1)
const cardForCell = (n) => CARDS[(n - 1) % CARDS.length];

// Get center position (% of board) for a cell number 1..60
const cellCenter = (n) => {
  const { col, rowFromBottom } = cellToCoord(n);
  return {
    x: (col + 0.5) * (100 / COLS),
    y: (ROWS - 1 - rowFromBottom + 0.5) * (100 / ROWS),
  };
};

// Snake SVG — thick patterned body, big head, scales
const SnakeSVG = ({ from, to, color = "#FF1493", secondary = "#FFD600" }) => {
  const a = cellCenter(from);
  const b = cellCenter(to);
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len, ny = dx / len;
  const off = Math.min(18, len * 0.45);
  const c1x = midX + nx * off - dx * 0.18;
  const c1y = midY + ny * off - dy * 0.18;
  const c2x = midX - nx * off + dx * 0.18;
  const c2y = midY - ny * off + dy * 0.18;
  const pathD = `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
  return (
    <g>
      {/* black outline */}
      <path d={pathD} stroke="#0A0A0A" strokeWidth="5.2" fill="none" strokeLinecap="round" />
      {/* main body */}
      <path d={pathD} stroke={color} strokeWidth="4.2" fill="none" strokeLinecap="round" />
      {/* scale stripes */}
      <path d={pathD} stroke={secondary} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="0.8 2" />
      {/* head */}
      <circle cx={a.x} cy={a.y} r="3.2" fill={color} stroke="#0A0A0A" strokeWidth="0.7" />
      <circle cx={a.x - 1} cy={a.y - 1} r="0.7" fill="#fff" stroke="#0A0A0A" strokeWidth="0.2" />
      <circle cx={a.x + 1} cy={a.y - 1} r="0.7" fill="#fff" stroke="#0A0A0A" strokeWidth="0.2" />
      <circle cx={a.x - 1} cy={a.y - 1} r="0.32" fill="#0A0A0A" />
      <circle cx={a.x + 1} cy={a.y - 1} r="0.32" fill="#0A0A0A" />
      {/* tongue */}
      <path d={`M ${a.x} ${a.y + 2.5} L ${a.x - 1.2} ${a.y + 4} M ${a.x} ${a.y + 2.5} L ${a.x + 1.2} ${a.y + 4}`}
            stroke="#FF1493" strokeWidth="0.6" strokeLinecap="round" fill="none" />
      {/* tail tip */}
      <circle cx={b.x} cy={b.y} r="1.3" fill={color} stroke="#0A0A0A" strokeWidth="0.4" />
    </g>
  );
};

// Ladder SVG — wooden brown rails with thick rungs (board-game style)
const LadderSVG = ({ from, to, color = "#92400E", rail = "#FB923C" }) => {
  const a = cellCenter(from);
  const b = cellCenter(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len, ny = dx / len;
  const w = 2.6;
  const ax1 = a.x + nx * w, ay1 = a.y + ny * w;
  const ax2 = a.x - nx * w, ay2 = a.y - ny * w;
  const bx1 = b.x + nx * w, by1 = b.y + ny * w;
  const bx2 = b.x - nx * w, by2 = b.y - ny * w;
  const count = Math.max(3, Math.round(len / 3.5));
  const rungs = [];
  for (let i = 1; i < count; i++) {
    const t = i / count;
    const r1x = ax1 + (bx1 - ax1) * t;
    const r1y = ay1 + (by1 - ay1) * t;
    const r2x = ax2 + (bx2 - ax2) * t;
    const r2y = ay2 + (by2 - ay2) * t;
    rungs.push(
      <g key={i}>
        <line x1={r1x} y1={r1y} x2={r2x} y2={r2y} stroke="#0A0A0A" strokeWidth="1.6" strokeLinecap="round" />
        <line x1={r1x} y1={r1y} x2={r2x} y2={r2y} stroke={color} strokeWidth="1" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      {/* shadows / outlines */}
      <line x1={ax1} y1={ay1} x2={bx1} y2={by1} stroke="#0A0A0A" strokeWidth="2.6" strokeLinecap="round" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke="#0A0A0A" strokeWidth="2.6" strokeLinecap="round" />
      {/* rails */}
      <line x1={ax1} y1={ay1} x2={bx1} y2={by1} stroke={rail} strokeWidth="1.8" strokeLinecap="round" />
      <line x1={ax2} y1={ay2} x2={bx2} y2={by2} stroke={rail} strokeWidth="1.8" strokeLinecap="round" />
      {rungs}
    </g>
  );
};

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
    <div data-testid="snake-ladder-board" className="bg-white border-4 border-black rounded-3xl p-3 shadow-[8px_8px_0_#0A0A0A] w-full">
      <div className="relative w-full" style={{ aspectRatio: `${COLS} / ${ROWS}` }}>
        {/* Grid of cells */}
        <div className="absolute inset-0 grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0,1fr))` }}>
          {cells.flatMap((row) =>
            row.map((n) => {
              const card = cardForCell(n);
              const aspect = ASPECTS.find((a) => a.id === card.aspect);
              const type = CARD_TYPES[card.type];
              const isStart = n === 1;
              const isFinish = n === TOTAL;
              const checker = ((Math.floor((n - 1) / COLS) + ((n - 1) % COLS)) % 2 === 0);
              return (
                <div
                  key={n}
                  data-testid={`cell-${n}`}
                  className="relative rounded-md border-2 border-black flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: aspect.color + (checker ? "40" : "18") }}
                  title={`#${n} · ${aspect.name} · ${type.label}`}
                >
                  <div className="absolute top-0 left-0 text-[9px] md:text-[11px] font-pixel bg-black text-yellow-300 px-1 leading-tight">{n}</div>
                  {isStart && <div className="absolute bottom-0 inset-x-0 bg-[#FF1493] text-white font-display text-[9px] md:text-[11px] text-center border-t-2 border-black leading-tight py-0.5">START</div>}
                  {isFinish && <div className="absolute bottom-0 inset-x-0 bg-[#FFD600] text-black font-display text-[9px] md:text-[11px] text-center border-t-2 border-black leading-tight py-0.5">FINISH</div>}
                  <TypeIcon iconKey={type.iconKey} className="w-5 h-5 md:w-7 md:h-7" style={{ color: type.color }} strokeWidth={3} />
                </div>
              );
            })
          )}
        </div>

        {/* Snake & Ladder SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Object.entries(LADDERS).map(([foot, top], i) => {
            const palettes = [
              { color: "#92400E", rail: "#FB923C" },
              { color: "#5B21B6", rail: "#A855F7" },
              { color: "#84CC16", rail: "#BEF264" },
              { color: "#0E7490", rail: "#06B6D4" },
              { color: "#BE185D", rail: "#EC4899" },
            ];
            const p = palettes[i % palettes.length];
            return <LadderSVG key={`L${foot}`} from={Number(foot)} to={Number(top)} color={p.color} rail={p.rail} />;
          })}
          {Object.entries(SNAKES).map(([head, tail], i) => {
            const palettes = [
              { color: "#FF1493", secondary: "#FFD600" },
              { color: "#16A34A", secondary: "#84CC16" },
              { color: "#F97316", secondary: "#FBBF24" },
              { color: "#7C3AED", secondary: "#EC4899" },
              { color: "#06B6D4", secondary: "#FFFFFF" },
            ];
            const p = palettes[i % palettes.length];
            return <SnakeSVG key={`S${head}`} from={Number(head)} to={Number(tail)} color={p.color} secondary={p.secondary} />;
          })}
        </svg>

        {/* Player tokens overlay */}
        <div className="absolute inset-0 grid gap-1 pointer-events-none" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0,1fr))` }}>
          {cells.flatMap((row) =>
            row.map((n) => {
              const playersHere = validPlayers
                .map((p, idx) => ({ p, idx }))
                .filter(({ idx }) => positions[idx] === n);
              if (playersHere.length === 0) return <div key={`pt-${n}`} />;
              return (
                <div key={`pt-${n}`} className="relative flex flex-wrap items-end justify-center gap-1 p-1">
                  {playersHere.map(({ p, idx }) => (
                    <div
                      key={idx}
                      className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-black transition-all duration-300"
                      style={{ backgroundColor: p.color, boxShadow: idx === (lastRoll?.turn ?? -1) ? "0 0 0 2px #FFD600, 2px 2px 0 #0A0A0A" : "2px 2px 0 #0A0A0A" }}
                      title={p.name}
                    />
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs font-pixel">
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-1.5 rounded-full" style={{ background: "linear-gradient(90deg,#FF1493,#FFD600)" }} /> Ular (turun)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-4 h-1.5 rounded-full bg-[#FB923C]" /> Tangga (naik)</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-[#FF1493] border-2 border-black" /> START</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 bg-[#FFD600] border-2 border-black" /> FINISH</span>
        {Object.entries(CARD_TYPES).map(([k, t]) => (
          <span key={k} className="flex items-center gap-1">
            <TypeIcon iconKey={t.iconKey} className="w-3 h-3" style={{ color: t.color }} strokeWidth={3} /> {t.label}
          </span>
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
    className={`!p-0 !rounded-2xl w-24 h-24 md:w-28 md:h-28 bg-white border-4 border-black flex items-center justify-center shadow-[6px_6px_0_#0A0A0A] ${rolling ? "animate-spin" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:translate-x-[-2px] hover:translate-y-[-2px]"}`}
    aria-label="Lempar dadu"
  >
    <DiceFace value={dice} />
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
  const [inventory, setInventory] = useState({}); // {playerIdx: {shield, skipQ, reroll}}
  const [direction, setDirection] = useState(1); // 1 forward in turn list, -1 backward
  const [history, setHistory] = useState([]); // per-game card answers log
  const [startedAt] = useState(() => Date.now());
  const [canReroll, setCanReroll] = useState(false); // after rolling, if pos hasn't moved yet

  const validPlayers = players.filter((p) => p.name.trim());

  const updatePlayer = (i, v) => {
    const arr = [...players];
    arr[i] = { ...arr[i], name: v };
    setPlayers(arr);
  };
  const addPlayer = () => {
    if (players.length < 10) setPlayers([...players, { name: "", color: PLAYER_COLORS[players.length] }]);
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
    setInventory({});
    setDirection(1);
    setHistory([]);
    setMessage(`Giliran ${validPlayers[0].name}. Klik DADU!`);
    sfx.start();
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
    sfx.dice();
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
        if ((inventory[turn]?.reroll || 0) > 0) {
          setCanReroll(true);
          setMessage(`Dadu: ${finalRoll}. Mau pakai LEMPAR ULANG? Klik tombol "Reroll" atau "Jalan".`);
        } else {
          movePlayer(finalRoll);
        }
      }
    }, 90);
  };

  const doReroll = () => {
    if (!spendInv(turn, "reroll")) return;
    setCanReroll(false);
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

  const acceptRoll = () => {
    setCanReroll(false);
    movePlayer(dice);
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
      sfx.step();
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
      sfx.snake();
      setMessage(`🐍 Ular! ${validPlayers[turn].name} turun ke ${finalPos}.`);
    } else if (LADDERS[landed] !== undefined) {
      finalPos = LADDERS[landed];
      sfx.ladder();
      setMessage(`🪜 Tangga! ${validPlayers[turn].name} naik ke ${finalPos}.`);
    }
    if (finalPos !== landed) {
      const np = [...positions];
      np[turn] = finalPos;
      setPositions(np);
    }

    if (finalPos === TOTAL) {
      sfx.win();
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
    if (card.type === "twist") sfx.twist();
    else if (card.type === "boost") sfx.boost();
    else sfx.card();
    setActiveCard({ ...card, cellNumber: finalPos });
  };

  const getInv = (i) => inventory[i] || { shield: 0, skipQ: 0, reroll: 0 };
  const addInv = (i, key, by = 1) => {
    const inv = { ...inventory };
    const cur = inv[i] || { shield: 0, skipQ: 0, reroll: 0 };
    inv[i] = { ...cur, [key]: (cur[key] || 0) + by };
    setInventory(inv);
  };
  const spendInv = (i, key) => {
    const inv = { ...inventory };
    const cur = inv[i] || { shield: 0, skipQ: 0, reroll: 0 };
    if ((cur[key] || 0) <= 0) return false;
    inv[i] = { ...cur, [key]: cur[key] - 1 };
    setInventory(inv);
    return true;
  };

  const applyTwist = (card) => {
    const eff = TWIST_EFFECTS[card.title];
    const np = [...positions];
    if (spendInv(turn, "shield")) {
      setMessage(`🛡️ Tameng Penalti aktif — Twist dibatalkan!`);
      logCard(card, "shield-blocked");
      return setTimeout(() => advanceTurn(), 1200);
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
      const cellNumber = activeCard?.cellNumber || np[turn];
      const aspectStart = Math.floor((cellNumber - 1) / 10) * 10 + 1;
      np[turn] = aspectStart;
      setPositions(np);
      addInv(turn, "shield", 1);
      setMessage(`⚡ Kembali ke awal aspek (kotak ${aspectStart}). Ambil 1 Tameng gratis!`);
    } else if (eff === "swap-boost") {
      if (spendInv(turn, "shield")) {
        const rightIdx = (turn + 1) % validPlayers.length;
        addInv(rightIdx, "shield", 1);
        setMessage(`⚡ Kartu Tameng ditukar ke ${validPlayers[rightIdx].name}.`);
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
      addInv(turn, "shield", 1);
      setMessage(`💖 TAMENG tersimpan! Aktif otomatis saat kamu kena Twist.`);
    } else if (eff === "forward-5") {
      np[turn] = Math.min(TOTAL, np[turn] + 5);
      setPositions(np);
      setMessage(`💖 Lompat maju 5 → kotak ${np[turn]}`);
      if (np[turn] === TOTAL) {
        setWinner({ idx: turn, name: validPlayers[turn].name });
        setPhase("end");
        logCard(card, "boost-win");
        return;
      }
    } else if (eff === "reroll") {
      addInv(turn, "reroll", 1);
      setMessage(`💖 LEMPAR ULANG tersimpan! Pakai di giliran berikutnya setelah dadu keluar.`);
    } else if (eff === "skip-q") {
      addInv(turn, "skipQ", 1);
      setMessage(`💖 SKIP PERTANYAAN tersimpan! Pakai saat dapat kartu pertanyaan sulit.`);
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

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-6 mt-6">
        {phase === "setup" && (
          <div data-testid="setup-panel" className="retro-card p-6 md:p-10">
            <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// SETUP PEMAIN //</div>
            <h2 className="font-display text-3xl md:text-5xl mb-4" style={{ textShadow: "4px 4px 0 #FF1493" }}>
              SIAPA YANG MAIN?
            </h2>
            <p className="font-body mb-6 text-[#0A0A0A]/80">Masukkan nama pemain (2–10 orang). Board ular tangga 60 kotak ECHOMIND.</p>

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
              {players.length < 10 && (
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
          <div data-testid="play-panel" className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
            <Board positions={positions} validPlayers={validPlayers} lastRoll={lastRoll} />

            <div className="space-y-4">
              <div className="retro-card !p-4">
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// GILIRAN //</div>
                <div className="font-display text-3xl mb-3" style={{ color: validPlayers[turn]?.color, textShadow: "2px 2px 0 #0A0A0A" }}>{validPlayers[turn]?.name}</div>
                <div className="flex items-center gap-3">
                  <Dice dice={dice} rolling={rolling} onRoll={rollDice} disabled={!!activeCard || !!winner || canReroll} />
                  <div className="text-sm font-body flex-1">{message}</div>
                </div>
                {canReroll && (
                  <div className="mt-3 flex gap-2 flex-wrap" data-testid="reroll-prompt">
                    <button onClick={doReroll} data-testid="use-reroll-btn" className="retro-btn retro-btn-lime !text-xs !px-3 !py-2">
                      💖 Pakai Reroll ({getInv(turn).reroll})
                    </button>
                    <button onClick={acceptRoll} data-testid="accept-roll-btn" className="retro-btn retro-btn-yellow !text-xs !px-3 !py-2">
                      ▶ Jalan dengan {dice}
                    </button>
                  </div>
                )}
                {direction === -1 && <div className="font-pixel text-[10px] mt-2 text-[#FF1493]">↺ ARAH GILIRAN TERBALIK</div>}
              </div>

              <div className="retro-card !p-4">
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-2">// SCOREBOARD &amp; INVENTORY //</div>
                <div className="space-y-2">
                  {validPlayers.map((p, i) => {
                    const inv = getInv(i);
                    return (
                      <div key={i} data-testid={`scoreboard-${i}`} className={`p-2 rounded-lg border-2 border-black ${i === turn ? "bg-[#FFD600]" : "bg-white"}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full border-2 border-black shadow-[2px_2px_0_#0A0A0A]" style={{ backgroundColor: p.color }} />
                          <div className="font-display flex-1 truncate text-base">{p.name}</div>
                          <div className="font-pixel text-xs bg-black text-yellow-300 px-2 py-1 rounded-full">{positions[i] ?? 0}/{TOTAL}</div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {inv.shield > 0 && (
                            <span data-testid={`inv-shield-${i}`} title="Tameng Penalti — otomatis aktif saat kena Twist" className="font-pixel text-[10px] bg-[#84CC16] text-black px-2 py-1 rounded border-2 border-black flex items-center gap-1">🛡️ x{inv.shield}</span>
                          )}
                          {inv.skipQ > 0 && (
                            <span data-testid={`inv-skipq-${i}`} title="Skip Pertanyaan" className="font-pixel text-[10px] bg-[#06B6D4] text-black px-2 py-1 rounded border-2 border-black flex items-center gap-1">⏩ x{inv.skipQ}</span>
                          )}
                          {inv.reroll > 0 && (
                            <span data-testid={`inv-reroll-${i}`} title="Lempar Dadu Ulang" className="font-pixel text-[10px] bg-[#FB923C] text-black px-2 py-1 rounded border-2 border-black flex items-center gap-1">🎲 x{inv.reroll}</span>
                          )}
                          {skipNext[i] && (
                            <span title="Skip 1 giliran" className="font-pixel text-[10px] bg-[#FF1493] text-white px-2 py-1 rounded border-2 border-black">⏭ SKIP TURN</span>
                          )}
                          {inv.shield === 0 && inv.skipQ === 0 && inv.reroll === 0 && !skipNext[i] && (
                            <span className="font-pixel text-[10px] text-[#0A0A0A]/50">— belum punya power-up —</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                <ClipboardList className="w-4 h-4" strokeWidth={3} /> Buka Refleksi
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
                <div className="font-display text-xl flex items-center gap-2" style={{ color: CARD_TYPES[activeCard.type].color }}>
                  <TypeIcon iconKey={CARD_TYPES[activeCard.type].iconKey} className="w-5 h-5" strokeWidth={3} />
                  {CARD_TYPES[activeCard.type].label}
                </div>
              </div>
            </div>
            <h3 className="font-display text-2xl md:text-3xl mb-3" style={{ textShadow: "3px 3px 0 #FFD600" }}>{activeCard.title}</h3>
            <p className="font-body text-base md:text-lg mb-3 text-[#0A0A0A]">{activeCard.prompt}</p>
            {activeCard.refleksi && (
              <div className="mb-6 p-3 rounded-lg border-2 border-black bg-[#FFD600]/40">
                <div className="font-pixel text-[10px] text-[#5B21B6] mb-1">// REFLEKSI //</div>
                <p className="font-body text-sm font-medium">{activeCard.refleksi}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button data-testid="card-answer-btn" onClick={onCardAnswered} className="retro-btn retro-btn-lime !text-sm">
                <Sparkles className="w-4 h-4" strokeWidth={3} />
                {activeCard.type === "twist" || activeCard.type === "boost" ? "Terapkan Efek" : "Sudah Dijawab"}
              </button>
              {activeCard.type !== "twist" && activeCard.type !== "boost" && (
                <>
                  {getInv(turn).skipQ > 0 && (
                    <button
                      data-testid="card-use-skipq-btn"
                      onClick={() => { spendInv(turn, "skipQ"); logCard(activeCard, "skipq-used"); advanceTurn(); }}
                      className="retro-btn retro-btn-magenta !text-sm"
                    >
                      💖 Pakai SKIP-Q ({getInv(turn).skipQ})
                    </button>
                  )}
                  <button data-testid="card-skip-btn" onClick={onCardSkip} className="retro-btn retro-btn-yellow !text-sm">
                    Skip Tanpa Power-Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeLadder;
