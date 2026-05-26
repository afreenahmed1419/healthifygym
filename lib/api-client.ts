import axios from "axios";
import { getStoredToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Attach JWT token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error responses to a consistent shape
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err.response?.data?.message ?? err.message ?? "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
