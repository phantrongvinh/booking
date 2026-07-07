import axiosClient from "./axiosClient";

const url = "/ProductIngredients";

const linkProductIngredient = async (form) => {
  const res = await axiosClient.post(url, form);
  return res.data;
};

const getProductIngredientByProductName = async (name) => {
  const res = await axiosClient.get(`${url}/by-product/${name}`);
  return res.data;
};

const productIngredientAPI = {
  linkProductIngredient,
  getProductIngredientByProductName,
};
export default productIngredientAPI;
