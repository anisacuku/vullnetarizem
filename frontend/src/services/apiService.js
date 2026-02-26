import axios from "axios";

const RAW_API_URL =
  process.env.REACT_APP_API_URL || "https://vullnetarizem-1.onrender.com";

const API_URL = RAW_API_URL.replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000,
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Clean error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    const message =
      data?.detail ||
      data?.message ||
      error?.message ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      raw: error,
    });
  }
);

export default api;
export { API_URL };