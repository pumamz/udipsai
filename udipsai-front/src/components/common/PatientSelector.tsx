import{ useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { pacientesService } from "../../services/pacientes";
import Button from "../ui/button/Button";

interface Paciente {
  id: number;
  nombresApellidos: string;
  cedula: string;
}

interface PatientSelectorProps {
  onSelect: (paciente: Paciente) => void;
}

export default function PatientSelector({ onSelect }: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm.length >= 3) {
      searchPatients(debouncedTerm);
    } else {
      setResults([]);
    }
  }, [debouncedTerm]);

  const searchPatients = async (term: string) => {
    setLoading(true);
    try {
      const response = await pacientesService.filtrar({ search: term, activo: true });
      setResults(response.content);
    } catch (error) {
      console.error("Error searching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Seleccionar Paciente
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Busque por nombre o cédula para asignar la ficha
        </p>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
          placeholder="Ingrese nombre o cédula (min. 3 caracteres)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {results.length > 0 ? (
          results.map((paciente) => (
            <div
              key={paciente.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all cursor-pointer group"
              onClick={() => onSelect(paciente)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {paciente.nombresApellidos}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CI: {paciente.cedula}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="primary" className="opacity-0 group-hover:opacity-100">
                Seleccionar
              </Button>
            </div>
          ))
        ) : debouncedTerm.length >= 3 && !loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
             No se encontraron pacientes
          </div>
        ) : null}
        
        {debouncedTerm.length < 3 && (
           <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
             Escriba para buscar...
           </div>
        )}
      </div>
    </div>
  );
}
