import { createSlice } from "@reduxjs/toolkit";

// Initial state for services
const initialState = {
  data: [],
  filteredData: [],
  selectedCategories: [],
  searchQuery: "",
};

// Create the services slice
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    // Set all service data
    setData(state, action) {
      state.data = action.payload;
    },
    // Set filtered service data
    setFilteredData(state, action) {
      state.filteredData = action.payload;
    },
    // Set selected categories for filtering
    setSelectedCategories(state, action) {
      state.selectedCategories = action.payload;
    },
    // Set search query for services
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setData,
  setFilteredData,
  setSelectedCategories,
  setSearchQuery,
} = servicesSlice.actions;

export const servicesActions = {
  setData,
  setFilteredData,
  setSelectedCategories,
  setSearchQuery,
};

export default servicesSlice.reducer;
