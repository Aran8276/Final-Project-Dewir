import React from 'react';

// Fungsi untuk menyimpan rating film
const rateMovie = (movie) => {
  const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || [];
  const existingMovie = ratedMovies.find((ratedMovie) => ratedMovie.id === movie.id);
  
  if (existingMovie) {
    existingMovie.rating = movie.rating; // Update rating
  } else {
    ratedMovies.push(movie); // Tambahkan film baru
  }

  localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
};

const RateMovie = () => {
  const handleRate = (id, title, rating) => {
    rateMovie({ id, title, rating }); // Simpan film dengan rating
    alert(`Film "${title}" telah dinilai dengan ${rating} ⭐`);
  };

  const rateMoviesAutomatically = () => {
    // Daftar film yang bisa dirating
    const movies = [
      { id: 1, title: "Film 1", rating: 5 },
      { id: 2, title: "Film 2", rating: 4 },
      { id: 3, title: "Film 3", rating: 3 },
      { id: 4, title: "Film 4", rating: 5 },
      { id: 5, title: "Film 5", rating: 4 },
      { id: 6, title: "Film 6", rating: 2 },
      { id: 7, title: "Film 7", rating: 1 },
      // Tambahkan lebih banyak film sesuai kebutuhan
    ];
    
    movies.forEach(movie => {
      rateMovie(movie); // Simpan setiap film dengan ratingnya
    });
  };

  return (
    <div>
      <button onClick={rateMoviesAutomatically}>Rate All Movies Automatically</button>
      {/* Anda juga bisa menambahkan tombol untuk rating individual */}
      <button onClick={() => handleRate(1, "Film 1", 5)}>Rate Film 1 - 5 ⭐</button>
      <button onClick={() => handleRate(2, "Film 2", 4)}>Rate Film 2 - 4 ⭐</button>
    </div>
  );
};

export default RateMovie;
