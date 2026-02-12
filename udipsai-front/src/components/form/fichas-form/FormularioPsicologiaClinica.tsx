import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { fichasService } from "../../../services/fichas";
import { pacientesService } from "../../../services/pacientes";
import PatientSelector from "../../common/PatientSelector";
import { User } from "lucide-react";

import AnamnesisForm from "./sections/PsicologiaClinica.tsx/AnamnesisForm";
import SuenioForm from "./sections/PsicologiaClinica.tsx/SuenioForm";
import ConductaForm from "./sections/PsicologiaClinica.tsx/ConductaForm";
import SexualidadForm from "./sections/PsicologiaClinica.tsx/SexualidadForm";
import EvaluacionLenguajeForm from "./sections/PsicologiaClinica.tsx/EvaluacionLenguajeForm";
import EvaluacionAfectivaForm from "./sections/PsicologiaClinica.tsx/EvaluacionAfectivaForm";
import EvaluacionCognitivaForm from "./sections/PsicologiaClinica.tsx/EvaluacionCognitivaForm";
import EvaluacionPensamientoForm from "./sections/PsicologiaClinica.tsx/EvaluacionPensamientoForm";
import DiagnosticoPsicologiaForm from "./sections/PsicologiaClinica.tsx/DiagnosticoPsicologiaForm";
import Switch from "../switch/Switch";
import { Brain, ClipboardList, Activity } from "lucide-react";

