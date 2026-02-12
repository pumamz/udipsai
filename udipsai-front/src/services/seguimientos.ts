import api from "../api/api";

export interface SeguimientoDTO {
  id: number;
  especialista: { 
    id: number; 
    nombresApellidos: string; 
    especialidad: any; 
  };
  paciente: { id: number; nombresApellidos: string };
  fecha: string;
  observacion: string;
  activo: boolean;
  documento?: { id: number; nombre: string; url: string };
}

export interface SeguimientoRequest {
  especialistaId: number;
  pacienteId: number;
  fecha: string;
  observacion: string;
  documentoId?: number;
}

export const seguimientosService = {
  listar: async () => {
    try {
      const response = await api.get("/seguimientos");
      return response.data;
    } catch (error) {
      console.error("Error al listar seguimientos:", error);
      throw error;
    }
  },

  listarPorPaciente: async (id: number | string) => {
    try {
      const response = await api.get(`/seguimientos/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener seguimientos del paciente:", error);
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

      const response = await api.post("/seguimientos", formData);
      return response.data;
    } catch (error) {
      console.error("Error al crear seguimiento:", error);
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

      const response = await api.put(`/seguimientos/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/seguimientos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar seguimiento:", error);
      throw error;
    }
  },
};
