import axiosClient from "./axiosClient";

const url = "/Voucher";

// Lấy danh sách tất cả voucher
const fetchVouchers = async () => {
  const { data } = await axiosClient.get(url);
  return data;
};

// Lấy chi tiết voucher theo id
const fetchVoucherById = async (id) => {
  const { data } = await axiosClient.get(`${url}/${id}`);
  return data;
};

// Lấy danh sách voucher đã sử dụng của tôi
const fetchUsedVouchers = async () => {
  const { data } = await axiosClient.get(`${url}/me/used`);
  return data;
};

// Lấy danh sách voucher chưa sử dụng của tôi
const fetchUnusedVouchers = async () => {
  const { data } = await axiosClient.get(`${url}/me/unused`);
  return data;
};

// Tìm kiếm voucher theo mã code
const searchVouchers = async (keyword) => {
  const { data } = await axiosClient.get(`${url}/search`, {
    params: { keyword },
  });
  return data;
};

// Lọc voucher theo khoảng ngày (from, to: định dạng YYYY-MM-DD)
const filterVouchers = async (from, to) => {
  const { data } = await axiosClient.get(`${url}/filter`, {
    params: { from, to },
  });
  return data;
};

// Áp dụng voucher cho đơn hàng
const applyVoucher = async (form) => {
  const { data } = await axiosClient.post(`${url}/apply`, form);
  return data;
};

const voucherAPI = {
  fetchVouchers,
  fetchVoucherById,
  fetchUsedVouchers,
  fetchUnusedVouchers,
  searchVouchers,
  filterVouchers,
  applyVoucher,
};

export default voucherAPI;
