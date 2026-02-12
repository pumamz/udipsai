import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { useNavigate } from "react-router";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import Button from "../ui/button/Button";
import { pacientesService } from "../../services/pacientes";
import { FileText, Plus, Eye, Pen, Trash, Download } from "lucide-react";
import { toast } from "react-toastify";
import Badge from "../ui/badge/Badge";
import { useAuth } from "../../context/AuthContext";
import { fichasService } from "../../services/fichas";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { HistoriaClinicaViewModal } from "./HistoriaClinicaViewModal";
import { PsicologiaEducativaViewModal } from "./PsicologiaEducativaViewModal";
import { PsicologiaClinicaViewModal } from "./PsicologiaClinicaViewModal";
import { FonoaudiologiaViewModal } from "./FonoaudiologiaViewModal";

interface Paciente {
  id: number;
  nombresApellidos: string;
}

interface FichaResumen {
  totalFichas: number;
  fichas: Record<string, number>;
}

interface PatientFichasModalProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

const FILE_TYPES = [
  {
    id: "historia-clinica",
    label: "Historia Clínica",
    internalName: "Historia Clínica",
    type: "ficha",
    permissions: {
      create: "PERM_HISTORIA_CLINICA_CREAR",
      edit: "PERM_HISTORIA_CLINICA_EDITAR",
      delete: "PERM_HISTORIA_CLINICA_ELIMINAR",
      view: "PERM_HISTORIA_CLINICA",
    },
  },
  {
    id: "psicologia-educativa",
    label: "Psicología Educativa",
    internalName: "Psicología Educativa",
    type: "ficha",
    permissions: {
      create: "PERM_PSICOLOGIA_EDUCATIVA_CREAR",
      edit: "PERM_PSICOLOGIA_EDUCATIVA_EDITAR",
      delete: "PERM_PSICOLOGIA_EDUCATIVA_ELIMINAR",
      view: "PERM_PSICOLOGIA_EDUCATIVA",
    },
  },
  {
    id: "psicologia-clinica",
    label: "Psicología Clínica",
    internalName: "Psicología Clínica",
    type: "ficha",
    permissions: {
      create: "PERM_PSICOLOGIA_CLINICA_CREAR",
      edit: "PERM_PSICOLOGIA_CLINICA_EDITAR",
      delete: "PERM_PSICOLOGIA_CLINICA_ELIMINAR",
      view: "PERM_PSICOLOGIA_CLINICA",
    },
  },
  {
    id: "fonoaudiologia",
    label: "Fonoaudiología",
    internalName: "Fonoaudiología",
    type: "ficha",
    permissions: {
      create: "PERM_FONOAUDIOLOGIA_CREAR",
      edit: "PERM_FONOAUDIOLOGIA_EDITAR",
      delete: "PERM_FONOAUDIOLOGIA_ELIMINAR",
      view: "PERM_FONOAUDIOLOGIA",
    },
  },
  {
    id: "ficha-compromiso",
    label: "Ficha de Compromiso",
    internalName: "Ficha Compromiso",
    type: "documento",
    permissions: {
      create: "PERM_PACIENTES_EDITAR",
      edit: "PERM_PACIENTES_EDITAR",
      delete: "PERM_PACIENTES_ELIMINAR",
      view: "PERM_PACIENTES",
    },
  },
  {
    id: "ficha-deteccion",
    label: "Ficha de Detección",
    internalName: "Ficha Detección",
    type: "documento",
    permissions: {
      create: "PERM_PACIENTES_EDITAR",
      edit: "PERM_PACIENTES_EDITAR",
      delete: "PERM_PACIENTES_ELIMINAR",
      view: "PERM_PACIENTES",
    },
  },
];

