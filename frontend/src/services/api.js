// frontend/src/services/api.js  (or wherever your api.js lives)
import axios from "axios";

// Use your existing env var name (REACT_APP_API_URL)
const RAW_API_URL =
  process.env.REACT_APP_API_URL || "https://vullnetarizem-1.onrender.com";

// Remove trailing slash to prevent // in requests
const API_URL = RAW_API_URL.replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 20000, // 20s safety timeout (adjust if needed)
});

// Add auth token to requests (if present)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Make sure headers exist
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no token, make sure we don't accidentally send "Bearer null"
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors so your UI can show clean messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    // Build a useful message
    const msg =
      data?.detail ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      error?.message ||
      "Request failed";

    // Attach a consistent shape
    return Promise.reject({
      status,
      message: msg,
      raw: error,
    });
  }
);

export default api;
export { API_URL };