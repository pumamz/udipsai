import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { especialistasService } from "../../services/especialistas";
import { pasantesService } from "../../services/pasantes";
import InputField from "../form/input/InputField";
import Badge from "../ui/badge/Badge";
import {
  Search,
  ChevronRight,
  Stethoscope,
  GraduationCap,
} from "lucide-react";

interface ProfessionalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (professional: any) => void;
  type: "ESPEC" | "PASANTE";
  filterId?: number | string;
}

const ProfessionalSearchModal: React.FC<ProfessionalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  type,
  filterId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      loadProfessionals("");
    }
  }, [isOpen, type, filterId]);

  const loadProfessionals = async (term: string) => {
    setLoading(true);
    try {
      let data;
      if (type === "ESPEC") {
        data = await especialistasService.filtrar(
          {
            search: term,
            especialidadId: filterId ? Number(filterId) : undefined,
            activo: true,
          },
          0,
          100,
        );
      } else {
        data = await pasantesService.filtrar(
          {
            search: term,
            especialistaId: filterId ? Number(filterId) : undefined,
            activo: true,
          },
          0,
          100,
        );
      }

      const list = data?.content || [];
      setProfessionals(list);
    } catch (error) {
      console.error("Error searching professionals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    loadProfessionals(term);
  };

  const getProfessionalSubtitle = (p: any) => {
    if (type === "ESPEC") {
      return p.especialidad?.area || p.especialidad?.nombre || "General";
    } else {
      return p.carrera || "Pasante";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-0 overflow-hidden"
    >
      <div className="px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              type === "ESPEC"
                ? "bg-brand-500/10 text-brand-600"
                : "bg-purple-500/10 text-purple-600"
            }`}
          >
            {type === "ESPEC" ? (
              <Stethoscope size={24} />
            ) : (
              <GraduationCap size={24} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Buscar {type === "ESPEC" ? "Especialista" : "Pasante"}
            </h3>
            <p className="text-md text-gray-500 font-medium">
              {type === "ESPEC"
                ? "Filtre por nombre o especialidad"
                : "Filtre por nombre o carrera"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <div className="relative">
            <InputField
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={`Buscar por nombre o identificación...`}
              className="w-full pl-10"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar -mx-2 px-2">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">
                Buscando profesionales...
              </p>
            </div>
          ) : professionals.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {professionals.map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => {
                    onSelect(prof);
                    onClose();
                  }}
                  className="group flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                      {prof.nombresApellidos}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="light"
                        color={type === "ESPEC" ? "primary" : "light"}
                        size="sm"
                      >
                        {getProfessionalSubtitle(prof)}
                      </Badge>
                      <span className="text-[10px] text-gray-400 font-medium bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded uppercase">
                        C.I: {prof.cedula}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all text-brand-500">
                    <ChevronRight size={24} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="text-gray-300 dark:text-gray-700 mb-4 flex justify-center">
                <Search size={48} />
              </div>
              <p className="text-gray-500 font-bold">
                No se encontraron resultados
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Intente con otros términos de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfessionalSearchModal;