export interface FichaPsicologiaClinicaState {
  id?: number;
  pacienteId: number;
  activo: boolean;
  anamnesis: {
    anamnesisFamiliar: string;
    personal: string;
    momentosEvolutivosEnElDesarrollo: string;
    habitosEnLaOralidad: string;
  };
  suenio: {
    inicioHorarioDeSuenio: number;
    finHorarioDeSuenio: number;
    tipoHorarioDeSuenio: string;
    companiaSuenio: string;
    especificarCompaniaSuenio: string;
    edad: string;
    hipersomnia: boolean;
    dificultadDeConciliarElSuenio: boolean;
    despertarFrecuente: boolean;
    despertarPrematuro: boolean;
    sonambulismo: boolean;
    observacionesHabitosDeSuenio: string;
  };
  conducta: {
    temores: boolean;
    destructividad: boolean;
    nerviosismo: boolean;
    irritabilidad: boolean;
    egocentrismo: boolean;
    regresiones: boolean;
    tics: boolean;
    hurto: boolean;
    mentira: boolean;
    cuidadoPersonal: boolean;
    otrosConductasPreocupantes: string;
    observacionesConductasPreocupantes: string;
  };
  sexualidad: {
    sexoDeNacimiento: string;
    genero: string;
    orientacionSexual: string;
    curiosidadSexual: string;
    gradoDeInformacion: string;
    actividadSexual: string;
    masturbacion: string;
    promiscuidad: string;
    disfunciones: string;
    erotismo: string;
    parafilias: string;
    observacionesAspectoPsicosexual: string;
  };
  evaluacionLenguaje: {
    palabrasRaras: boolean;
    logicoYClaro: boolean;
    vozMonotona: boolean;
    malHablado: boolean;
    lentoYTeatral: boolean;
    pesimista: boolean;
    hiriente: boolean;
    charlatan: boolean;
    incoherente: boolean;
    verborrea: boolean;
    abatimiento: boolean;
    tension: boolean;
    perplejidad: boolean;
    suspicacia: boolean;
    enfado: boolean;
    preocupacion: boolean;
    obscenidad: boolean;
    disartria: boolean;
    afasiaExpresiva: boolean;
    afasiaReceptiva: boolean;
    afasiaAnomica: boolean;
    afasiaGlobal: boolean;
    ecolalia: boolean;
    palilalia: boolean;
    ensimismamiento: boolean;
    hayQueGuiarlo: boolean;
    molestoso: boolean;
    lento: boolean;
    noDeseaHacerNada: boolean;
    haceCosasExtranas: boolean;
    aislado: boolean;
    participaEnGrupos: boolean;
    esViolento: boolean;
    callado: boolean;
    amigableYCooperador: boolean;
    adaptable: boolean;
    inquieto: boolean;
    nervioso: boolean;
    tieneAmigosIntimos: boolean;
    confuso: boolean;
    centradoEnSiMismo: boolean;
    olvidadizo: boolean;
    piensaYRespondeBien: boolean;
    pocosPensamientos: boolean;
    noVeLosErrores: boolean;
    actuaInfaltilmente: boolean;
    desconfia: boolean;
    hosco: boolean;
    fastidiado: boolean;
    cansado: boolean;
    visteRaramente: boolean;
    desordenado: boolean;
    mugrosoYFachoso: boolean;
    excesoDeRopas: boolean;
    dramaticoYTeatral: boolean;
    visteNormalmente: boolean;
    impecable: boolean;
    dudaDeTodos: boolean;
    pasaAislado: boolean;
    diceEstarBien: boolean;
    gustaDeHacerDanoALosDemas: boolean;
    tieneIniciativas: boolean;
    colabora: boolean;
    reticencia: boolean;
    rechazo: boolean;
    mutismo: boolean;
    negativismo: boolean;
    agresividad: boolean;
    sarcasmo: boolean;
    pegajosidad: boolean;
    colaboracionExcesiva: boolean;
    atento: boolean;
    seductor: boolean;
    evitaConversar: boolean;
    impulsivo: boolean;
    bromista: boolean;
    toscoYDescortes: boolean;
    triste: boolean;
    irritable: boolean;
    popensoARinias: false;
    suaveYAfable: boolean;
    indiferente: boolean;
    preocupadoYPensativo: boolean;
    tendenciaAlLlanto: boolean;
    alegre: boolean;
    euforico: boolean;
    labilDeHumor: boolean;
    inactivo: boolean;
    perezoso: boolean;
    soloHaceCosasIndispensables: boolean;
    realizaSoloUnTipoDeTrabajo: boolean;
    dedicadoAVariasActividades: boolean;
    apraxia: boolean;
    catatonia: boolean;
    agitacion: boolean;
    amaneramiento: boolean;
    estereotipias: boolean;
    ecopraxia: boolean;
    obedienciaAutomatica: boolean;
    negativismoActividades: boolean;
    interceptacionMotriz: boolean;
    dispraxias: boolean;
    actosImpulsivos: boolean;
    actosObsesivos: boolean;
    ticsActividades: boolean;
    liderazgo: boolean;
    sociabilidad: boolean;
    responsabilidad: boolean;
    toleranciaNormal: boolean;
    baja: boolean;
    colaboracion: boolean;
    inquietud: boolean;
    acataOrdenesVerbales: boolean;
    agresivo: boolean;
    extravagante: boolean;
    antisocial: boolean;
    impulsivoComportamiento: boolean;
    reflexivo: boolean;
    pasivo: boolean;
    apatico: boolean;
    dependiente: boolean;
    dominante: boolean;
    cauteloso: boolean;
    quejoso: boolean;
    temeroso: boolean;
    teatral: boolean;
    ritualista: boolean;
    aislamiento: boolean;
    ataquesDePanico: boolean;
    incapacidadDeRealizacionDeActividadesProductivas: boolean;
    riesgoPotencialOPotencialSuicida: boolean;
    inhibicion: boolean;
    apatia: boolean;
    humorVariable: boolean;
  };
  evaluacionAfectiva: {
    altaSensibilidad: boolean;
    agresividadAfectividad: boolean;
    sumision: boolean;
    rabietas: boolean;
    solidaridad: boolean;
    generosidad: boolean;
    afectuoso: boolean;
    angustia: boolean;
    ansiedadSituacional: boolean;
    timidez: boolean;
    ansiedadExpectante: boolean;
    depresion: boolean;
    perdidaRecienteDeInteres: boolean;
    desesperacion: boolean;
    euforia: boolean;
    indiferencia: boolean;
    aplanamiento: boolean;
    ambivalencia: boolean;
    irritabilidadAfectividad: boolean;
    labilidad: boolean;
    tenacidad: boolean;
    incontinencia: boolean;
    sentimientosInadecuados: boolean;
    neotimia: boolean;
    disociacionIdeoAfectiva: boolean;
    anhedonia: boolean;
  };
  evaluacionCognitiva: {
    observacionesGuiaDeObservacion: string;
    lucidez: boolean;
    obnubilacion: boolean;
    estupor: boolean;
    coma: boolean;
    hipervigilancia: boolean;
    confusion: boolean;
    estadoCrepuscular: boolean;
    onirismo: boolean;
    sonambulismoEstadoDeConciencia: boolean;
    hipercepcion: boolean;
    hipoprosexia: boolean;
    disprosexia: boolean;
    distraibilidad: boolean;
    sinAlteracion: boolean;
    hipercepcionSensopercepcion: boolean;
    ilusiones: boolean;
    seudoalucionciones: boolean;
    alusinosis: boolean;
    macropsias: boolean;
    micropsias: boolean;
    noPresenta: boolean;
    alucinaiones: boolean;
    hipermnecia: boolean;
    amnesiaDeFijacion: boolean;
    amnesiaDeEvocacion: boolean;
    mixta: boolean;
    lacunar: boolean;
    dismensia: boolean;
    paramnesias: boolean;
    sinAlteracionMemoria: boolean;
    desorientacionEnTiempo: string;
    espacio: string;
    respectoASiMismo: string;
    respectoAOtrasPersonas: string;
  };
  evaluacionPensamiento: {
    incoherencia: string;
    bloqueos: string;
    preservacion: string;
    prolijidad: string;
    desgragacion: string;
    estereotipiasEstructuraDelPensamiento: string;
    neologismos: string;
    musitacion: string;
    retardo: boolean;
    aceleracion: boolean;
    fugaDeIdeas: boolean;
    mutismoCursoDelPensamiento: boolean;
    grandeza: boolean;
    suicidio: boolean;
    autocompasion: boolean;
    inferioridad: boolean;
    perdidaDeInteres: boolean;
    indecision: boolean;
    necesidadDeAyuda: boolean;
    fracaso: boolean;
    ruina: boolean;
    autoacusacion: boolean;
    resentimiento: boolean;
    muerte: boolean;
    danio: boolean;
    enfermedad: boolean;
    grave: boolean;
    hipocondrias: boolean;
    nihilistas: boolean;
    noTenerSentimientos: boolean;
    elMundoHaDejadoDeExistir: boolean;
    referencia: boolean;
    extravagantes: boolean;
    fobicas: boolean;
    compulsivas: boolean;
    obsesivas: boolean;
    desconfianzas: boolean;
    desRelacion: boolean;
    perdidaDeControl: boolean;
    serCalumniado: boolean;
    deliriosParanoides: boolean;
    depresivos: boolean;
    misticoReligioso: boolean;
    sexuales: boolean;
    difusos: boolean;
    otrosContenidoDelPensamiento: string;
    capacidadDeAutocritica: boolean;
    heterocritica: boolean;
    proyectosFuturos: boolean;
    concienciaDeLaEnfermedad: boolean;
  };
  diagnostico: {
    impresionDiagnostica: string;
    derivacionInterconsulta: string;
    objetivoPlanTratamientoIndividual: string;
    estrategiaDeIntervencion: string;
    indicadorDeLogro: string;
    tiempoEstimado: string;
    evaluacion: string;
  };
}

