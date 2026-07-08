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
// lấy đơn hàng cá nhân
const fetchMyOrders = async () => {
  const res = await axiosClient.get(`${url}/me`);
  return res.data;
};

// user hủy đơn hàng
const cancelOrder = async (id, cancelReason) => {
  const res = await axiosClient.put(`${url}/${id}/cancel`, { cancelReason });
  return res.data;
};

// user xác nhận nhận hàng
const confirmOrder = async (id) => {
  const res = await axiosClient.put(`${url}/${id}/confirm-received`);
  return res.data;
};

const orderAPI = {
  fetchAllOrder,
  createOrder,
  fetchOrderById,
  updateOrderStatus,
  fetchMyOrders,
  cancelOrder,
  confirmOrder,
};
export default orderAPI;
