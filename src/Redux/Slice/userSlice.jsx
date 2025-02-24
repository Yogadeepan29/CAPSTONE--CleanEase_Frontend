import { createSlice } from "@reduxjs/toolkit";

// Initial state for user
const initialState = {
  currentuser: null,
  error: null,
  loading: false,
};

// Create the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Start sign-in process
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Successful sign-in
    signInSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Failed sign-in
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Start user update process
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Successful user update
    updateSuccess: (state, action) => {
      state.currentuser.rest = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Failed user update
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Successful sign-out
    signOutSucess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    // Start user deletion process
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Successful user deletion
    deleteUserSuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    // Failed user deletion
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  signOutSucess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
