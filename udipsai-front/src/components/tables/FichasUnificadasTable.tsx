import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash,
  FileText,
  Activity,
  Brain,
  Ear,
  Eye,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableLoading,
  TableEmpty,
} from "../ui/table";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { TableActionHeader } from "../common/TableActionHeader";

import { HistoriaClinicaViewModal } from "../modals/HistoriaClinicaViewModal";
import { PsicologiaEducativaViewModal } from "../modals/PsicologiaEducativaViewModal";
import { PsicologiaClinicaViewModal } from "../modals/PsicologiaClinicaViewModal";
import { FonoaudiologiaViewModal } from "../modals/FonoaudiologiaViewModal";

import { useAuth } from "../../context/AuthContext";
import { fichasService } from "../../services/fichas";

interface FichaListDTO {
  id: number;
  paciente: {
    id: number;
    nombresApellidos: string;
    cedula: string;
    email: string;
  };
  activo: boolean;
}

type TabKey =
  | "historia_clinica"
  | "psicologia_educativa"
  | "psicologia_clinica"
  | "fonoaudiologia";

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  fetch: () => Promise<FichaListDTO[]>;
  delete: (id: number) => Promise<void>;
  editPath: string;
  createPath: string;
  permEdit: string;
  permCreate: string;
  permDelete: string;
  permRead: string;
  title: string;
}

