// src/plugins/axios.ts
import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

// Create axios instance
// const api: AxiosInstance = axios.create({
//   baseURL: "http://localhost:8000", // Laravel backend
// });

const api: AxiosInstance = axios.create({
  baseURL: (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  // headers: {
  //   "Accept": "application/json",
  //   "Content-Type": "application/json",
  // },
});

// Function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Function to set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

export default api;

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('401 Unauthorized - clearing auth token');
      removeAuthToken();
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
