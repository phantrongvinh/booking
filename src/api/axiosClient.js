import axios from "axios";

const axiosClient = axios.create({
  baseURL: "",
  timeout: 5000,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/login");

    if (isLoginRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status === 403) {
      window.location.href = "/forbidden";
    } else if (status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
