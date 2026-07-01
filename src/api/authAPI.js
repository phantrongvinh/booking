import axiosClient from "./axiosClient";

const url = "/Auth";

const login = async (form) => {
  const { data } = await axiosClient.post(`${url}/login`, form);
  return data;
};

const register = async (form) => {
  const { data } = await axiosClient.post(`${url}/register`, form);
  return data;
};

const authAPI = {
  login,
  register,
};

export default authAPI;
