import axiosClient from "./axiosClient";

const url = "Ingredients";

const fetchAllIngredient = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const updateIngredientStock = async (name, currentStock) => {
  const res = await axiosClient.put(`${url}/stock-by-name/${name}`, {
    currentStock: currentStock,
  });
  return res.data;
};

const ingredientAPI = {
  fetchAllIngredient,
  updateIngredientStock,
};

export default ingredientAPI;
