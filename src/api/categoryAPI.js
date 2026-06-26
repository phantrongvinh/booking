import axiosClient from "./axiosClient";

const url = "/Categories";

const fetchCategory = async () => {
  const { data } = await axiosClient.get(url);
  return data;
};

export default {
  fetchCategory,
};  
