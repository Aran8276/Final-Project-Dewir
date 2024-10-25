import { useParams, Link } from "react-router-dom"; // Import Link dan useParams
import { useEffect, useState } from "react";

const DetailFilm = () => {
  const { id } = useParams(); // Mengambil ID dari URL
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null); // State untuk trailer
  const [cast, setCast] = useState([]); // State untuk pemeran
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0); // State untuk rating pengguna
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal

  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
  const movieDetailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
  const movieVideosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`; // URL untuk mendapatkan video
  const movieCreditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`; // URL untuk mendapatkan pemeran

  // URL gambar placeholder untuk aktor tanpa foto
  const placeholderImage = 'https://via.placeholder.com/100?text=No+Image'; // Ganti URL ini sesuai dengan preferensi Anda

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(movieDetailUrl);
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError("Gagal memuat detail film.");
      } finally {
        setLoading(false); // Pindahkan ke sini
      }
    };

    const fetchMovieTrailers = async () => {
      try {
        const response = await fetch(movieVideosUrl);
        const data = await response.json();
        const mainTrailer = data.results.find(video => video.type === 'Trailer'); // Mencari trailer utama
        const alternativeTrailer = data.results.find(video => video.type === 'Teaser'); // Mencari teaser sebagai alternatif
        setTrailer(mainTrailer || alternativeTrailer); // Jika trailer utama tidak ada, gunakan teaser
      } catch (err) {
        setError("Gagal memuat trailer film.");
      }
    };

    const fetchMovieCast = async () => {
      try {
        const response = await fetch(movieCreditsUrl);
        const data = await response.json();
        setCast(data.cast); // Menyimpan data pemeran
      } catch (err) {
        setError("Gagal memuat pemeran film.");
      }
    };

    fetchMovieDetail();
    fetchMovieTrailers();
    fetchMovieCast(); // Mengambil data pemeran
  }, [id]);

  const handleRatingChange = (e) => {
    setUserRating(e.target.value); // Mengupdate rating pengguna
  };

  const handleAddRating = () => {
    // Logika untuk menambahkan rating, bisa disimpan di database atau di lokal
    alert(`Anda memberikan rating ${userRating} untuk film ${movie.title}`);
    setUserRating(0); // Reset rating setelah ditambahkan
    setIsModalOpen(false); // Menutup modal setelah menambahkan rating
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Menampilkan atau menyembunyikan modal
  };

  if (loading) return <p>Memuat detail film...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ textAlign: 'center', margin: '20px', paddingTop: '80px' }}> {/* Menambahkan paddingTop */}
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
        <div>
          <h2>Trailer tidak tersedia.</h2>
        </div>
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
              {movie.vote_average} ⭐ {/* Menampilkan rating */ }
            </div>
          </div>
          <div style={{ textAlign: 'left', marginLeft: '20px' }}>
            <h1 style={{ fontSize: '2em', marginBottom: '10px' }}>{movie.title}</h1>
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
              Genre: {movie.genres.map(genre => genre.name).join(', ')} {/* Menampilkan genre */}
            </p>
            <p style={{ fontSize: '1.2em', marginBottom: '10px' }}>
              Status: {movie.status} {/* Menampilkan status penayangan */}
            </p>
            <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>{movie.overview}</p>

            {/* Menambahkan tombol Add Rating di bawah deskripsi */}
            <button className="btn btn-warning" onClick={toggleModal}>Add Rating</button>
          </div>
        </div>
      )}

      {/* Modal untuk rating pengguna */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Latar belakang transparan
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontWeight: 'bold' }}>Berikan Rating</h2>
            <br/>
            <input
              type="number"
              min="0"
              max="10"
              value={userRating}
              onChange={handleRatingChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <button className="btn btn-warning" onClick={handleAddRating}>Kirim</button>
            <button className="btn btn-danger" onClick={toggleModal}>Tutup</button>
          </div>
        </div>
      )}

      {/* Menampilkan pemeran di bawah fitur rating */}
      {cast.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#001f3f', padding: '20px', borderRadius: '10px' }}>
            <h1 style={{ color: 'white', marginBottom: '10px' }}><strong>Pemeran</strong></h1>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
              <ul style={{ listStyle: 'none', padding: 0, display: 'inline-block' }}>
                {cast.map(actor => (
                  <li key={actor.id} style={{ margin: '10px', display: 'inline-block', textAlign: 'center' }}>
                    <Link to={`/actor/${actor.id}`}> {/* Link menuju ActorDetail */}
                      <img
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : placeholderImage}
                        alt={actor.name}
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          borderRadius: '50%',  // Membuat gambar berbentuk lingkaran
                          objectFit: 'cover'    // Menghindari distorsi gambar
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
