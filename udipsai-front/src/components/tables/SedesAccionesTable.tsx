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
import { sedesService, SedeCriteria } from "../../services/sedes";
import Button from "../ui/button/Button";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { useModal } from "../../hooks/useModal";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { Pagination } from "../ui/Pagination";
import { Pencil, Trash } from "lucide-react";
import { SedeModal } from "../modals/SedesModal";
import { useAuth } from "../../context/AuthContext";

interface Sedes {
  id: number;
  nombre: string;
  activo: boolean;
}

export default function SedesAccionesTable() {
  const [sedes, setSedes] = useState<Sedes[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<SedeCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    isOpen: isModalOpen,
    openModal: openSedeModal,
    closeModal: closeSedeModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [currentSede, setCurrentSede] = useState<Sedes | null>(null);
  const [sedesToDelete, setSedesToDelete] = useState<number | null>(null);

  const fetchSedes = async (
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
        const criteria: SedeCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await sedesService.filtrar(criteria, page, pageSize, sort);
      } else {
        data = await sedesService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setSedes(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setSedes(data);
        setTotalPages(1);
      } else {
        setSedes([]);
      }
    } catch (error) {
      console.error("Error fetching sedes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSedes();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const getEstadoBadge = (activo: boolean) => {
    return activo ? "success" : "error";
  };

  const handleCreate = () => {
    setCurrentSede(null);
    openSedeModal();
  };

  const handleEdit = (sedes: Sedes) => {
    setCurrentSede(sedes);
    openSedeModal();
  };

  const handleDelete = (id: number) => {
    setSedesToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (sedesToDelete) {
      try {
        await sedesService.eliminar(sedesToDelete);
        toast.success("Sede eliminada correctamente");
        await fetchSedes();
        closeDeleteModal();
        setSedesToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar sede");
        console.error("Error deleting sedes:", error);
      }
    }
  };

  const handleSave = async (sedes: any) => {
    try {
      if ("id" in sedes) {
        await sedesService.actualizar(sedes.id, sedes);
        toast.success("Sede actualizada correctamente");
      } else {
        await sedesService.crear(sedes);
        toast.success("Sede creada correctamente");
      }
      await fetchSedes();
      closeSedeModal();
    } catch (error) {
      toast.error("Error al guardar sede");
      console.error("Error saving sedes:", error);
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
        { value: "nombre", label: "Nombre" },
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
      const criteria: SedeCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await sedesService.exportarExcel(criteria);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `sedes_${new Date().toISOString().slice(0, 10)}.xlsx`,
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
        title="Sedes"
        onSearchClick={handleSearch}
        onNew={
          permissions.includes("PERM_SEDES_CREAR") ? handleCreate : undefined
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
                <TableCell isHeader>Id de la sede</TableCell>
                <TableCell isHeader>Nombre de la sede</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoading colSpan={4} message="Cargando sedes..." />
              ) : sedes.length > 0 ? (
                sedes.map((sede) => (
                  <TableRow key={sede.id}>
                    <TableCell>{sede.id}</TableCell>
                    <TableCell>{sede.nombre}</TableCell>
                    <TableCell>
                      <Badge size="sm" color={getEstadoBadge(sede.activo)}>
                        {sede.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {permissions.includes("PERM_SEDES_EDITAR") && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleEdit(sede)}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {permissions.includes("PERM_SEDES_ELIMINAR") && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(sede.id)}
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
                  message="No se encontraron sedes registradas"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <SedeModal
          isOpen={isModalOpen}
          onClose={closeSedeModal}
          onSave={handleSave}
          initialData={currentSede}
          title={currentSede ? "Editar Sede" : "Nueva Sede"}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Sede"
          description={`¿Estás seguro de que deseas eliminar la sede?`}
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
