import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Controller,
  Joystick,
  PixelHeart,
  Star,
  Sparkle,
  PixelCloud,
  CassetteTape,
  Diamond,
  Coin,
  Lightning,
  PixelGhost,
} from "@/components/RetroIcons";
import { Users, Smartphone, Gamepad2, Sparkles, Zap, Trophy, Heart, ArrowRight, Dices, BookOpen, ClipboardList, Flame, MessageCircle } from "lucide-react";

// === HEAVY FLOATING DECORATIONS ===
const FloatingDecor = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
    <Controller className="absolute w-32 md:w-44 top-[8%] -left-6 float-slow" color="#EC4899" />
    <Joystick className="absolute w-24 md:w-32 top-[18%] right-[6%] float-fast" color="#84CC16" />
    <CassetteTape className="absolute w-28 md:w-40 top-[55%] -left-8 wobble" />
    <PixelGhost className="absolute w-20 md:w-28 top-[68%] right-[8%] bounce-soft" color="#5B21B6" />
    <Star className="absolute w-16 md:w-20 top-[6%] left-[40%] spin-slow" color="#FFD600" />
    <Star className="absolute w-12 md:w-16 top-[78%] left-[34%] spin-slow" color="#FF1493" />
    <PixelHeart className="absolute w-14 md:w-20 top-[40%] right-[18%] float-slow" color="#FF1493" />
    <Sparkle className="absolute w-10 md:w-14 top-[28%] left-[22%] pulse-glow" color="#5B21B6" />
    <Sparkle className="absolute w-10 md:w-14 top-[60%] right-[32%] pulse-glow" color="#84CC16" />
    <Diamond className="absolute w-12 md:w-16 top-[12%] right-[28%] float-fast" color="#06B6D4" />
    <Diamond className="absolute w-10 md:w-14 top-[88%] left-[14%] wobble" color="#FF1493" />
    <Coin className="absolute w-12 md:w-16 top-[48%] left-[44%] bounce-soft" />
    <Lightning className="absolute w-10 md:w-14 top-[34%] right-[42%] float-fast" color="#FFD600" />
    <PixelCloud className="absolute w-24 md:w-32 top-[3%] left-[58%] float-slow" />
  </div>
);

