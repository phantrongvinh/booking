import axiosClient from "./axiosClient";

const url = "/promotions";

const getPromotion = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const postPromotion = async (form) => {
  const res = await axiosClient.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const updatePromotion = async (id, form) => {
  const res = await axiosClient.put(`${url}/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const deletePromotion = async (id) => {
  const res = await axiosClient.delete(`${url}/${id}`);
  return res.data;
};

const getPromotionById = async (id) => {
  const res = await axiosClient.get(`${url}/${id}`);
  return res.data;
};

const addPromotionOnProduct = async (promotionId, productIds) => {
  const res = await axiosClient.post(`${url}/${promotionId}/products`, {
    productIds,
  });
  return res.data;
};

const deletePromotionOnProduct = async (promotionId, productIds) => {
  const res = await axiosClient.delete(`${url}/${promotionId}/products`, {
    data: {
      productIds,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

const importPromotion = async (file) => {
  const res = await axiosClient.post(`${url}/import`, file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const getPromotionOngoing = async () => {
  const res = await axiosClient.get(`${url}/ongoing`);
  return res.data;
};

const promotionAPI = {
  getPromotion,
  postPromotion,
  updatePromotion,
  deletePromotion,
  getPromotionById,
  addPromotionOnProduct,
  deletePromotionOnProduct,
  importPromotion,
  getPromotionOngoing,
};

export default promotionAPI;
