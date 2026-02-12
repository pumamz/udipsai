import React from "react";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface VestibularFormProps {
  data: {
    faltaEquilibrioCaminar: boolean;
    mareos: boolean;
    cuandoMareos: string;
    vertigo: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const VestibularForm: React.FC<VestibularFormProps> = ({ data, onChange }) => {
  const optionsCuandoMareos = [
    { value: "SIEMPRE", label: "Siempre" },
    { value: "A_VECES", label: "A veces" },
    { value: "AL_CAMINAR", label: "Al caminar" },
    { value: "AL_PARARSE", label: "Al pararse" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Equilibrio y Vértigo
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Switch
            label="Falta equilibrio al caminar"
            checked={data.faltaEquilibrioCaminar}
            onChange={(val: boolean) => onChange("faltaEquilibrioCaminar", val)}
          />
          <Switch
            label="Sufre de Vértigo"
            checked={data.vertigo}
            onChange={(val: boolean) => onChange("vertigo", val)}
          />
          <Switch
            label="Presenta Mareos"
            checked={data.mareos}
            onChange={(val: boolean) => onChange("mareos", val)}
          />
        {data.mareos && (
          <div>
            <Select
              options={optionsCuandoMareos}
              value={data.cuandoMareos || ""}
              onChange={(val: string) => onChange("cuandoMareos", val)}
              placeholder="Seleccione el momento..."
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default VestibularForm;
