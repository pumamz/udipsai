import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import PatientSelector from "../../common/PatientSelector";
import { User, Ear, MessageSquare } from "lucide-react";

import HablaForm from "./sections/Fonoaudiologia/HablaForm";
import AudicionForm from "./sections/Fonoaudiologia/AudicionForm";
import FonacionForm from "./sections/Fonoaudiologia/FonacionForm";
import HistoriaAuditivaForm from "./sections/Fonoaudiologia/HistoriaAuditivaForm";
import VestibularForm from "./sections/Fonoaudiologia/VestibularForm";
import OtoscopiaForm from "./sections/Fonoaudiologia/OtoscopiaForm";
import Switch from "../switch/Switch";

export interface FonoaudiologiaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  habla: any;
  audicion: any;
  fonacion: any;
  historiaAuditiva: any;
  vestibular: any;
  otoscopia: any;
}

export const initialFonoaudiologiaState: FonoaudiologiaState = {
  pacienteId: 0,
  activo: true,
  habla: {
    dificultadPronunciarPalabras: false,
    seTrabaCuandoHabla: false,
    seEntiendeLoQueDice: false,
    sabeComoLlamanObjetosEntorno: false,
    comprendeLoQueSeLeDice: false,
    reconoceFuenteSonora: false,
    comunicacionPreferentementeForma: "",
    trastornoEspecificoPronunciacion: false,
    trastornoLenguajeExpresivo: false,
    afasiaAdquiridaEpilepsia: false,
    otrosTrastornosDesarrolloHabla: false,
    trastornoDesarrolloHablaLenguaje: false,
    trastornoRecepcionLenguaje: false,
    alteracionesHabla: false,
    disfasiaAfasia: false,
    disartriaAnartria: false,
    otrasAlteracionesHabla: false,
  },
  audicion: {
    seARealizadoExamenAudiologico: false,
    perdidaAuditivaConductivaNeurosensorial: false,
    audicionNormal: false,
    hipoacusiaConductivaBilateral: false,
    hipoacusiaConductivaUnilateral: false,
    hipoacusiaNeurosensorialBilateral: false,
    hipoacusiaNeurosensorialUnilateral: false,
    detallesAudicion: "",
    infeccionesOidoFuertes: false,
    cualInfeccionesOidoFuertes: "",
    edadInfeccionesOidoFuertes: 0,
    perdidaAuditiva: false,
    oidoDerecho: false,
    oidoIzquierdo: false,
    bilateral: false,
    gradoPerdida: "",
    permanecia: "",
    otitis: false,
    tipoOtitis: "",
    duracionOtitisInicio: "",
    duracionOtitisFin: "",
    antecedentesFamiliares: false,
    exposisionRuidos: false,
    ototoxicos: false,
    infecciones: false,
    usoAudifonos: false,
    inicioAyudasAuditivas: "",
    finUsoAyudasAuditivas: "",
    implanteCoclear: false,
    vibradorOseo: false
  },
  fonacion: {
    creeTonoVozEstudianteApropiado: false,
    respiracionNormal: false,
    situacionesAlteraTonoVoz: "",
    desdeCuandoAlteracionesVoz: "",
    tonoDeVoz: "",
    respiracion: "",
    ronca: false,
    roncaDesdeCuando: "",
    juegoVocal: false,
    juegoVocalDesdeCuando: "",
    vocalizacion: false,
    vocalizacionDesdeCuando: "",
    balbuceo: false,
    balbuceoDesdeCuando: "",
    silabeo: false,
    silabeoDesdeCuando: "",
    primerasPalabras: false,
    primerasPalabrasDesdeCuando: "",
    oracionesDosPalabras: false,
    oracionesDosPalabrasDesdeCuando: "",
    oracionesTresPalabras: false,
    oracionesTresPalabrasDesdeCuando: "",
    formacionLinguisticaCompleta: false,
    formacionLinguisticaCompletaDesdeCuando: "",
    numeroTotalPalabras: 0,
  },
  historiaAuditiva: {
    otalgia: false,
    otalgiaUnilateral: false,
    otalgiaOidoDerecho: false,
    otalgiaOidoIzquierdo: false,
    otalgiaBilateral: false,
    permanenciaOtalgiaContinua: false,
    permanenciaOtalgiaIntermitente: false,
    gradoPermanenciaOtalgia: "",
    asociadaOtalgiaInfeccionRespiratoriaAlta: false,
    infeccionRespiratoriaPunzante: false,
    infeccionRespiratoriaPulsatil: false,
    infeccionRespiratoriaProgresivo: false,
    infeccionRespiratoriaOpresivo: false,
    pruriginoso: false,
    aumentaMasticar: false,
    disminuyeConCalorLocal: false,
    aumentaConCalorLocal: false,
    otorrea: false,
    otorreaUnilateral: false,
    otorreaOidoDerecho: false,
    otorreaOidoIzquierdo: false,
    otorreaBilateral: false,
    permanenciaOtorreaContinua: false,
    permanenciaOtorreaIntermitente: false,
    gradoPermanenciaOtorrea: "",
    aspectoClaroOtorrea: false,
    aspectoSerosoOtorrea: false,
    aspectoMucosoOtorrea: false,
    aspectoMucopurulentoOtorrea: false,
    aspectoPurulentoOtorrea: false,
    aspectoSanguinolentoOtorrea: false,
    asosiadaOtorreaInfeccionRespiratoriaAlta: false,
    asosiadaotorreaInfeccionAgudaOido: false,
    presentoOtalgia: false,
    presentoOtalgiaBilateral: false,
    presentoOtalgiaOidoDerecho: false,
    presentoOtalgiaOidoIzquierdo: false,
    presentoSensacionOidoTapado: false,
    presentoSensacionOidoTapadoBilateral: false,
    presentoSensacionOidoTapadoOidoDerecho: false,
    presentoSensacionOidoTapadoOidoIzquierdo: false,
    presentoAutofonia: false,
    presentoAutofoniaBilateral: false,
    presentoAutofoniaOidoDerecho: false,
    presentoAutofoniaOidoIzquierdo: false,
    presentoOtorrea: false,
    presentoOtorreaBilateral: false,
    presentoOtorreaOidoDerecho: false,
    presentoOtorreaOidoIzquierdo: false,
    aumentaVolumenTV: false,
    sensacionPercibirTinnitus: false,
    expuestoRuidosFuertes: false,
    dificultadOidVozBaja: false,
    hablaMasFuerteOMasDespacio: false,
    utilizaAyudaAuditiva: false,
    especficarAyudaAuditiva: "",
    percibeSonidoIgualAmbosOidos: false,
    conQueOidoEscuchaMejor: "",
    haceCuantoTiempoPresentaSintomasAuditivos: "",
  },
  vestibular: {
    faltaEquilibrioCaminar: false,
    mareos: false,
    cuandoMareos: "",
    vertigo: false,
  },
  otoscopia: {
    palpacionPabellonOidoDerecho: "",
    palpacionMastoidesOidoDerecho: "",
    caeOidoDerecho: "",
    obstruccionOidoDerecho: "",
    aparienciaMenbranaTimpanicaOidoDerecho: "",
    perforacionOidoDerecho: false,
    burbujaOidoDerecho: false,
    coloracionOidoDerecho: "",
    palpacionPabellonOidoIzquierdo: "",
    palpacionMastoidesOidoIzquierdo: "",
    caeOidoIzquierdo: "",
    obstruccionOidoIzquierdo: "",
    aparienciaMenbranaTimpanicaOidoIzquierdo: "",
    perforacionOidoIzquierdo: false,
    burbujaOidoIzquierdo: false,
    coloracionOidoIzquierdo: "",
  },
};

