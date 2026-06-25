import axiosClient from "./axiosClient";

const url = "/Categories";

const fetchAllCategory = async () => {
  const res = await axiosClient.get(`${url}`);
  return res;
};

const categoryAPI = {
  fetchAllCategory,
};

export default categoryAPI;
