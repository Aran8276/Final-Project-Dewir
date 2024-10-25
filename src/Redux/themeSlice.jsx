import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: 'light', // atau 'dark'
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

// Ekspor action dan reducer
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
