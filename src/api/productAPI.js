import axiosClient from "./axiosClient";

const url = "/Products";

const fetchProduct = async () => {
  const { data } = await axiosClient.get(`${url}`);
  return data;
};

const fetchProductById = async (id) => {
  const { data } = await axiosClient.get(`${url}/${id}`);
  return data;
};

const fetchProductByCategory = async (categoryId) => {
  const { data } = await axiosClient.get(`/Products/category/${categoryId}`);
  return data;
};

const fetchProductBySearch = async (name) => {
  const { data } = await axiosClient.get(`${url}/search`, {
    params: {
      name,
    },
  });
  return data;
};

const productAPI = {
  fetchProduct,
  fetchProductById,
  fetchProductByCategory,
  fetchProductBySearch,
};

export default productAPI;
