import api from "../api/api";

export interface SedeCriteria {
  search?: string;
  activo?: boolean;
}

export const sedesService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/sedes/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener sedes activas:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: SedeCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/sedes/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar sedes:", error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post("/sedes", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear sede:", error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/sedes/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar sede:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/sedes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar sede:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/sedes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener sede:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: SedeCriteria) => {
    try {
      const response = await api.get("/sedes/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel de sedes:", error);
      throw error;
    }
  },
};
