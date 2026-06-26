import axiosClient from "./axiosClient";

const url = "/Carts";

const fetchCart = async () => {
  const { data } = await axiosClient.get(`${url}/me`);

  return data;
};

const addToCart = async (payload) => {
  const { data } = await axiosClient.post(`${url}/items`, payload);

  return data;
};

const updateCartItem = async (productId, payload) => {
  const { data } = await axiosClient.put(`${url}/items/${productId}`, payload);

  return data;
};

const removeCartItem = async (productId) => {
  const { data } = await axiosClient.delete(`${url}/items/${productId}`);

  return data;
};

const clearCart = async () => {
  const { data } = await axiosClient.delete(url);

  return data;
};

export default {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
