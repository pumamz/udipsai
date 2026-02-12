import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import TextArea from "../../../input/TextArea";
import Select from "../../../Select";

interface SuenioFormProps {
  data: {
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
  onChange: (field: string, value: any) => void;
}

const SuenioForm: React.FC<SuenioFormProps> = ({ data, onChange }) => {
  const optionsTipoHorario = [
    { value: "NOCTURNO", label: "Nocturno" },
    { value: "DIURNO", label: "Diurno" },
    { value: "MIXTO", label: "Mixto" },
  ];

  const optionsCompania = [
    { value: "SOLO", label: "Solo" },
    { value: "ACOMPANIADO", label: "Acompañado" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Inicio Horario de Sueño (Hora)</Label>
        <Input
          type="number"
          value={data.inicioHorarioDeSuenio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("inicioHorarioDeSuenio", Number(e.target.value))}
        />
      </div>
      <div>
        <Label>Fin Horario de Sueño (Hora)</Label>
        <Input
          type="number"
          value={data.finHorarioDeSuenio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("finHorarioDeSuenio", Number(e.target.value))}
        />
      </div>
      <div>
        <Label>Tipo Horario de Sueño</Label>
        <Select
          options={optionsTipoHorario}
          value={data.tipoHorarioDeSuenio}
          onChange={(val: string) => onChange("tipoHorarioDeSuenio", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Compañía en el Sueño</Label>
        <Select
          options={optionsCompania}
          value={data.companiaSuenio}
          onChange={(val: string) => onChange("companiaSuenio", val)}
          placeholder="Seleccione..."
        />
      </div>
      {data.companiaSuenio === "ACOMPANIADO" && (
        <div>
          <Label>Especificar Compañía</Label>
          <Input
            value={data.especificarCompaniaSuenio}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("especificarCompaniaSuenio", e.target.value)}
            placeholder="Con quién..."
          />
        </div>
      )}
      <div>
        <Label>Edad</Label>
        <Input
          value={data.edad}
          type="number"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange("edad", Number(e.target.value))}
          placeholder="Edad..."
        />
      </div>
      
      <div className="space-y-4">
        <Switch
          label="Hipersomnia"
          checked={data.hipersomnia}
          onChange={(checked: boolean) => onChange("hipersomnia", checked)}
        />
        <Switch
          label="Dificultad de conciliar el sueño"
          checked={data.dificultadDeConciliarElSuenio}
          onChange={(checked: boolean) => onChange("dificultadDeConciliarElSuenio", checked)}
        />
        <Switch
          label="Despertar frecuente"
          checked={data.despertarFrecuente}
          onChange={(checked: boolean) => onChange("despertarFrecuente", checked)}
        />
      </div>
      
      <div className="space-y-4">
        <Switch
          label="Despertar prematuro"
          checked={data.despertarPrematuro}
          onChange={(checked: boolean) => onChange("despertarPrematuro", checked)}
        />
        <Switch
          label="Sonambulismo"
          checked={data.sonambulismo}
          onChange={(checked: boolean) => onChange("sonambulismo", checked)}
        />
      </div>

      <div className="xl:col-span-2">
        <Label>Observaciones Hábitos de Sueño</Label>
        <TextArea
          value={data.observacionesHabitosDeSuenio}
          onChange={(val: string) => onChange("observacionesHabitosDeSuenio", val)}
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default SuenioForm;
