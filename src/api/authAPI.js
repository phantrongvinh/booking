import axiosClient from "./axiosClient";

const url = "/Auth";

const login = async () => {
  const res = await axiosClient.post(`${url}/login`);
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
