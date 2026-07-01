import axiosClient from "./axiosClient";

const url = "/Orders";

const fetchAllOrder = async () => {
  const res = await axiosClient.get(url);
  return res.data;
};

const orderAPI = {
  fetchAllOrder,
};
export default orderAPI;
