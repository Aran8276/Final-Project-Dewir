import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const searchMovie = createAsyncThunk(
  "movies/fetchMovies",
  async (query) => {
    const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
    );
    const data = await response.json();
    return data.results; // Mengembalikan array film
  }
);

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (query = "") => {
    const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&${query}`
    );
    const data = await response.json();
    return data.results; // Mengembalikan array film
  }
);

export const fetchGenres = createAsyncThunk("movies/fetchGenres", async () => {
  const apiKey = "95a4ed4dc8c4f7610f43e67fc4969ac0";
  const response = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
  );
  const data = await response.json();
  return data.genres; // Mengembalikan array genre
});

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    genres: [],
    filteredMovies: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Anda bisa menambahkan reducer di sini jika perlu
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      });
  },
});

export default movieSlice.reducer;
