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
import Laman from "./Laman";
import ThemeContext from "./context/ThemeContext";
import RatingView from "./RatingView";
import Rating from "./Rating";


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
          <Route path="/actor/:id" element={<ActorDetail />} />
          <Route path="/ratingview" element={<RatingView />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
        <Footer />
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
