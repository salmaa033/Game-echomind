import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/components/Landing";
import { PassPlay, OnlinePlay } from "@/components/Play";
import SnakeLadder from "@/components/SnakeLadder";
import Reflections from "@/components/Reflections";

function App() {
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
      </BrowserRouter>
    </div>
  );
}

export default App;
