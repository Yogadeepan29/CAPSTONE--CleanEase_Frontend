// Redux/Slice/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for orders
const initialState = {
  hasNewOrder: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Set a new order
    setNewOrder: (state) => {
      state.hasNewOrder = true;
    },
    // Clear the new order
    clearNewOrder: (state) => {
      state.hasNewOrder = false;
    },
  },
});

// Export actions and reducer
export const { setNewOrder, clearNewOrder } = orderSlice.actions;
export default orderSlice.reducer;