// === NAVBAR ===
const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const links = [
    { label: "Home", href: "#home" },
    { label: "Modes", href: "#modes" },
    { label: "How To Play", href: "#how" },
    { label: "About", href: "#about" },
    { label: "Refleksi", href: "/reflections", route: true },
  ];
  const navigate = useNavigate();

  return (
    <nav data-testid="main-navbar" className="relative z-30 px-4 md:px-10 pt-5">
      <div className="flex items-center justify-between gap-4">
        <a href="#home" data-testid="nav-logo" className="flex items-center gap-3 hover-wiggle">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#FF1493] border-4 border-black flex items-center justify-center shadow-[5px_5px_0_#0A0A0A]">
            <Gamepad2 className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={3} />
          </div>
          <span className="font-display text-2xl md:text-3xl text-[#5B21B6]" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>
            ECHOMIND
          </span>
        </a>

        <div className="hidden md:flex items-center gap-2 retro-card !rounded-full !p-2 !shadow-[6px_6px_0_#0A0A0A]">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => { if (l.route) { e.preventDefault(); navigate(l.href); } }}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
              className="font-arcade text-sm px-4 py-2 rounded-full text-[#0A0A0A] hover:bg-[#5B21B6] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden w-12 h-12 rounded-2xl bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#0A0A0A]"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "✕" : "≡"}
        </button>
      </div>

      {open && (
        <div data-testid="nav-mobile-menu" className="md:hidden mt-4 retro-card !p-4 flex flex-col gap-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => { setOpen(false); if (l.route) { e.preventDefault(); navigate(l.href); } }}
              className="font-arcade text-sm px-4 py-2 rounded-full text-[#0A0A0A] hover:bg-[#5B21B6] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// === TICKER ===
const Ticker = ({ items, testid }) => (
  <div className="ticker my-6" data-testid={testid}>
    <div className="ticker-track">
      {[...Array(2)].flatMap((_, idx) =>
        items.map((it, i) => (
          <span key={`${idx}-${i}`}>
            {it.icon} {it.text}
          </span>
        ))
      )}
    </div>
  </div>
);

// === HERO ===
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section id="home" data-testid="hero-section" className="relative z-10 px-4 md:px-10 pt-8 md:pt-12 pb-8">
      <div className="max-w-6xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 retro-card-purple !rounded-full !p-0 px-5 py-2 mb-6">
          <Sparkles className="w-4 h-4" strokeWidth={3} />
          <span className="font-arcade text-xs md:text-sm">SELF-DISCLOSURE BOARDGAME · EST. 2026</span>
        </div>

        <div className="relative inline-block">
          <h1 className="retro-title text-[clamp(3rem,14vw,11rem)] font-display mb-4">
            ECHOMIND
          </h1>
          <div className="absolute -top-2 -right-10 md:-right-16 w-20 h-20 md:w-28 md:h-28 wobble">
            <div className="starburst w-full h-full flex items-center justify-center">
              <span className="text-xs md:text-sm font-display rotate-[12deg]">NEW!</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            data-testid="hero-cta-start"
            onClick={() => navigate("/play/passplay")}
            className="retro-btn retro-btn-purple"
          >
            <Dices className="w-5 h-5" strokeWidth={3} />
            Mulai Bermain
          </button>
          <a href="#how" data-testid="hero-cta-how" className="retro-btn retro-btn-yellow">
            <Zap className="w-5 h-5" strokeWidth={3} />
            Cara Main
          </a>
          <button
            data-testid="hero-cta-reflections"
            onClick={() => navigate("/reflections")}
            className="retro-btn retro-btn-lime"
          >
            <ClipboardList className="w-5 h-5" strokeWidth={3} />
            Riwayat / Refleksi BK
          </button>
        </div>
      </div>
    </section>
  );
};

