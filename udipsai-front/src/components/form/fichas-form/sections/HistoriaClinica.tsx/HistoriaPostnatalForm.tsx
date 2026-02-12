import React from "react";
import Switch from "../../../switch/Switch";

interface HistoriaPostnatalProps {
  data: {
    esquemaVacunacionCompleto: boolean;
    convulsiones: boolean;
    medicacion: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaPostnatalForm: React.FC<HistoriaPostnatalProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 p-4 rounded-2xl">
        <Switch
          label="¿Esquema de Vacunación completo?"
          checked={data.esquemaVacunacionCompleto}
          onChange={(checked: boolean) =>
            onChange("esquemaVacunacionCompleto", checked)
          }
        />
        <Switch
          label="Convulsiones"
          checked={data.convulsiones}
          onChange={(checked: boolean) => onChange("convulsiones", checked)}
        />
        <Switch
          label="Medicación"
          checked={data.medicacion}
          onChange={(checked: boolean) => onChange("medicacion", checked)}
        />
    </div>
  );
};

export default HistoriaPostnatalForm;
