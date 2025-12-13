// utils/api.js
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
    baseURL: "https://api.ommdocumentation.com/api",
    withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // 🔥 Use SAME axios instance
                await api.get("/auth/refresh-token");

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // useAuthStore.getState().logout();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
