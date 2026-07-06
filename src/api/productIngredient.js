import axiosClient from "./axiosClient";

const url = "/ProductIngredients";

const linkProductIngredient = async (form) => {
  const res = await axiosClient.post(url, form);
  return res.data;
};

const productIngredientAPI = { linkProductIngredient };
export default productIngredientAPI;