export default function FormularioFonoaudiologia() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FonoaudiologiaState>(
    initialFonoaudiologiaState
  );
  const [loading, setLoading] = useState(false);
  const [verSeccionHabla, setVerSeccionHabla] = useState(false);
  const [verSeccionAudicion, setVerSeccionAudicion] = useState(false);
  const [verSeccionFonacion, setVerSeccionFonacion] = useState(false);
  const [verSeccionVestibular, setVerSeccionVestibular] = useState(false);
  const [verSeccionOtoscopia, setVerSeccionOtoscopia] = useState(false);
  const [verSeccionHistoriaAuditiva, setVerSeccionHistoriaAuditiva] =
    useState(false);

  const [areaAudicion, setAreaAudicion] = useState(false);
  const [areaLenguaje, setAreaLenguaje] = useState(false);

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
      const data = await fichasService.obtenerFonoaudiologia(fichaId);
      if (data) {
        const loadedData = {
          ...data,
          pacienteId: data.pacienteId || data.paciente?.id,
        };
        setFormData(loadedData);

        const hasHabla = !isSectionEmpty(data.habla, initialFonoaudiologiaState.habla);
        const hasAudicion = !isSectionEmpty(data.audicion, initialFonoaudiologiaState.audicion);
        const hasFonacion = !isSectionEmpty(data.fonacion, initialFonoaudiologiaState.fonacion);
        const hasHistoria = !isSectionEmpty(data.historiaAuditiva, initialFonoaudiologiaState.historiaAuditiva);
        const hasVestibular = !isSectionEmpty(data.vestibular, initialFonoaudiologiaState.vestibular);
        const hasOtoscopia = !isSectionEmpty(data.otoscopia, initialFonoaudiologiaState.otoscopia);

        if (hasHabla) setVerSeccionHabla(true);
        if (hasAudicion) setVerSeccionAudicion(true);
        if (hasFonacion) setVerSeccionFonacion(true);
        if (hasHistoria) setVerSeccionHistoriaAuditiva(true);
        if (hasVestibular) setVerSeccionVestibular(true);
        if (hasOtoscopia) setVerSeccionOtoscopia(true);

        if (hasHabla || hasFonacion) setAreaLenguaje(true);
        if (hasAudicion || hasHistoria || hasVestibular || hasOtoscopia) setAreaAudicion(true);

        if (data.paciente) {
          try {
            const paciente = await pacientesService.obtenerPorId(
              data.paciente.id
            );
            setSelectedPatient(paciente);
          } catch (pError) {
            console.warn("Could not load patient details", pError);
          }
        }
      } else {
        toast.error("No se encontró la ficha");
        navigate("/fichas?tab=fonoaudiologia");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/fichas?tab=fonoaudiologia");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FonoaudiologiaState,
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
        await fichasService.actualizarFonoaudiologia(formData.id, formData);
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("No se encontró la ficha");
        return;
      } else {
        await fichasService.crearFonoaudiologia(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=fonoaudiologia");
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
          onClick={() => setAreaAudicion(!areaAudicion)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaAudicion
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaAudicion
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Ear size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Evaluación de Audición
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Historia, Otoscopia, Vestibular
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaAudicion ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaAudicion}
                onChange={(v) => setAreaAudicion(v)}
              />
            </div>
          </div>
        </div>

        <div
          onClick={() => setAreaLenguaje(!areaLenguaje)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaLenguaje
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaLenguaje
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Evaluación de Lenguaje
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Habla, Fonación y Voz
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaLenguaje ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaLenguaje}
                onChange={(v) => setAreaLenguaje(v)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Secciones de Lenguaje */}
      {areaLenguaje && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <div className="flex items-center gap-2 px-2">
            <MessageSquare size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Lenguaje
            </span>
          </div>

          <ComponentCard
            title="Habla / Lenguaje"
            action={
              <Switch
                label=""
                checked={verSeccionHabla}
                onChange={(val) => setVerSeccionHabla(val)}
              />
            }
            onHeaderClick={() => setVerSeccionHabla(!verSeccionHabla)}
            bodyDisabled={!verSeccionHabla}
          >
            <HablaForm
              data={formData.habla}
              onChange={(field, val) => handleNestedChange("habla", field, val)}
            />
          </ComponentCard>

          <ComponentCard
            title="Fonación / Voz"
            action={
              <Switch
                label=""
                checked={verSeccionFonacion}
                onChange={(val) => setVerSeccionFonacion(val)}
              />
            }
            onHeaderClick={() => setVerSeccionFonacion(!verSeccionFonacion)}
            bodyDisabled={!verSeccionFonacion}
          >
            <FonacionForm
              data={formData.fonacion}
              onChange={(field, val) =>
                handleNestedChange("fonacion", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Secciones de Audición */}
      {areaAudicion && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
          <div className="flex items-center gap-2 px-2 ">
            <Ear size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Audición
            </span>
          </div>

          <ComponentCard
            title="Audición"
            action={
              <Switch
                label=""
                checked={verSeccionAudicion}
                onChange={(val) => setVerSeccionAudicion(val)}
              />
            }
            onHeaderClick={() => setVerSeccionAudicion(!verSeccionAudicion)}
            bodyDisabled={!verSeccionAudicion}
          >
            <AudicionForm
              data={formData.audicion}
              onChange={(field, val) =>
                handleNestedChange("audicion", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Historia Auditiva"
            action={
              <Switch
                label=""
                checked={verSeccionHistoriaAuditiva}
                onChange={(val) => setVerSeccionHistoriaAuditiva(val)}
              />
            }
            onHeaderClick={() =>
              setVerSeccionHistoriaAuditiva(!verSeccionHistoriaAuditiva)
            }
            bodyDisabled={!verSeccionHistoriaAuditiva}
          >
            <HistoriaAuditivaForm
              data={formData.historiaAuditiva}
              onChange={(field, val) =>
                handleNestedChange("historiaAuditiva", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Vestibular / Equilibrio"
            action={
              <Switch
                label=""
                checked={verSeccionVestibular}
                onChange={(val) => setVerSeccionVestibular(val)}
              />
            }
            onHeaderClick={() => setVerSeccionVestibular(!verSeccionVestibular)}
            bodyDisabled={!verSeccionVestibular}
          >
            <VestibularForm
              data={formData.vestibular}
              onChange={(field, val) =>
                handleNestedChange("vestibular", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Otoscopia"
            action={
              <Switch
                label=""
                checked={verSeccionOtoscopia}
                onChange={(val) => setVerSeccionOtoscopia(val)}
              />
            }
            onHeaderClick={() => setVerSeccionOtoscopia(!verSeccionOtoscopia)}
            bodyDisabled={!verSeccionOtoscopia}
          >
            <OtoscopiaForm
              data={formData.otoscopia}
              onChange={(field, val) =>
                handleNestedChange("otoscopia", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/fichas?tab=fonoaudiologia")}>
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
