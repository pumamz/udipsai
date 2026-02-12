import api from "../api/api";

export interface EspecialidadCriteria {
  search?: string;
  activo?: boolean;
}

export const especialidadesService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/especialidades/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener especialidades activas:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: EspecialidadCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/especialidades/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar especialidades:", error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post("/especialidades", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear especialidad:", error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/especialidades/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar especialidad:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/especialidades/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/especialidades/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener especialidad:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: EspecialidadCriteria) => {
    try {
      const response = await api.get("/especialidades/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel de especialidades:", error);
      throw error;
    }
  },
};
