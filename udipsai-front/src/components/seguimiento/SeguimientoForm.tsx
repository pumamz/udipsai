import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import DatePicker from "../form/date-picker";
import { SeguimientoDTO } from "../../services/seguimientos";
import { toast } from "react-toastify";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import { especialistasService } from "../../services";
import { Upload, CheckCircle2 } from "lucide-react";

interface SeguimientoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any, file?: File) => Promise<void>;
  initialData: SeguimientoDTO | null;
  pacienteId: number;
  especialistaId?: number;
}

export const SeguimientoForm: React.FC<SeguimientoFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  pacienteId,
  especialistaId,
}) => {
  const [fecha, setFecha] = useState<Date>(new Date());
  const [observacion, setObservacion] = useState("");
  const [selectedEspecialistaId, setSelectedEspecialistaId] = useState<number | string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [especialistas, setEspecialistas] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      getEspecialistas();
      if (initialData) {
        setFecha(new Date(initialData.fecha));
        setObservacion(initialData.observacion);
        setSelectedEspecialistaId(initialData.especialista.id);
      } else {
        setFecha(new Date());
        setObservacion("");
        setSelectedEspecialistaId(especialistaId || "");
        setFile(null);
      }
      setErrors({});
    }
  }, [isOpen, initialData, especialistaId]);

  const getEspecialistas = async () => {
      try {
        const data = await especialistasService.listarActivos(0, 100);
        setEspecialistas(data?.content || []);
      } catch (error) {
        console.error("Error fetching especialistas:", error);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!selectedEspecialistaId) {
      newErrors.especialista = "El especialista es requerido";
    }

    if (!observacion.trim()) {
      newErrors.observacion = "La observación es requerida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      const data = {
        pacienteId,
        especialistaId: Number(selectedEspecialistaId),
        fecha: fecha.toISOString(),
        observacion,
        activo: true,
      };

      await onSave(data, file || undefined);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const optionsEspecialistas = especialistas.map((esp) => ({
    value: String(esp.id),
    label: esp.nombresApellidos,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Editar Seguimiento" : "Nuevo Seguimiento"}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {initialData
            ? "Modifica los datos del seguimiento"
            : "Registra un nuevo evento de seguimiento"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="especialista">Especialista</Label>
          <div className="mt-1">
            <Select
              options={optionsEspecialistas}
              placeholder="Seleccione un especialista"
              onChange={(value) => {
                setSelectedEspecialistaId(value);
                if (errors.especialista) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.especialista;
                    return next;
                  });
                }
              }}
              value={String(selectedEspecialistaId)}
              error={!!errors.especialista}
              hint={errors.especialista}
            />
          </div>
        </div>
        <div>
          <Label>Fecha</Label>
          <div className="mt-1">
            <DatePicker
              id="fecha-seguimiento"
              defaultDate={fecha}
              onChange={(dates: Date[]) => {
                if (dates && dates.length > 0) {
                  setFecha(dates[0]);
                }
              }}
            />
          </div>
        </div>

        <div>
          <Label>Observación</Label>
          <TextArea
            value={observacion}
            onChange={(val) => {
              setObservacion(val);
              if (errors.observacion) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.observacion;
                  return next;
                });
              }
            }}
            placeholder="Escribe los detalles del seguimiento..."
            rows={5}
            className="mt-1"
            error={!!errors.observacion}
            hint={errors.observacion}
          />
        </div>

        <div>
          <Label>Documento Adjunto (Opcional)</Label>
          <div
            className={`mt-1 relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all min-h-[100px] ${
              file || initialData?.documento
                ? "border-green-200 bg-green-50/30 dark:border-green-500/30 dark:bg-green-500/5"
                : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-500 bg-white dark:bg-gray-900"
            }`}
          >
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            {file || initialData?.documento ? (
              <div className="flex flex-col items-center gap-2 text-center text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6 animate-in zoom-in-50 duration-300" />
                <span className="text-xs font-bold truncate max-w-[250px]">
                  {file ? file.name : initialData?.documento?.nombre}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center text-gray-500 dark:text-gray-400">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs font-semibold">
                  Click para adjuntar documento
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
