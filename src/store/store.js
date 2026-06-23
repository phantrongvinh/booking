import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");

    if (!data) return undefined;

    const parsed = JSON.parse(data);

    if (parsed && Array.isArray(parsed.cartItems)) {
      return parsed;
    }

    return {
      cartItems: [],
      selectedVoucher: null,
      shippingFee: 10000,
    };
  } catch {
    return undefined;
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  } catch (err) {}
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },

  preloadedState: {
    cart: loadCart(),
  },
});

store.subscribe(() => {
  saveCart(store.getState());
});
