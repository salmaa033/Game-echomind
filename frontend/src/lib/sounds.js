// Retro 8-bit style sound effects using Web Audio API (no asset files needed)

let ctx = null;
let muted = false;

const getCtx = () => {
  if (!ctx) {
    try {
      const Cls = window.AudioContext || window.webkitAudioContext;
      ctx = new Cls();
    } catch { return null; }
  }
  if (ctx && ctx.state === "suspended") ctx.resume();
  return ctx;
};

const tone = (freq, dur = 0.08, type = "square", vol = 0.06, slide = 0) => {
  const c = getCtx();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + dur);
};

const seq = (notes) => notes.forEach(([f, d, t, v, s], i) => setTimeout(() => tone(f, d, t, v, s), i * 70));

export const sfx = {
  click:   () => tone(720, 0.04, "square", 0.04),
  hover:   () => tone(880, 0.03, "sine", 0.02),
  dice:    () => seq([[420, 0.05, "square"], [600, 0.05, "square"], [820, 0.07, "square"]]),
  step:    () => tone(520, 0.04, "triangle", 0.05),
  ladder:  () => seq([[440, 0.06, "triangle"], [660, 0.06, "triangle"], [880, 0.08, "triangle"], [1100, 0.1, "triangle"]]),
  snake:   () => seq([[800, 0.08, "sawtooth", 0.05, -400], [500, 0.08, "sawtooth", 0.05, -300], [220, 0.12, "sawtooth", 0.05, -100]]),
  card:    () => seq([[600, 0.05, "sine"], [900, 0.08, "sine"]]),
  twist:   () => seq([[300, 0.06, "sawtooth"], [400, 0.06, "sawtooth"], [350, 0.1, "sawtooth"]]),
  boost:   () => seq([[660, 0.05, "sine"], [880, 0.06, "sine"], [1320, 0.1, "sine"]]),
  win:     () => seq([[523, 0.1, "square"], [659, 0.1, "square"], [784, 0.1, "square"], [1047, 0.2, "square"]]),
  start:   () => seq([[440, 0.06, "square"], [660, 0.06, "square"], [880, 0.08, "square"]]),
};

export const setMuted = (v) => { muted = !!v; };
export const isMuted  = () => muted;

// Install global click listener for buttons + interactive elements
let installed = false;
export const installGlobalClickSfx = () => {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("click", (e) => {
    if (muted) return;
    const t = e.target.closest("button, a, [role='button'], input[type='checkbox'], input[type='radio']");
    if (t && !t.disabled) sfx.click();
  }, true);
};
