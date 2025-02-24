import { createSlice } from "@reduxjs/toolkit";

// Initial state for theme
const initialState = {
  theme: "dark",
};

// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Toggle between light and dark themes
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

// Export actions and reducer
export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
