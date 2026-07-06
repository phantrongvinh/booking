import axiosClient from "./axiosClient";

const url = "/UserProfiles";

// Lấy danh sách tất cả khách hàng
const fetchCustomers = async () => {
  const { data } = await axiosClient.get(`${url}/customers`);
  return data;
};

// Tìm kiếm khách hàng
const searchCustomers = async (params) => {
  const { data } = await axiosClient.get(`${url}/customers/search`, {
    params,
  });
  return data;
};

// Lấy thông tin khách hàng theo profileId
const fetchCustomerByProfileId = async (profileId) => {
  const { data } = await axiosClient.get(`${url}/${profileId}`);
  return data;
};

// Lấy thông tin khách hàng theo userId
const fetchCustomerByUserId = async (userId) => {
  const { data } = await axiosClient.get(`${url}/by-user/${userId}`);
  return data;
};

const customerAPI = {
  fetchCustomers,
  searchCustomers,
  fetchCustomerByProfileId,
  fetchCustomerByUserId,
};

export default customerAPI;
