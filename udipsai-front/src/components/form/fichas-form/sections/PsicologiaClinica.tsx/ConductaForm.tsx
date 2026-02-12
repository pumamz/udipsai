import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import TextArea from "../../../input/TextArea";

interface ConductaFormProps {
  data: {
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
  onChange: (field: string, value: any) => void;
}

const ConductaForm: React.FC<ConductaFormProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Switch
          label="Temores"
          checked={data.temores}
          onChange={(checked: boolean) => onChange("temores", checked)}
        />
        <Switch
          label="Destructividad"
          checked={data.destructividad}
          onChange={(checked: boolean) => onChange("destructividad", checked)}
        />
        <Switch
          label="Nerviosismo"
          checked={data.nerviosismo}
          onChange={(checked: boolean) => onChange("nerviosismo", checked)}
        />
        <Switch
          label="Irritabilidad"
          checked={data.irritabilidad}
          onChange={(checked: boolean) => onChange("irritabilidad", checked)}
        />
        <Switch
          label="Egocentrismo"
          checked={data.egocentrismo}
          onChange={(checked: boolean) => onChange("egocentrismo", checked)}
        />
        <Switch
          label="Regresiones"
          checked={data.regresiones}
          onChange={(checked: boolean) => onChange("regresiones", checked)}
        />
        <Switch
          label="Tics"
          checked={data.tics}
          onChange={(checked: boolean) => onChange("tics", checked)}
        />
        <Switch
          label="Hurto"
          checked={data.hurto}
          onChange={(checked: boolean) => onChange("hurto", checked)}
        />
        <Switch
          label="Mentira"
          checked={data.mentira}
          onChange={(checked: boolean) => onChange("mentira", checked)}
        />
        <Switch
          label="Cuidado Personal"
          checked={data.cuidadoPersonal}
          onChange={(checked: boolean) => onChange("cuidadoPersonal", checked)}
        />

      <div className="xl:col-span-2">
        <Label>Otras conductas preocupantes</Label>
        <TextArea
          value={data.otrosConductasPreocupantes}
          onChange={(val: string) => onChange("otrosConductasPreocupantes", val)}
          placeholder="Describa otras conductas preocupantes..."
        />
      </div>
      <div className="xl:col-span-2">
        <Label>Observaciones Conductas Preocupantes</Label>
        <TextArea
          value={data.observacionesConductasPreocupantes}
          onChange={(val: string) => onChange("observacionesConductasPreocupantes", val)}
          placeholder="Describa observaciones conductas preocupantes..."
        />
      </div>
    </div>
  );
};

export default ConductaForm;
