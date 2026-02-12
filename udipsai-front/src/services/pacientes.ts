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

export type Paciente = {
  id: number;
  nombresApellidos: string;
  fechaNacimiento: string;
  genero: string;
  documento: string;
  tipoDocumento: string;
  telefono: string;
  correo: string;
  direccion: string;
  ciudad: string;
  sedeId: number;
  institucionEducativaId: number;
  activo: boolean;
};

export interface PacienteCriteria {
  search?: string;
  ciudad?: string;
  activo?: boolean;
  sedeId?: number;
  institucionEducativaId?: number;
  id?: number;
}

export const pacientesService = {
  listarActivos: async (
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ): Promise<PageResponse<any>> => {
    try {
      const params = { page, size, sort };
      const response = await api.get("/pacientes/activos", { params });
      return response.data;
    } catch (error) {
      console.error("Error al listar pacientes activos:", error);
      throw error;
    }
  },

  filtrar: async (
    criteria: PacienteCriteria,
    page: number = 0,
    size: number = 10,
    sort: string = "id,desc"
  ): Promise<PageResponse<any>> => {
    try {
      const params = { ...criteria, page, size, sort };
      const response = await api.get("/pacientes/filter", { params });
      return response.data;
    } catch (error) {
      console.error("Error al filtrar pacientes:", error);
      throw error;
    }
  },

  crear: async (
    data: any,
    file?: File,
    fichaCompromiso?: File,
    fichaDeteccion?: File,
    otrosDocumentos?: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );
      if (file) {
        formData.append("file", file);
      }
      if (fichaCompromiso) {
        formData.append("fichaCompromiso", fichaCompromiso);
      }
      if (fichaDeteccion) {
        formData.append("fichaDeteccion", fichaDeteccion);
      }
      if (otrosDocumentos) {
        otrosDocumentos.forEach((f) => formData.append("otrosDocumentos", f));
      }

      const response = await api.post("/pacientes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear paciente:", error);
      throw error;
    }
  },

  actualizar: async (
    id: number | string,
    data: any,
    file?: File,
    fichaCompromiso?: File,
    fichaDeteccion?: File,
    otrosDocumentos?: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
      );

      if (file) {
        formData.append("file", file);
      }
      if (fichaCompromiso) {
        formData.append("fichaCompromiso", fichaCompromiso);
      }
      if (fichaDeteccion) {
        formData.append("fichaDeteccion", fichaDeteccion);
      }
      if (otrosDocumentos) {
        otrosDocumentos.forEach((f) => formData.append("otrosDocumentos", f));
      }

      const response = await api.put(`/pacientes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al actualizar paciente:", error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener paciente:", error);
      throw error;
    }
  },

  obtenerFoto: async (filename: string) => {
    try {
      const response = await api.get(`/pacientes/foto/${filename}`, {
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
      const response = await api.delete(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      throw error;
    }
  },

  obtenerResumenFichas: async (id: number | string) => {
    try {
      const response = await api.get(`/pacientes/${id}/resumen-fichas`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener resumen fichas:", error);
      throw error;
    }
  },

  exportarExcel: async (criteria: PacienteCriteria): Promise<Blob> => {
    try {
      const response = await api.get("/pacientes/export/excel", {
        params: criteria,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      throw error;
    }
  },

  exportarPdf: async (id: number | string): Promise<Blob> => {
    try {
      const response = await api.get(`/pacientes/${id}/export/pdf`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      throw error;
    }
  },

  descargarDocumento: async (id: number | string): Promise<Blob> => {
    try {
      const response = await api.get(`/pacientes/documentos/${id}`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al descargar documento:", error);
      throw error;
    }
  },

  eliminarDocumento: async (id: number | string) => {
    try {
      const response = await api.delete(`/pacientes/documentos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      throw error;
    }
  },
};
