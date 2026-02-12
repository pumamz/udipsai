import { useEffect, useState, useCallback } from "react";
import { Modal } from "../ui/modal/index";
import { asignacionesService } from "../../services/asignaciones";
import { pacientesService } from "../../services/pacientes";
import { toast } from "react-toastify";
import { Trash, UserPlus, X } from "lucide-react";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHeader,
  TableLoading,
  TableRow,
} from "../ui/table";

interface AsignacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  pasanteId: number | null;
  pasanteName: string;
}

interface Asignacion {
  id: number;
  paciente: {
    id: number;
    nombresApellidos: string;
    cedula: string;
  };
  activo: boolean;
}

interface Paciente {
  id: number;
  nombresApellidos: string;
  cedula: string;
}

export const AsignacionesModal = ({
  isOpen,
  onClose,
  pasanteId,
  pasanteName,
  permCreate = "PERM_ASIGNACIONES_CREAR",
  permDelete = "PERM_ASIGNACIONES_ELIMINAR",
}: AsignacionesModalProps & { permCreate?: string; permDelete?: string }) => {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Paciente[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<Paciente[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAsignaciones = useCallback(async () => {
    if (!pasanteId) return;
    try {
      setLoading(true);
      const data = await asignacionesService.obtenerPorPasante(pasanteId);
      setAsignaciones(data);
    } catch (error) {
      toast.error("Error al cargar asignaciones");
    } finally {
      setLoading(false);
    }
  }, [pasanteId]);

  useEffect(() => {
    if (isOpen && pasanteId) {
      fetchAsignaciones();
      setSearchTerm("");
      setSearchResults([]);
      setSelectedPatients([]);
    }
  }, [isOpen, pasanteId, fetchAsignaciones]);

  const handleDelete = async (id: number) => {
    try {
      await asignacionesService.eliminar(id);
      toast.success("Asignación eliminada");
      fetchAsignaciones();
    } catch (error) {
      toast.error("Error al eliminar asignación");
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          const response = await pacientesService.filtrar(
            {
              search: searchTerm,
              activo: true,
            },
            0,
            10
          );

          const existingIds = asignaciones.map((a) => a.paciente.cedula);
          const available = (response.content || []).filter(
            (p: Paciente) => !existingIds.includes(p.cedula)
          );

          setSearchResults(available);
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, asignaciones]);

  const handleSelectPatient = (patient: Paciente) => {
    if (!selectedPatients.find((p) => p.id === patient.id)) {
      setSelectedPatients([...selectedPatients, patient]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveSelected = (id: number) => {
    setSelectedPatients(selectedPatients.filter((p) => p.id !== id));
  };

  const handleSaveAssignments = async () => {
    if (!pasanteId || selectedPatients.length === 0) return;

    try {
      const ids = selectedPatients.map((p) => p.id);
      await asignacionesService.crear(ids, pasanteId);
      toast.success(`${ids.length} pacientes asignados correctamente`);
      setSelectedPatients([]);
      fetchAsignaciones();
    } catch (error) {
      toast.error("Error al crear asignaciones");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] max-h-[700px] p-6"
      showCloseButton={false}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Asignaciones -{" "}
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            {pasanteName}
          </span>
        </h3>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg space-y-3">
          {hasPermission(permCreate) && (
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <UserPlus size={16} />
              Agregar Pacientes
            </h4>
          )}

          {hasPermission(permCreate) && (
            <div className="relative">
              <Input
                placeholder="Buscar paciente por nombre o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
                  {searchResults.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => handleSelectPatient(patient)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex justify-between items-center"
                    >
                      <span>{patient.nombresApellidos}</span>
                      <span className="text-xs text-gray-500">
                        {patient.cedula}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedPatients.length > 0 && hasPermission(permCreate) && (
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex flex-wrap gap-2">
                {selectedPatients.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 bg-red-50/50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3 py-1.5 rounded-full transition-all duration-300 hover:border-red-500/50 group"
                  >
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {p.nombresApellidos}
                    </span>
                    <button
                      onClick={() => handleRemoveSelected(p.id)}
                      className="text-red-400 group-hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-500/20"
                      title="Quitar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveAssignments}
                  className="shadow-md hover:shadow-lg transition-all"
                >
                  Asignar ({selectedPatients.length})
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
            Pacientes Asignados ({asignaciones.length})
          </h4>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader>Paciente</TableCell>
                    <TableCell isHeader>Cédula</TableCell>
                    <TableCell isHeader>Acción</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableLoading
                      colSpan={3}
                      message="Cargando asignaciones..."
                    />
                  ) : asignaciones.length > 0 ? (
                    asignaciones.map((asignacion) => (
                      <TableRow
                        key={asignacion.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <TableCell>
                          {asignacion.paciente.nombresApellidos}
                        </TableCell>
                        <TableCell>{asignacion.paciente.cedula}</TableCell>
                        <TableCell className="px-5 py-3 text-center text-theme-xs text-gray-700 dark:text-gray-300">
                          {hasPermission(permDelete) && (
                            <Button
                              onClick={() => handleDelete(asignacion.id)}
                              variant="danger"
                              title="Eliminar asignación"
                            >
                              <Trash size={14} />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableEmpty colSpan={3} message="No hay asignaciones" />
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
