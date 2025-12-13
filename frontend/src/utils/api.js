// utils/api.js ya lib/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,    // ← cookie jayegi har request mein
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token se naya accessToken le aao
                await axios.get("http://localhost:4000/api/auth/refresh-token", {
                    withCredentials: true
                });

                // Purani request dobara bhejo
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh bhi fail → user ko logout ho gaya
                // useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;