import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import PatientSelector from "../../common/PatientSelector";
import { User } from "lucide-react";

import HistoriaEscolarForm from "./sections/PsicologiaEducativa.tsx/HistoriaEscolarForm";
import DesarrolloForm from "./sections/PsicologiaEducativa.tsx/DesarrolloForm";
import AdaptacionForm from "./sections/PsicologiaEducativa.tsx/AdaptacionForm";
import EstadoGeneralForm from "./sections/PsicologiaEducativa.tsx/EstadoGeneralForm";
import Switch from "../switch/Switch";
import { GraduationCap, BookOpen, Settings, ClipboardCheck } from "lucide-react";

export interface FichaPsicologiaEducativaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  historiaEscolar: {
    asignaturasGustan: string;
    asignaturasDisgustan: string;
    relacionDocentes: string;
    causaRelacionDocentes: string;
    gustaIrInstitucion: boolean;
    causaGustaIrInstitucion: string;
    relacionConGrupo: string;
    causaRelacionConGrupo: string;
  };
  desarrollo: {
    cdi: boolean;
    cdiEdad: number;
    inicial1: boolean;
    inicial1Edad: number;
    inicial2: boolean;
    inicial2Edad: number;
    primerEGB: boolean;
    edad1roEGB: number;
    perdidaAnio: boolean;
    gradoCausaPerdidaAnio: string;
    desercionEscolar: boolean;
    gradoCausaDesercionEscolar: string;
    cambioInstitucion: boolean;
    gradoCausaCambioInstitucion: string;
    problemasAprendizaje: boolean;
    problemasAprendizajeEspecificar: string;
  };
  adaptacion: {
    inclusionEducativa: boolean;
    causaInclusionEducativa: string;
    adaptacionesCurriculares: boolean;
    gradoAdaptacion: string;
    especifiqueAsignaturas: string;
    evaluacionPsicologicaUOtrosAnterior: boolean;
    causaEvaluacionPsicologicaUOtrosAnterior: string;
    recibeApoyo: boolean;
    causaLugarTiempoRecibeApoyo: string;
  };
  estadoGeneral: {
    aprovechamientoGeneral: string;
    actividadEscolar: string;
    observaciones: string;
  };
}

export const initialPsicologiaEducativaState: FichaPsicologiaEducativaState = {
  pacienteId: 0,
  activo: true,
  historiaEscolar: {
    asignaturasGustan: "",
    asignaturasDisgustan: "",
    relacionDocentes: "",
    causaRelacionDocentes: "",
    gustaIrInstitucion: false,
    causaGustaIrInstitucion: "",
    relacionConGrupo: "",
    causaRelacionConGrupo: "",
  },
  desarrollo: {
    cdi: false,
    cdiEdad: 0,
    inicial1: false,
    inicial1Edad: 0,
    inicial2: false,
    inicial2Edad: 0,
    primerEGB: false,
    edad1roEGB: 0,
    perdidaAnio: false,
    gradoCausaPerdidaAnio: "",
    desercionEscolar: false,
    gradoCausaDesercionEscolar: "",
    cambioInstitucion: false,
    gradoCausaCambioInstitucion: "",
    problemasAprendizaje: false,
    problemasAprendizajeEspecificar: "",
  },
  adaptacion: {
    inclusionEducativa: false,
    causaInclusionEducativa: "",
    adaptacionesCurriculares: false,
    gradoAdaptacion: "",
    especifiqueAsignaturas: "",
    evaluacionPsicologicaUOtrosAnterior: false,
    causaEvaluacionPsicologicaUOtrosAnterior: "",
    recibeApoyo: false,
    causaLugarTiempoRecibeApoyo: "",
  },
  estadoGeneral: {
    aprovechamientoGeneral: "",
    actividadEscolar: "",
    observaciones: "",
  },
};

