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
const fetchProductIngredients = async (productId) => {
  const { data } = await axiosClient.get(`${url}/by-product-id/${productId}`);

  return data;
};

const createProductIngredient = async (payload) => {
  console.log("SEND:", payload);

  const { data } = await axiosClient.post(
    `${url}/by-ids`,
    payload
  );

  return data;
};

const updateProductIngredient = async (payload) => {
  const { data } = await axiosClient.put(`${url}/by-ids`, payload);

  return data;
};

const removeProductIngredient = async (productId, ingredientId) => {
  const { data } = await axiosClient.delete(`${url}/by-ids`, {
    data: {
      productId,
      ingredientId,
    },
  });

  return data;
};

const productIngredientAPI = {
  linkProductIngredient,
  getProductIngredientByProductName,
  fetchProductIngredients,
  createProductIngredient,
  updateProductIngredient,
  removeProductIngredient,

};
export default productIngredientAPI;
