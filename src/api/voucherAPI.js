import axiosClient from "./axiosClient";

const url = "Voucher";

const getAllVouchers = async () => {
  const res = await axiosClient.get(url);

  return res.data;
};

const postVoucher = async (form) => {
  const res = await axiosClient.post(url, form);
  return res.data;
};

const editVoucher = async (id, form) => {
  const res = await axiosClient.put(`${url}/${id}`, form);
  return res.data;
};

const voucherAPI = { getAllVouchers, postVoucher, editVoucher };

export default voucherAPI;
