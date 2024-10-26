import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Header from "./header/Header";
import DetailFilm from "./DetailFilm";
import Footer from "./Footer";
import Pemeran from "./Pemeran";
import ActorDetail from "./ActorDetail";
import Episode from "./Episode";
import DetailEpisode from "./DetailEpisode";
import HistoriRating from "./HistoriRating";
import Laman from "./Laman";
import RateMovie from "./RateMovie";
import ThemeContext from "./context/ThemeContext";

function App() {
  const tema = useState("light");
  return (
    <BrowserRouter>
      <ThemeContext.Provider value={tema}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Laman />} />
          <Route path="/header" element={<Header />} />
          <Route path="/pemeran" element={<Pemeran />} />
          <Route path="/episode" element={<Episode />} />
          <Route path="/detailepisode/:id" element={<DetailEpisode />} />
          <Route path="/tv/:id" element={<DetailEpisode />} />
          <Route path="/movie/:id" element={<DetailFilm />} />
          <Route path="/histori-rating" element={<HistoriRating />} />
          <Route path="/actor/:id" element={<ActorDetail />} />
          <Route path="/RateMovie" element={<RateMovie />} />
        </Routes>
        <Footer />
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
