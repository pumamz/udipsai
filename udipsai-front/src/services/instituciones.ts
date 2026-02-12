import api from "../api/api";

export interface InstitucionEducativaCriteria {
  search?: string;
  activo?: boolean;
}

export const institucionesService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/instituciones/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener instituciones activas:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: InstitucionEducativaCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/instituciones/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar instituciones:", error);
      throw error;
    }
  },

  listar: async () => {
    try {
      const response = await api.get("/instituciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener instituciones:", error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post("/instituciones", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear institución:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/instituciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener institución:", error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/instituciones/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar institución:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/instituciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar institución:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: InstitucionEducativaCriteria) => {
    try {
      const response = await api.get("/instituciones/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel de instituciones:", error);
      throw error;
    }
  },
};
