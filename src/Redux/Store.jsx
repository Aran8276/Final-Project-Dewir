import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import themeReducer from './themeSlice'; // Import themeReducer

const store = configureStore({
  reducer: {
    movies: movieReducer,
    theme: themeReducer, // Tambahkan themeReducer di sini
  },
});

export default store;