// === MODE CARDS ===
const ModeCard = ({ tone, icon, badge, title, subtitle, players, testid, accent, onPlay }) => {
  const toneClass =
    tone === "purple" ? "retro-card-purple" :
    tone === "magenta" ? "retro-card-magenta" :
    "retro-card-lime";

  return (
    <div data-testid={testid} className={`${toneClass} p-8 md:p-10 relative`}>
      <div className="absolute -top-5 -left-5 starburst w-20 h-20 flex items-center justify-center wobble">
        <span className="font-display text-xs rotate-[-10deg] text-white">{badge}</span>
      </div>

      <div className="w-20 h-20 rounded-2xl border-4 border-black flex items-center justify-center mb-6"
           style={{ backgroundColor: accent }}>
        {icon}
      </div>

      <h3 className="font-display text-3xl md:text-4xl mb-3" style={{ WebkitTextStroke: "1.5px #0A0A0A", textShadow: "3px 3px 0 #0A0A0A" }}>
        {title}
      </h3>
      <p className={`font-body text-base md:text-lg mb-6 ${tone === "lime" ? "text-[#0A0A0A]" : "text-white/90"}`}>
        {subtitle}
      </p>

      <div className="flex items-center justify-between">
        <div className={`font-pixel text-[10px] md:text-xs ${tone === "lime" ? "text-[#0A0A0A]" : "text-white"}`}>
          {players}
        </div>
        <button data-testid={`${testid}-play-btn`} onClick={onPlay} className="retro-btn retro-btn-yellow !text-sm !px-5 !py-3">
          PLAY <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const ModesSection = () => {
  const navigate = useNavigate();
  return (
    <section id="modes" data-testid="modes-section" className="relative z-10 px-4 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="font-pixel text-[10px] md:text-xs text-[#5B21B6] mb-3">// PILIH MODE PERMAINAN //</div>
            <h2 className="font-display text-4xl md:text-6xl text-[#0A0A0A]" style={{ textShadow: "5px 5px 0 #FF1493" }}>
              CHOOSE YOUR<br/>BATTLE
            </h2>
          </div>
          <div className="retro-card !p-4 max-w-xs">
            <p className="font-body text-sm font-bold">
              ★ Pilih mode, kumpulkan circlemu, dan mulai membuka diri — kartu power-up di papan ular tangga.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ModeCard
            testid="mode-passplay"
            tone="lime"
            accent="#5B21B6"
            badge="DI KELAS"
            icon={<Smartphone className="w-10 h-10 text-white" strokeWidth={3} />}
            title="Pass & Play"
            subtitle="Satu device, gantian main. Cocok untuk sesi BK di kelas — board ular tangga 60 kotak."
            players="2 — 6 PEMAIN"
            onPlay={() => navigate("/play/passplay")}
          />
          <ModeCard
            testid="mode-multiplayer"
            tone="purple"
            accent="#FF1493"
            badge="MULTI-DEVICE"
            icon={<Users className="w-10 h-10 text-white" strokeWidth={3} />}
            title="Multiplayer"
            subtitle="Akses dari device masing-masing dengan kode room. Board ular tangga 60 kotak sama."
            players="2 — 6 PEMAIN"
            onPlay={() => navigate("/play/online")}
          />
        </div>
      </div>
    </section>
  );
};

// === HOW TO PLAY ===
const HowToPlay = () => {
  const steps = [
    { n: "01", color: "#FF1493", title: "Pilih Mode", desc: "Pass & Play (1 device) atau Multiplayer (multi-device)." },
    { n: "02", color: "#5B21B6", title: "Kocok Dadu", desc: "Bergiliran melempar dadu di papan ular tangga 60 kotak." },
    { n: "03", color: "#84CC16", title: "Ambil Kartu", desc: "Tiap kotak punya kartu: Challenge, Scenario, Twist, atau Boost." },
    { n: "04", color: "#06B6D4", title: "Refleksi", desc: "Selesai main → Guru BK pakai riwayat & refleksi untuk konseling." },
  ];
  return (
    <section id="how" data-testid="how-section" className="relative z-10 px-4 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="font-pixel text-[10px] md:text-xs text-[#5B21B6] mb-3">// HOW IT WORKS //</div>
          <h2 className="font-display text-4xl md:text-6xl text-[#5B21B6]" style={{ WebkitTextStroke: "2px #0A0A0A", textShadow: "5px 5px 0 #0A0A0A" }}>
            CARA MAIN
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              data-testid={`how-step-${i + 1}`}
              className="retro-card p-6 relative"
              style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
            >
              <div
                className="w-14 h-14 rounded-2xl border-4 border-black flex items-center justify-center font-display text-lg mb-4 text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.n}
              </div>
              <h3 className="font-display text-2xl mb-2" style={{ textShadow: "2px 2px 0 #FFD600" }}>{s.title}</h3>
              <p className="font-body text-sm font-medium text-[#0A0A0A]/80">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === CARD TYPES SECTION (replaces "Unlock Boosters") ===
const CardTypes = () => {
  const items = [
    { Icon: Flame, color: "#FF1493", title: "CHALLENGE", desc: "Tantangan singkat — peragakan, ungkapkan, atau bertindak di depan kelompok." },
    { Icon: MessageCircle, color: "#5B21B6", title: "SKENARIO", desc: "Pertanyaan reflektif — bagikan pengalaman dan pandangan secara jujur." },
    { Icon: Zap, color: "#06B6D4", title: "TWIST", desc: "Plot twist! Mundur langkah, lewati giliran, atau efek mengejutkan lainnya." },
    { Icon: Heart, color: "#84CC16", title: "BOOST", desc: "Power-up positif — tameng, lompat maju, lempar dadu ulang, dan lainnya." },
  ];
  return (
    <section data-testid="features-section" className="relative z-10 px-4 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="retro-card-magenta p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 spin-slow opacity-30">
            <Star className="w-40 h-40" color="#FFD600" />
          </div>
          <div className="font-pixel text-[10px] md:text-xs mb-3 text-[#FFD600]">// 4 TIPE KARTU //</div>
          <h2 className="font-display text-4xl md:text-6xl text-white mb-2" style={{ WebkitTextStroke: "2px #0A0A0A", textShadow: "5px 5px 0 #0A0A0A" }}>
            TIPE KARTU PERMAINAN
          </h2>
          <p className="font-body text-base md:text-lg text-white/90 max-w-2xl mb-10">
            Setiap kotak di papan ular tangga punya kartu. Per aspek: <strong>3 Challenge + 5 Scenario + 1 Twist + 1 Boost</strong> = 10 kartu × 6 aspek = <strong>60 kartu</strong>.
          </p>

          <div className="grid md:grid-cols-4 gap-5">
            {items.map((f, i) => (
              <div
                key={f.title}
                data-testid={`card-type-${i + 1}`}
                className="bg-white rounded-3xl p-5 border-4 border-black shadow-[6px_6px_0_#0A0A0A] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[10px_10px_0_#FFD600] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl border-4 border-black flex items-center justify-center mb-3"
                  style={{ backgroundColor: f.color }}
                >
                  <f.Icon className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <h4 className="font-display text-xl mb-1">{f.title}</h4>
                <p className="font-body text-sm font-medium text-black/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// === ASPECTS SECTION (6 aspects, replaces newsletter) ===
const AspectsSection = () => {
  const aspects = [
    { icon: "🧭", title: "Sikap & Opini", color: "#FF1493", desc: "Prinsip, nilai, pandangan tentang hidup." },
    { icon: "🎨", title: "Selera & Minat", color: "#5B21B6", desc: "Hobi, gaya, hal yang membuatmu bahagia." },
    { icon: "📚", title: "Pekerjaan / Sekolah", color: "#84CC16", desc: "Cita-cita, target, dinamika kelas." },
    { icon: "💰", title: "Keuangan", color: "#06B6D4", desc: "Pengelolaan uang, kebiasaan finansial." },
    { icon: "🧠", title: "Kepribadian", color: "#FB923C", desc: "Reaksi emosional, kekuatan, kelemahan diri." },
    { icon: "💪", title: "Aspek Fisik", color: "#EC4899", desc: "Kesehatan, body image, self-care." },
  ];
  return (
    <section id="aspects" data-testid="aspects-section" className="relative z-10 px-4 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="font-pixel text-[10px] md:text-xs text-[#5B21B6] mb-3">// 6 ASPEK SELF-DISCLOSURE //</div>
          <h2 className="font-display text-4xl md:text-5xl text-[#0A0A0A]" style={{ textShadow: "4px 4px 0 #84CC16" }}>
            ENAM ASPEK JOURARD
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {aspects.map((a, i) => (
            <div key={a.title} data-testid={`aspect-${i + 1}`} className="retro-card p-5" style={{ borderTop: `12px solid ${a.color}` }}>
              <div className="text-4xl mb-2">{a.icon}</div>
              <h3 className="font-display text-xl mb-1" style={{ color: a.color }}>{a.title}</h3>
              <p className="font-body text-sm text-[#0A0A0A]/80">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === ABOUT ECHOMIND (replaces "Buka Diri, Bangun Koneksi" + Newsletter) ===
const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section id="about" data-testid="about-section" className="relative z-10 px-4 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="retro-card p-8 md:p-12">
          <div className="font-pixel text-[10px] md:text-xs text-[#5B21B6] mb-3">// TENTANG //</div>
          <h2 className="font-display text-4xl md:text-6xl mb-6" style={{ textShadow: "5px 5px 0 #84CC16" }}>
            ABOUT ECHOMIND
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-body text-base md:text-lg font-medium text-[#0A0A0A]/85 mb-4">
                <strong>Echomind</strong> merupakan media bimbingan dan konseling berbasis permainan papan (board game) yang bertujuan
                membantu peserta didik mengembangkan kemampuan <strong>keterbukaan diri (self-disclosure)</strong> dalam suasana
                yang aman, menyenangkan, dan suportif.
              </p>
              <p className="font-body text-base md:text-lg font-medium text-[#0A0A0A]/85">
                Melalui kombinasi permainan ular tangga, kartu skenario, dan kartu challenge, peserta didik diajak untuk
                mengenali, mengungkapkan, serta merefleksikan berbagai pengalaman, pikiran, perasaan, dan pandangan yang dimilikinya.
              </p>
            </div>
            <div className="retro-card-purple p-6 md:p-8 text-white">
              <BookOpen className="w-10 h-10 mb-3" strokeWidth={3} />
              <h3 className="font-display text-2xl mb-2" style={{ WebkitTextStroke: "1px #0A0A0A", textShadow: "2px 2px 0 #FF1493" }}>UNTUK GURU BK</h3>
              <p className="font-body text-sm md:text-base text-white/90 mb-4">
                Setiap permainan tersimpan otomatis dengan riwayat skor & pertanyaan yang dijawab tiap pemain.
                Gunakan halaman <strong>Refleksi</strong> untuk membuka diskusi pasca-permainan.
              </p>
              <button
                data-testid="about-cta-reflections"
                onClick={() => navigate("/reflections")}
                className="retro-btn retro-btn-yellow !text-sm"
              >
                <ClipboardList className="w-4 h-4" strokeWidth={3} /> Buka Riwayat &amp; Refleksi
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {["60 KARTU", "6 ASPEK", "2-6 PEMAIN", "TEORI JOURARD"].map((t) => (
              <span key={t} className="font-pixel text-[10px] bg-[#5B21B6] text-white px-3 py-2 rounded-full border-2 border-black">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// === FOOTER ===
const Footer = () => (
  <footer data-testid="footer" className="relative z-10 px-4 md:px-10 py-10 mt-6">
    <div className="max-w-6xl mx-auto retro-card !rounded-[36px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FF1493] border-4 border-black flex items-center justify-center shadow-[4px_4px_0_#0A0A0A]">
          <Heart className="w-6 h-6 text-white" strokeWidth={3} fill="white" />
        </div>
        <div>
          <div className="font-display text-2xl" style={{ textShadow: "2px 2px 0 #FFD600" }}>ECHOMIND</div>
          <div className="font-pixel text-[10px] text-[#0A0A0A]/70">© 2026 · Media BK Self-Disclosure</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href="#about" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">TENTANG</a>
        <a href="#modes" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">MODE</a>
        <a href="#how" className="retro-btn retro-btn-black !text-xs !px-4 !py-2">CARA MAIN</a>
      </div>
    </div>
  </footer>
);

// === MAIN LANDING ===
export default function Landing() {
  const tickerTop = [
    { icon: "✦", text: "MEDIA BIMBINGAN & KONSELING" },
    { icon: "◆", text: "BOARD GAME · ULAR TANGGA" },
    { icon: "★", text: "60 KARTU · 6 ASPEK · 2-6 PEMAIN" },
    { icon: "✧", text: "TEORI SIDNEY JOURARD" },
    { icon: "▲", text: "EST. 2026" },
  ];
  const tickerBottom = [
    { icon: "♥", text: "AMAN · MENYENANGKAN · SUPORTIF" },
    { icon: "✦", text: "CHALLENGE · SCENARIO · TWIST · BOOST" },
    { icon: "◆", text: "SELF-DISCLOSURE EDITION" },
  ];

  return (
    <div data-testid="landing-page" className="relative min-h-screen">
      <FloatingDecor />
      <Navbar />
      <Ticker items={tickerTop} testid="ticker-top" />
      <Hero />
      <ModesSection />
      <HowToPlay />
      <CardTypes />
      <AspectsSection />
      <Ticker items={tickerBottom} testid="ticker-bottom" />
      <AboutSection />
      <Footer />
    </div>
  );
}
