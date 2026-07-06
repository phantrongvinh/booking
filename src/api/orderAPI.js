import axiosClient from "./axiosClient";

const url = "/orders";

const fetchAllOrder = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const createOrder = async (data) => {
  const res = await axiosClient.post(url, data);
};
const fetchOrderById = async (id) => {
  const res = await axiosClient.get(`${url}/${id}`);
  return res.data;
};
const updateOrderStatus = async (id, newStatus, note) => {
  const res = await axiosClient.put(`${url}/${id}/status`, {
    newStatus,
    note,
  });
  return res.data;
};

const orderAPI = {
  fetchAllOrder,
  createOrder,
  fetchOrderById,
  updateOrderStatus,
};
export default orderAPI;
