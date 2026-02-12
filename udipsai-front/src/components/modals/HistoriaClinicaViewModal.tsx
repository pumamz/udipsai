import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { fichasService } from "../../services/fichas";
import { HistoriaClinicaState } from "../form/fichas-form/FormularioHistoriaClinica";
import { FileText, AlertCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Label from "../form/Label";

interface HistoriaClinicaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const HistoriaClinicaViewModal: React.FC<
  HistoriaClinicaViewModalProps
> = ({ isOpen, onClose, pacienteId }) => {
  const [data, setData] = useState<HistoriaClinicaState | null>(null);
  const [loading, setLoading] = useState(true);
  const [genogramaPreview, setGenogramaPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pacienteId) {
      fetchData();
    }
  }, [isOpen, pacienteId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerHistoriaClinica(pacienteId);
      setData(res);

      if (res?.informacionGeneral?.genogramaUrl) {
        const gUrl = await fichasService.obtenerGenograma(pacienteId);
        setGenogramaPreview(gUrl);
      }
    } catch (error) {
      console.error("Error fetching historia clinica:", error);
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
      <Label className="text-gray-500">
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
            Historia Clínica
          </h3>
          {data?.fecha && (
            <Badge color="light">
              {new Date(data.fecha).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Vista detallada de la ficha clínica del paciente.
        </p>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse text-lg">
              Cargando datos de la ficha clínica
            </p>
          </div>
        ) : data ? (
          <>
            {/* Informacion General */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Información General" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4">
                <DataField
                  label="Fuente de Información"
                  value={data.informacionGeneral.fuenteDeInformacion}
                />
                <DataField
                  label="Parentesco"
                  value={data.informacionGeneral.parentesco}
                />
                <DataField
                  label="Persona que deriva"
                  value={data.informacionGeneral.personaQueDeriva}
                />
                <DataField
                  label="Vive con"
                  value={data.informacionGeneral.viveCon}
                />
                {data.informacionGeneral.viveCon === "OTRO" && (
                  <DataField
                    label="Especif. Otro"
                    value={data.informacionGeneral.viveConOtro}
                  />
                )}
                <DataField
                  label="Padres Juntos"
                  value={data.informacionGeneral.vivenJuntos}
                />
                <DataField
                  label="Tipo Familia"
                  value={data.informacionGeneral.tipoFamilia}
                />
                <DataField
                  label="Motivo Consulta"
                  value={data.informacionGeneral.motivoConsulta}
                  fullWidth
                />
                <DataField
                  label="Convivientes"
                  value={data.informacionGeneral.hijosOtrosFamiliaresVivenCasa}
                  fullWidth
                />
                <DataField
                  label="Observaciones"
                  value={data.informacionGeneral.otrosCompromisos}
                  fullWidth
                />
              </div>
            </section>

            {/* Datos Familiares */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Entorno Familiar" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Padre */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <DataField
                      label="Nombres completos (Padre)"
                      value={data.datosFamiliares.nombrePadre}
                      fullWidth
                    />
                    <DataField
                      label="Edad (Padre)"
                      value={data.datosFamiliares.edadPadre}
                    />
                    <DataField
                      label="Ocupación (Padre)"
                      value={data.datosFamiliares.ocupacionPadre}
                    />
                    <DataField
                      label="Instrucción (Padre)"
                      value={data.datosFamiliares.instruccionPadre}
                    />
                    <DataField
                      label="Estado Civil (Padre)"
                      value={data.datosFamiliares.estadoCivilPadre}
                    />
                  </div>
                </div>
                {/* Madre */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <DataField
                      label="Nombres completos (Madre)"
                      value={data.datosFamiliares.nombreMadre}
                      fullWidth
                    />
                    <DataField
                      label="Edad (Madre)"
                      value={data.datosFamiliares.edadMadre}
                    />
                    <DataField
                      label="Ocupación (Madre)"
                      value={data.datosFamiliares.ocupacionMadre}
                    />
                    <DataField
                      label="Instrucción (Madre)"
                      value={data.datosFamiliares.instruccionMadre}
                    />
                    <DataField
                      label="Estado Civil (Madre)"
                      value={data.datosFamiliares.estadoCivilMadre}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 border-t border-gray-300 dark:border-white/5">
                <DataField
                  label="N° Hermanos"
                  value={data.datosFamiliares.numeroHermanos}
                />
                <DataField
                  label="Lugar que ocupa"
                  value={data.datosFamiliares.lugarQueOcupa}
                />
                <DataField
                  label="Residencia"
                  value={data.datosFamiliares.lugarResidenciaPadre}
                />
                <DataField
                  label="Dirección"
                  value={data.datosFamiliares.direccionDomiciliaria}
                  fullWidth
                />
              </div>
            </section>

            {/* Salud y Desarrollo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Antecedentes Nacimiento */}
              <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
                <SectionHeader title="Nacimiento" />
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <DataField
                      label="Embarazo deseado"
                      value={data.historiaPrenatal.embarazoDeseado}
                    />
                    <DataField
                      label="Amenaza aborto"
                      value={data.historiaPrenatal.presentoAmenazaAborto}
                    />
                    <DataField
                      label="Tipo parto"
                      value={data.historiaNatal.tipoParto}
                    />
                    <DataField
                      label="Lloró al nacer"
                      value={data.historiaNatal.lloroAlNacer}
                    />
                    <DataField
                      label="Peso (kg)"
                      value={data.historiaNatal.pesoAlNacer}
                    />
                    <DataField
                      label="Talla (cm)"
                      value={data.historiaNatal.tallaAlNacer}
                    />
                  </div>
                </div>
              </section>

              {/* Desarrollo Motor */}
              <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
                <SectionHeader title="Desarrollo Motor" />
                <div className="grid grid-cols-2 gap-4">
                  <DataField
                    label="Control Cefálico"
                    value={data.desarrolloMotor.controlCefalico}
                  />
                  <DataField
                    label="Sedestación"
                    value={data.desarrolloMotor.sedestacion}
                  />
                  <DataField
                    label="Bipedestación"
                    value={data.desarrolloMotor.hipedestacion}
                  />
                  <DataField
                    label="Camina Solo"
                    value={data.desarrolloMotor.caminaSolo}
                  />
                  <DataField label="Gateo" value={data.desarrolloMotor.gateo} />
                  <DataField
                    label="Esfínteres"
                    value={data.desarrolloMotor.controlEsfinteres}
                  />
                </div>
              </section>
            </div>

            {/* Antecedentes Medicos */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Historial Médico y Familiar" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <DataField
                    label="Tratamientos médicos"
                    value={data.antecedentesMedicos.enfermedadesConTratamiento}
                    fullWidth
                  />
                  <DataField
                    label="Alergias"
                    value={data.antecedentesMedicos.alergias}
                    fullWidth
                  />
                  <DataField
                    label="Intervenciones"
                    value={data.antecedentesMedicos.intervencionesQuirurgicas}
                    fullWidth
                  />
                </div>
                <div className="space-y-4">
                  <DataField
                    label="Trastornos familiares"
                    value={
                      data.antecedentesMedicos.trastornosPsicologicosFamiliares
                    }
                    fullWidth
                  />
                  <DataField
                    label="Problemas aprendizaje"
                    value={
                      data.antecedentesMedicos.problemasAprendizajeFamiliares
                    }
                    fullWidth
                  />
                </div>
              </div>
            </section>

            {/* Genograma */}
            {genogramaPreview && (
              <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader title="Genograma" />
                </div>
                <div className="flex justify-center rounded-xl p-4 border border-gray-300 dark:border-white/5 shadow-sm">
                  {data.informacionGeneral.genogramaUrl
                    .toLowerCase()
                    .endsWith(".pdf") ? (
                    <div className="flex flex-col items-center gap-2 py-6">
                      <FileText size={32} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Documento PDF
                      </span>
                    </div>
                  ) : (
                    <img
                      src={genogramaPreview}
                      alt="Genograma"
                      className="max-h-[400px] w-auto rounded-lg"
                    />
                  )}
                </div>
              </section>
            )}
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
