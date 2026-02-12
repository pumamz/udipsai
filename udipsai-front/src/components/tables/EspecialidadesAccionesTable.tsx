import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableLoading,
  TableEmpty,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { toast } from "react-toastify";
import {
  especialidadesService,
  EspecialidadCriteria,
} from "../../services/especialidades";
import Button from "../ui/button/Button";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { useModal } from "../../hooks/useModal";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { Pagination } from "../ui/Pagination";
import { Pencil, Trash } from "lucide-react";
import { EspecialidadModal } from "../modals/EspecialidadModal";
import { useAuth } from "../../context/AuthContext";

interface Especialidades {
  id: number;
  area: string;
  activo: boolean;
}

export default function EspecialidadesAccionesTable() {
  const [especialidades, setEspecialidades] = useState<Especialidades[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<EspecialidadCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    isOpen: isModalOpen,
    openModal: openEspecialidadModal,
    closeModal: closeEspecialidadModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [currentEspecialidad, setCurrentEspecialidad] =
    useState<Especialidades | null>(null);
  const [especialidadesToDelete, setEspecialidadesToDelete] = useState<
    number | null
  >(null);

  const fetchEspecialidades = async (
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
        const criteria: EspecialidadCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await especialidadesService.filtrar(
          criteria,
          page,
          pageSize,
          sort,
        );
      } else {
        data = await especialidadesService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setEspecialidades(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setEspecialidades(data);
        setTotalPages(1);
      } else {
        setEspecialidades([]);
      }
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const getEstadoBadge = (activo: boolean) => {
    return activo ? "success" : "error";
  };

  const handleCreate = () => {
    setCurrentEspecialidad(null);
    openEspecialidadModal();
  };

  const handleEdit = (especialidad: Especialidades) => {
    setCurrentEspecialidad(especialidad);
    openEspecialidadModal();
  };

  const handleDelete = (id: number) => {
    setEspecialidadesToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (especialidadesToDelete) {
      try {
        await especialidadesService.eliminar(especialidadesToDelete);
        toast.success("Especialidad eliminada correctamente");
        await fetchEspecialidades();
        closeDeleteModal();
        setEspecialidadesToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar especialidad");
        console.error("Error deleting especialidad:", error);
      }
    }
  };

  const handleSave = async (especialidad: any) => {
    try {
      if ("id" in especialidad) {
        await especialidadesService.actualizar(especialidad.id, especialidad);
        toast.success("Especialidad actualizada correctamente");
      } else {
        await especialidadesService.crear(especialidad);
        toast.success("Especialidad creada correctamente");
      }
      await fetchEspecialidades();
      closeEspecialidadModal();
    } catch (error) {
      toast.error("Error al guardar especialidad");
      console.error("Error saving especialidad:", error);
    }
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

    setFilters(cleanedFilters);
    setCurrentPage(0);
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
        { value: "area", label: "Área" },
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
      const criteria: EspecialidadCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await especialidadesService.exportarExcel(criteria);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `especialidades_${new Date().toISOString().slice(0, 10)}.xlsx`,
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
        title="Especialidades"
        onSearchClick={handleSearch}
        onNew={
          permissions.includes("PERM_ESPECIALIDADES_CREAR")
            ? handleCreate
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
                <TableCell isHeader>Id</TableCell>
                <TableCell isHeader>Área / Especialidad</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoading
                  colSpan={4}
                  message="Cargando especialidades..."
                />
              ) : especialidades.length > 0 ? (
                especialidades.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.area}</TableCell>
                    <TableCell>
                      <Badge size="sm" color={getEstadoBadge(item.activo)}>
                        {item.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {permissions.includes("PERM_ESPECIALIDADES_EDITAR") && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(item)}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {permissions.includes(
                          "PERM_ESPECIALIDADES_ELIMINAR",
                        ) && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
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
                  message="No se encontraron especialidades registradas"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <EspecialidadModal
          isOpen={isModalOpen}
          onClose={closeEspecialidadModal}
          onSave={handleSave}
          initialData={currentEspecialidad}
          title={
            currentEspecialidad ? "Editar Especialidad" : "Nueva Especialidad"
          }
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Especialidad"
          description={`¿Estás seguro de que deseas eliminar la especialidad?`}
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
