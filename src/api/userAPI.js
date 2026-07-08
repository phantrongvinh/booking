import axiosClient from "./axiosClient";

const url = "/UserProfiles";

const fetchMe = async () => {
  const { data } = await axiosClient.get(`${url}/me`);
  return data;
};

const updateProfile = async (form) => {
  const { data } = await axiosClient.put(`${url}/me`, form);
  return data;
};

const fetchUsers = async () => {
  const { data } = await axiosClient.get("/users");
  return data;
};

const userAPI = {
  fetchMe,
  updateProfile,
  fetchUsers,
};
export default userAPI;