export const initialPsicologiaClinicaState: FichaPsicologiaClinicaState = {
  pacienteId: 0,
  activo: true,
  anamnesis: {
    anamnesisFamiliar: "",
    personal: "",
    momentosEvolutivosEnElDesarrollo: "",
    habitosEnLaOralidad: "",
  },
  suenio: {
    inicioHorarioDeSuenio: 0,
    finHorarioDeSuenio: 0,
    tipoHorarioDeSuenio: "",
    companiaSuenio: "",
    especificarCompaniaSuenio: "",
    edad: "0",
    hipersomnia: false,
    dificultadDeConciliarElSuenio: false,
    despertarFrecuente: false,
    despertarPrematuro: false,
    sonambulismo: false,
    observacionesHabitosDeSuenio: "",
  },
  conducta: {
    temores: false,
    destructividad: false,
    nerviosismo: false,
    irritabilidad: false,
    egocentrismo: false,
    regresiones: false,
    tics: false,
    hurto: false,
    mentira: false,
    cuidadoPersonal: false,
    otrosConductasPreocupantes: "",
    observacionesConductasPreocupantes: "",
  },
  sexualidad: {
    sexoDeNacimiento: "",
    genero: "",
    orientacionSexual: "",
    curiosidadSexual: "",
    gradoDeInformacion: "",
    actividadSexual: "",
    masturbacion: "",
    promiscuidad: "",
    disfunciones: "",
    erotismo: "",
    parafilias: "",
    observacionesAspectoPsicosexual: "",
  },
  evaluacionLenguaje: {
    palabrasRaras: false,
    logicoYClaro: false,
    vozMonotona: false,
    malHablado: false,
    lentoYTeatral: false,
    pesimista: false,
    hiriente: false,
    charlatan: false,
    incoherente: false,
    verborrea: false,
    abatimiento: false,
    tension: false,
    perplejidad: false,
    suspicacia: false,
    enfado: false,
    preocupacion: false,
    obscenidad: false,
    disartria: false,
    afasiaExpresiva: false,
    afasiaReceptiva: false,
    afasiaAnomica: false,
    afasiaGlobal: false,
    ecolalia: false,
    palilalia: false,
    ensimismamiento: false,
    hayQueGuiarlo: false,
    molestoso: false,
    lento: false,
    noDeseaHacerNada: false,
    haceCosasExtranas: false,
    aislado: false,
    participaEnGrupos: false,
    esViolento: false,
    callado: false,
    amigableYCooperador: false,
    adaptable: false,
    inquieto: false,
    nervioso: false,
    tieneAmigosIntimos: false,
    confuso: false,
    centradoEnSiMismo: false,
    olvidadizo: false,
    piensaYRespondeBien: false,
    pocosPensamientos: false,
    noVeLosErrores: false,
    actuaInfaltilmente: false,
    desconfia: false,
    hosco: false,
    fastidiado: false,
    cansado: false,
    visteRaramente: false,
    desordenado: false,
    mugrosoYFachoso: false,
    excesoDeRopas: false,
    dramaticoYTeatral: false,
    visteNormalmente: false,
    impecable: false,
    dudaDeTodos: false,
    pasaAislado: false,
    diceEstarBien: false,
    gustaDeHacerDanoALosDemas: false,
    tieneIniciativas: false,
    colabora: false,
    reticencia: false,
    rechazo: false,
    mutismo: false,
    negativismo: false,
    agresividad: false,
    sarcasmo: false,
    pegajosidad: false,
    colaboracionExcesiva: false,
    atento: false,
    seductor: false,
    evitaConversar: false,
    impulsivo: false,
    bromista: false,
    toscoYDescortes: false,
    triste: false,
    irritable: false,
    popensoARinias: false,
    suaveYAfable: false,
    indiferente: false,
    preocupadoYPensativo: false,
    tendenciaAlLlanto: false,
    alegre: false,
    euforico: false,
    labilDeHumor: false,
    inactivo: false,
    perezoso: false,
    soloHaceCosasIndispensables: false,
    realizaSoloUnTipoDeTrabajo: false,
    dedicadoAVariasActividades: false,
    apraxia: false,
    catatonia: false,
    agitacion: false,
    amaneramiento: false,
    estereotipias: false,
    ecopraxia: false,
    obedienciaAutomatica: false,
    negativismoActividades: false,
    interceptacionMotriz: false,
    dispraxias: false,
    actosImpulsivos: false,
    actosObsesivos: false,
    ticsActividades: false,
    liderazgo: false,
    sociabilidad: false,
    responsabilidad: false,
    toleranciaNormal: false,
    baja: false,
    colaboracion: false,
    inquietud: false,
    acataOrdenesVerbales: false,
    agresivo: false,
    extravagante: false,
    antisocial: false,
    impulsivoComportamiento: false,
    reflexivo: false,
    pasivo: false,
    apatico: false,
    dependiente: false,
    dominante: false,
    cauteloso: false,
    quejoso: false,
    temeroso: false,
    teatral: false,
    ritualista: false,
    aislamiento: false,
    ataquesDePanico: false,
    incapacidadDeRealizacionDeActividadesProductivas: false,
    riesgoPotencialOPotencialSuicida: false,
    inhibicion: false,
    apatia: false,
    humorVariable: false,
  },
  evaluacionAfectiva: {
    altaSensibilidad: false,
    agresividadAfectividad: false,
    sumision: false,
    rabietas: false,
    solidaridad: false,
    generosidad: false,
    afectuoso: false,
    angustia: false,
    ansiedadSituacional: false,
    timidez: false,
    ansiedadExpectante: false,
    depresion: false,
    perdidaRecienteDeInteres: false,
    desesperacion: false,
    euforia: false,
    indiferencia: false,
    aplanamiento: false,
    ambivalencia: false,
    irritabilidadAfectividad: false,
    labilidad: false,
    tenacidad: false,
    incontinencia: false,
    sentimientosInadecuados: false,
    neotimia: false,
    disociacionIdeoAfectiva: false,
    anhedonia: false,
  },
  evaluacionCognitiva: {
    observacionesGuiaDeObservacion: "",
    lucidez: false,
    obnubilacion: false,
    estupor: false,
    coma: false,
    hipervigilancia: false,
    confusion: false,
    estadoCrepuscular: false,
    onirismo: false,
    sonambulismoEstadoDeConciencia: false,
    hipercepcion: false,
    hipoprosexia: false,
    disprosexia: false,
    distraibilidad: false,
    sinAlteracion: false,
    hipercepcionSensopercepcion: false,
    ilusiones: false,
    seudoalucionciones: false,
    alusinosis: false,
    macropsias: false,
    micropsias: false,
    noPresenta: false,
    alucinaiones: false,
    hipermnecia: false,
    amnesiaDeFijacion: false,
    amnesiaDeEvocacion: false,
    mixta: false,
    lacunar: false,
    dismensia: false,
    paramnesias: false,
    sinAlteracionMemoria: false,
    desorientacionEnTiempo: "",
    espacio: "",
    respectoASiMismo: "",
    respectoAOtrasPersonas: "",
  },
  evaluacionPensamiento: {
    incoherencia: "",
    bloqueos: "",
    preservacion: "",
    prolijidad: "",
    desgragacion: "",
    estereotipiasEstructuraDelPensamiento: "",
    neologismos: "",
    musitacion: "",
    retardo: false,
    aceleracion: false,
    fugaDeIdeas: false,
    mutismoCursoDelPensamiento: false,
    grandeza: false,
    suicidio: false,
    autocompasion: false,
    inferioridad: false,
    perdidaDeInteres: false,
    indecision: false,
    necesidadDeAyuda: false,
    fracaso: false,
    ruina: false,
    autoacusacion: false,
    resentimiento: false,
    muerte: false,
    danio: false,
    enfermedad: false,
    grave: false,
    hipocondrias: false,
    nihilistas: false,
    noTenerSentimientos: false,
    elMundoHaDejadoDeExistir: false,
    referencia: false,
    extravagantes: false,
    fobicas: false,
    compulsivas: false,
    obsesivas: false,
    desconfianzas: false,
    desRelacion: false,
    perdidaDeControl: false,
    serCalumniado: false,
    deliriosParanoides: false,
    depresivos: false,
    misticoReligioso: false,
    sexuales: false,
    difusos: false,
    otrosContenidoDelPensamiento: "",
    capacidadDeAutocritica: false,
    heterocritica: false,
    proyectosFuturos: false,
    concienciaDeLaEnfermedad: false,
  },
  diagnostico: {
    impresionDiagnostica: "",
    derivacionInterconsulta: "",
    objetivoPlanTratamientoIndividual: "",
    estrategiaDeIntervencion: "",
    indicadorDeLogro: "",
    tiempoEstimado: "",
    evaluacion: "",
  },
};

