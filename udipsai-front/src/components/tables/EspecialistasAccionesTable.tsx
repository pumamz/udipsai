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
import { Pen, Trash } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { toast } from "react-toastify";
import {
  especialistasService,
  EspecialistaCriteria,
} from "../../services/especialistas";
import { sedesService } from "../../services/sedes";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { useAuth } from "../../context/AuthContext";
import { especialidadesService } from "../../services/especialidades";
import Button from "../ui/button/Button";
import { Pagination } from "../ui/Pagination";
import { useModal } from "../../hooks/useModal";
import { DeleteModal } from "../ui/modal/DeleteModal";

interface Especialista {
  id: number;
  cedula: string;
  nombresApellidos: string;
  fotoUrl: string | null;
  especialidad: {
    id: number;
    area: string;
  };
  sede: {
    id: number;
    nombre: string;
  };
  activo: boolean;
}

export default function EspecialistasAccionesTable() {
  const [especialistas, setEspecialistas] = useState<Especialista[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEspecialista, setSelectedEspecialista] =
    useState<Especialista | null>(null);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<EspecialistaCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const [sedes, setSedes] = useState<any[]>([]);
  const [especialidades, setEspecialidades] = useState<any[]>([]);

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const fetchEspecialistas = async (
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

      let data;
      if (hasFilters) {
        const criteria: EspecialistaCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await especialistasService.filtrar(
          criteria,
          page,
          pageSize,
          sort,
        );
      } else {
        data = await especialistasService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setEspecialistas(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setEspecialistas(data);
        setTotalPages(1);
      } else {
        setEspecialistas([]);
      }
    } catch (error) {
      console.error("Error fetching especialistas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [sedesRes, especialidadesRes] = await Promise.all([
          sedesService.listarActivos(0, 100),
          especialidadesService.listarActivos(0, 100),
        ]);
        setSedes(sedesRes?.content || []);
        setEspecialidades(especialidadesRes?.content || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchEspecialistas();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const handleEdit = (id: number) => {
    navigate(`/especialistas/editar/${id}`);
  };

  const handleDeleteClick = (especialista: Especialista) => {
    setSelectedEspecialista(especialista);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (selectedEspecialista) {
      try {
        await especialistasService.eliminar(selectedEspecialista.id);
        toast.success("Especialista eliminado correctamente");
        await fetchEspecialistas();
        closeDeleteModal();
        setSelectedEspecialista(null);
      } catch (error) {
        toast.error("Error al eliminar especialista");
        console.error("Error al eliminar especialista:", error);
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

    if (cleanedFilters.sedeId)
      cleanedFilters.sedeId = parseInt(cleanedFilters.sedeId);
    if (cleanedFilters.especialidadId)
      cleanedFilters.especialidadId = parseInt(cleanedFilters.especialidadId);

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
      name: "especialidadId",
      label: "Especialidad",
      placeholder: "Todas",
      options: especialidades.map((e) => ({
        value: e.id.toString(),
        label: e.area,
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

  const handleExport = async () => {
    try {
      const toastId = toast.info("Generando reporte Excel...", {
        autoClose: false,
      });
      const criteria: EspecialistaCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await especialistasService.exportarExcel(criteria);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `especialistas_${new Date().toISOString().slice(0, 10)}.xlsx`,
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

  const { permissions } = useAuth();

  return (
    <div>
      <TableActionHeader
        title="Especialistas"
        onSearchClick={handleSearch}
        onNew={() => navigate("/especialistas/nuevo")}
        createPermission="PERM_ESPECIALISTAS_CREAR"
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
          especialidadId: filters.especialidadId?.toString(),
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
                <TableCell isHeader>Sede</TableCell>
                <TableCell isHeader>Especialidad</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoading colSpan={6} message="Cargando especialistas..." />
              ) : especialistas.length > 0 ? (
                especialistas.map((especialista) => (
                  <TableRow key={especialista.id}>
                    <TableCell>{especialista.cedula}</TableCell>
                    <TableCell>{especialista.nombresApellidos}</TableCell>
                    <TableCell>{especialista.sede?.nombre || "N/A"}</TableCell>
                    <TableCell>
                      {especialista.especialidad?.area || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        color={getEstadoBadge(especialista.activo)}
                      >
                        {especialista.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {permissions.includes("PERM_ESPECIALISTAS_EDITAR") && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(especialista.id)}
                            title="Editar"
                          >
                            <Pen size={14} />
                          </Button>
                        )}
                        {permissions.includes(
                          "PERM_ESPECIALISTAS_ELIMINAR",
                        ) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(especialista)}
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
                  colSpan={6}
                  message="No se encontraron especialistas registrados"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Eliminar Especialista"
          description={`¿Estás seguro de que deseas eliminar al especialista ${selectedEspecialista?.nombresApellidos}? Esta acción no se puede deshacer.`}
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