export default function FormularioPsicologiaEducativa() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaPsicologiaEducativaState>(
    initialPsicologiaEducativaState
  );
  const [loading, setLoading] = useState(false);

  const [verHistoriaEscolar, setVerHistoriaEscolar] = useState(false);
  const [verDesarrollo, setVerDesarrollo] = useState(false);
  const [verAdaptacion, setVerAdaptacion] = useState(false);
  const [verEstadoGeneral, setVerEstadoGeneral] = useState(false);

  const [areaAcademica, setAreaAcademica] = useState(false);
  const [areaApoyo, setAreaApoyo] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState<{
    nombresApellidos: string;
    cedula: string;
  } | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const isEdit = !!id;
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pacienteIdParam = searchParams.get("pacienteId");
    if (isEdit && id) {
      loadFicha(id);
    } else if (pacienteIdParam) {
      loadPacienteFromUrl(pacienteIdParam);
    } else {
        setShowSelector(true);
    }
  }, [id, isEdit, searchParams]);

  const loadPacienteFromUrl = async (id: string) => {
    try {
      setLoading(true);
      const paciente = await pacientesService.obtenerPorId(id);
      if (paciente) {
        setSelectedPatient(paciente);
        setFormData((prev) => ({ ...prev, pacienteId: paciente.id }));
        setShowSelector(false);
      }
    } catch (error) {
      console.error("Error loading patient from URL", error);
      toast.error("Error al cargar datos del paciente asociado");
    } finally {
      setLoading(false);
    }
  };

  const isSectionEmpty = (sectionData: any, initialSectionData: any) => {
    if (!sectionData) return true;

    return Object.keys(initialSectionData).every((key) => {
      const v1 = sectionData[key];
      const v2 = initialSectionData[key];

      const normalize = (v: any) => (v === null || v === undefined ? "" : v);

      return normalize(v1) === normalize(v2);
    });
  };

  const loadFicha = async (fichaId: string) => {
    try {
      setLoading(true);
      const data = await fichasService.obtenerPsicologiaEducativa(fichaId);
      if (data) {
        const loadedData = {
            ...data,
            pacienteId: data.pacienteId || data.paciente?.id
        };
        setFormData(loadedData);

        const hasHistoria = !isSectionEmpty(data.historiaEscolar, initialPsicologiaEducativaState.historiaEscolar);
        const hasDesarrollo = !isSectionEmpty(data.desarrollo, initialPsicologiaEducativaState.desarrollo);
        const hasAdaptacion = !isSectionEmpty(data.adaptacion, initialPsicologiaEducativaState.adaptacion);
        const hasEstado = !isSectionEmpty(data.estadoGeneral, initialPsicologiaEducativaState.estadoGeneral);

        if (hasHistoria) setVerHistoriaEscolar(true);
        if (hasDesarrollo) setVerDesarrollo(true);
        if (hasAdaptacion) setVerAdaptacion(true);
        if (hasEstado) setVerEstadoGeneral(true);

        if (hasHistoria || hasDesarrollo) setAreaAcademica(true);
        if (hasAdaptacion || hasEstado) setAreaApoyo(true);

        if (data.paciente) {
            try {
                const paciente = await pacientesService.obtenerPorId(data.paciente.id);
                setSelectedPatient(paciente);
            } catch (pError) {
                console.warn("Could not load patient details", pError);
            }
        }
      } else {
        toast.error("No se encontró la ficha");
        navigate("/fichas?tab=psicologia_educativa");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/fichas?tab=psicologia_educativa");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FichaPsicologiaEducativaState,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!formData.pacienteId) {
        toast.error("Debe seleccionar un paciente");
        return;
    }

    try {
      setLoading(true);
      if (isEdit && formData.id) {
        await fichasService.actualizarPsicologiaEducativa(formData.id, formData);
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("No se encontró la ficha");
        return;
      } else {
        await fichasService.crearPsicologiaEducativa(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=psicologia_educativa");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este paciente ya tiene una ficha activa.");
      } else {
        toast.error(
          isEdit ? "Error al actualizar la ficha" : "Error al crear la ficha"
        );
      }
      console.error("Error saving ficha:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePatientSelect = (paciente: any) => {
    setFormData((prev) => ({ ...prev, pacienteId: paciente.id }));
    setSelectedPatient(paciente);
    setShowSelector(false);
  };

  if (loading && isEdit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Cargando ficha...
        </p>
      </div>
    );
  }
  
  if (showSelector) {
    return (
      <div className="space-y-6">
        <PatientSelector onSelect={handlePatientSelect} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedPatient && (
        <div className="bg-red-50/20 dark:bg-gray-800 p-4 rounded-3xl flex items-center justify-between border-2 border-brand-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-400 dark:bg-gray-500 rounded-full text-white font-bold dark:text-gray-200">
              <User size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">
                {selectedPatient.nombresApellidos}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                CI: {selectedPatient.cedula}
              </p>
            </div>
          </div>
          {!isEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSelector(true)}
            >
              Cambiar Paciente
            </Button>
          )}
        </div>
      )}

      {/* Selectores de Área Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setAreaAcademica(!areaAcademica)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaAcademica
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaAcademica
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <GraduationCap size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Información Académica
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Historia y Desarrollo Escolar
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaAcademica ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaAcademica}
                onChange={(v) => setAreaAcademica(v)}
              />
            </div>
          </div>
        </div>

        <div
          onClick={() => setAreaApoyo(!areaApoyo)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaApoyo
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaApoyo
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Settings size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Necesidades y Apoyo
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adaptaciones y Estado General
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaApoyo ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaApoyo}
                onChange={(v) => setAreaApoyo(v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Información Académica */}
      {areaAcademica && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <div className="flex items-center gap-2 px-2">
            <BookOpen size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos Académicos
            </span>
          </div>

          <ComponentCard
            title="Historia Escolar"
            action={
              <Switch
                label=""
                checked={verHistoriaEscolar}
                onChange={(val) => setVerHistoriaEscolar(val)}
              />
            }
            onHeaderClick={() => setVerHistoriaEscolar(!verHistoriaEscolar)}
            bodyDisabled={!verHistoriaEscolar}
          >
            <HistoriaEscolarForm
              data={formData.historiaEscolar}
              onChange={(field, value) =>
                handleNestedChange("historiaEscolar", field, value)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Desarrollo Escolar"
            action={
              <Switch
                label=""
                checked={verDesarrollo}
                onChange={(val) => setVerDesarrollo(val)}
              />
            }
            onHeaderClick={() => setVerDesarrollo(!verDesarrollo)}
            bodyDisabled={!verDesarrollo}
          >
            <DesarrolloForm
              data={formData.desarrollo}
              onChange={(field, value) =>
                handleNestedChange("desarrollo", field, value)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Necesidades y Apoyo */}
      {areaApoyo && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
          <div className="flex items-center gap-2 px-2">
            <ClipboardCheck size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Apoyo
            </span>
          </div>

          <ComponentCard
            title="Adaptación"
            action={
              <Switch
                label=""
                checked={verAdaptacion}
                onChange={(val) => setVerAdaptacion(val)}
              />
            }
            onHeaderClick={() => setVerAdaptacion(!verAdaptacion)}
            bodyDisabled={!verAdaptacion}
          >
            <AdaptacionForm
              data={formData.adaptacion}
              onChange={(field, value) =>
                handleNestedChange("adaptacion", field, value)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Estado General"
            action={
              <Switch
                label=""
                checked={verEstadoGeneral}
                onChange={(val) => setVerEstadoGeneral(val)}
              />
            }
            onHeaderClick={() => setVerEstadoGeneral(!verEstadoGeneral)}
            bodyDisabled={!verEstadoGeneral}
          >
            <EstadoGeneralForm
              data={formData.estadoGeneral}
              onChange={(field, value) =>
                handleNestedChange("estadoGeneral", field, value)
              }
            />
          </ComponentCard>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/fichas?tab=psicologia_educativa")}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          {loading
            ? "Guardando..."
            : isEdit
            ? "Actualizar Ficha"
            : "Guardar Ficha"}
        </Button>
      </div>
    </div>
  );
}
