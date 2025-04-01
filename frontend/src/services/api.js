import axios from 'axios';

console.log("API_URL", process.env.REACT_APP_API_URL);
const API_URL = process.env.REACT_APP_API_URL || 'https://vullnetarizem-1.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;