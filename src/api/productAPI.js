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

const createProduct = async (product) => {
  const formData = new FormData();

  formData.append("CategoryId", product.categoryId);
  formData.append("Name", product.name);
  formData.append("Description", product.description || "");
  formData.append("Price", product.price);
  formData.append("StockQuantity", product.stockQuantity);

  if (product.costPrice !== "" && product.costPrice != null) {
    formData.append("CostPrice", product.costPrice);
  }

  if (product.image) {
    formData.append("Image", product.image);
  }

  const { data } = await axiosClient.post(url, formData);

  return data;
};

const deleteProduct = async (id) => {
  const { data } = await axiosClient.delete(`${url}/${id}`);
  return data;
};

const updateProductPrice = async (id, price) => {
  const { data } = await axiosClient.put(`${url}/${id}/price`, {
    price,
  });

  return data;
};

const updateProductNameCategory = async (id, name, categoryId) => {
  const { data } = await axiosClient.put(`${url}/${id}/name-category`, {
    name,
    categoryId,
  });

  return data;
};

const updateProductDescription = async (id, description) => {
  const { data } = await axiosClient.put(`${url}/${id}/description`, {
    description,
  });

  return data;
};

const updateProductStock = async (id, stockQuantity) => {
  const { data } = await axiosClient.put(`${url}/${id}/stock`, {
    stockQuantity,
  });

  return data;
};

const updateProductImage = async (id, file) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await axiosClient.put(`${url}/${id}/image`, formData);

  return data;
};

const productAPI = {
  fetchProduct,
  fetchProductById,
  fetchProductByCategory,
  createProduct,
  deleteProduct,
  updateProductPrice,
  updateProductNameCategory,
  updateProductDescription,
  updateProductStock,
  updateProductImage,
};

export default productAPI;
