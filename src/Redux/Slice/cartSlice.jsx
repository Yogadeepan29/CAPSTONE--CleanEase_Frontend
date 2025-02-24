import { createSlice } from "@reduxjs/toolkit";

// Initial state for the cart
const initialState = {
  items: [],
  checkoutData: { items: [], totalPrice: 0 },
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add an item to the cart
    addToCart: (state, action) => {
      const { _id, category, addons, prevAddons } = action.payload; // Include prevAddons
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === _id
      );

      if (existingItemIndex >= 0) {
        // If the item already exists, create a new object for that item
        const existingItem = state.items[existingItemIndex];
        const updatedItem = {
          ...existingItem,
          addons: addons,
          prevAddons: prevAddons, // Update prevAddons
        };
        // Replace the existing item with the updated item
        state.items[existingItemIndex] = updatedItem;
      } else {
        // If the item does not exist, push a new item
        state.items.push({
          _id,
          category,
          productId: _id,
          addons,
          prevAddons,
          subscription: false,
        });
      }
    },
    // Remove an item from the cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    // Set multiple cart items
    setCartItems: (state, action) => {
      state.items = action.payload.map((item) => ({
        ...item,
        subscription: item.subscription || false, // Ensure subscription status is included
      }));
      state.totalPrice = state.items.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );
    },
    // Clear the cart
    clearCart: (state) => {
      state.items = [];
      state.checkoutData = { items: [], totalPrice: 0 };
    },
    // Set checkout data
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
    // Clear checkout data
    clearCheckoutData: (state) => {
      state.checkoutData = { items: [], totalPrice: 0 };
    },
    // Update service address in checkout data
    updateServiceAddress: (state, action) => {
      const { serviceIndex, addressId } = action.payload;
      if (state.checkoutData.items[serviceIndex]) {
        state.checkoutData.items[serviceIndex].selectedAddressId = addressId;
      }
    },
    // Update service date and time
    updateServiceDateTime: (state, action) => {
      const { productId, date, time, subscription } = action.payload;
      const service = state.checkoutData.items.find(
        (item) => item.productId === productId
      );
      if (service) {
        service.date = date;
        service.time = time;
        service.subscription = subscription;
      }
    },
    // Update subscription status of an item
    updateSubscriptionStatus: (state, action) => {
      const { itemId, subscription } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === itemId
      );

      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];

        // Update the subscription status
        const updatedItem = {
          ...existingItem,
          subscription: subscription,
          addons: subscription ? [] : existingItem.prevAddons, // Clear or restore addons based on subscription status
          prevAddons: subscription ? existingItem.addons : [], // Update prevAddons accordingly
        };

        // Replace the existing item with the updated item
        state.items[existingItemIndex] = updatedItem;
      }
    },
  },
});

// Export actions and reducer
export const {
  addToCart,
  removeFromCart,
  setCartItems,
  clearCart,
  setCheckoutData,
  clearCheckoutData,
  updateServiceAddress,
  updateServiceDateTime,
  updateSubscriptionStatus,
} = cartSlice.actions;

export default cartSlice.reducer;
