import React, { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { fichasService } from "../../services/fichas";
import { FonoaudiologiaState } from "../form/fichas-form/FormularioFonoaudiologia";
import { AlertCircle } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Label from "../form/Label";

interface FonoaudiologiaViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: number;
}

export const FonoaudiologiaViewModal: React.FC<FonoaudiologiaViewModalProps> = ({
  isOpen,
  onClose,
  pacienteId,
}) => {
  const [data, setData] = useState<FonoaudiologiaState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pacienteId) {
      fetchData();
    }
  }, [isOpen, pacienteId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fichasService.obtenerFonoaudiologia(pacienteId);
      setData(res);
    } catch (error) {
      console.error("Error fetching fonoaudiologia:", error);
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
          )) : <span className="text-xs text-gray-400 italic">No especifica</span>}
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
            Ficha de Fonoaudiología
          </h3>
          <Badge color="light">Vista detallada</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Vista de solo lectura de la evaluación de audición, habla y lenguaje.
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
            {/* Habla y Lenguaje */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Habla / Lenguaje" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <DataField label="Dificultad pronunciar" value={data.habla.dificultadPronunciarPalabras} />
                <DataField label="¿Se traba al hablar?" value={data.habla.seTrabaCuandoHabla} />
                <DataField label="¿Se entiende lo que dice?" value={data.habla.seEntiendeLoQueDice} />
                <DataField label="Comprende lo que se le dice" value={data.habla.comprendeLoQueSeLeDice} />
                <DataField label="Reconoce fuente sonora" value={data.habla.reconoceFuenteSonora} />
                <DataField label="Forma de comunicación" value={data.habla.comunicacionPreferentementeForma} />
                <BooleanGrid label="Trastornos detectados" items={{
                  trastornoEspecificoPronunciacion: data.habla.trastornoEspecificoPronunciacion,
                  trastornoLenguajeExpresivo: data.habla.trastornoLenguajeExpresivo,
                  trastornoRecepcionLenguaje: data.habla.trastornoRecepcionLenguaje,
                  disartria: data.habla.disartriaAnartria
                }} />
              </div>
            </section>

            {/* Audicion */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Audición" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <DataField label="Examen audiológico" value={data.audicion.seARealizadoExamenAudiologico} />
                <DataField label="Audición Normal" value={data.audicion.audicionNormal} />
                <DataField label="Uso audífonos" value={data.audicion.usoAudifonos} />
                <DataField label="Implante coclear" value={data.audicion.implanteCoclear} />
                <DataField label="Grado Pérdida" value={data.audicion.gradoPerdida} />
                <DataField label="Detalles" value={data.audicion.detallesAudicion} fullWidth />
              </div>
            </section>

            {/* Fonacion */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Fonación / Voz" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <DataField label="Tono de voz apropiado" value={data.fonacion.creeTonoVozEstudianteApropiado} />
                <DataField label="Respiración Normal" value={data.fonacion.respiracionNormal} />
                <DataField label="Tono de voz" value={data.fonacion.tonoDeVoz} />
                <DataField label="Desde cuándo alteración" value={data.fonacion.desdeCuandoAlteracionesVoz} />
                <DataField label="N° total de palabras" value={data.fonacion.numeroTotalPalabras} />
              </div>
            </section>

            {/* Otoscopia */}
            <section className="p-6 rounded-2xl border-3 border-gray-300/50 dark:border-white/[0.05]">
              <SectionHeader title="Otoscopia" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-md font-bold text-gray-400">Oído Derecho</p>
                  <DataField label="Apariencia MB" value={data.otoscopia.aparienciaMenbranaTimpanicaOidoDerecho} />
                  <DataField label="Obstrucción" value={data.otoscopia.obstruccionOidoDerecho} />
                  <DataField label="Perforación" value={data.otoscopia.perforacionOidoDerecho} />
                </div>
                <div className="space-y-4">
                  <p className="text-md font-bold text-gray-400">Oído Izquierdo</p>
                  <DataField label="Apariencia MB" value={data.otoscopia.aparienciaMenbranaTimpanicaOidoIzquierdo} />
                  <DataField label="Obstrucción" value={data.otoscopia.obstruccionOidoIzquierdo} />
                  <DataField label="Perforación" value={data.otoscopia.perforacionOidoIzquierdo} />
                </div>
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
