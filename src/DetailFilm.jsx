import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DetailFilm = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
  const movieDetailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const movieVideosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`;
  const movieCreditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
  
  const placeholderImage = 'https://via.placeholder.com/100?text=No+Image';

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [detailRes, trailerRes, castRes] = await Promise.all([
          fetch(movieDetailUrl),
          fetch(movieVideosUrl),
          fetch(movieCreditsUrl),
        ]);

        const movieData = await detailRes.json();
        const trailerData = await trailerRes.json();
        const castData = await castRes.json();

        setMovie(movieData);

        const mainTrailer = trailerData.results.find(video => video.type === 'Trailer');
        const alternativeTrailer = trailerData.results.find(video => video.type === 'Teaser');
        setTrailer(mainTrailer || alternativeTrailer);

        setCast(castData.cast);
      } catch (err) {
        setError("Gagal memuat data film.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const postRating = async (value) => {
    try {
      const body = { value: value };
      const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWE0ZWQ0ZGM4YzRmNzYxMGY0M2U2N2ZjNDk2OWFjMCIsIm5iZiI6MTczMDA5NTY0NC41MzUzOTUsInN1YiI6IjY3MDQ4MTkzMjIyZWFkMWVkYWJmZjc5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.u1rfKEluD4lX1VNVqRuFa-zilqf59BMkrbsoLyYRf4o";
      
      await axios.post(
        `https://api.themoviedb.org/3/movie/${id}/rating`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserRating(value);
    } catch (error) {
      console.error("Error posting rating:", error);
    }
  };

  const handleRatingChange = (newRating) => {
    if (newRating >= 0 && newRating <= 10) {
      setUserRating(newRating);
      postRating(newRating); // Update rating on server
    }
  };

  if (loading) return <p>Memuat detail film...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ textAlign: 'center', margin: '20px', paddingTop: '80px' }}>
      {trailer ? (
        <div style={{ position: 'relative', width: '100%', height: '60vh', overflow: 'hidden' }}>
          <h2>Trailer</h2>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&loop=1&playlist=${trailer.key}&controls=0&showinfo=0&rel=0&modestbranding=1`}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <h2>Trailer tidak tersedia.</h2>
      )}

      {movie && (
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{
                maxWidth: '200px',
                height: 'auto',
                borderRadius: '10px'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(0, 31, 63, 0.7)',
              color: 'white',
              padding: '5px',
              borderRadius: '5px',
              fontSize: '1.2em'
            }}>
              {movie.vote_average} ⭐
            </div>
          </div>
          <div style={{ textAlign: 'left', marginLeft: '20px' }} className="movie-title text-black dark:text-white">
            <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>{movie.title}</h1>
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
              Genre: {movie.genres.map(genre => genre.name).join(', ')}
            </p>
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
              Status: {movie.status}
            </p>
            <p style={{
              maxWidth: '900px',
              fontSize: '1.2em',
              marginBottom: '20px',
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }}>
              {movie.overview}
            </p>

            <div className="absolute bottom-4 right-0 flex items-center space-x-2">
              <button
                className="btn"
                onClick={() => handleRatingChange(userRating - 1)} // Kurangi rating
                disabled={userRating <= 0} // Disable jika rating sudah 0
              >
                -
              </button>
              <span className="movie-title text-black dark:text-white">⭐Rating: {userRating} / 10</span>
              <button
                className="btn"
                onClick={() => handleRatingChange(userRating + 1)} // Tambah rating
                disabled={userRating >= 10} // Disable jika rating sudah 10
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {cast.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#001f3f', padding: '20px', borderRadius: '10px' }}>
            <h1 style={{ color: 'white', marginBottom: '10px' }}><strong>Pemeran</strong></h1>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'inline-block' }}>
                {cast.map(actor => (
                  <li key={actor.id} style={{ margin: '10px', display: 'inline-block', textAlign: 'center' }}>
                    <Link to={`/actor/${actor.id}`}>
                      <img
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : placeholderImage}
                        alt={actor.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <p style={{ color: 'white' }}>{actor.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFilm;
