import { useEffect, useState } from "react";
import { Trash, RefreshCw, FileText, Gamepad2, Info } from "lucide-react";
import { toast } from "react-toastify";

import PageMeta from "../../components/common/PageMeta";
import { TableActionHeader } from "../../components/common/TableActionHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Modal } from "../../components/ui/modal";
import { DeleteModal } from "../../components/ui/modal/DeleteModal";
import { Recurso, recursosService } from "../../services";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { useAuth } from "../../context/AuthContext";

export default function SubirRecursos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "test",
    archivo: null as File | null,
  });

  const {
    isOpen: isUploadModalOpen,
    openModal: openUploadModal,
    closeModal: closeUploadModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isReplaceModalOpen,
    openModal: openReplaceModal,
    closeModal: closeReplaceModal,
  } = useModal();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await recursosService.getRecursos();
      setRecursos(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los recursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.archivo) {
      toast.warn("Faltan datos obligatorios");
      return;
    }

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("descripcion", formData.descripcion);
    data.append("tipo", formData.tipo);
    data.append("archivo", formData.archivo);

    try {
      await recursosService.subirRecurso(data);
      toast.success("Recurso subido correctamente");
      closeUploadModal();
      setFormData({ titulo: "", descripcion: "", tipo: "test", archivo: null });
      loadResources();
    } catch (e) {
      toast.error("No se pudo subir el archivo");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRecurso) {
      try {
        await recursosService.eliminarRecurso(selectedRecurso.id);
        toast.success("Recurso eliminado correctamente");
        closeDeleteModal();
        loadResources();
      } catch (e) {
        toast.error("No se pudo eliminar el recurso");
      }
    }
  };

  const handleConfirmReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecurso || !formData.archivo) {
      toast.warn("Debe seleccionar un archivo");
      return;
    }

    const data = new FormData();
    data.append("archivo", formData.archivo);

    try {
      await recursosService.reemplazarArchivo(selectedRecurso.id, data);
      toast.success("Archivo reemplazado correctamente");
      closeReplaceModal();
      setFormData({ ...formData, archivo: null });
      loadResources();
    } catch (e) {
      toast.error("No se pudo reemplazar el archivo");
    }
  };

  const openReplace = (recurso: Recurso) => {
    setSelectedRecurso(recurso);
    setFormData({ ...formData, archivo: null });
    openReplaceModal();
  };

  const openDelete = (recurso: Recurso) => {
    setSelectedRecurso(recurso);
    openDeleteModal();
  };

  if (loading && recursos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando recursos...
        </p>
      </div>
    );
  }

  const { permissions } = useAuth();

  return (
    <>
      <PageMeta
        title="Gestión de Recursos | UDIPSAI"
        description="Panel para subir y gestionar recursos de juegos y tests"
      />

      <TableActionHeader
        title="Gestor de Recursos"
        onNew={permissions.includes("PERM_RECURSOS_CREAR") ? openUploadModal : undefined}
        newButtonText="Subir Recurso"
        placeholder="Buscar recurso..."
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                >
                  Nombre del Recurso
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                >
                  Descripción
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                >
                  Tipo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-left text-theme-xs dark:text-gray-400"
                >
                  Archivo
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-right text-theme-xs dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recursos.length > 0 ? (
                recursos.map((r) => (
                  <TableRow
                    key={r.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell className="px-5 py-3 text-left text-theme-xs text-gray-700 dark:text-gray-300 font-medium">
                      {r.titulo}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-left text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="max-w-xs truncate" title={r.descripcion}>
                        {r.descripcion || "Sin descripción"}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                      <Badge
                        size="sm"
                        color={r.tipo === "test" ? "success" : "warning"}
                      >
                        {r.tipo === "test" ? (
                          <FileText size={12} className="mr-1" />
                        ) : (
                          <Gamepad2 size={12} className="mr-1" />
                        )}
                        {r.tipo.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-left text-theme-xs text-gray-700 dark:text-gray-300">
                      <span className="truncate max-w-[200px] block opacity-70">
                        {r.archivo}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right text-theme-xs text-gray-700 dark:text-gray-300">
                      <div className="flex justify-end gap-2">
                        {permissions.includes("PERM_RECURSOS_EDITAR") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReplace(r)}
                            className="hover:bg-white hover:text-blue-600 p-2"
                            title="Reemplazar"
                          >
                            <RefreshCw size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_RECURSOS_ELIMINAR") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDelete(r)}
                            className="hover:bg-red-500 hover:text-white p-2 text-red-600"
                            title="Eliminar"
                          >
                            <Trash size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-5 py-10 text-center text-theme-md text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-gray-400">
                        <Info size={30} strokeWidth={1} />
                      </span>
                      <p>No se encontraron recursos registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Subir Nuevo Recurso
          </h3>
          <form onSubmit={handleSubir} className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                placeholder="Ej: Test de Ansiedad"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                placeholder="Descripción breve"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                options={[
                  { value: "test", label: "Test (.exe/.pdf)" },
                  { value: "juego", label: "Juego (.zip)" },
                ]}
                value={formData.tipo}
                onChange={(val) => setFormData({ ...formData, tipo: val })}
              />
            </div>
            <div>
              <Label>Archivo</Label>
              <input
                type="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                onChange={(e) =>
                    setFormData({ ...formData, archivo: e.target.files?.[0] || null })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={closeUploadModal}>
                Cancelar
              </Button>
              <Button type="submit">Subir</Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isReplaceModalOpen} onClose={closeReplaceModal}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Reemplazar archivo
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Sustituyendo archivo para: <span className="font-semibold">{selectedRecurso?.titulo}</span>
          </p>
          <form onSubmit={handleConfirmReplace} className="space-y-4">
            <div>
              <Label>Nuevo Archivo</Label>
              <input
                type="file"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) =>
                    setFormData({ ...formData, archivo: e.target.files?.[0] || null })
                }
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={closeReplaceModal}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Reemplazar
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Recurso"
        description={`¿Estás seguro de que deseas eliminar el recurso "${selectedRecurso?.titulo}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
}
