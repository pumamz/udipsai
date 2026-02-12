import React, { useState } from "react";
import Switch from "../form/switch/Switch";
import { ChevronDown, ShieldCheck } from "lucide-react";

export interface PermissionsState {
  // Modules
  pacientes: boolean;
  pasantes: boolean;
  sedes: boolean;
  especialistas: boolean;
  especialidades: boolean;
  asignaciones: boolean;
  recursos: boolean;
  institucionesEducativas: boolean;
  historiaClinica: boolean;
  fonoAudiologia: boolean;
  psicologiaClinica: boolean;
  psicologiaEducativa: boolean;
  citas: boolean;

  // Granular - Pacientes
  pacientesCrear?: boolean;
  pacientesEditar?: boolean;
  pacientesEliminar?: boolean;

  // Granular - Pasantes
  pasantesCrear?: boolean;
  pasantesEditar?: boolean;
  pasantesEliminar?: boolean;

  // Granular - Sedes
  sedesCrear?: boolean;
  sedesEditar?: boolean;
  sedesEliminar?: boolean;

  // Granular - Especialistas
  especialistasCrear?: boolean;
  especialistasEditar?: boolean;
  especialistasEliminar?: boolean;

  // Granular - Especialidades
  especialidadesCrear?: boolean;
  especialidadesEditar?: boolean;
  especialidadesEliminar?: boolean;

  // Granular - Asignaciones
  asignacionesCrear?: boolean;
  asignacionesEditar?: boolean;
  asignacionesEliminar?: boolean;

  // Granular - Recursos
  recursosCrear?: boolean;
  recursosEditar?: boolean;
  recursosEliminar?: boolean;

  // Granular - Instituciones
  institucionesEducativasCrear?: boolean;
  institucionesEducativasEditar?: boolean;
  institucionesEducativasEliminar?: boolean;

  // Granular - Historia Clinica
  historiaClinicaCrear?: boolean;
  historiaClinicaEditar?: boolean;
  historiaClinicaEliminar?: boolean;

  // Granular - Fonoaudiologia
  fonoAudiologiaCrear?: boolean;
  fonoAudiologiaEditar?: boolean;
  fonoAudiologiaEliminar?: boolean;

  // Granular - Psicologia Clinica
  psicologiaClinicaCrear?: boolean;
  psicologiaClinicaEditar?: boolean;
  psicologiaClinicaEliminar?: boolean;

  // Granular - Psicologia Educativa
  psicologiaEducativaCrear?: boolean;
  psicologiaEducativaEditar?: boolean;
  psicologiaEducativaEliminar?: boolean;

  // Granular - Citas
  citasCrear?: boolean;
  citasEditar?: boolean;
  citasEliminar?: boolean;
}

interface PermisosTableProps {
  permissions: PermissionsState;
  onChange: (key: keyof PermissionsState, value: boolean) => void;
  readOnly?: boolean;
}

const categories = [
  {
    name: "Gestión Clínica",
    modules: [
      { key: "pacientes", label: "Pacientes" },
      { key: "historiaClinica", label: "Historia Clínica" },
      { key: "citas", label: "Citas" },
      { key: "fonoAudiologia", label: "Fonoaudiología" },
      { key: "psicologiaClinica", label: "Psicología Clínica" },
      { key: "psicologiaEducativa", label: "Psicología Educativa" },
    ] as const,
  },
  {
    name: "Administración",
    modules: [
      { key: "especialistas", label: "Especialistas" },
      { key: "pasantes", label: "Pasantes" },
      { key: "asignaciones", label: "Asignaciones" },
      { key: "especialidades", label: "Especialidades" },
    ] as const,
  },
  {
    name: "Sistema y Red",
    modules: [
      { key: "sedes", label: "Sedes" },
      { key: "institucionesEducativas", label: "Instituciones Educativas" },
      { key: "recursos", label: "Recursos" },
    ] as const,
  },
];

export const PermisosTable: React.FC<PermisosTableProps> = ({
  permissions,
  onChange,
  readOnly = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainToggle = (key: string, value: boolean) => {
    onChange(key as keyof PermissionsState, value);
    
    const actions = ["Crear", "Editar", "Eliminar"];
    actions.forEach((action) => {
      onChange(`${key}${action}` as keyof PermissionsState, value);
    });
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 group-hover:bg-blue-light-50 group-hover:text-blue-light-500 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 group-hover:text-blue-light-600 transition-colors">
                Configuración de Permisos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gestión de accesos y acciones permitidas
              </p>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-blue-light-500" : ""}`} 
          />
        </button>

        <div 
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="border-t border-gray-100 dark:border-gray-800">
            {categories.map((category, catIdx) => (
              <div key={category.name} className={`${catIdx !== 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
                <div className="bg-gray-50/50 dark:bg-white/5 px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {category.name}
                  </span>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {category.modules.map((module) => {
                    const accessKey = module.key as keyof PermissionsState;
                    const hasAccess = !!permissions[accessKey];

                    return (
                      <div 
                        key={module.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 px-6 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors gap-6"
                      >
                        <div className="flex items-center gap-4 min-w-[280px]">
                          <div className="scale-100">
                            <Switch
                              label=""
                              checked={hasAccess}
                              onChange={(val) => handleMainToggle(accessKey, val)}
                              disabled={readOnly}
                              color="blue"
                            />
                          </div>
                          <span className={`text-base font-semibold ${hasAccess ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                            {module.label}
                          </span>
                        </div>

                        <div className={`flex flex-wrap items-center gap-8 transition-all duration-300 ${hasAccess ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}>
                          {["Crear", "Editar", "Eliminar"].map((action) => {
                            const key = `${module.key}${action}` as keyof PermissionsState;
                            return (
                              <div key={action} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {action}
                                </span>
                                <div className="scale-90 origin-left">
                                  <Switch
                                    label=""
                                    checked={!!permissions[key]}
                                    onChange={(val) => onChange(key, val)}
                                    disabled={readOnly || !hasAccess}
                                    color="blue"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
