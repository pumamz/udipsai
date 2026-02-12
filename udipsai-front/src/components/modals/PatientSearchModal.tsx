import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { pacientesService } from "../../services/pacientes";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import InputField from "../form/input/InputField";
import Badge from "../ui/badge/Badge";
import { Search, User, ChevronRight, UserSearch } from "lucide-react";

interface PatientSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (patient: any) => void;
}

const PatientSearchModal: React.FC<PatientSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (search.length < 3) {
      toast.error("Ingrese al menos 3 caracteres");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const response = await pacientesService.filtrar({ search });
      setPatients(response.content || []);
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("Error al buscar pacientes");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (patient: any) => {
    onSelect(patient);
    onClose();
    setSearch("");
    setPatients([]);
    setSearched(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-0 overflow-hidden"
    >
      <div className="px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center text-brand-500">
            <UserSearch size={30} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Buscar Paciente
            </h3>
            <p className="text-md text-gray-500 font-medium">
              Busque por nombres, apellidos o número de cédula.
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <InputField
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ej: Juan Perez o 0102030405..."
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="px-8 rounded-xl font-bold"
            startIcon={<Search size={18} />}
          />
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar -mx-2 px-2">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Buscando pacientes...</p>
            </div>
          ) : patients.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className="group flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-brand-300 dark:hover:border-brand-500/30 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                      {patient.nombresApellidos}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge
                        variant="light"
                        color="light"
                        size="sm"
                        startIcon={<User size={10} />}
                      >
                        {patient.cedula}
                      </Badge>
                      {patient.correo && (
                        <span className="text-xs text-gray-400 truncate hidden sm:inline">
                          {patient.correo}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all text-brand-500">
                    <ChevronRight size={24} />
                  </div>
                </div>
              ))}
            </div>
          ) : searched ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="text-gray-400 mb-4 flex justify-center dark:text-gray-700">
                <Search size={48} />
              </div>
              <p className="text-gray-600 font-medium dark:text-gray-400">
                No se encontraron coincidencias
              </p>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                Intente con otros términos de búsqueda.
              </p>
            </div>
          ) : (
            <div className="py-20 text-center opacity-40 dark:opacity-100">
              <div className="text-gray-400 mb-4 flex justify-center dark:text-gray-700">
                <UserSearch size={48} />
              </div>
              <p className="font-medium dark:text-gray-400">
                Busque un paciente para comenzar
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PatientSearchModal;
