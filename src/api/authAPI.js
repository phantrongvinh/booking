import axiosClient from "./axiosClient";

const url = "/Auth";

const login = async (form) => {
  const { data } = await axiosClient.post(`${url}/login`, form);
  return data;
};

const register = async () => {
  const { data } = await axiosClient.post(`${url}/register`);
  return data;
};

const authAPI = {
  login,
  register,
};

export default authAPI;
