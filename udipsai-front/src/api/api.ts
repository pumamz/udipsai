import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api',
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType');
    if (accessToken && tokenType) {
      config.headers.Authorization = `${tokenType} ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    const isAuthRequest = originalConfig.url?.includes("/auth/login") || originalConfig.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !isAuthRequest && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            return api(originalConfig);
          })
          .catch((err) => Promise.reject(err));
      }

      originalConfig._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No hay refresh token");

        const rs = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = rs.data;
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        return api(originalConfig);
      } catch (_error) {
        processQueue(_error, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
        return Promise.reject(_error);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status !== 401) {
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        console.log(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
