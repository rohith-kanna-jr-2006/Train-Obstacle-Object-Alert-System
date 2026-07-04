import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach authentication token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().session.token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors, tokens, and retries
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Check if error is network issue or server down, and implement retry logic
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized (JWT expiration)
      if (status === 401 && originalRequest && !originalRequest.headers.get("X-Retry")) {
        originalRequest.headers.set("X-Retry", "true");
        
        try {
          // In production, call refresh token endpoint
          // const newToken = await refreshAuthToken();
          const newToken = "mock-refreshed-jwt-token";
          
          // Update store
          useAuthStore.setState((state) => ({
            session: {
              ...state.session,
              token: newToken,
            },
          }));

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
      
      // Handle general server errors (500, 502, 503, 504)
      if (status >= 500 && status <= 504) {
        originalRequest._retryCount = originalRequest._retryCount || 0;
        if (originalRequest._retryCount < 3) {
          originalRequest._retryCount += 1;
          const delay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
          return apiClient(originalRequest);
        }
      }
    } else {
      // Network Error (server offline)
      console.warn("API Server unreachable, activating offline fallback data.");
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
