import api from "../api/api";

export const evaluacionesService = {
  listar: async () => {
    try {
      const response = await api.get("/evaluaciones");
      return response.data;
    } catch (error) {
      console.error("Error al listar evaluaciones:", error);
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

      const response = await api.post("/evaluaciones", formData);
      return response.data;
    } catch (error) {
      console.error("Error al crear evaluación:", error);
      throw error;
    }
  },

  listarPorPaciente: async (id: number | string) => {
    try {
      const response = await api.get(`/evaluaciones/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener evaluaciones del paciente:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/evaluaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar evaluación:", error);
      throw error;
    }
  },

  descargar: async (id: number | string) => {
    try {
      const response = await api.get(`/evaluaciones/${id}/descargar`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error al descargar evaluación:", error);
      throw error;
    }
  },
};
