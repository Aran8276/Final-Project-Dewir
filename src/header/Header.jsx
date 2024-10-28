import { useState, useEffect } from "react";
import "./Header.css";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies, fetchGenres, searchMovie } from "../Redux/movieSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { movies, genres, loading, error, filteredMovies } = useSelector(
    (state) => state.movies
  );
  const theme = useSelector((state) => state.theme.theme);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [genreId, setGenreId] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentTrailer, setCurrentTrailer] = useState({
    title: "",
    description: "",
    url: "",
  });

  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    if (debouncedQuery === "") {
      dispatch(fetchMovies());
      return;
    }
    dispatch(searchMovie(debouncedQuery));
  }, [dispatch, debouncedQuery]);

  useEffect(() => {
    if (movies.length > 0) {
      const movie = movies[0];
      const fetchTrailer = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
          );
          const videoData = await response.json();
          const validVideo = videoData.results.find(
            (video) =>
              video.site === "YouTube" && video.type === "Trailer" && video.key
          );
          if (validVideo) {
            setCurrentTrailer({
              title: movie.title,
              description: movie.overview,
              url: `https://www.youtube.com/embed/${validVideo.key}?autoplay=1&controls=0&rel=0&showinfo=0`,
            });
          }
        } catch (error) {
          console.error("Failed to fetch trailer:", error);
        }
      };
      fetchTrailer();
    }
  }, [movies]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchParams(query ? { query } : {});
  };

  const handleSearchSubmit = () => {
    setDebouncedQuery(searchQuery);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleGenreClick = (id) => {
    const genre = genres.find((genre) => genre.id === id);
    setSelectedGenre(genre ? genre.name : "");
    setGenreId(id);
    dispatch(fetchMovies());
  };

  return (
    <div className="movie-title text-black dark:text-white">
      <div className="trailer-container">
        {currentTrailer.url && (
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
        )}
      </div>

      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            name="searchInput"
            placeholder="Cari film..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
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

      <br />

      <div className="movie-title text-black dark:text-white">
        <h1 className="heading" style={{ fontWeight: "bold" }}>
          {searchQuery ? "Hasil Pencarian" : "Daftar Film Populer"}
        </h1>
        <div className="movie-list">
          {error && <p>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : Array.isArray(movies) && movies.length > 0 ? (
            movies.map((movie) => (
              <div className="movie-item" key={movie.id}>
                <div className="movie-poster-container">
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  </Link>
                </div>
                <div className="movie-title-container text-black dark:text-white">
                  <Link to={`/movie/${movie.id}`}>
                    <h6 className="movie-title text-black dark:text-white">{movie.title}</h6>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada film ditemukan.</p>
          )}
        </div>
      </div>

      <div className="genre-section">
        <h2>
          <strong>Film Sesuai Genre</strong>
        </h2>
        <div className="genre-buttons">
          {Array.isArray(genres) && genres.length > 0 ? (
            genres.map((genre) => (
              <button
                key={genre.id}
                className="genre-button"
                onClick={() => handleGenreClick(genre.id)}
              >
                {genre.name}
              </button>
            ))
          ) : (
            <p>Tidak ada genre ditemukan.</p>
          )}
        </div>

        <div className="movie-list">
          {error && <p>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : Array.isArray(filteredMovies) && filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div className="movie-item" key={movie.id}>
                <div className="movie-poster-container">
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  </Link>
                </div>
                <div className="movie-title-container">
                  <Link to={`/movie/${movie.id}`}>
                    <h6 className="movie-title">{movie.title}</h6>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Tidak ada film ditemukan.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
