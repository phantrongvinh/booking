import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import orderReducer from "./slices/orderSlice";
import ingredientReducer from "./slices/ingredientSlice";
import voucherReducer from "./slices/voucherSlice";
import promotionReducer from "./slices/promotionSlice";

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
    category: categoryReducer,
    product: productReducer,
    user: userReducer,
    order: orderReducer,
    ingredient: ingredientReducer,
    voucher: voucherReducer,
    promotion: promotionReducer,
  },

  preloadedState: {
    cart: loadCart(),
  },
});

store.subscribe(() => {
  saveCart(store.getState());
});
