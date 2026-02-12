import api from "../api/api";

export const asignacionesService = {
  listar: async () => {
    try {
      const response = await api.get("/asignaciones");
      return response.data;
    } catch (error) {
      console.error("Error al listar asignaciones:", error);
      throw error;
    }
  },

  obtenerPorPasante: async (id: number | string) => {
    try {
      const response = await api.get(`/asignaciones/pasante/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener asignaciones del pasante:", error);
      throw error;
    }
  },

  crear: async (pacienteIds: number[], pasanteId: number | string) => {
    try {
      const response = await api.post("/asignaciones", {
        pacienteIds,
        pasanteId,
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear asignación:", error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/asignaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar asignación:", error);
      throw error;
    }
  },
};
