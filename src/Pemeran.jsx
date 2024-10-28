import { useState, useEffect } from "react";
import "./Pemeran.css";
import { Link } from "react-router-dom";

const Pemeran = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
  const totalPages = 5; // Jumlah total halaman yang ingin dimuat
  const actorsApiUrl = (page) =>
    `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&language=en-US&page=${page}`;

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const allActors = await Promise.all(
          Array.from({ length: totalPages }, (_, i) =>
            fetch(actorsApiUrl(i + 1)).then((response) => response.json())
          )
        );

        // Menggabungkan semua hasil dari setiap halaman
        setActors(allActors.flatMap((data) => data.results));
      } catch (err) {
        setError("Gagal memuat data aktor: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [totalPages, apiKey]);

  return (
    <div className="movie-title text-black dark:text-white pemeran">
    <br/>
    <br/>
    <br/>
      <h1 className="heading">Daftar Aktor Populer</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="actor-list">
          {actors.map((actor) => (
            <div className="actor-item" key={actor.id}>
              <Link to={`/actor/${actor.id}`}>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : "https://plexure.io/assets/profile.865ff3c59679a4e6027229aeccd27625.png"
                  }
                  alt={actor.name}
                  className="actor-image"
                />
                <h6 className="actor-name">{actor.name}</h6>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pemeran;
