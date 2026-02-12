import React from "react";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface EvaluacionCognitivaProps {
  data: {
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
  onChange: (field: string, value: any) => void;
}

const EvaluacionCognitivaForm: React.FC<EvaluacionCognitivaProps> = ({ data, onChange }) => {
  const optionsNivel = [
    { value: "AUSENTE", label: "Ausente" },
    { value: "LEVE", label: "Leve" },
    { value: "MODERADO", label: "Moderado" },
    { value: "GRAVE", label: "Grave" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Label className="mb-4 text-lg font-bold">Estado de Conciencia</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Lucidez" checked={data.lucidez} onChange={(val) => onChange("lucidez", val)} />
          <Switch label="Obnubilación" checked={data.obnubilacion} onChange={(val) => onChange("obnubilacion", val)} />
          <Switch label="Estupor" checked={data.estupor} onChange={(val) => onChange("estupor", val)} />
          <Switch label="Coma" checked={data.coma} onChange={(val) => onChange("coma", val)} />
          <Switch label="Hipervigilancia" checked={data.hipervigilancia} onChange={(val) => onChange("hipervigilancia", val)} />
          <Switch label="Confusión" checked={data.confusion} onChange={(val) => onChange("confusion", val)} />
          <Switch label="Estado Crepuscular" checked={data.estadoCrepuscular} onChange={(val) => onChange("estadoCrepuscular", val)} />
          <Switch label="Onirismo" checked={data.onirismo} onChange={(val) => onChange("onirismo", val)} />
          <Switch label="Sonambulismo" checked={data.sonambulismoEstadoDeConciencia} onChange={(val) => onChange("sonambulismoEstadoDeConciencia", val)} />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Atención</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Hiperpercepción" checked={data.hipercepcion} onChange={(val) => onChange("hipercepcion", val)} />
          <Switch label="Hipoprosexia" checked={data.hipoprosexia} onChange={(val) => onChange("hipoprosexia", val)} />
          <Switch label="Disprosexia" checked={data.disprosexia} onChange={(val) => onChange("disprosexia", val)} />
          <Switch label="Distraibilidad" checked={data.distraibilidad} onChange={(val) => onChange("distraibilidad", val)} />
          <Switch label="Sin Alteración" checked={data.sinAlteracion} onChange={(val) => onChange("sinAlteracion", val)} />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Sensopercepción</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Hiperpercepción" checked={data.hipercepcionSensopercepcion} onChange={(val) => onChange("hipercepcionSensopercepcion", val)} />
          <Switch label="Ilusiones" checked={data.ilusiones} onChange={(val) => onChange("ilusiones", val)} />
          <Switch label="Seudoalucinaciones" checked={data.seudoalucionciones} onChange={(val) => onChange("seudoalucionciones", val)} />
          <Switch label="Alucinosis" checked={data.alusinosis} onChange={(val) => onChange("alusinosis", val)} />
          <Switch label="Macropsias" checked={data.macropsias} onChange={(val) => onChange("macropsias", val)} />
          <Switch label="Micropsias" checked={data.micropsias} onChange={(val) => onChange("micropsias", val)} />
          <Switch label="No presenta" checked={data.noPresenta} onChange={(val) => onChange("noPresenta", val)} />
          <Switch label="Alucinaciones" checked={data.alucinaiones} onChange={(val) => onChange("alucinaiones", val)} />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Memoria</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Hipermnesia" checked={data.hipermnecia} onChange={(val) => onChange("hipermnecia", val)} />
          <Switch label="Amnesia de fijación" checked={data.amnesiaDeFijacion} onChange={(val) => onChange("amnesiaDeFijacion", val)} />
          <Switch label="Amnesia de evocación" checked={data.amnesiaDeEvocacion} onChange={(val) => onChange("amnesiaDeEvocacion", val)} />
          <Switch label="Mixta" checked={data.mixta} onChange={(val) => onChange("mixta", val)} />
          <Switch label="Lacunar" checked={data.lacunar} onChange={(val) => onChange("lacunar", val)} />
          <Switch label="Dismensia" checked={data.dismensia} onChange={(val) => onChange("dismensia", val)} />
          <Switch label="Paramnesias" checked={data.paramnesias} onChange={(val) => onChange("paramnesias", val)} />
          <Switch label="Sin Alteración" checked={data.sinAlteracionMemoria} onChange={(val) => onChange("sinAlteracionMemoria", val)} />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Orientación (Desorientación)</Label>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <Label>En Tiempo</Label>
            <Select
              options={optionsNivel}
              value={data.desorientacionEnTiempo}
              onChange={(val) => onChange("desorientacionEnTiempo", val)}
              placeholder="Seleccione..."
            />
          </div>
          <div>
            <Label>Espacio</Label>
            <Select
              options={optionsNivel}
              value={data.espacio}
              onChange={(val) => onChange("espacio", val)}
              placeholder="Seleccione..."
            />
          </div>
          <div>
            <Label>Respecto a sí mismo</Label>
            <Select
              options={optionsNivel}
              value={data.respectoASiMismo}
              onChange={(val) => onChange("respectoASiMismo", val)}
              placeholder="Seleccione..."
            />
          </div>
          <div>
            <Label>Respecto a otras personas</Label>
            <Select
              options={optionsNivel}
              value={data.respectoAOtrasPersonas}
              onChange={(val) => onChange("respectoAOtrasPersonas", val)}
              placeholder="Seleccione..."
            />
          </div>
        </div>
      </div>

      <div className="xl:col-span-2">
        <Label>Observaciones Guía de Observación</Label>
        <TextArea
          value={data.observacionesGuiaDeObservacion}
          onChange={(val: string) => onChange("observacionesGuiaDeObservacion", val)}
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default EvaluacionCognitivaForm;
