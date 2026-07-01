import axiosClient from "./axiosClient";

const url = "/Orders";

const fetchAllOrder = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const createOrder = async (data) => {
  const res = await axiosClient.post(url, data);
  return res.data;
};

const orderAPI = {
  fetchAllOrder,
  createOrder,
};
export default orderAPI;
