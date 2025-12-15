// utils/api.js
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: false, // ❌ cookies nahi bhejni
});

/* =========================
   REQUEST INTERCEPTOR
   → accessToken header me
========================= */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   → 401 → refresh → retry
========================= */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar token expire hua
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // 🔄 Refresh token API call
        const res = await axios.post(
          `${API_BASE}/api/auth/refresh-token`,
          { refreshToken }
        );

        const { accessToken: newAccessToken } = res.data;

        // 🆕 Store new token
        localStorage.setItem("accessToken", newAccessToken);

        // 🔁 Header update + retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh bhi fail → force logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
