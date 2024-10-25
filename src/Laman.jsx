import React from "react"; // Pastikan Anda mengimpor React
import { Link } from "react-router-dom"; // Impor Link dari react-router-dom

const Laman = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/564x/74/06/bb/7406bbce01a681f89b2c86e1d791f6a9.jpg')",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">MovieIT</h1>
          <p className="mb-5">
            Aplikasi list film terlengkap. Lihat Trailer film-film terbaru,
            rating film, tambah ke favorit, dan banyak fitur lainnya.
          </p>
          <Link to="/header" className="btn btn-primary">
            Mulai
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Laman;