export default function FormularioPsicologiaClinica() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<FichaPsicologiaClinicaState>(
    initialPsicologiaClinicaState
  );
  const [loading, setLoading] = useState(false);

  const [verAnamnesis, setVerAnamnesis] = useState(false);
  const [verSuenio, setVerSuenio] = useState(false);
  const [verConducta, setVerConducta] = useState(false);
  const [verSexualidad, setVerSexualidad] = useState(false);
  const [verEvaluacionLenguaje, setVerEvaluacionLenguaje] = useState(false);
  const [verEvaluacionAfectiva, setVerEvaluacionAfectiva] = useState(false);
  const [verEvaluacionCognitiva, setVerEvaluacionCognitiva] = useState(false);
  const [verEvaluacionPensamiento, setVerEvaluacionPensamiento] = useState(false);
  const [verDiagnostico, setVerDiagnostico] = useState(false);

  const [areaHistoria, setAreaHistoria] = useState(false);
  const [areaEvaluacion, setAreaEvaluacion] = useState(false);

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
      const data = await fichasService.obtenerPsicologiaClinica(fichaId);
      if (data) {
        const loadedData = {
            ...data,
            pacienteId: data.pacienteId || data.paciente?.id
        };
        setFormData(loadedData);

        const hasAnamnesis = !isSectionEmpty(data.anamnesis, initialPsicologiaClinicaState.anamnesis);
        const hasSuenio = !isSectionEmpty(data.suenio, initialPsicologiaClinicaState.suenio);
        const hasConducta = !isSectionEmpty(data.conducta, initialPsicologiaClinicaState.conducta);
        const hasSexualidad = !isSectionEmpty(data.sexualidad, initialPsicologiaClinicaState.sexualidad);
        const hasLenguaje = !isSectionEmpty(data.evaluacionLenguaje, initialPsicologiaClinicaState.evaluacionLenguaje);
        const hasAfectiva = !isSectionEmpty(data.evaluacionAfectiva, initialPsicologiaClinicaState.evaluacionAfectiva);
        const hasCognitiva = !isSectionEmpty(data.evaluacionCognitiva, initialPsicologiaClinicaState.evaluacionCognitiva);
        const hasPensamiento = !isSectionEmpty(data.evaluacionPensamiento, initialPsicologiaClinicaState.evaluacionPensamiento);
        const hasDiagnostico = !isSectionEmpty(data.diagnostico, initialPsicologiaClinicaState.diagnostico);

        if (hasAnamnesis) setVerAnamnesis(true);
        if (hasSuenio) setVerSuenio(true);
        if (hasConducta) setVerConducta(true);
        if (hasSexualidad) setVerSexualidad(true);
        if (hasLenguaje) setVerEvaluacionLenguaje(true);
        if (hasAfectiva) setVerEvaluacionAfectiva(true);
        if (hasCognitiva) setVerEvaluacionCognitiva(true);
        if (hasPensamiento) setVerEvaluacionPensamiento(true);
        if (hasDiagnostico) setVerDiagnostico(true);

        if (hasAnamnesis || hasSuenio || hasConducta || hasSexualidad) setAreaHistoria(true);
        if (hasLenguaje || hasAfectiva || hasCognitiva || hasPensamiento) setAreaEvaluacion(true);
        
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
        navigate("/fichas?tab=psicologia_clinica");
      }
    } catch (error) {
      console.error("Error loading ficha:", error);
      toast.error("Error al cargar la ficha");
      navigate("/fichas?tab=psicologia_clinica");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedChange = (
    section: keyof FichaPsicologiaClinicaState,
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
        await fichasService.actualizarPsicologiaClinica(formData.id, formData);
        toast.success("Ficha actualizada exitosamente");
      } else if (isEdit && !formData.id) {
        toast.error("No se encontró la ficha");
        return;
      } else {
        await fichasService.crearPsicologiaClinica(formData);
        toast.success("Ficha creada exitosamente");
      }
      navigate("/fichas?tab=psicologia_clinica");
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
          onClick={() => setAreaHistoria(!areaHistoria)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaHistoria
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaHistoria
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <ClipboardList size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Historia y Hábitos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Anamnesis, Sueño, Sexualidad
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaHistoria ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaHistoria}
                onChange={(v) => setAreaHistoria(v)}
              />
            </div>
          </div>
        </div>

        <div
          onClick={() => setAreaEvaluacion(!areaEvaluacion)}
          className={`cursor-pointer group relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 ${
            areaEvaluacion
              ? "border-brand-100 bg-brand-50/20 dark:border-gray-600 dark:bg-gray-800 scale-[1.02]"
              : "border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl transition-all duration-500 ${
                areaEvaluacion
                  ? "bg-brand-400 text-white rotate-12 dark:bg-gray-500 dark:text-gray-200"
                  : "bg-brand-50 text-brand-500 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              <Brain size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Evaluación Psicológica
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cognitiva, Afectiva, Pensamiento
              </p>
            </div>
            <div
              className={`ml-auto transition-transform duration-500 ${
                areaEvaluacion ? "rotate-180" : ""
              }`}
            >
              <Switch
                label=""
                checked={areaEvaluacion}
                onChange={(v) => setAreaEvaluacion(v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Historia y Hábitos */}
      {areaHistoria && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both">
          <div className="flex items-center gap-2 px-2">
            <ClipboardList size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Historia
            </span>
          </div>

          <ComponentCard
            title="Anamnesis"
            action={
              <Switch
                label=""
                checked={verAnamnesis}
                onChange={(val) => setVerAnamnesis(val)}
              />
            }
            onHeaderClick={() => setVerAnamnesis(!verAnamnesis)}
            bodyDisabled={!verAnamnesis}
          >
            <AnamnesisForm
              data={formData.anamnesis}
              onChange={(field, val) => handleNestedChange("anamnesis", field, val)}
            />
          </ComponentCard>

          <ComponentCard
            title="Sueño"
            action={
              <Switch
                label=""
                checked={verSuenio}
                onChange={(val) => setVerSuenio(val)}
              />
            }
            onHeaderClick={() => setVerSuenio(!verSuenio)}
            bodyDisabled={!verSuenio}
          >
            <SuenioForm
              data={formData.suenio}
              onChange={(field, val) => handleNestedChange("suenio", field, val)}
            />
          </ComponentCard>

          <ComponentCard
            title="Conducta"
            action={
              <Switch
                label=""
                checked={verConducta}
                onChange={(val) => setVerConducta(val)}
              />
            }
            onHeaderClick={() => setVerConducta(!verConducta)}
            bodyDisabled={!verConducta}
          >
            <ConductaForm
              data={formData.conducta}
              onChange={(field, val) => handleNestedChange("conducta", field, val)}
            />
          </ComponentCard>

          <ComponentCard
            title="Sexualidad"
            action={
              <Switch
                label=""
                checked={verSexualidad}
                onChange={(val) => setVerSexualidad(val)}
              />
            }
            onHeaderClick={() => setVerSexualidad(!verSexualidad)}
            bodyDisabled={!verSexualidad}
          >
            <SexualidadForm
              data={formData.sexualidad}
              onChange={(field, val) =>
                handleNestedChange("sexualidad", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Evaluación Psicológica */}
      {areaEvaluacion && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-100">
          <div className="flex items-center gap-2 px-2">
            <Brain size={18} className="text-brand-500 dark:text-gray-300" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
              Módulos de Evaluación
            </span>
          </div>

          <ComponentCard
            title="Evaluación Lenguaje"
            action={
              <Switch
                label=""
                checked={verEvaluacionLenguaje}
                onChange={(val) => setVerEvaluacionLenguaje(val)}
              />
            }
            onHeaderClick={() =>
              setVerEvaluacionLenguaje(!verEvaluacionLenguaje)
            }
            bodyDisabled={!verEvaluacionLenguaje}
          >
            <EvaluacionLenguajeForm
              data={formData.evaluacionLenguaje}
              onChange={(field, val) =>
                handleNestedChange("evaluacionLenguaje", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Evaluación Afectiva"
            action={
              <Switch
                label=""
                checked={verEvaluacionAfectiva}
                onChange={(val) => setVerEvaluacionAfectiva(val)}
              />
            }
            onHeaderClick={() =>
              setVerEvaluacionAfectiva(!verEvaluacionAfectiva)
            }
            bodyDisabled={!verEvaluacionAfectiva}
          >
            <EvaluacionAfectivaForm
              data={formData.evaluacionAfectiva}
              onChange={(field, val) =>
                handleNestedChange("evaluacionAfectiva", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Evaluación Cognitiva"
            action={
              <Switch
                label=""
                checked={verEvaluacionCognitiva}
                onChange={(val) => setVerEvaluacionCognitiva(val)}
              />
            }
            onHeaderClick={() =>
              setVerEvaluacionCognitiva(!verEvaluacionCognitiva)
            }
            bodyDisabled={!verEvaluacionCognitiva}
          >
            <EvaluacionCognitivaForm
              data={formData.evaluacionCognitiva}
              onChange={(field, val) =>
                handleNestedChange("evaluacionCognitiva", field, val)
              }
            />
          </ComponentCard>

          <ComponentCard
            title="Evaluación Pensamiento"
            action={
              <Switch
                label=""
                checked={verEvaluacionPensamiento}
                onChange={(val) => setVerEvaluacionPensamiento(val)}
              />
            }
            onHeaderClick={() =>
              setVerEvaluacionPensamiento(!verEvaluacionPensamiento)
            }
            bodyDisabled={!verEvaluacionPensamiento}
          >
            <EvaluacionPensamientoForm
              data={formData.evaluacionPensamiento}
              onChange={(field, val) =>
                handleNestedChange("evaluacionPensamiento", field, val)
              }
            />
          </ComponentCard>
        </div>
      )}

      {/* Diagnóstico */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Activity size={18} className="text-brand-500 dark:text-gray-300" />
          <span className="text-sm font-bold uppercase tracking-widest text-brand-600/70 dark:text-gray-300">
            Cierre y Diagnóstico
          </span>
        </div>

        <ComponentCard
          title="Diagnóstico"
          action={
            <Switch
              label=""
              checked={verDiagnostico}
              onChange={(val) => setVerDiagnostico(val)}
            />
          }
          onHeaderClick={() => setVerDiagnostico(!verDiagnostico)}
          bodyDisabled={!verDiagnostico}
        >
          <DiagnosticoPsicologiaForm
            data={formData.diagnostico}
            onChange={(field, val) =>
              handleNestedChange("diagnostico", field, val)
            }
          />
        </ComponentCard>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/fichas?tab=psicologia_clinica")}>
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