export const PatientFichasModal: React.FC<PatientFichasModalProps> = ({
  isOpen,
  onClose,
  paciente,
}) => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<FichaResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    type: string;
    fileType: string;
    label: string;
  } | null>(null);

  const [viewHistoriaModalOpen, setViewHistoriaModalOpen] = useState(false);
  const [viewEduModalOpen, setViewEduModalOpen] = useState(false);
  const [viewClinicaModalOpen, setViewClinicaModalOpen] = useState(false);
  const [viewFonoModalOpen, setViewFonoModalOpen] = useState(false);

  const fetchResumen = async () => {
    if (!paciente) return;
    try {
      setLoading(true);
      const data = await pacientesService.obtenerResumenFichas(paciente.id);
      setResumen(data);
    } catch (error) {
      console.error("Error al obtener resumen de fichas:", error);
      toast.error("Error al cargar el resumen de fichas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && paciente) {
      fetchResumen();
    }
  }, [isOpen, paciente]);

  if (!paciente) return null;

  const getFileStatus = (internalName: string) => {
    return (
      resumen?.fichas &&
      resumen.fichas[internalName] !== undefined
    );
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "documento") {
        await pacientesService.eliminarDocumento(itemToDelete.id);
        toast.success(`${itemToDelete.label} eliminada`);
      } else {
        switch (itemToDelete.fileType) {
          case "historia-clinica":
            await fichasService.eliminarHistoriaClinica(itemToDelete.id);
            break;
          case "psicologia-educativa":
            await fichasService.eliminarPsicologiaEducativa(itemToDelete.id);
            break;
          case "psicologia-clinica":
            await fichasService.eliminarPsicologiaClinica(itemToDelete.id);
            break;
          case "fonoaudiologia":
            await fichasService.eliminarFonoaudiologia(itemToDelete.id);
            break;
          default:
            throw new Error("Tipo de ficha no reconocido");
        }
        toast.success(`Ficha de ${itemToDelete.label} eliminada`);
      }
      fetchResumen();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error al eliminar el elemento");
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAction = async (action: string, fileType: string, internalName: string, type: string, label: string) => {
    const fichaId = resumen?.fichas?.[internalName];

    if (action === "Crear") {
      if (type === "documento") {
          navigate(`/pacientes/editar/${paciente.id}`);
          toast.info("Por favor suba el documento en la edición del paciente");
      } else {
          try {
             navigate(`/fichas/${fileType}/nuevo?pacienteId=${paciente.id}`);
          } catch (e) {
             console.error(e);
             toast.error("Error al navegar a creación de ficha");
          }
      }
      onClose();
      return;
    }
    
    if (action === "Ver") {
      if (fileType === "historia-clinica") {
        setViewHistoriaModalOpen(true);
        return;
      }
      if (fileType === "psicologia-educativa") {
        setViewEduModalOpen(true);
        return;
      }
      if (fileType === "psicologia-clinica") {
        setViewClinicaModalOpen(true);
        return;
      }
      if (fileType === "fonoaudiologia") {
        setViewFonoModalOpen(true);
        return;
      }
      if (type === "documento") {
        return;
      }
    }
    
    if (action === "Exportar") {
        if (type === "documento" && fichaId) {
             try {
                const blob = await pacientesService.descargarDocumento(fichaId);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${internalName}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            } catch (error) {
                console.error("Error downloading document", error);
                toast.error("Error al descargar el documento");
            }
            return;
        }
        if (fileType === "fonoaudiologia") {
            try {
                toast.info("Generando reporte Excel...");
                await fichasService.exportarExcelFonoaudiologia(paciente.id);
                toast.success("Excel descargado correctamente");
            } catch (error) {
                toast.error("Error al exportar el Excel");
            }
            return;
        }
        if (fileType === "historia-clinica") {
            try {
                toast.info("Generando reporte Excel...");
                await fichasService.exportarExcelHistoriaClinica(paciente.id);
                toast.success("Excel descargado correctamente");
            } catch (error) {
                toast.error("Error al exportar el Excel");
            }
            return;
        }
        if (fileType === "psicologia-educativa") {
            try {
                toast.info("Generando reporte Excel...");
                await fichasService.exportarExcelPsicologiaEducativa(paciente.id);
                toast.success("Excel descargado correctamente");
            } catch (error) {
                toast.error("Error al exportar el Excel");
            }
            return;
        }
        if (fileType === "psicologia-clinica") {
            try {
                toast.info("Generando reporte Excel...");
                await fichasService.exportarExcelPsicologiaClinica(paciente.id);
                toast.success("Excel descargado correctamente");
            } catch (error) {
                toast.error("Error al exportar el Excel");
            }
            return;
        }
    }

    if (action === "Eliminar") {
        if (fichaId) {
            setItemToDelete({ id: fichaId, type, fileType, label });
            setDeleteModalOpen(true);
        }
        return;
    }

    if (action === "Editar") {
      if (fichaId) {
        if (type === "documento") {
             navigate(`/pacientes/editar/${paciente.id}`);
             onClose();
             return;
        }
        navigate(`/fichas/${fileType}/editar/${paciente.id}`);
        onClose();
      } else {
        toast.error("No se pudo obtener el ID de la ficha");
      }
      return;
    }
    toast.info(`${action}: Funcionalidad en desarrollo para ${fileType}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Fichas de {paciente.nombresApellidos}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Resumen de documentos clínicos vinculados al paciente
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse text-lg">
            Cargando resumen de fichas...
          </p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Tipo de Ficha
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FILE_TYPES.map((file) => {
                const exists = getFileStatus(file.internalName);
                const isDocument = file.type === "documento";
                return (
                  <TableRow key={file.id}>
                    <TableCell className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-400" />
                        {file.label}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge color={exists ? "success" : "warning"}>
                        {exists ? (isDocument ? "Subido" : "Completada") : (isDocument ? "Sin subir" : "Pendiente")}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {exists ? (
                          <>
                            {!isDocument && hasPermission(file.permissions.view) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Ver", file.id, file.internalName, file.type, file.label)}
                                className="hover:bg-white hover:text-blue-600 p-2 text-dark dark:text-white-400 dark:hover:text-blue-600"
                                title="Ver"
                              >
                                <Eye size={14} />
                              </Button>
                            )}
                            {hasPermission(file.permissions.edit) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Editar", file.id, file.internalName, file.type, file.label)}
                                className="hover:bg-white hover:text-yellow-600 p-2 text-dark dark:text-white-400 dark:hover:text-yellow-600"
                                title="Editar"
                              >
                                <Pen size={14} />
                              </Button>
                            )}
                            
                            {hasPermission(file.permissions.view) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Exportar", file.id, file.internalName, file.type, file.label)}
                                className="hover:bg-white hover:text-green-600 p-2 text-dark dark:text-white-400 dark:hover:text-green-600"
                                title="Exportar"
                              >
                                <Download size={14} />
                              </Button>
                            )}
                            
                            {hasPermission(file.permissions.delete) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction("Eliminar", file.id, file.internalName, file.type, file.label)}
                                className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400 dark:hover:text-red-400"
                                title="Eliminar"
                              >
                                <Trash size={14} />
                              </Button>
                            )}
                          </>
                        ) : (
                          hasPermission(file.permissions.create) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction("Crear", file.id, file.internalName, file.type, file.label)}
                              className="hover:bg-white hover:text-green-600 p-2 text-dark dark:text-white-400 dark:hover:text-green-600"
                            >
                              <Plus size={14} />
                              {isDocument ? "Subir documento" : "Crear ficha"}
                            </Button>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {resumen?.fichas && Object.entries(resumen.fichas)
                .filter(([name]) => !FILE_TYPES.some(ft => ft.internalName === name))
                .map(([name, id]) => (
                  <TableRow key={`extra-${id}`}>
                    <TableCell className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-400" />
                        {name}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Badge color="success">Subido</Badge>
                    </TableCell> 
                    <TableCell className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("Exportar", "extra", name, "documento", name)}
                          className="hover:bg-white hover:text-green-600 p-2 text-dark dark:text-white-400 dark:hover:text-green-600"
                          title="Descargar"
                        >
                          <Download size={14} />
                        </Button>
                        {hasPermission("PERM_PACIENTES_ELIMINAR") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction("Eliminar", "extra", name, "documento", name)}
                            className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400 dark:hover:text-red-400"
                            title="Eliminar"
                          >
                            <Trash size={14} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={`Eliminar ${itemToDelete?.label}`}
        description={`¿Estás seguro de que deseas eliminar ${itemToDelete?.label.toLowerCase()}? Esta acción no se puede deshacer.`}
      />

      {viewHistoriaModalOpen && (
        <HistoriaClinicaViewModal
          isOpen={viewHistoriaModalOpen}
          onClose={() => setViewHistoriaModalOpen(false)}
          pacienteId={paciente.id}
        />
      )}
      {viewEduModalOpen && (
        <PsicologiaEducativaViewModal
          isOpen={viewEduModalOpen}
          onClose={() => setViewEduModalOpen(false)}
          pacienteId={paciente.id}
        />
      )}
      {viewClinicaModalOpen && (
        <PsicologiaClinicaViewModal
          isOpen={viewClinicaModalOpen}
          onClose={() => setViewClinicaModalOpen(false)}
          pacienteId={paciente.id}
        />
      )}
      {viewFonoModalOpen && (
        <FonoaudiologiaViewModal
          isOpen={viewFonoModalOpen}
          onClose={() => setViewFonoModalOpen(false)}
          pacienteId={paciente.id}
        />
      )}
    </Modal>
  );
};
