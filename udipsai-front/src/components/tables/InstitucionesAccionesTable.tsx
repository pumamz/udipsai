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
  institucionesService,
  InstitucionEducativaCriteria,
} from "../../services/instituciones";
import Button from "../ui/button/Button";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { useModal } from "../../hooks/useModal";
import { TableActionHeader, FilterField } from "../common/TableActionHeader";
import { InstitucionModal } from "../modals/InstitucionModal";
import { Pagination } from "../ui/Pagination";
import { Pencil, Trash } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Institucion {
  id: number;
  nombre: string;
  direccion: string;
  tipo: string;
  activo: boolean;
}

export default function InstitucionesTable() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<InstitucionEducativaCriteria>({});

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const {
    isOpen: isModalOpen,
    openModal: openInstitucionModal,
    closeModal: closeInstitucionModal,
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [currentInstitucion, setCurrentInstitucion] =
    useState<Institucion | null>(null);
  const [institucionToDelete, setInstitucionToDelete] = useState<number | null>(
    null,
  );

  const fetchInstituciones = async (
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
        const criteria: InstitucionEducativaCriteria = {
          ...currentFilters,
          search: search || undefined,
        };
        data = await institucionesService.filtrar(
          criteria,
          page,
          pageSize,
          sort,
        );
      } else {
        data = await institucionesService.listarActivos(page, pageSize, sort);
      }

      if (data?.content && Array.isArray(data.content)) {
        setInstituciones(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setInstituciones(data);
        setTotalPages(1);
      } else {
        setInstituciones([]);
      }
    } catch (error) {
      console.error("Error fetching instituciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstituciones();
  }, [currentPage, sortField, sortDirection, filters, searchTerm]);

  const getEstadoBadge = (estado: boolean) => {
    return estado ? "success" : "error";
  };

  const handleCreate = () => {
    setCurrentInstitucion(null);
    openInstitucionModal();
  };

  const handleEdit = (institucion: Institucion) => {
    setCurrentInstitucion(institucion);
    openInstitucionModal();
  };

  const handleDelete = (id: number) => {
    setInstitucionToDelete(id);
    openDeleteModal();
  };

  const confirmDelete = async () => {
    if (institucionToDelete) {
      try {
        await institucionesService.eliminar(institucionToDelete);
        toast.success("Institución eliminada correctamente");
        await fetchInstituciones();
        closeDeleteModal();
        setInstitucionToDelete(null);
      } catch (error) {
        toast.error("Error al eliminar la institución");
        console.error("Error deleting institucion:", error);
      }
    }
  };

  const handleSave = async (institucion: any) => {
    try {
      if ("id" in institucion) {
        await institucionesService.actualizar(institucion.id, institucion);
        toast.success("Institución actualizada correctamente");
      } else {
        await institucionesService.crear(institucion);
        toast.success("Institución creada correctamente");
      }
      await fetchInstituciones();
      closeInstitucionModal();
    } catch (error) {
      toast.error("Error al guardar la institución");
      console.error("Error saving institucion:", error);
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

    const cleanedFilters = { ...rest };
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
      const criteria: InstitucionEducativaCriteria = {
        ...filters,
        search: searchTerm || undefined,
      };

      const blob = await institucionesService.exportarExcel(criteria);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `instituciones_${new Date().toISOString().slice(0, 10)}.xlsx`,
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
        title="Instituciones Educativas"
        onSearchClick={handleSearch}
        onNew={
          permissions.includes("PERM_INSTITUCIONES_EDUCATIVAS_CREAR")
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
                <TableCell isHeader>Id de institución</TableCell>
                <TableCell isHeader>Nombre de la institución</TableCell>
                <TableCell isHeader>Dirección</TableCell>
                <TableCell isHeader>Tipo de institución</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableLoading colSpan={6} message="Cargando instituciones..." />
              ) : instituciones.length > 0 ? (
                instituciones.map((institucion) => (
                  <TableRow key={institucion.id}>
                    <TableCell>{institucion.id}</TableCell>
                    <TableCell>{institucion.nombre}</TableCell>
                    <TableCell>{institucion.direccion}</TableCell>
                    <TableCell>{institucion.tipo}</TableCell>
                    <TableCell>
                      <Badge
                        size="sm"
                        color={getEstadoBadge(institucion.activo)}
                      >
                        {institucion.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {permissions.includes(
                          "PERM_INSTITUCIONES_EDUCATIVAS_EDITAR",
                        ) && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEdit(institucion)}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                        )}
                        {permissions.includes(
                          "PERM_INSTITUCIONES_EDUCATIVAS_ELIMINAR",
                        ) && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(institucion.id)}
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
                  message="No se encontraron instituciones educativas activas"
                />
              )}
            </TableBody>
          </Table>
        </div>

        <InstitucionModal
          isOpen={isModalOpen}
          onClose={closeInstitucionModal}
          onSave={handleSave}
          initialData={currentInstitucion}
          title={
            currentInstitucion ? "Editar Institución" : "Nueva Institución"
          }
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Eliminar Institución"
          description={`¿Estás seguro de que deseas eliminar la institución?`}
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
