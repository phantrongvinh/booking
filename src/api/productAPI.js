import axiosClient from "./axiosClient";

const url = "/Products";

const fetchAllProduct = async () => {
  const res = await axiosClient.get(`${url}`);
  return res;
};

const fetchProductById = async (id) => {
  const res = await axiosClient.get(`${url}/${id}`);
  return res;
};

const productAPI = {
  fetchAllProduct,
  fetchProductById,
};

export default productAPI;
