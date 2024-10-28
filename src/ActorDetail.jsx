import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ActorDetail = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);
  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        setActor(data);
      } catch (err) {
        setError("Gagal memuat data aktor: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        setMovies(data.cast);
      } catch (err) {
        setError("Gagal memuat film: " + err.message);
      }
    };

    fetchActor();
    fetchMovies();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '100px' }}>
      <img
        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : "https://plexure.io/assets/profile.865ff3c59679a4e6027229aeccd27625.png"}
        alt={actor.name}
        style={{
          width: '300px',
          height: 'auto',
          marginRight: '20px',
          borderRadius: '15px'
        }} 
      />
      <div className="movie-title text-black dark:text-white" style={{ textAlign: 'left', maxWidth: '900px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '10px' }}>{actor.name}</h2>
        
        {/* Personal Info in Table */}
        <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '5px' }}>Info Pribadi</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}><strong>Jenis Kelamin:</strong></td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{actor.gender === 1 ? "Perempuan" : "Laki-laki"}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}><strong>Tanggal Lahir:</strong></td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{actor.birthday || "Tanggal lahir tidak tersedia"} ({actor.age} tahun)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}><strong>Tempat Lahir:</strong></td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{actor.place_of_birth || "Tempat lahir tidak tersedia"}</td>
            </tr>
            {actor.also_known_as && actor.also_known_as.length > 0 && (
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}><strong>Nama Lainnya:</strong></td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <ul style={{ padding: 0, margin: 0 }}>
                    {actor.also_known_as.map((alias, index) => (
                      <li key={index} style={{ listStyleType: 'none' }}>{alias}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}><strong>Sebagai:</strong></td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{actor.known_for_department || "Known for not available."}</td>
            </tr>
          </tbody>
        </table>

        <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginTop: '20px' }}>Biografi</h3>
        <p style={{ marginBottom: '10px' }}>
          {showFullBio ? actor.biography : actor.biography?.substring(0, 100) + '...'}
          {actor.biography && (
            <button 
              onClick={() => setShowFullBio(!showFullBio)} 
              style={{ marginLeft: '5px', background: 'none', border: 'none', color: 'navy', cursor: 'pointer', fontStyle: 'italic' }}
            >
              {showFullBio ? "Tampilkan lebih sedikit" : "Lebih banyak"}
            </button>
          )}
        </p>

        <h3 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginTop: '20px' }}>Film yang Dimainkan</h3>
        {movies.length > 0 ? (
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px' }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ flex: '0 0 auto', textAlign: 'center', position: 'relative' }}>
                <Link to={`/detailfilm/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/150"}
                    alt={movie.title}
                    style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                  />
                  {movie.vote_average > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '5px', 
                      left: '5px', 
                      backgroundColor: 'rgba(0, 31, 63, 0.7)', 
                      color: 'white', 
                      padding: '3px 5px', 
                      borderRadius: '5px',
                      fontSize: '0.8rem'
                    }}>
                      {movie.vote_average.toFixed(1)} ⭐
                    </div>
                  )}
                  <span style={{ 
                    display: 'block',
                    maxWidth: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {movie.title} ({new Date(movie.release_date).getFullYear()})
                  </span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Tidak ada film yang ditemukan untuk aktor ini.</p>
        )}
      </div>
    </div>
  );
};

export default ActorDetail;
