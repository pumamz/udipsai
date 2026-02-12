import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { AlertTriangle, Edit2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

interface CitaInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    cita: any; // Event/Cita object
    onDelete?: (id: string) => Promise<void>;
    onReschedule?: (id: string) => void;
    onMarkAsAttended?: (id: string) => Promise<void>;
    onMarkAsNotAttended?: (id: string) => Promise<void>;
    onMarkAsJustified?: (id: string) => Promise<void>;
}

const CitaInfoModal: React.FC<CitaInfoModalProps> = ({
    isOpen,
    onClose,
    cita,
    onDelete,
    onReschedule,
    onMarkAsAttended,
    onMarkAsNotAttended,
    onMarkAsJustified,
}) => {
    const { userRole } = useAuth();
    const isPasante = userRole === "ROLE_PASANTE";
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Estados para el flujo de cambio de estado
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [tempStatus, setTempStatus] = useState<string>('PENDIENTE');
    const [showStatusConfirm, setShowStatusConfirm] = useState(false);

    // Props de la cita
    const extendedProps = cita?.extendedProps || {};
    const currentStatus = extendedProps.status || 'PENDIENTE';

    // Sincronizar tempStatus con el estado actual al abrir/cambiar cita
    useEffect(() => {
        setTempStatus(currentStatus);
        setIsEditingStatus(false);
        setShowStatusConfirm(false);
    }, [cita, currentStatus]);

    if (!cita) return null;

    // Helper para confirmar eliminacion
    const confirmDelete = async () => {
        if (!onDelete) return;
        setLoading(true);
        try {
            await onDelete(cita.id);
            onClose();
        } catch (error) {
            console.error("Error deleting cita", error);
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const handleActualStatusChange = async () => {
        setLoading(true);
        try {
            if (tempStatus === 'FINALIZADA' && onMarkAsAttended) {
                await onMarkAsAttended(cita.id);
            } else if (tempStatus === 'FALTA_INJUSTIFICADA' && onMarkAsNotAttended) {
                await onMarkAsNotAttended(cita.id);
            } else if (tempStatus === 'FALTA_JUSTIFICADA' && onMarkAsJustified) {
                await onMarkAsJustified(cita.id);
            }
            onClose();
        } catch (error) {
            console.error("Error updating status", error);
            toast.error("Error al actualizar estado");
        } finally {
            setLoading(false);
            setShowStatusConfirm(false);
        }
    };

    const handleSaveStatusClick = () => {
        if (tempStatus === currentStatus) {
            setIsEditingStatus(false);
            return;
        }
        if (tempStatus === 'PENDIENTE') {
            toast.error("No se puede revertir a estado Pendiente");
            return;
        }
        setShowStatusConfirm(true);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
            {showStatusConfirm ? (
                // --- VISTA CONFIRMAR CAMBIO DE ESTADO ---
                <div className="text-center py-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4 dark:bg-yellow-900/30">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        ¿Confirmar cambio de estado?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Vas a cambiar el estado de la cita a: <strong>{tempStatus}</strong>
                    </p>
                    <p className="text-xs text-red-500 font-medium mb-6">
                        ⚠️ Esta acción NO se puede deshacer.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowStatusConfirm(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary" // O un color específico si se desea
                            onClick={handleActualStatusChange}
                            disabled={loading}
                            className="bg-brand-600 hover:bg-brand-700 text-white"
                        >
                            {loading ? "Guardando..." : "Confirmar Cambio"}
                        </Button>
                    </div>
                </div>
            ) : !showConfirm ? (
                // --- VISTA DETALLES ---
                <>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                        Detalles de Cita
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Paciente</label>
                            <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {cita?.title || "Sin Nombre"}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Especialidad</label>
                            <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                {extendedProps.specialty || "General"}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Especialista</label>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {extendedProps.specialist || "Sin Asignar"}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Fecha</label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {cita?.start ? new Date(cita.start).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase">Hora</label>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {cita?.start ? new Date(cita.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    {' - '}
                                    {cita?.end ? new Date(cita.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase">Estado</label>
                            <div className="mt-1 flex items-center gap-2">
                                {isEditingStatus ? (
                                    // MODO EDICIÓN
                                    <div className="flex items-center gap-2 w-full">
                                        <select
                                            value={tempStatus}
                                            onChange={(e) => setTempStatus(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm px-3 py-2 border bg-gray-50 text-gray-900"
                                        >
                                            <option value="PENDIENTE">PENDIENTE</option>
                                            <option value="FINALIZADA">FINALIZADA</option>
                                            <option value="FALTA_INJUSTIFICADA">FALTA INJUSTIFICADA</option>
                                            <option value="FALTA_JUSTIFICADA">FALTA JUSTIFICADA</option>
                                        </select>

                                        <button
                                            onClick={handleSaveStatusClick}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                            title="Guardar"
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingStatus(false);
                                                setTempStatus(currentStatus);
                                            }}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Cancelar"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    // MODO VISUALIZACIÓN
                                    <div className="flex items-center justify-between w-full">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border
                                            ${currentStatus === 'PENDIENTE' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                                                currentStatus === 'FINALIZADA' ? 'bg-green-50 text-green-800 border-green-200' :
                                                    currentStatus === 'FALTA_INJUSTIFICADA' ? 'bg-red-50 text-red-800 border-red-200' :
                                                        currentStatus === 'FALTA_JUSTIFICADA' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                                            'bg-gray-50 text-gray-800 border-gray-200'}
                                        `}>
                                            {currentStatus === 'FALTA_INJUSTIFICADA' ? 'FALTA INJUSTIFICADA' :
                                                currentStatus === 'FALTA_JUSTIFICADA' ? 'FALTA JUSTIFICADA' : currentStatus}
                                        </span>

                                        {/* Botón para habilitar edición solo si es PENDIENTE y NO es pasante */}
                                        {currentStatus === 'PENDIENTE' && !isPasante && (
                                            <button
                                                onClick={() => setIsEditingStatus(true)}
                                                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium px-2 py-1 rounded hover:bg-brand-50 transition-colors"
                                            >
                                                <Edit2 size={14} />
                                                Cambiar Estado
                                            </button>
                                        )}

                                        {(currentStatus === 'FINALIZADA' || currentStatus === 'FALTA_INJUSTIFICADA' || currentStatus === 'FALTA_JUSTIFICADA') && (
                                            <span className="text-xs text-gray-400 italic">No editable</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-3 mt-6">
                        <div className="flex justify-end gap-3">
                            {/* Boton Reagendar - Ocultar para pasantes */}
                            {(currentStatus === 'PENDIENTE' || currentStatus === 'FALTA_INJUSTIFICADA' || currentStatus === 'FALTA_JUSTIFICADA') && onReschedule && !isPasante && (
                                <Button
                                    variant="outline"
                                    className="!border-blue-600 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-400 dark:!text-blue-400 dark:hover:!bg-blue-900/20"
                                    onClick={() => onReschedule(cita.id)}
                                >
                                    Reagendar
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cerrar
                            </Button>
                        </div>

                        {/* Cancelar (eliminar) cita si es Pendiente y NO es pasante */}
                        {currentStatus === 'PENDIENTE' && onDelete && !isPasante && (
                            <div className="flex justify-start mt-2">
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="text-xs text-red-500 hover:text-red-700 underline"
                                >
                                    Cancelar Cita
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                // --- VISTA CONFIRMAR ELIMINACIÓN ---
                <div className="text-center py-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4 dark:bg-red-900/30">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">¿Cancelar esta cita?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Esta acción no se puede deshacer. La cita será eliminada permanentemente del calendario.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                        >
                            No, Volver
                        </Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? "Cancelando..." : "Sí, Cancelar"}
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CitaInfoModal;
