// utils/api.js ya lib/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://api.ommdocumentation.com",
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
                console.log("i am up")
                // Refresh token se naya accessToken le aao
                await axios.get("http://api.ommdocumentation.com/api/auth/refresh-token", {
                    withCredentials: true
                });
                console.log("i am refresh frontend")
                // Purani request dobara bhejo
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh bhi fail → user ko logout ho gaya
                useAuthStore.getState().logout();
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;