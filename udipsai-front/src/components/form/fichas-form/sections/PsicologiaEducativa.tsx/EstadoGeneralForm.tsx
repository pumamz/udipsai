import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";

interface EstadoGeneralProps {
  data: {
    aprovechamientoGeneral: string;
    actividadEscolar: string;
    observaciones: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosEstadoGeneralForm: React.FC<EstadoGeneralProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div>
        <Label>Aprovechamiento General</Label>
        <Input
          value={data.aprovechamientoGeneral}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("aprovechamientoGeneral", e.target.value)
          }
          placeholder="Ingrese aprovechamiento general"
        />
      </div>
      <div>
        <Label>Actividad Escolar</Label>
        <Input
          value={data.actividadEscolar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("actividadEscolar", e.target.value)
          }
          placeholder="Ingrese actividad escolar"
        />
      </div>
      <div>
        <Label>Observaciones</Label>
        <Input
          value={data.observaciones}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange("observaciones", e.target.value)
          }
          placeholder="Ingrese observaciones"
        />
      </div>
    </div>
  );
};

export default DatosEstadoGeneralForm;