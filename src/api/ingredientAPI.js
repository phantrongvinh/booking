import axiosClient from "./axiosClient";

const url = "Ingredients";

const fetchAllIngredient = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const ingredientAPI = {
  fetchAllIngredient,
};

export default ingredientAPI;
