import api from "../api/api";

export interface Recurso {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: "test" | "juego";
  archivo: string;
  fechaSubida?: string;
}

const LOCAL_STORAGE_KEY = "udipsai_recursos";

const generateId = () => Date.now();

export const recursosService = {
  getRecursos: async (): Promise<Recurso[]> => {
    try {
      const response = await api.get("/recursos", {
        // @ts-ignore
        skipErrorHandler: true,
      });
      const data = response.data as any[];
      if (data && Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id || generateId(),
          titulo: item.titulo || item.nombre || item.title || "Sin Título",
          descripcion: item.descripcion || item.description || "",
          tipo: item.tipo || item.type || "juego",
          archivo:
            item.archivo ||
            item.archivoUrl ||
            item.url ||
            item.file ||
            item.fileName ||
            item.ruta ||
            "",
          fechaSubida: item.fechaSubida || new Date().toISOString(),
        }));
      }
      throw new Error("Invalid backend data");
    } catch (error) {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }
  },

  subirRecurso: async (formData: FormData): Promise<Recurso> => {
    try {
      const response = await api.post("/recursos/subir", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // @ts-ignore
        skipErrorHandler: true,
      });
      return response.data as Recurso;
    } catch (error) {
      console.warn(
        "API /recursos/subir fail. Simulating upload in LocalStorage.",
        error
      );

      const titulo = (formData.get("titulo") as string) || "Sin título";
      const descripcion = (formData.get("descripcion") as string) || "";
      const tipo = (formData.get("tipo") as "test" | "juego") || "juego";
      const archivoFile = formData.get("archivo") as File;

      let archivoNombre = "archivo_demo.zip";
      if (archivoFile && archivoFile.name) {
        archivoNombre = `${Date.now()}-${archivoFile.name}`;
      } else if (typeof archivoFile === "string") {
        archivoNombre = archivoFile;
      }

      const newRecurso: Recurso = {
        id: generateId(),
        titulo,
        descripcion,
        tipo,
        archivo: archivoNombre,
        fechaSubida: new Date().toISOString(),
      };

      const current = await recursosService.getRecursos();

      const updated = [newRecurso, ...current];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

      return newRecurso;
    }
  },

  eliminarRecurso: async (id: number): Promise<void> => {
    try {
      await api.delete(`/recursos/${id}`, {
        // @ts-ignore
        skipErrorHandler: true,
      });
    } catch (error) {
      console.warn("API Delete fail. Trying LocalStorage.", error);

      const current = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"
      ) as Recurso[];
      const updated = current.filter((r) => r.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  reemplazarArchivo: async (id: number, formData: FormData): Promise<void> => {
    try {
      await api.put(`/recursos/reemplazar/${id}`, formData, {
        // @ts-ignore
        skipErrorHandler: true,
      });
    } catch (error) {
      console.warn(
        "API Replace fail. Ignoring for LocalStorage mock (complexity).",
        error
      );
    }
  },
};
