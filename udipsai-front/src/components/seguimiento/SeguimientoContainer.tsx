import React, { useEffect, useState } from "react";
import { Plus, Info } from "lucide-react";
import Button from "../ui/button/Button";
import { SeguimientoCard } from "./SeguimientoCard";
import { SeguimientoForm } from "./SeguimientoForm";
import { seguimientosService, SeguimientoDTO } from "../../services/seguimientos";
import { toast } from "react-toastify";
import { DeleteModal } from "../ui/modal/DeleteModal";
import { useModal } from "../../hooks/useModal";

interface SeguimientoContainerProps {
  pacienteId: number;
}

export const SeguimientoContainer: React.FC<SeguimientoContainerProps> = ({
  pacienteId,
}) => {
  const [seguimientos, setSeguimientos] = useState<SeguimientoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState<SeguimientoDTO | null>(null);
  
  const {
    isOpen: isFormOpen,
    openModal: openForm,
    closeModal: closeForm,
  } = useModal();

  const {
    isOpen: isDeleteOpen,
    openModal: openDelete,
    closeModal: closeDelete,
  } = useModal();

  const fetchSeguimientos = async () => {
    try {
      setLoading(true);
      const data = await seguimientosService.listarPorPaciente(pacienteId);
      const sorted = (Array.isArray(data) ? data : []).sort((a: SeguimientoDTO, b: SeguimientoDTO) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setSeguimientos(sorted);
    } catch (error) {
      console.error("Error fetching seguimientos:", error);
      toast.error("Error al cargar el historial de seguimiento");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pacienteId) {
      fetchSeguimientos();
    }
  }, [pacienteId]);

  const handleCreate = () => {
    setSelectedSeguimiento(null);
    openForm();
  };

  const handleEdit = (seguimiento: SeguimientoDTO) => {
    setSelectedSeguimiento(seguimiento);
    openForm();
  };

  const handleDeleteClick = (id: number) => {
    const seguimiento = seguimientos.find(s => s.id === id);
    if (seguimiento) {
      setSelectedSeguimiento(seguimiento);
      openDelete();
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSeguimiento) {
      try {
        await seguimientosService.eliminar(selectedSeguimiento.id);
        toast.success("Seguimiento eliminado correctamente");
        fetchSeguimientos();
        closeDelete();
      } catch (error) {
        toast.error("Error al eliminar el seguimiento");
      }
    }
  };

  const handleSave = async (data: any, file?: File) => {
    try {
      if (selectedSeguimiento) {
        await seguimientosService.actualizar(selectedSeguimiento.id, data, file);
        toast.success("Seguimiento actualizado correctamente");
      } else {
        await seguimientosService.crear(data, file);
        toast.success("Seguimiento creado correctamente");
      }
      fetchSeguimientos();
    } catch (error) {
        console.error("Error saving seguimiento:", error);
        toast.error("Error al guardar el seguimiento");
        throw error;
    }
  };

  if (loading && seguimientos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-4">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Historial de Seguimiento
        </h4>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={16} />
          Nuevo Evento
        </Button>
      </div>

      <div className="relative pl-4 space-y-0">
        {seguimientos.length > 0 ? (
          seguimientos.map((seguimiento) => (
            <SeguimientoCard
              key={seguimiento.id}
              seguimiento={seguimiento}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 dark:bg-white/[0.03] dark:border-gray-800">
            <Info className="text-gray-400 mb-2" size={32} />
            <p className="text-gray-500 text-sm">No hay registros de seguimiento para este paciente.</p>
          </div>
        )}
      </div>

      <SeguimientoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSave}
        initialData={selectedSeguimiento}
        pacienteId={pacienteId}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        title="Eliminar Seguimiento"
        description="¿Estás seguro de que deseas eliminar este evento de seguimiento?"
      />
    </div>
  );
};
