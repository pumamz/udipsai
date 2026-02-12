import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface HistoriaEscolarProps {
  data: {
    asignaturasGustan: string;
    asignaturasDisgustan: string;
    relacionDocentes: string;
    causaRelacionDocentes: string;
    gustaIrInstitucion: boolean;
    causaGustaIrInstitucion: string;
    relacionConGrupo: string;
    causaRelacionConGrupo: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosHistoriaEscolarForm: React.FC<HistoriaEscolarProps> = ({
  data,
  onChange,
}) => {
  const optionsRelacion = [
    { value: "BUENA", label: "Buena" },
    { value: "MALA", label: "Mala" },
    { value: "REGULAR", label: "Regular" },
    { value: "NEUTRA", label: "Neutra" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Asignaturas que le gusta</Label>
        <Input
          value={data.asignaturasGustan}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("asignaturasGustan", e.target.value)
          }
          placeholder="Ingrese las asignaturas que le gusta"
        />
      </div>
      <div>
        <Label>Asignaturas que no le gusta</Label>
        <Input
          value={data.asignaturasDisgustan}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("asignaturasDisgustan", e.target.value)
          }
          placeholder="Ingrese las asignaturas que no le gusta"
        />
      </div>
      <div>
        <Label>Relación con docentes</Label>
        <Select
          options={optionsRelacion}
          value={data.relacionDocentes}
          onChange={(val: string) => onChange("relacionDocentes", val)}
          placeholder="Seleccione la relación con docentes"
        />
      </div>
      <div>
        <Label>Causa de la relación con docentes</Label>
        <Input
          value={data.causaRelacionDocentes}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaRelacionDocentes", e.target.value)
          }
          placeholder="Ingrese la causa de la relación con docentes"
        />
      </div>
      <div className="flex items-center">
        <Switch
          label="¿Le gusta ir a la institución?"
          checked={data.gustaIrInstitucion}
          onChange={(checked: boolean) =>
            onChange("gustaIrInstitucion", checked)
          }
        />
      </div>
      {!data.gustaIrInstitucion && (
        <div>
          <Label>Causa del porqué no le gusta ir a la institución</Label>
          <Input
            value={data.causaGustaIrInstitucion}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange("causaGustaIrInstitucion", e.target.value)
            }
            placeholder="Ingrese la causa del porqué no le gusta ir a la institución"
          />
        </div>
      )}
      <div>
        <Label>Relación con el grupo</Label>
        <Select
          options={optionsRelacion}
          value={data.relacionConGrupo}
          onChange={(val: string) => onChange("relacionConGrupo", val)}
          placeholder="Seleccione la relación con el grupo"
        />
      </div>
      <div>
        <Label>Causa de la relación con el grupo</Label>
        <Input
          value={data.causaRelacionConGrupo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("causaRelacionConGrupo", e.target.value)
          }
          placeholder="Ingrese la causa de la relación con el grupo"
        />
      </div>
    </div>
  );
};

export default DatosHistoriaEscolarForm;
