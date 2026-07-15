import axiosClient from "./axiosClient";

// Lấy danh sách tất cả nhân viên
const fetchStaffs = async () => {
  const { data } = await axiosClient.get("/UserProfiles/staff");
  return data;
};

// Lấy chi tiết thông tin nhân viên theo userId
const fetchStaffByUserId = async (userId) => {
  const { data } = await axiosClient.get(`/UserProfiles/by-user/${userId}`);
  return data;
};

// Tạo tài khoản nhân viên mới
const registerStaff = async (form) => {
  const { data } = await axiosClient.post("/Auth/register-staff", form);
  return data;
};

// Sửa thông tin profile của nhân viên đang đăng nhập
const updateStaffProfile = async (form) => {
  const { data } = await axiosClient.put("/UserProfiles/me", form);
  return data;
};

// Đổi mật khẩu tài khoản
const changePassword = async (form) => {
  const { data } = await axiosClient.put("/UserProfiles/me/change-password", form);
  return data;
};

// Xóa tài khoản nhân viên
const deleteStaff = async (userId) => {
  const { data } = await axiosClient.delete(`/Users/${userId}`);
  return data;
};

const staffAPI = {
  fetchStaffs,
  fetchStaffByUserId,
  registerStaff,
  updateStaffProfile,
  changePassword,
  deleteStaff,
};

export default staffAPI;
