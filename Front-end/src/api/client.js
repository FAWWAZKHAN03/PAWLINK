import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

// Generic API helper
export const apiFetch = async (config) => {
  const response = await client(config);
  return response.data;
};

// Build image URLs
export const resolveAssetUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  const root = BASE_URL.replace("/api", "");

  return `${root}/${path.replace(/^\/+/, "")}`;
};

export default client;