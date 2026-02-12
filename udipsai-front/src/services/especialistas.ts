import api from "../api/api";

export interface EspecialistaCriteria {
  search?: string;
  especialidadId?: number;
  sedeId?: number;
  activo?: boolean;
}

export const especialistasService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/especialistas/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al obtener especialistas activos:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: EspecialistaCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ) => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/especialistas/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar especialistas:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/especialistas/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error al obtener especialista:", error);
      throw error;
    }
  },

  crear: async (data: any, file?: File) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (file) {
        formData.append("file", file);
      }

      const response = await api.post("/especialistas", formData);
      return response.data;
    } catch (error) {
      console.error("Error al crear especialista:", error);
      throw error;
    }
  },

  actualizar: async (id: number | string, data: any, file?: File) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (file) {
        formData.append("file", file);
      }

      const response = await api.put(`/especialistas/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar especialista:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/especialistas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar especialista:", error);
      throw error;
    }
  },

  buscar: async (
    search?: string,
    especialidadId?: number | string,
    sedeId?: number | string
  ) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (especialidadId)
        params.append("especialidadId", String(especialidadId));
      if (sedeId) params.append("sedeId", String(sedeId));

      const response = await api.get(
        `/especialistas/buscar?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al buscar especialistas:", error);
      throw error;
    }
  },

  obtenerFoto: async (filename: string) => {
    try {
      const response = await api.get(`/especialistas/foto/${filename}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener foto:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: EspecialistaCriteria) => {
    try {
      const response = await api.get("/especialistas/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel de especialistas:", error);
      throw error;
    }
  },
};
