import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { fichasService } from "../../services/fichas";
import { FichaPsicologiaClinicaState } from "../form/fichas-form/FormularioPsicologiaClinica";
import { AlertCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Label from "../form/Label";

interface PsicologiaClinicaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const PsicologiaClinicaViewModal: React.FC<PsicologiaClinicaViewModalProps> = ({
  isOpen,
  onClose,
  pacienteId,
}) => {
  const [data, setData] = useState<FichaPsicologiaClinicaState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pacienteId) {
      fetchData();
    }
  }, [isOpen, pacienteId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerPsicologiaClinica(pacienteId);
      setData(res);
    } catch (error) {
      console.error("Error fetching psicologia clinica:", error);
    } finally {
      setLoading(false);
    }
  };

  const DataField = ({ label, value, fullWidth = false }: { label: string; value: any; fullWidth?: boolean }) => (
    <div className={`${fullWidth ? "col-span-full" : ""} space-y-1`}>
      <Label className="text-md font-semibold">{label}</Label>
      <Label className="text-gray-500 block">
        {value === true ? "Sí" : value === false ? "No" : value || "-"}
      </Label>
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <Label className="font-bold text-xl">{title}</Label>
    </div>
  );

  const BooleanGrid = ({ label, items }: { label: string, items: { [key: string]: boolean } }) => {
    const activeItems = Object.entries(items).filter(([_, val]) => val === true);
    return (
      <div className="space-y-2 col-span-full">
        <Label className="text-md font-semibold underline decoration-gray-200 underline-offset-4">{label}</Label>
        <div className="flex flex-wrap gap-2 pt-1">
          {activeItems.length > 0 ? activeItems.map(([key, _]) => (
            <Badge key={key} color="success" variant="light">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Badge>
          )) : <span className="text-xs text-gray-400 italic">Ninguno seleccionado</span>}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[850px] p-8" showCloseButton={true}>
      <div className="mb-8 pr-12">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Ficha de Psicología Clínica
          </h3>
          <Badge color="light">Vista detallada</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Vista de solo lectura del historial clínico funcional y evolutivo.
        </p>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">Cargando información...</p>
          </div>
        ) : data ? (
          <>
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Anamnesis" />
              <div className="grid grid-cols-1 gap-y-6">
                <DataField label="Anamnesis Familiar" value={data.anamnesis.anamnesisFamiliar} fullWidth />
                <DataField label="Anamnesis Personal" value={data.anamnesis.personal} fullWidth />
                <DataField label="Momentos Evolutivos" value={data.anamnesis.momentosEvolutivosEnElDesarrollo} fullWidth />
                <DataField label="Hábitos en la Oralidad" value={data.anamnesis.habitosEnLaOralidad} fullWidth />
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
                <SectionHeader title="Hábitos de Sueño" />
                <div className="grid grid-cols-2 gap-4">
                  <DataField label="Inicio" value={data.suenio.inicioHorarioDeSuenio} />
                  <DataField label="Fin" value={data.suenio.finHorarioDeSuenio} />
                  <DataField label="Tipo horario" value={data.suenio.tipoHorarioDeSuenio} />
                  <DataField label="Compañía" value={data.suenio.companiaSuenio} />
                  {data.suenio.hipersomnia && <DataField label="Hipersomnia" value={true} />}
                  {data.suenio.dificultadDeConciliarElSuenio && <DataField label="Dificultad conciliar" value={true} />}
                  {data.suenio.despertarFrecuente && <DataField label="Despertar frecuente" value={true} />}
                  <DataField label="Observaciones" value={data.suenio.observacionesHabitosDeSuenio} fullWidth />
                </div>
              </section>

              <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
                <SectionHeader title="Conducta" />
                <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                   <BooleanGrid label="Indicadores detectados" items={{
                     temores: data.conducta.temores,
                     destructividad: data.conducta.destructividad,
                     nerviosismo: data.conducta.nerviosismo,
                     irritabilidad: data.conducta.irritabilidad,
                     egocentrismo: data.conducta.egocentrismo,
                     tics: data.conducta.tics,
                     mentira: data.conducta.mentira
                   }} />
                   <DataField label="Otros" value={data.conducta.otrosConductasPreocupantes} fullWidth />
                </div>
              </section>
            </div>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Aspecto Psicosexual" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                <DataField label="Sexo de nacimiento" value={data.sexualidad.sexoDeNacimiento} />
                <DataField label="Género" value={data.sexualidad.genero} />
                <DataField label="Orientación" value={data.sexualidad.orientacionSexual} />
                <DataField label="Curiosidad sexual" value={data.sexualidad.curiosidadSexual} />
                <DataField label="Actividad sexual" value={data.sexualidad.actividadSexual} />
                <DataField label="Observaciones" value={data.sexualidad.observacionesAspectoPsicosexual} fullWidth />
              </div>
            </section>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Examen Mental / Expresión" />
              <div className="space-y-8">
                <BooleanGrid label="Evaluación del Lenguaje" items={data.evaluacionLenguaje} />
                <BooleanGrid label="Evaluación Afectiva" items={data.evaluacionAfectiva} />
                <BooleanGrid label="Fijación y Conciencia" items={{
                  lucidez: data.evaluacionCognitiva.lucidez,
                  confusion: data.evaluacionCognitiva.confusion,
                  distraibilidad: data.evaluacionCognitiva.distraibilidad,
                  hipervigilancia: data.evaluacionCognitiva.hipervigilancia
                }} />
              </div>
            </section>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Diagnóstico y Plan" />
              <div className="space-y-6">
                <DataField label="Impresión Diagnóstica" value={data.diagnostico.impresionDiagnostica} fullWidth />
                <DataField label="Plan de Tratamiento" value={data.diagnostico.objetivoPlanTratamientoIndividual} fullWidth />
                <DataField label="Estrategia de Intervención" value={data.diagnostico.estrategiaDeIntervencion} fullWidth />
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-2">
            <AlertCircle size={40} className="text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">No se encontró información detallada</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
