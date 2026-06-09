import "@/App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/Landing";
import { PassPlay, OnlinePlay } from "@/components/Play";
import SnakeLadder from "@/components/SnakeLadder";
import Reflections from "@/components/Reflections";
import { installGlobalClickSfx, sfx, setMuted, isMuted } from "@/lib/sounds";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

const SoundToggle = () => {
  const [m, setM] = useState(isMuted());
  return (
    <button
      data-testid="sound-toggle"
      onClick={() => { setMuted(!m); setM(!m); if (m) sfx.click(); }}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-[#5B21B6] border-4 border-black flex items-center justify-center text-white shadow-[4px_4px_0_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform"
      title={m ? "Unmute" : "Mute"}
      aria-label={m ? "Unmute sound" : "Mute sound"}
    >
      {m ? <VolumeX className="w-5 h-5" strokeWidth={3} /> : <Volume2 className="w-5 h-5" strokeWidth={3} />}
    </button>
  );
};

function App() {
  useEffect(() => { installGlobalClickSfx(); }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/play/snake-ladder" element={<SnakeLadder />} />
          <Route path="/play/passplay" element={<PassPlay />} />
          <Route path="/play/online" element={<OnlinePlay />} />
          <Route path="/reflections" element={<Reflections />} />
        </Routes>
        <SoundToggle />
      </BrowserRouter>
    </div>
  );
}

export default App;
