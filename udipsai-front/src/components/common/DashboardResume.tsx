import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { pacientesService, especialistasService, pasantesService } from "../../services";
import { citasService } from "../../services/citas";

export default function DashboardResume() {
  const { userIdentity, userRole } = useAuth();
  const [totalPacientes, setTotalPacientes] = useState<number | string>("-");
  const [citasHoy, setCitasHoy] = useState<number | string>("-");
  const [citasPendientes, setCitasPendientes] = useState<number | string>("-");

  const isEspecialista = userRole === "ROLE_ESPECIALISTA";
  const isPasante = userRole === "ROLE_PASANTE";
  const isProfesional = isEspecialista || isPasante;

  useEffect(() => {
    const fetchTotalPatients = async () => {
      try {
        const params: any = { activo: true };
        const pacientesData = await pacientesService.listarActivos(params.page, params.size, params.sort);

        if (pacientesData?.totalElements !== undefined) {
          setTotalPacientes(pacientesData.totalElements);
        } else if (Array.isArray(pacientesData)) {
          setTotalPacientes(pacientesData.length);
        } else if (pacientesData?.content && Array.isArray(pacientesData.content)) {
          setTotalPacientes(pacientesData.content.length);
        }
      } catch (error) {
        console.error("Error fetching total patients:", error);
      }
    };

    const fetchProfessionalStats = async () => {
      if (!isProfesional || !userIdentity) return;
      try {
        let data = null;
        if (isEspecialista) {
          data = await especialistasService.filtrar({ search: userIdentity });
        } else if (isPasante) {
          data = await pasantesService.filtrar({ search: userIdentity });
        }

        if (data) {
          const profId = data.content[0].id;
          const resumen = await citasService.obtenerResumen(profId);
          setCitasHoy(resumen.citasHoy ?? 0);
          setCitasPendientes(resumen.pendientesTotales ?? 0);
        }
      } catch (error) {
        console.error("Error fetching professional dashboard stats:", error);
      }
    };

    fetchTotalPatients();
    fetchProfessionalStats();
  }, [userIdentity, isEspecialista, isPasante]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UsersIcon size={20} className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total de pacientes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalPacientes}
            </h4>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl dark:bg-blue-900/20">
          <CalendarIcon size={20} className="text-blue-600 size-6 dark:text-blue-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Citas de hoy
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {citasHoy}
            </h4>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-xl dark:bg-orange-900/20">
          <ClockIcon size={20} className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Citas pendientes
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {citasPendientes}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
