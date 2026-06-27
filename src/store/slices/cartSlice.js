import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    selectedProducts: [],
    selectedVoucher: null,
    shippingFee: 10000,
  },

  reducers: {
    toggleSelected: (state, action) => {
      const productId = action.payload;

      if (state.selectedProducts.includes(productId)) {
        state.selectedProducts = state.selectedProducts.filter(
          (id) => id !== productId,
        );
      } else {
        state.selectedProducts.push(productId);
      }
    },

    toggleSelectAll: (state, action) => {
      const productIds = action.payload;

      if (state.selectedProducts.length === productIds.length) {
        state.selectedProducts = [];
      } else {
        state.selectedProducts = [...productIds];
      }
    },

    setVoucher: (state, action) => {
      state.selectedVoucher = action.payload;
    },

    setShippingFee: (state, action) => {
      state.shippingFee = action.payload;
    },

    clearSelected: (state) => {
      state.selectedProducts = [];
    },
  },
});

export const {
  toggleSelected,
  toggleSelectAll,
  setVoucher,
  setShippingFee,
  clearSelected,
} = cartSlice.actions;

export default cartSlice.reducer;
