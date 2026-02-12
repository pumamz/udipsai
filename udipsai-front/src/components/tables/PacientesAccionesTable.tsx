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

import { Pen, Trash, Info, FileText } from "lucide-react";

import Badge from "../ui/badge/Badge";
import { toast } from "react-toastify";
import { PacienteCriteria, pacientesService } from "../../services/pacientes";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { PatientDetailsModal } from "../modals/PacienteDetalleModal";
import { PatientFichasModal } from "../modals/PatientFichasModal";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { Pagination } from "../ui/Pagination";
import { sedesService } from "../../services/sedes";
import { institucionesService } from "../../services/instituciones";
import { useAuth } from "../../context/AuthContext";

interface Paciente {
  id: number;
  nombresApellidos: string;
  cedula: string;
  fechaNacimiento: string;
  fechaApertura: string;
  activo: boolean;
  ciudad: string;
  domicilio: string;
  numeroTelefono: string;
  numeroCelular: string;
  institucionEducativa: { id: number; nombre: string };
  sede: { id: number; nombre: string };
  motivoConsulta: string;
  observaciones: string;
}

export default function PacientesAccionesTable() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<PacienteCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sedes, setSedes] = useState<any[]>([]);
  const [instituciones, setInstituciones] = useState<any[]>([]);

  const navigate = useNavigate();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const {
    isOpen: isDetailsModalOpen,
    openModal: openDetailsModal,
    closeModal: closeDetailsModal,
  } = useModal();

  const {
    isOpen: isFichasModalOpen,
    openModal: openFichasModal,
    closeModal: closeFichasModal,
  } = useModal();

  const fetchPacientes = async (
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
        const criteria: PacienteCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        response = await pacientesService.filtrar(
          criteria,
          page,
          pageSize,
          sort,
        );
      } else {
        response = await pacientesService.listarActivos(page, pageSize, sort);
      }

      if (response?.content && Array.isArray(response.content)) {
        setPacientes(response.content);
        setTotalPages(response.totalPages);
      } else if (Array.isArray(response)) {
        setPacientes(response);
        setTotalPages(1);
      } else {
        setPacientes([]);
      }
    } catch (error) {
      toast.error("Error al cargar la lista de pacientes");
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [sedesResponse, institucionesResponse] = await Promise.all([
          sedesService.listarActivos(0, 100),
          institucionesService.listarActivos(0, 100),
        ]);

        const sedesData = sedesResponse?.content || [];
        const institucionesData = institucionesResponse?.content || [];

        setSedes(sedesData);
        setInstituciones(institucionesData);
      } catch (error) {
        console.error("Error al cargar datos de filtros:", error);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/pacientes/editar/${id}`);
  };

  const handleDeleteClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedPaciente) {
      try {
        await pacientesService.eliminar(selectedPaciente.id);
        toast.success("Paciente eliminado correctamente");
        await fetchPacientes();
        closeDeleteModal();
        setSelectedPaciente(null);
      } catch (error) {
        toast.error("Error al eliminar el paciente");
        console.error("Error al eliminar paciente:", error);
      }
    }
  };

  const handleDetailsClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openDetailsModal();
  };

  const handleFichasClick = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
    openFichasModal();
  };

  const getEstadoBadge = (estado: boolean) => {
    return estado ? "success" : "error";
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

    if (cleanedFilters.sedeId)
      cleanedFilters.sedeId = parseInt(cleanedFilters.sedeId);
    if (cleanedFilters.institucionEducativaId)
      cleanedFilters.institucionEducativaId = parseInt(
        cleanedFilters.institucionEducativaId,
      );

    setFilters(cleanedFilters);
    setCurrentPage(0);
  };

  const filterConfig: FilterField[] = [
    {
      type: "select",
      name: "sedeId",
      label: "Sede",
      placeholder: "Todas las sedes",
      options: sedes.map((s) => ({ value: s.id.toString(), label: s.nombre })),
    },
    {
      type: "select",
      name: "institucionEducativaId",
      label: "Institución Educativa",
      placeholder: "Todas las instituciones",
      options: instituciones.map((i) => ({
        value: i.id.toString(),
        label: i.nombre,
      })),
    },
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
      type: "input",
      name: "ciudad",
      label: "Ciudad",
      placeholder: "Ej: Quito",
    },
    {
      type: "select",
      name: "sortField",
      label: "Ordenar por",
      options: [
        { value: "id", label: "Registro (ID)" },
        { value: "nombresApellidos", label: "Nombre" },
        { value: "cedula", label: "Cédula" },
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
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = async () => {
    try {
      toast.info("Generando reporte Excel...");
      const criteria: PacienteCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await pacientesService.exportarExcel(criteria);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `pacientes_${new Date().toLocaleDateString()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reporte generado correctamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      toast.error("Error al generar el reporte Excel");
    }
  };

  const { permissions } = useAuth();

  return (
    <div>
      <TableActionHeader
        title="Lista de pacientes"
        onSearchClick={handleSearch}
        onNew={() => navigate("/pacientes/nuevo")}
        createPermission="PERM_PACIENTES_CREAR"
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
          sedeId: filters.sedeId?.toString(),
          institucionEducativaId: filters.institucionEducativaId?.toString(),
        }}
        onFiltersChange={handleFiltersChange}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader>Número de ficha</TableCell>
                <TableCell isHeader>Nombre del paciente</TableCell>
                <TableCell isHeader>Cédula</TableCell>
                <TableCell isHeader>Celular</TableCell>
                <TableCell isHeader>Sede</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="relative min-h-[400px]">
              {loading ? (
                <TableLoading colSpan={7} message="Cargando pacientes..." />
              ) : pacientes.length > 0 ? (
                pacientes.map((paciente) => (
                  <TableRow
                    key={paciente.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  >
                    <TableCell>{paciente.id}</TableCell>
                    <TableCell>{paciente.nombresApellidos}</TableCell>
                    <TableCell>{paciente.cedula}</TableCell>
                    <TableCell>{paciente.numeroCelular}</TableCell>
                    <TableCell>{paciente.sede?.nombre || "Cuenca"}</TableCell>
                    <TableCell>
                      <Badge size="sm" color={getEstadoBadge(paciente.activo)}>
                        {paciente.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleDetailsClick(paciente)}
                          title="Detalles"
                        >
                          <Info size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleFichasClick(paciente)}
                          title="Fichas"
                        >
                          <FileText size={14} />
                        </Button>
                        {permissions.includes("PERM_PACIENTES_EDITAR") && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(paciente.id)}
                            title="Editar"
                          >
                            <Pen size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_PACIENTES_ELIMINAR") && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(paciente)}
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
                  message="No se encontraron pacientes registrados"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar Paciente"
          description={`¿Estás seguro de que deseas eliminar al paciente ${selectedPaciente?.nombresApellidos}? Esta acción no se puede deshacer.`}
        />

        <PatientDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          paciente={selectedPaciente}
        />

        <PatientFichasModal
          isOpen={isFichasModalOpen}
          onClose={closeFichasModal}
          paciente={selectedPaciente}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
