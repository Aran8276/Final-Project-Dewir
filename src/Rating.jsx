import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingView from "./RatingView"; // Pastikan path ini benar sesuai dengan lokasi file RatingView.jsx

const Rating = () => {
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    const movieIds = Object.keys(storedRatings);

    const filteredRatedMovies = movieIds
      .filter((id) => storedRatings[id] > 0) // Hanya ambil yang ratingnya lebih dari 0
      .map((id) => ({
        id: id,
        rating: storedRatings[id],
      }));

    setRatedMovies(filteredRatedMovies);
  }, []);

  return (
    <div className="rated-movies bg-white dark:bg-gray-900 text-black dark:text-white p-5">
      <center><h2 className="text-2xl font-bold mb-4 text-black dark:text-white" style={{marginTop: '70px', marginBottom: '40px'}}>
        Rating Anda
      </h2></center>
      {ratedMovies.length === 0 ? (
        <p className="text-gray-600 dark:text-red-400">Tidak ada film yang di-rating.</p>
      ) : (
        <div className="movie-slider overflow-x-scroll scrollbar-hide">
          <div className="flex space-x-4">
            {ratedMovies.map(({ id, rating }) => (
              <RatedMovieCard key={id} movieId={id} initialRating={rating} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RatedMovieCard = ({ movieId, initialRating }) => {
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=95a4ed4dc8c4f7610f43e67fc4969ac0&language=en-US`
        );
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Gagal mengambil detail film: ", error);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    const currentRatings = JSON.parse(localStorage.getItem("ratings")) || {};
    currentRatings[movieId] = newRating;
    localStorage.setItem("ratings", JSON.stringify(currentRatings));
  };

  if (!movie) {
    return <p className="text-blue-600 dark:text-gray-400">Memuat film...</p>;
  }

  return (
    <div className="min-w-[200px] max-w-[200px] shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <Link to={`/detail/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <h3 className="text-center text-xl font-bold truncate p-2 text-black dark:text-white dark:hover:text-purple-600">
          {movie.title}
        </h3>
      </Link>
      <div className="flex justify-center items-center p-2">
        <RatingView
          rating={rating}
          onRatingChange={handleRatingChange}
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default Rating;
