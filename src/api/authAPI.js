import axiosClient from "./axiosClient";

const url = "/Auth";

const login = async (data) => {
  const res = await axiosClient.post(`${url}/login`, data);
  return res;
};

const register = async () => {
  const res = await axiosClient.post(`${url}/register`);
  return res;
};

const authAPI = {
  login,
  register,
};

export default authAPI;
