import axios from 'axios';

console.log("HELLO")
console.log("API_URL", process.env.REACT_APP_API_URL);
const API_URL = process.env.REACT_APP_API_URL || 'https://vullnetarizem-1.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
console.log("how about here?")
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

console.log("api", api)
export default api;