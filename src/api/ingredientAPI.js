import axiosClient from "./axiosClient";

const url = "/Ingredients";

const fetchAllIngredient = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const createIngredient = async (data) => {
  const res = await axiosClient.post(url, data);
  return res.data;
};

const updateIngredient = async (id, data) => {
  const res = await axiosClient.put(`${url}/${id}`, data);
  return res.data;
};

const updateIngredientStock = async (name, currentStock) => {
  const res = await axiosClient.put(
    `${url}/stock-by-name/${encodeURIComponent(name)}`,
    {
      currentStock,
    },
  );
  return res.data;
};

const deleteIngredient = async (id) => {
  const res = await axiosClient.delete(`${url}/${id}`);
  return res.data;
};

const ingredientAPI = {
  fetchAllIngredient,
  createIngredient,
  updateIngredient,
  updateIngredientStock,
  deleteIngredient,
};

export default ingredientAPI;