export default function FichasUnificadasTable() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const tabs: TabConfig[] = [
    {
      key: "historia_clinica",
      label: "Historia Clínica",
      icon: FileText,
      fetch: fichasService.listarHistoriaClinica,
      delete: fichasService.eliminarHistoriaClinica,
      editPath: "/fichas/historia-clinica/editar",
      createPath: "/fichas/historia-clinica/nuevo",
      permEdit: "PERM_HISTORIA_CLINICA_EDITAR",
      permCreate: "PERM_HISTORIA_CLINICA_CREAR",
      permDelete: "PERM_HISTORIA_CLINICA_ELIMINAR",
      permRead: "PERM_HISTORIA_CLINICA",
      title: "Historia Clínica",
    },
    {
      key: "psicologia_educativa",
      label: "Psicología Educativa",
      icon: Activity,
      fetch: fichasService.listarPsicologiaEducativa,
      delete: fichasService.eliminarPsicologiaEducativa,
      editPath: "/fichas/psicologia-educativa/editar",
      createPath: "/fichas/psicologia-educativa/nuevo",
      permEdit: "PERM_PSICOLOGIA_EDUCATIVA_EDITAR",
      permCreate: "PERM_PSICOLOGIA_EDUCATIVA_CREAR",
      permDelete: "PERM_PSICOLOGIA_EDUCATIVA_ELIMINAR",
      permRead: "PERM_PSICOLOGIA_EDUCATIVA",
      title: "Psicología Educativa",
    },
    {
      key: "psicologia_clinica",
      label: "Psicología Clínica",
      icon: Brain,
      fetch: fichasService.listarPsicologiaClinica,
      delete: fichasService.eliminarPsicologiaClinica,
      editPath: "/fichas/psicologia-clinica/editar",
      createPath: "/fichas/psicologia-clinica/nuevo",
      permEdit: "PERM_PSICOLOGIA_CLINICA_EDITAR",
      permCreate: "PERM_PSICOLOGIA_CLINICA_CREAR",
      permDelete: "PERM_PSICOLOGIA_CLINICA_ELIMINAR",
      permRead: "PERM_PSICOLOGIA_CLINICA",
      title: "Psicología Clínica",
    },
    {
      key: "fonoaudiologia",
      label: "Fonoaudiología",
      icon: Ear,
      fetch: fichasService.listarFonoaudiologia,
      delete: fichasService.eliminarFonoaudiologia,
      editPath: "/fichas/fonoaudiologia/editar",
      createPath: "/fichas/fonoaudiologia/nuevo",
      permEdit: "PERM_FONOAUDIOLOGIA_EDITAR",
      permCreate: "PERM_FONOAUDIOLOGIA_CREAR",
      permDelete: "PERM_FONOAUDIOLOGIA_ELIMINAR",
      permRead: "PERM_FONOAUDIOLOGIA",
      title: "Fonoaudiología",
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "historia_clinica";

  const [activeTabKey, setActiveTabKey] = useState<TabKey>(
    tabs.some((t) => t.key === initialTab) ? initialTab : "historia_clinica",
  );

  const [fichas, setFichas] = useState<FichaListDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fichaToDelete, setFichaToDelete] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(
    null,
  );
  const [viewHistoriaModalOpen, setViewHistoriaModalOpen] = useState(false);
  const [viewEduModalOpen, setViewEduModalOpen] = useState(false);
  const [viewClinicaModalOpen, setViewClinicaModalOpen] = useState(false);
  const [viewFonoModalOpen, setViewFonoModalOpen] = useState(false);

  const activeTab = tabs.find((t) => t.key === activeTabKey) || tabs[0];

  const handleTabChange = (key: TabKey) => {
    setActiveTabKey(key);
    setSearchParams({ tab: key });
  };

  useEffect(() => {
    loadFichas();
    setSearchTerm("");
  }, [activeTabKey]);

  const loadFichas = async () => {
    try {
      setLoading(true);
      const data = await activeTab.fetch();
      setFichas(data);
    } catch (error) {
      console.error(`Error loading fichas for ${activeTab.label}:`, error);
      toast.error(`Error al cargar las fichas de ${activeTab.label}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (id: number) => {
    navigate(`${activeTab.editPath}/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setFichaToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (fichaToDelete) {
      try {
        await activeTab.delete(fichaToDelete);
        toast.success("Ficha eliminada correctamente");
        loadFichas();
      } catch (error) {
        console.error("Error deleting ficha:", error);
        toast.error("Error al eliminar la ficha");
      } finally {
        setShowDeleteModal(false);
        setFichaToDelete(null);
      }
    }
  };

  const getEstadoBadge = (activo: boolean) => {
    return activo ? "success" : "error";
  };

  const handleViewClick = (pacienteId: number) => {
    setSelectedPacienteId(pacienteId);
    switch (activeTabKey) {
      case "historia_clinica":
        setViewHistoriaModalOpen(true);
        break;
      case "psicologia_educativa":
        setViewEduModalOpen(true);
        break;
      case "psicologia_clinica":
        setViewClinicaModalOpen(true);
        break;
      case "fonoaudiologia":
        setViewFonoModalOpen(true);
        break;
    }
  };

  const filteredFichas = fichas.filter((ficha) => {
    const searchLower = searchTerm.toLowerCase();

    const nombreCompleto = ficha.paciente?.nombresApellidos
      ? ficha.paciente.nombresApellidos.toLowerCase()
      : "";
    const cedula = ficha.paciente?.cedula
      ? ficha.paciente.cedula.toLowerCase()
      : "";

    return nombreCompleto.includes(searchLower) || cedula.includes(searchLower);
  });

  const handleExport = async () => {
    try {
      toast.info("Generando reporte Excel...");
      switch (activeTabKey) {
        case "fonoaudiologia":
          await fichasService.exportarExcelFonoaudiologia();
          break;
        case "historia_clinica":
          await fichasService.exportarExcelHistoriaClinica();
          break;
        case "psicologia_educativa":
          await fichasService.exportarExcelPsicologiaEducativa();
          break;
        case "psicologia_clinica":
          await fichasService.exportarExcelPsicologiaClinica();
          break;
        default:
          toast.warn("Exportación no disponible para esta pestaña");
          return;
      }
      toast.success("Excel descargado correctamente");
    } catch (error) {
      toast.error("Error al exportar el Excel");
    }
  };

  return (
    <div className="space-y-6">
      <TableActionHeader
        title={activeTab.title}
        onSearchClick={setSearchTerm}
        onNew={() => navigate(activeTab.createPath)}
        onExport={hasPermission(activeTab.permRead) ? handleExport : undefined}
        createPermission={activeTab.permCreate}
        newButtonText="Agregar"
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-200 text-sm font-medium
                  ${
                    isActive
                      ? "bg-brand-50 text-brand-600 border-b-2 border-brand-500 dark:bg-white/5 dark:text-brand-400"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                  }
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>Nombres del Paciente</TableCell>
                <TableCell isHeader>Cédula</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="relative min-h-[400px]">
              {loading ? (
                <TableLoading
                  colSpan={4}
                  message={`Cargando ${activeTab.label}...`}
                />
              ) : filteredFichas.length > 0 ? (
                filteredFichas.map((ficha) => (
                  <TableRow key={ficha.id}>
                    <TableCell>
                      {ficha.paciente?.nombresApellidos || "Sin Nombre"}
                    </TableCell>
                    <TableCell>{ficha.paciente?.cedula || "S/N"}</TableCell>
                    <TableCell>
                      <Badge size="sm" color={getEstadoBadge(ficha.activo)}>
                        {ficha.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {hasPermission(activeTab.permRead) && (
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleViewClick(ficha.paciente.id)}
                            title="Ver"
                          >
                            <Eye size={14} />
                          </Button>
                        )}
                        {hasPermission(activeTab.permEdit) && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEditClick(ficha.paciente.id)}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {hasPermission(activeTab.permDelete) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(ficha.id)}
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
                <TableEmpty
                  colSpan={4}
                  message={`No se encontraron registros de ${activeTab.label}`}
                />
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Confirmar Eliminación"
          description={`¿Está seguro que desea eliminar esta ficha de ${activeTab.label}? Esta acción no se puede deshacer.`}
        />

        {selectedPacienteId && (
          <>
            <HistoriaClinicaViewModal
              isOpen={viewHistoriaModalOpen}
              onClose={() => setViewHistoriaModalOpen(false)}
              pacienteId={selectedPacienteId}
            />
            <PsicologiaEducativaViewModal
              isOpen={viewEduModalOpen}
              onClose={() => setViewEduModalOpen(false)}
              pacienteId={selectedPacienteId}
            />
            <PsicologiaClinicaViewModal
              isOpen={viewClinicaModalOpen}
              onClose={() => setViewClinicaModalOpen(false)}
              pacienteId={selectedPacienteId}
            />
            <FonoaudiologiaViewModal
              isOpen={viewFonoModalOpen}
              onClose={() => setViewFonoModalOpen(false)}
              pacienteId={selectedPacienteId}
            />
          </>
        )}
      </div>
    </div>
  );
}
