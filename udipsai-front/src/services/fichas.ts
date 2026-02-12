import api from "../api/api";

export const fichasService = {
  // Historial de cambios
  obtenerHistorial: async (id: number | string) => {
    try {
      const response = await api.get(`/historial-cambios/listar/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener historial:", error);
      throw error;
    }
  },

  // Historia Clínica
  listarHistoriaClinica: async () => {
    try {
      const response = await api.get("/historia-clinica");
      return response.data;
    } catch (error) {
      console.error("Error al listar historia clínica:", error);
      throw error;
    }
  },

  crearHistoriaClinica: async (data: any, genograma?: File) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (genograma) {
        formData.append("genograma", genograma);
      }

      const response = await api.post("/historia-clinica", formData);
      return response.data;
    } catch (error) {
      console.error("Error al crear historia clínica:", error);
      throw error;
    }
  },

  actualizarHistoriaClinica: async (
    id: number | string,
    data: any,
    genograma?: File
  ) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (genograma) {
        formData.append("genograma", genograma);
      }

      const response = await api.put(`/historia-clinica/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar historia clínica:", error);
      throw error;
    }
  },

  obtenerHistoriaClinica: async (id: number | string) => {
    try {
      const response = await api.get(`/historia-clinica/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener historia clínica:", error);
      throw error;
    }
  },

  obtenerGenograma: async (pacienteId: number | string) => {
    try {
      const response = await api.get(
        `/historia-clinica/paciente/${pacienteId}/genograma`,
        {
          responseType: "blob",
        }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener genograma:", error);
      throw error;
    }
  },

  eliminarHistoriaClinica: async (id: number | string) => {
    try {
      const response = await api.delete(`/historia-clinica/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar historia clínica:", error);
      throw error;
    }
  },

  // Psicología Educativa
  listarPsicologiaEducativa: async () => {
    try {
      const response = await api.get("/psicologia-educativa");
      return response.data;
    } catch (error) {
      console.error("Error al listar psicología educativa:", error);
      throw error;
    }
  },

  crearPsicologiaEducativa: async (request: any) => {
    try {
      const response = await api.post("/psicologia-educativa", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear psicología educativa:", error);
      throw error;
    }
  },

  obtenerPsicologiaEducativa: async (id: number | string) => {
    try {
      const response = await api.get(`/psicologia-educativa/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener psicología educativa:", error);
      throw error;
    }
  },

  actualizarPsicologiaEducativa: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/psicologia-educativa/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar psicología educativa:", error);
      throw error;
    }
  },

  eliminarPsicologiaEducativa: async (id: number | string) => {
    try {
      const response = await api.delete(`/psicologia-educativa/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar psicología educativa:", error);
      throw error;
    }
  },

  // Psicología Clínica
  listarPsicologiaClinica: async () => {
    try {
      const response = await api.get("/psicologia-clinica");
      return response.data;
    } catch (error) {
      console.error("Error al listar psicología clínica:", error);
      throw error;
    }
  },

  crearPsicologiaClinica: async (request: any) => {
    try {
      const response = await api.post("/psicologia-clinica", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear psicología clínica:", error);
      throw error;
    }
  },

  obtenerPsicologiaClinica: async (id: number | string) => {
    try {
      const response = await api.get(`/psicologia-clinica/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener psicología clínica:", error);
      throw error;
    }
  },

  actualizarPsicologiaClinica: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/psicologia-clinica/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar psicología clínica:", error);
      throw error;
    }
  },

  eliminarPsicologiaClinica: async (id: number | string) => {
    try {
      const response = await api.delete(`/psicologia-clinica/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar psicología clínica:", error);
      throw error;
    }
  },

  // Fonoaudiología
  listarFonoaudiologia: async () => {
    try {
      const response = await api.get("/fonoaudiologia");
      return response.data;
    } catch (error) {
      console.error("Error al listar fonoaudiología:", error);
      throw error;
    }
  },

  crearFonoaudiologia: async (request: any) => {
    try {
      const response = await api.post("/fonoaudiologia", request);
      return response.data;
    } catch (error) {
      console.error("Error al crear fonoaudiología:", error);
      throw error;
    }
  },

  obtenerFonoaudiologia: async (id: number | string) => {
    try {
      const response = await api.get(`/fonoaudiologia/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener fonoaudiología:", error);
      throw error;
    }
  },

  actualizarFonoaudiologia: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/fonoaudiologia/${id}`, request);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar fonoaudiología:", error);
      throw error;
    }
  },

  eliminarFonoaudiologia: async (id: number | string) => {
    try {
      const response = await api.delete(`/fonoaudiologia/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar fonoaudiología:", error);
      throw error;
    }
  },

  exportarExcelFonoaudiologia: async (pacienteId?: number | string) => {
    try {
      const response = await api.get("/fonoaudiologia/export/excel", {
        params: { pacienteId },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = pacienteId 
        ? `ficha_fonoaudiologia_${pacienteId}.xlsx` 
        : "fichas_fonoaudiologia.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar Excel de fonoaudiología:", error);
      throw error;
    }
  },

  exportarExcelHistoriaClinica: async (pacienteId?: number | string) => {
    try {
      const response = await api.get("/historia-clinica/export/excel", {
        params: { pacienteId },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = pacienteId 
        ? `historia_clinica_${pacienteId}.xlsx` 
        : "historias_clinicas.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar Excel Historia Clínica:", error);
      throw error;
    }
  },

  exportarExcelPsicologiaEducativa: async (pacienteId?: number | string) => {
    try {
      const response = await api.get("/psicologia-educativa/export/excel", {
        params: { pacienteId },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = pacienteId 
        ? `psicologia_educativa_${pacienteId}.xlsx` 
        : "fichas_psicologia_educativa.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar Excel Psicología Educativa:", error);
      throw error;
    }
  },

  exportarExcelPsicologiaClinica: async (pacienteId?: number | string) => {
    try {
      const response = await api.get("/psicologia-clinica/export/excel", {
        params: { pacienteId },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const filename = pacienteId 
        ? `psicologia_clinica_${pacienteId}.xlsx` 
        : "fichas_psicologia_clinica.xlsx";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar Excel Psicología Clínica:", error);
      throw error;
    }
  },
};
