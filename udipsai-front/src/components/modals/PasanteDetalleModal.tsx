import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { FileDown } from "lucide-react";
import Button from "../ui/button/Button";
import { pasantesService } from "../../services/pasantes";
import { toast } from "react-toastify";

interface Pasante {
  id: number;
  nombresApellidos: string;
  cedula: string;
  fechaNacimiento: string;
  email: string;
  activo: boolean;
  ciudad: string;
  domicilio: string;
  numeroTelefono: string;
  numeroCelular: string;
  especialidad: { id: number; area: string };
  especialista: { id: number; nombresApellidos: string };
  sede: { id: number; nombre: string };
  inicioPasantia: string;
  finPasantia: string;
}

interface PasanteDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pasante: Pasante | null;
}

const calcularEdad = (fechaNacimiento: string) => {
  if (!fechaNacimiento) return 0;
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const fechaActual = new Date();
  let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
  const mesNacimiento = fechaNacimientoDate.getMonth();
  const diaNacimiento = fechaNacimientoDate.getDate();
  const mesActual = fechaActual.getMonth();
  const diaActual = fechaActual.getDate();
  if (mesNacimiento > mesActual || (mesNacimiento === mesActual && diaNacimiento > diaActual)) {
    edad--;
  }
  return edad;
};

export const PasanteDetalleModal: React.FC<PasanteDetalleModalProps> = ({
  isOpen,
  onClose,
  pasante,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    if (!pasante) return;
    try {
      setIsExporting(true);
      toast.info("Generando reporte PDF...");
      const blob = await pasantesService.exportarPdf(pasante.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `detalle_pasante_${pasante.cedula}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reporte PDF generado correctamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      toast.error("Error al generar el reporte PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (!pasante) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-6" showCloseButton={false}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {pasante.nombresApellidos}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {pasante.cedula}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileDown size={16} />
          {isExporting ? "Generando..." : "Reporte PDF"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombres y Apellidos
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.nombresApellidos}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Cédula
                </label>
                <p className="text-gray-900 dark:text-white">{pasante.cedula}</p>
            </div>
             <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
                </label>
                <p className="text-gray-900 dark:text-white">{pasante.email}</p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fecha de Nacimiento
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.fechaNacimiento || "N/A"}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Edad
                </label>
                <p className="text-gray-900 dark:text-white">
                {calcularEdad(pasante.fechaNacimiento)}
                </p>
            </div>
            </div>

            <div className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Teléfono / Celular
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.numeroTelefono} / {pasante.numeroCelular}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ciudad / Domicilio
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.ciudad} - {pasante.domicilio}
                </p>
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sede
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.sede?.nombre}
                </p>
            </div>
             <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Especialidad
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.especialidad?.area || "N/A"}
                </p>
            </div>
             <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tutor (Especialista)
                </label>
                <p className="text-gray-900 dark:text-white">
                {pasante.especialista?.nombresApellidos || "N/A"}
                </p>
            </div>
            </div>
             <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fecha Inicio Pasantía
                        </label>
                        <p className="text-gray-900 dark:text-white">
                        {pasante.inicioPasantia || "N/A"}
                        </p>
                    </div>
                     <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fecha Fin Pasantía
                        </label>
                        <p className="text-gray-900 dark:text-white">
                        {pasante.finPasantia || "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
  );
};
