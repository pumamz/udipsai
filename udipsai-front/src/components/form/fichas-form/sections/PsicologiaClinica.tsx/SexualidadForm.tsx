import React from "react";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";
import Select from "../../../Select";

interface SexualidadFormProps {
  data: {
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
  onChange: (field: string, value: any) => void;
}

const SexualidadForm: React.FC<SexualidadFormProps> = ({ data, onChange }) => {
  const optionsSexo = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMENINO", label: "Femenino" },
  ];

  const optionsGenero = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMENINO", label: "Femenino" },
    { value: "OTROS", label: "Otros" },
  ];

  const optionsOrientacion = [
    { value: "HETEROSEXUAL", label: "Heterosexual" },
    { value: "HOMOSEXUAL", label: "Homosexual" },
    { value: "BISEXUAL", label: "Bisexual" },
    { value: "ASEXUAL", label: "Asexual" },
    { value: "OTROS", label: "Otros" },
  ];

  const optionsNivel = [
    { value: "AUSENTE", label: "Ausente" },
    { value: "MEDIA", label: "Media" },
    { value: "ABUNDANTE", label: "Abundante" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Sexo de Nacimiento</Label>
        <Select
          options={optionsSexo}
          value={data.sexoDeNacimiento}
          onChange={(val: string) => onChange("sexoDeNacimiento", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Género</Label>
        <Select
          options={optionsGenero}
          value={data.genero}
          onChange={(val: string) => onChange("genero", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Orientación Sexual</Label>
        <Select
          options={optionsOrientacion}
          value={data.orientacionSexual}
          onChange={(val: string) => onChange("orientacionSexual", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Curiosidad Sexual</Label>
        <Select
          options={optionsNivel}
          value={data.curiosidadSexual}
          onChange={(val: string) => onChange("curiosidadSexual", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Grado de Información</Label>
        <Select
          options={optionsNivel}
          value={data.gradoDeInformacion}
          onChange={(val: string) => onChange("gradoDeInformacion", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Actividad Sexual</Label>
        <Select
          options={optionsNivel}
          value={data.actividadSexual}
          onChange={(val: string) => onChange("actividadSexual", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Masturbación</Label>
        <Select
          options={optionsNivel}
          value={data.masturbacion}
          onChange={(val: string) => onChange("masturbacion", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Promiscuidad</Label>
        <Select
          options={optionsNivel}
          value={data.promiscuidad}
          onChange={(val: string) => onChange("promiscuidad", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Disfunciones</Label>
        <Select
          options={optionsNivel}
          value={data.disfunciones}
          onChange={(val: string) => onChange("disfunciones", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Erotismo</Label>
        <Select
          options={optionsNivel}
          value={data.erotismo}
          onChange={(val: string) => onChange("erotismo", val)}
          placeholder="Seleccione..."
        />
      </div>
      <div>
        <Label>Parafilias</Label>
        <Select
          options={optionsNivel}
          value={data.parafilias}
          onChange={(val: string) => onChange("parafilias", val)}
          placeholder="Seleccione..."
        />
      </div>

      <div className="xl:col-span-2">
        <Label>Observaciones Aspecto Psicosexual</Label>
        <TextArea
          value={data.observacionesAspectoPsicosexual}
          onChange={(val: string) => onChange("observacionesAspectoPsicosexual", val)}
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default SexualidadForm;
