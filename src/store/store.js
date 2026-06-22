import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";

const loadCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : undefined;
  } catch (err) {
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