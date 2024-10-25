import React, { useEffect, useState } from 'react';

const HistoriRating = () => {
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    // Mendapatkan data rating dari localStorage
    const storedRatings = localStorage.getItem('ratings');
    if (storedRatings) {
      setRatingData(JSON.parse(storedRatings));
    }
  }, []);

  return (
    <div>
      <h1>Histori Rating</h1>
      {ratingData.length === 0 ? (
        <p>Belum ada film atau episode yang di-rating.</p>
      ) : (
        <ul>
          {ratingData.map((item, index) => (
            <li key={index}>
              <p>Judul: {item.title}</p>
              <p>Rating: {item.rating}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoriRating;
