import axiosClient from "./axiosClient";

const url = "/Products";

const fetchProduct = async () => {
  const res = await axiosClient.get(`${url}`);
  return res;
};

const fetchProductById = async (id) => {
  const res = await axiosClient.get(`${url}/${id}`);
  return res;
};

const productAPI = {
  fetchProduct,
  fetchProductById,
};

export default productAPI;
