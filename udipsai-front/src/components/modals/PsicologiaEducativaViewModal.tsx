import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { fichasService } from "../../services/fichas";
import { FichaPsicologiaEducativaState } from "../form/fichas-form/FormularioPsicologiaEducativa";
import { AlertCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Label from "../form/Label";

interface PsicologiaEducativaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const PsicologiaEducativaViewModal: React.FC<
  PsicologiaEducativaViewModalProps
> = ({ isOpen, onClose, pacienteId }) => {
  const [data, setData] = useState<FichaPsicologiaEducativaState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pacienteId) {
      fetchData();
    }
  }, [isOpen, pacienteId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerPsicologiaEducativa(pacienteId);
      setData(res);
    } catch (error) {
      console.error("Error fetching psicologia educativa:", error);
    } finally {
      setLoading(false);
    }
  };

  const DataField = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string;
    value: any;
    fullWidth?: boolean;
  }) => (
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

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[850px] p-8"
    >
      <div className="mb-8 pr-12">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Ficha de Psicología Educativa
          </h3>
          <Badge color="light">Vista detallada</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Información sobre la historia escolar, desarrollo y adaptaciones del
          paciente.
        </p>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm animate-pulse">
              Cargando información...
            </p>
          </div>
        ) : data ? (
          <>
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Historia Escolar" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <DataField
                  label="Asignaturas que gustan"
                  value={data.historiaEscolar.asignaturasGustan}
                />
                <DataField
                  label="Asignaturas que disgustan"
                  value={data.historiaEscolar.asignaturasDisgustan}
                />
                <DataField
                  label="Relación con docentes"
                  value={data.historiaEscolar.relacionDocentes}
                />
                <DataField
                  label="Causa relación docentes"
                  value={data.historiaEscolar.causaRelacionDocentes}
                />
                <DataField
                  label="¿Gusta ir a la institución?"
                  value={data.historiaEscolar.gustaIrInstitucion}
                />
                <DataField
                  label="Causa gusto/disgusto institución"
                  value={data.historiaEscolar.causaGustaIrInstitucion}
                  fullWidth
                />
                <DataField
                  label="Relación con el grupo"
                  value={data.historiaEscolar.relacionConGrupo}
                />
                <DataField
                  label="Causa relación grupo"
                  value={data.historiaEscolar.causaRelacionConGrupo}
                />
              </div>
            </section>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Desarrollo Escolar" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                <DataField label="CDI" value={data.desarrollo.cdi} />
                <DataField label="Edad CDI" value={data.desarrollo.cdiEdad} />
                <DataField label="Inicial 1" value={data.desarrollo.inicial1} />
                <DataField
                  label="Edad Inicial 1"
                  value={data.desarrollo.inicial1Edad}
                />
                <DataField label="Inicial 2" value={data.desarrollo.inicial2} />
                <DataField
                  label="Edad Inicial 2"
                  value={data.desarrollo.inicial2Edad}
                />
                <DataField label="1ro EGB" value={data.desarrollo.primerEGB} />
                <DataField
                  label="Edad 1ro EGB"
                  value={data.desarrollo.edad1roEGB}
                />

                <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
                  <DataField
                    label="Pérdida de año"
                    value={data.desarrollo.perdidaAnio}
                  />
                  <DataField
                    label="Grado/Causa Pérdida"
                    value={data.desarrollo.gradoCausaPerdidaAnio}
                  />
                  <DataField
                    label="Deserción escolar"
                    value={data.desarrollo.desercionEscolar}
                  />
                  <DataField
                    label="Grado/Causa Deserción"
                    value={data.desarrollo.gradoCausaDesercionEscolar}
                  />
                  <DataField
                    label="Cambio Institución"
                    value={data.desarrollo.cambioInstitucion}
                  />
                  <DataField
                    label="Grado/Causa Cambio"
                    value={data.desarrollo.gradoCausaCambioInstitucion}
                  />
                  <DataField
                    label="Prob. Aprendizaje"
                    value={data.desarrollo.problemasAprendizaje}
                  />
                  <DataField
                    label="Especificar problemas"
                    value={data.desarrollo.problemasAprendizajeEspecificar}
                  />
                </div>
              </div>
            </section>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Adaptación y Apoyo" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <DataField
                  label="Inclusión Educativa"
                  value={data.adaptacion.inclusionEducativa}
                />
                <DataField
                  label="Causa Inclusión"
                  value={data.adaptacion.causaInclusionEducativa}
                />
                <DataField
                  label="Adapt. Curriculares"
                  value={data.adaptacion.adaptacionesCurriculares}
                />
                <DataField
                  label="Grado Adaptación"
                  value={data.adaptacion.gradoAdaptacion}
                />
                <DataField
                  label="Asignaturas Adapt."
                  value={data.adaptacion.especifiqueAsignaturas}
                  fullWidth
                />
                <DataField
                  label="Eval. Anterior"
                  value={data.adaptacion.evaluacionPsicologicaUOtrosAnterior}
                />
                <DataField
                  label="Causa Eval. Anterior"
                  value={
                    data.adaptacion.causaEvaluacionPsicologicaUOtrosAnterior
                  }
                />
                <DataField
                  label="Recibe Apoyo"
                  value={data.adaptacion.recibeApoyo}
                />
                <DataField
                  label="Lugar/Tiempo Apoyo"
                  value={data.adaptacion.causaLugarTiempoRecibeApoyo}
                />
              </div>
            </section>

            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Estado General" />
              <div className="space-y-6">
                <DataField
                  label="Aprovechamiento General"
                  value={data.estadoGeneral.aprovechamientoGeneral}
                  fullWidth
                />
                <DataField
                  label="Actividad Escolar"
                  value={data.estadoGeneral.actividadEscolar}
                  fullWidth
                />
                <DataField
                  label="Observaciones"
                  value={data.estadoGeneral.observaciones}
                  fullWidth
                />
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-2">
            <AlertCircle size={40} className="text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">
              No se encontró información detallada
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
