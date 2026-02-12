import React from "react";
import { User, FileText, Trash, Pen } from "lucide-react";
import Button from "../ui/button/Button";
import { SeguimientoDTO } from "../../services/seguimientos";
import { documentosService } from "../../services";
import { toast } from "react-toastify";

interface SeguimientoCardProps {
  seguimiento: SeguimientoDTO;
  onEdit: (seguimiento: SeguimientoDTO) => void;
  onDelete: (id: number) => void;
}

export const SeguimientoCard: React.FC<SeguimientoCardProps> = ({
  seguimiento,
  onEdit,
  onDelete,
}) => {
  const dateObj = new Date(seguimiento.fecha);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatDay = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
    }).format(date);
  };

  return (
    <div className="relative pl-8 sm:pl-32 py-6 group">
      <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-200 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-brand-500 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5 dark:before:bg-slate-700 dark:after:border-slate-900">
        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-28 h-6 mb-3 sm:mb-0 text-brand-600 bg-brand-100 rounded-full dark:bg-brand-500/20 dark:text-brand-400">
          {formatDate(dateObj)}
        </time>
        <div className="text-xl font-bold text-slate-800 dark:text-slate-100 lg:text-2xl ml-4 sm:ml-0 capitalize">
          {formatDay(dateObj)}
        </div>
      </div>

      <div className="relative px-4 py-4 bg-white border border-gray-100 rounded-xl shadow-sm dark:bg-white/[0.03] dark:border-white/[0.05] hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
              <User size={16} className="text-brand-500" />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {seguimiento.especialista.nombresApellidos}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {seguimiento.especialista.especialidad.area}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {seguimiento.observacion}
            </p>

            {seguimiento.documento && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-2 h-8"
                  onClick={async () => {
                    try {
                      await documentosService.descargar(seguimiento.documento!.id);
                    } catch (error) {
                      toast.error("Error al descargar el documento");
                    }
                  }}
                >
                  <FileText size={14} />
                  Ver Documento Adjunto
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-start opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(seguimiento)}
              className="hover:bg-white hover:text-yellow-600 p-2 text-blue-600 dark:text-blue-400"
              title="Editar"
            >
              <Pen size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(seguimiento.id)}
              className="hover:bg-red-500 hover:text-white p-2 text-red-600 dark:text-red-400"
              title="Eliminar"
            >
              <Trash size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
