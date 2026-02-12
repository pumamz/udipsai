import api from "../api/api";

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken, tokenType, refreshToken } = response.data;
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("tokenType", tokenType || "Bearer");
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      return response.data;
    } catch (error) {
      throw new Error("Error al iniciar sesión");
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("refreshToken");
    window.location.href = "/signin";
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  },
};
