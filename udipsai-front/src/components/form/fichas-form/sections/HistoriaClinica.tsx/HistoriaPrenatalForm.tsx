import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface HistoriaPrenatalProps {
  data: {
    embarazoDeseado: boolean;
    controlEmbarazo: boolean;
    causaControlEmbarazo: string;
    enfermedadesMadre: string;
    consumoMedicamentosToxicos: string;
    presentoAmenazaAborto: boolean;
    mesAmenazaAborto: string;
    causaAmenazaAborto: string;
    estadoEmocional: string;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaPrenatalForm: React.FC<HistoriaPrenatalProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Switch
            label="¿Embarazo Deseado?"
            checked={data.embarazoDeseado}
            onChange={(checked: boolean) =>
              onChange("embarazoDeseado", checked)
            }
          />
        </div>
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Switch
            label="¿Control de Embarazo?"
            checked={data.controlEmbarazo}
            onChange={(checked: boolean) =>
              onChange("controlEmbarazo", checked)
            }
          />
        </div>
      </div>
{data.controlEmbarazo && (
      <div className="md:col-span-2">
        <Label>Causa de Control de Embarazo (Si aplica)</Label>
        <Input
          value={data.causaControlEmbarazo}
          onChange={(e) => onChange("causaControlEmbarazo", e.target.value)}
          placeholder="Describa la causa"
        />
      </div>
)}

      <div>
        <Label>Enfermedades de la Madre durante el embarazo</Label>
        <Input
          value={data.enfermedadesMadre}
          onChange={(e) => onChange("enfermedadesMadre", e.target.value)}
          placeholder="ej: Anemia, Diabetes Gestacional"
        />
      </div>

      <div>
        <Label>Consumo de Medicamentos / Sustancias Tóxicas</Label>
        <Input
          value={data.consumoMedicamentosToxicos}
          onChange={(e) =>
            onChange("consumoMedicamentosToxicos", e.target.value)
          }
          placeholder="ej: Alcohol, tabaco, medicinas específicas"
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
          <Switch
            label="¿Amenaza de Aborto?"
            checked={data.presentoAmenazaAborto}
            onChange={(checked: boolean) =>
              onChange("presentoAmenazaAborto", checked)
            }
          />
        </div>
        {data.presentoAmenazaAborto && (
          <>
            <div>
              <Label>Mes de la amenaza</Label>
              <Input
                value={data.mesAmenazaAborto}
                onChange={(e) => onChange("mesAmenazaAborto", e.target.value)}
                placeholder="ej: 3er mes"
              />
            </div>
            <div>
              <Label>Causa de la amenaza</Label>
              <Input
                value={data.causaAmenazaAborto}
                onChange={(e) => onChange("causaAmenazaAborto", e.target.value)}
                placeholder="Describa la causa"
              />
            </div>
          </>
        )}
      </div>

      <div className="md:col-span-2">
        <Label>Estado Emocional durante el embarazo</Label>
        <Input
          value={data.estadoEmocional}
          onChange={(e) => onChange("estadoEmocional", e.target.value)}
          placeholder="ej: Tranquila, ansiosa, deprimida"
        />
      </div>
    </div>
  );
};

export default HistoriaPrenatalForm;
