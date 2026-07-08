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

const createProduct = async (data) => {
  const formData = new FormData();

  formData.append("CategoryId", data.categoryId);
  formData.append("Name", data.name);
  formData.append("SizeName", data.sizeName);
  formData.append("Price", data.price);
  formData.append("StockQuantity", data.stockQuantity);
  formData.append("Image", data.image);

  if (data.description?.trim()) {
    formData.append("Description", data.description);
  }

  if (data.storageInstructions?.trim()) {
    formData.append("StorageInstructions", data.storageInstructions);
  }

  if (data.costPrice !== "" && data.costPrice != null) {
    formData.append("CostPrice", data.costPrice);
  }

  const { data: rs } = await axiosClient.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return rs;
};

const deleteProduct = async (id) => {
  const { data } = await axiosClient.delete(`${url}/${id}`);

  return data;
};

// Update giá bán
const updatePrice = async (id, price) => {
  const { data } = await axiosClient.put(`${url}/${id}/price`, {
    price,
  });

  return data;
};

// Update tên + danh mục
const updateNameCategory = async (id, name, categoryId) => {
  const { data } = await axiosClient.put(`${url}/${id}/name-category`, {
    name,
    categoryId,
  });

  return data;
};

// Update mô tả
const updateDescription = async (id, description) => {
  const { data } = await axiosClient.put(`${url}/${id}/description`, {
    description,
  });

  return data;
};

// Update tồn kho
const updateStock = async (id, stockQuantity) => {
  const { data } = await axiosClient.put(`${url}/${id}/stock`, {
    stockQuantity,
  });

  return data;
};

// Update ảnh
const updateImage = async (id, file) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await axiosClient.put(`${url}/${id}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

// Update hướng dẫn bảo quản
const updateStorageInstructions = async (id, storageInstructions) => {
  const { data } = await axiosClient.put(`${url}/${id}/storage-instructions`, {
    storageInstructions,
  });

  return data;
};

// Update kích thước
const updateSizeName = async (id, sizeName) => {
  const { data } = await axiosClient.put(`${url}/${id}/size-name`, {
    sizeName,
  });

  return data;
};

const productAPI = {
  fetchProduct,
  fetchProductById,
  fetchProductByCategory,
  createProduct,
  deleteProduct,
  updatePrice,
  updateNameCategory,
  updateDescription,
  updateStock,
  updateImage,
  updateStorageInstructions,
  updateSizeName,
  fetchProductBySearch,
 
};

export default productAPI;
