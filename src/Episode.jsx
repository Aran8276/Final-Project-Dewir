import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Episode.css";

const Episode = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [currentTrailer, setCurrentTrailer] = useState({ title: "", description: "", url: "" });
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
  const popularApiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${currentPage}`;
  const genreApiUrl = (genreId) => `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genreId}&page=${currentPage}`;
  const searchApiUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${debouncedQuery}&page=${currentPage}`;
  const imgBaseUrl = "https://image.tmdb.org/t/p/w500";
  const genresApiUrl = `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`;

  // Mengambil daftar genre
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(genresApiUrl);
        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Gagal memuat data genre: ", err);
      }
    };

    fetchGenres();
  }, []);

  // Mengambil film populer
  const fetchPopularMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(popularApiUrl);
      const data = await response.json();
      setTotalPages(data.total_pages);

      const moviesWithVideos = await Promise.all(
        data.results.map(async (movie) => {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${movie.id}/videos?api_key=${apiKey}`
          );
          const videoData = await videoResponse.json();
          const validVideo = videoData.results.find(
            (video) => video.site === "YouTube" && video.type === "Trailer" && video.key
          );
          return { ...movie, video_key: validVideo ? validVideo.key : null };
        })
      );

      setPopularMovies(moviesWithVideos);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data film: " + err.message);
      setLoading(false);
    }
  };

  // Mengambil film berdasarkan genre
  const fetchGenreMovies = async (genreId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(genreApiUrl(genreId));
      const data = await response.json();
      const moviesWithVideos = await Promise.all(
        data.results.map(async (movie) => {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${movie.id}/videos?api_key=${apiKey}`
          );
          const videoData = await videoResponse.json();
          const validVideo = videoData.results.find(
            (video) => video.site === "YouTube" && video.type === "Trailer" && video.key
          );
          return { ...movie, video_key: validVideo ? validVideo.key : null };
        })
      );
      setGenreMovies(moviesWithVideos);
    } catch (err) {
      setError("Gagal memuat film genre: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mengambil hasil pencarian
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(searchApiUrl);
          const data = await response.json();
          setPopularMovies(data.results);
          setTotalPages(data.total_pages);
        } catch (err) {
          setError("Gagal memuat data pencarian: " + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Jika query kosong, ambil film populer
        await fetchPopularMovies();
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  // Mengatur trailer acak
  useEffect(() => {
    const updateTrailer = () => {
      const validMovies = popularMovies.filter(movie => movie.video_key);
      if (validMovies.length > 0) {
        const randomMovie = validMovies[Math.floor(Math.random() * validMovies.length)];
        setCurrentTrailer({
          title: randomMovie.name,
          description: randomMovie.overview,
          url: `https://www.youtube.com/embed/${randomMovie.video_key}?autoplay=1&controls=0&rel=0&showinfo=0`,
        });
      } else {
        setCurrentTrailer({ title: "", description: "", url: "" });
      }
    };

    if (popularMovies.length > 0) {
      updateTrailer();
      const intervalId = setInterval(updateTrailer, 70000);
      return () => clearInterval(intervalId);
    }
  }, [popularMovies]);

  // Mengelola pencarian
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchParams(query ? { query } : {});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(debouncedQuery ? { query: debouncedQuery } : {});
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="episode">
      <div className="trailer-container">
        <div className="video-wrapper">
          <iframe
            className="trailer-video"
            src={currentTrailer.url}
            title={currentTrailer.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="trailer-title-overlay">
            <h2>{currentTrailer.title}</h2>
            <p className="trailer-description">{currentTrailer.description}</p>
          </div>
        </div>
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            name="searchInput"
            placeholder="Cari serial... "
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-ghost btn-circle"
            onClick={handleSearchSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Kontainer Film Populer */}
      <div className="content-container">
        <h1 className="heading" style={{ fontWeight: "bold" }}>
          {debouncedQuery ? "Hasil Pencarian" : "Daftar Serial Populer"}
        </h1>
        <div className="movie-list">
          {error && <p>{error}</p>}
          {popularMovies.length > 0 ? (
            popularMovies.map((movie) => (
              <div className="movie-item" key={movie.id}>
                <div className="movie-poster-container" style={{ position: 'relative' }}>
                  <Link to={`/tv/${movie.id}`}>
                    <img
                      src={`${imgBaseUrl}${movie.poster_path}`}
                      alt={movie.name}
                      className="movie-poster"
                    />
                  </Link>
                  {movie.vote_average > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(0, 31, 63, 0.7)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                    }}>
                      ⭐ {movie.vote_average.toFixed(1)} / 10
                    </div>
                  )}
                </div>
                <h6 className="movie-title">{movie.name}</h6>
              </div>
            ))
          ) : (
            <p>Tidak ada hasil.</p>
          )}
        </div>

        {/* Kontainer Genre */}
        <div className="genre-container" style={{ backgroundColor: '#001F3F', padding: '20px', marginTop: '0' }}>
          <div className="genre-header">
            <h1 className="heading" style={{ fontWeight: 'bold', color: 'white' }}>
              Pilih Genre
            </h1>
            <div className="genre-buttons">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className={`genre-button ${selectedGenre === genre.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedGenre(genre.id);
                    fetchGenreMovies(genre.id);
                  }}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kontainer Film Genre */}
        <div className="content-container" style={{ backgroundColor: '#001F3F', padding: '20px' }}>
          <h1 style={{ fontWeight: 'bold', color: 'white' }}>
            {selectedGenre ? `Film ${genres.find((g) => g.id === selectedGenre)?.name}` : "Genre Series:"}
          </h1>
          <div className="movie-list">
            {genreMovies.length > 0 ? (
              genreMovies.map((movie) => (
                <div className="movie-item" key={movie.id}>
                  <div className="movie-poster-container" style={{ position: 'relative' }}>
                    <Link to={`/tv/${movie.id}`}>
                      <img
                        src={`${imgBaseUrl}${movie.poster_path}`}
                        alt={movie.name}
                        className="movie-poster"
                      />
                    </Link>
                    {movie.vote_average > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(0, 31, 63, 0.7)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                      }}>
                        ⭐ {movie.vote_average.toFixed(1)} / 10
                      </div>
                    )}
                  </div>
                  <h6 className="movie-title" style={{ color: 'white' }}>{movie.name}</h6>
                </div>
              ))
            ) : (
              <p style={{ color: 'white' }}>Tidak ada film dalam genre ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Episode;
