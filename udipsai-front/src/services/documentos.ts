import api from "../api/api";

export const documentosService = {
  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/documentos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener documento:", error);
      throw error;
    }
  },

  subirDocumento: async (
    pacienteId: number | string,
    file: File,
    nombre: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pacienteId", String(pacienteId));
      formData.append("nombre", nombre);

      const response = await api.post("/documentos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al subir documento:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/documentos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar documento:", error);
      throw error;
    }
  },

  descargar: async (id: number | string) => {
    try {
      const response = await api.get(`/documentos/${id}/descargar`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `documento_${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error al descargar documento:", error);
      throw error;
    }
  },
};
