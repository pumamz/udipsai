import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableLoading,
  TableEmpty,
} from "../ui/table";
import { Pen, Trash, UserPlus, Info } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { toast } from "react-toastify";
import { PasanteCriteria, pasantesService } from "../../services/pasantes";
import Button from "../ui/button/Button";
import { Pagination } from "../ui/Pagination";

import { useModal } from "../../hooks/useModal";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { especialistasService, sedesService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { AsignacionesModal } from "../modals/AsignacionesModal";
import { especialidadesService } from "../../services/especialidades";
import { PasanteDetalleModal } from "../modals/PasanteDetalleModal";

interface Pasante {
  id: number;
  nombresApellidos: string;
  cedula: string;
  fechaNacimiento: string;
  fechaApertura: string;
  activo: boolean;
  especialidad: { id: number; area: string };
  especialista: { id: number; nombresApellidos: string };
  sede: { id: number; nombre: string };
  ciudad: string;
  domicilio: string;
  numeroTelefono: string;
  numeroCelular: string;
  inicioPasantia: string;
  finPasantia: string;
  email: string;
}

export default function PasantesAccionesTable() {
  const [pasantes, setPasantes] = useState<Pasante[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPasante, setSelectedPasante] = useState<Pasante | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<PasanteCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sedes, setSedes] = useState<any[]>([]);
  const [especialistas, setEspecialistas] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  const navigate = useNavigate();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [pasanteDetail, setPasanteDetail] = useState<Pasante | null>(null);

  const handleOpenDetail = (pasante: Pasante) => {
    setPasanteDetail(pasante);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setPasanteDetail(null);
  };

  const fetchPasantes = async (
    page = currentPage,
    search = searchTerm,
    currentFilters = filters,
    currentSortField = sortField,
    currentSortDirection = sortDirection,
  ) => {
    try {
      setLoading(true);
      const sort = `${currentSortField},${currentSortDirection}`;

      const hasFilters =
        Object.values(currentFilters).some(
          (val) => val !== undefined && val !== "",
        ) || !!search;

      let response;
      if (hasFilters) {
        const criteria: PasanteCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        response = await pasantesService.filtrar(
          criteria,
          page,
          pageSize,
          sort,
        );
      } else {
        response = await pasantesService.listarActivos(page, pageSize, sort);
      }

      if (response?.content && Array.isArray(response.content)) {
        setPasantes(response.content);
        setTotalPages(response.totalPages);
      } else if (Array.isArray(response)) {
        setPasantes(response);
        setTotalPages(1);
      } else {
        setPasantes([]);
      }
    } catch (error) {
      toast.error("Error al cargar pasantes");
      setPasantes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [sedesResponse, especialistasResponse, especialidadesResponse] =
          await Promise.all([
            sedesService.listarActivos(0, 100),
            especialistasService.listarActivos(0, 100),
            especialidadesService.listarActivos(0, 100),
          ]);

        const sedesData = sedesResponse?.content || [];
        const especialistasData = especialistasResponse?.content || [];
        const especialidadesData = especialidadesResponse?.content || [];

        setSedes(sedesData);
        setEspecialistas(especialistasData);
        setEspecialidades(especialidadesData);
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchPasantes();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/pasantes/editar/${id}`);
  };

  const handleDeleteClick = (pasante: Pasante) => {
    setSelectedPasante(pasante);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedPasante) {
      try {
        await pasantesService.eliminar(selectedPasante.id);
        toast.success("Pasante eliminado correctamente");
        await fetchPasantes();
        closeDeleteModal();
        setSelectedPasante(null);
      } catch (error) {
        toast.error("Error al eliminar pasante");
        console.error("Error al eliminar pasante:", error);
      }
    }
  };

  const getEstadoBadge = (estado: boolean) => {
    return estado === true ? "success" : "error";
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const handleFiltersChange = (newFilters: any) => {
    if (newFilters.sortField) setSortField(newFilters.sortField);
    if (newFilters.sortDirection) setSortDirection(newFilters.sortDirection);

    const { sortField: _sf, sortDirection: _sd, ...rest } = newFilters;

    const cleanedFilters: any = { ...rest };

    if (cleanedFilters.activo === "true") cleanedFilters.activo = true;
    else if (cleanedFilters.activo === "false") cleanedFilters.activo = false;
    else if (cleanedFilters.activo === "") delete cleanedFilters.activo;

    if (cleanedFilters.sedeId === "") delete cleanedFilters.sedeId;
    else if (cleanedFilters.sedeId)
      cleanedFilters.sedeId = parseInt(cleanedFilters.sedeId);

    if (cleanedFilters.especialistaId === "")
      delete cleanedFilters.especialistaId;
    else if (cleanedFilters.especialistaId)
      cleanedFilters.especialistaId = parseInt(cleanedFilters.especialistaId);

    if (cleanedFilters.especialidadId === "")
      delete cleanedFilters.especialidadId;
    else if (cleanedFilters.especialidadId)
      cleanedFilters.especialidadId = parseInt(cleanedFilters.especialidadId);

    setFilters(cleanedFilters);
    setCurrentPage(0);
  };
  const handleExport = async () => {
    try {
      const toastId = toast.info("Generando reporte Excel...", {
        autoClose: false,
      });
      const criteria: PasanteCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await pasantesService.exportarExcel(criteria);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `pasantes_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast.dismiss(toastId);
      toast.success("Reporte descargado correctamente");
    } catch (error) {
      toast.error("Error al exportar reporte");
      console.error(error);
    }
  };

  const filterConfig: FilterField[] = [
    {
      type: "select",
      name: "activo",
      label: "Estado",
      placeholder: "Todos",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
    },
    {
      type: "select",
      name: "sortField",
      label: "Ordenar por",
      options: [
        { value: "id", label: "Registro (ID)" },
        { value: "nombresApellidos", label: "Nombres" },
      ],
    },
    {
      type: "select",
      name: "sortDirection",
      label: "Dirección",
      options: [
        { value: "asc", label: "Ascendente" },
        { value: "desc", label: "Descendente" },
      ],
    },
    {
      type: "select",
      name: "sedeId",
      label: "Sede",
      placeholder: "Todas las sedes",
      options: sedes.map((sede) => ({
        value: String(sede.id),
        label: sede.nombre,
      })),
    },
    {
      type: "select",
      name: "especialistaId",
      label: "Tutor (Especialista)",
      placeholder: "Todos los especialistas",
      options: especialistas.map((esp) => ({
        value: String(esp.id),
        label: esp.nombresApellidos,
      })),
    },
    {
      type: "select",
      name: "especialidadId",
      label: "Especialidad",
      placeholder: "Todas las especialidades",
      options: especialidades.map((esp) => ({
        value: String(esp.id),
        label: esp.area,
      })),
    },
    {
      type: "input",
      name: "ciudad",
      label: "Ciudad",
      placeholder: "Ej: Quito",
    },
  ];

  const { permissions } = useAuth();

  const [isAsignacionModalOpen, setIsAsignacionModalOpen] = useState(false);
  const [pasanteParaAsignar, setPasanteParaAsignar] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleOpenAsignaciones = (pasante: Pasante) => {
    setPasanteParaAsignar({ id: pasante.id, name: pasante.nombresApellidos });
    setIsAsignacionModalOpen(true);
  };

  const handleCloseAsignaciones = () => {
    setIsAsignacionModalOpen(false);
    setPasanteParaAsignar(null);
  };

  return (
    <div>
      <TableActionHeader
        title="Pasantes"
        onSearchClick={handleSearch}
        onNew={
          permissions.includes("PERM_PASANTES_CREAR")
            ? () => navigate("/pasantes/nuevo")
            : undefined
        }
        newButtonText="Agregar"
        onExport={handleExport}
        filterConfig={filterConfig}
        activeFilters={{
          ...filters,
          activo:
            filters.activo === true
              ? "true"
              : filters.activo === false
                ? "false"
                : "",
          sortField,
          sortDirection,
        }}
        onFiltersChange={handleFiltersChange}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>Cédula</TableCell>
                <TableCell isHeader>Nombres</TableCell>
                <TableCell isHeader>Inicio Pasantía</TableCell>
                <TableCell isHeader>Fin Pasantía</TableCell>
                <TableCell isHeader>Tutor</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoading colSpan={7} message="Cargando pasantes..." />
              ) : pasantes.length > 0 ? (
                pasantes.map((pasante) => (
                  <TableRow key={pasante.id}>
                    <TableCell>{pasante.cedula}</TableCell>
                    <TableCell>{pasante.nombresApellidos}</TableCell>
                    <TableCell>{pasante.inicioPasantia || "N/A"}</TableCell>
                    <TableCell>{pasante.finPasantia || "N/A"}</TableCell>
                    <TableCell>
                      {pasante.especialista?.nombresApellidos || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge size="sm" color={getEstadoBadge(pasante.activo)}>
                        {pasante.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleOpenDetail(pasante)}
                          title="Ver Detalles"
                        >
                          <Info size={14} />
                        </Button>
                        {permissions.includes("PERM_ASIGNACIONES_CREAR") && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleOpenAsignaciones(pasante)}
                            title="Asignar Pacientes"
                          >
                            <UserPlus size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_PASANTES_EDITAR") && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(pasante.id)}
                            title="Editar"
                          >
                            <Pen size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_PASANTES_ELIMINAR") && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(pasante)}
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
                  colSpan={7}
                  message="No se encontraron pasantes registrados"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar Pasante"
          description={`¿Estás seguro de que deseas eliminar al pasante 
            ${selectedPasante?.nombresApellidos}? Esta acción no se puede deshacer.`}
        />

        <AsignacionesModal
          isOpen={isAsignacionModalOpen}
          onClose={handleCloseAsignaciones}
          pasanteId={pasanteParaAsignar?.id || null}
          pasanteName={pasanteParaAsignar?.name || ""}
        />

        <PasanteDetalleModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          pasante={pasanteDetail}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
