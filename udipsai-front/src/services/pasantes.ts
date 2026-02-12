import api from "../api/api";

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
}

export interface PasanteCriteria {
  search?: string;
  ciudad?: string;
  activo?: boolean;
  especialidadId?: number;
  especialistaId?: number;
  sedeId?: number;
}

export const pasantesService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ): Promise<PageResponse<any>> => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/pasantes/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al listar pasantes activos:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: PasanteCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ): Promise<PageResponse<any>> => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/pasantes/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar pasantes:", error);
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

      const response = await api.post("/pasantes", formData);
      return response.data;
    } catch (error) {
      console.error("Error al crear pasante:", error);
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

      const response = await api.put(`/pasantes/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar pasante:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/pasantes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pasante:", error);
      throw error;
    }
  },

  buscar: async (search?: string, tutorId?: number | string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (tutorId) params.append("tutorId", String(tutorId));

      const response = await api.get(`/pasantes/buscar?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error al buscar pasantes:", error);
      throw error;
    }
  },

  obtenerFoto: async (filename: string) => {
    try {
      const response = await api.get(`/pasantes/fotos/${filename}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener foto:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/pasantes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar pasante:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: PasanteCriteria) => {
    try {
      const response = await api.get("/pasantes/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel de pasantes:", error);
      throw error;
    }
  },

  exportarPdf: async (id: number | string) => {
    try {
      const response = await api.get(`/pasantes/${id}/export/pdf`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar PDF de pasante:", error);
      throw error;
    }
  },
};
