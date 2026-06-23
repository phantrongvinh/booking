import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    selectedVoucher: null,
    shippingFee: 10000,
  },

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existing = state.cartItems?.find(
        (item) => Number(item.product_id) === Number(product.product_id),
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
          selected: true,
        });
        console.log(state.cartItems);
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems?.filter(
        (item) => item.product_id !== action.payload,
      );
    },

    increaseQty: (state, action) => {
      const item = state.cartItems?.find(
        (i) => i.product_id === action.payload,
      );

      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.cartItems?.find(
        (i) => i.product_id === action.payload,
      );

      if (!item) return;

      item.quantity -= 1;

      if (item.quantity <= 0) {
        state.cartItems = state.cartItems?.filter(
          (i) => i.product_id !== action.payload,
        );
      }
    },

    toggleSelected: (state, action) => {
      const item = state.cartItems?.find(
        (i) => i.product_id === action.payload,
      );

      if (item) item.selected = !item.selected;
    },

    toggleSelectAll: (state) => {
      const allSelected = state.cartItems?.every((i) => i.selected);

      state.cartItems?.forEach((item) => {
        item.selected = !allSelected;
      });
    },

    setVoucher: (state, action) => {
      state.selectedVoucher = action.payload;
    },

    setShippingFee: (state, action) => {
      state.shippingFee = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  toggleSelected,
  toggleSelectAll,
  setVoucher,
  setShippingFee,
} = cartSlice.actions;

export default cartSlice.reducer;
