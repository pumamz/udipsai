import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";

interface AlimentacionProps {
  data: {
    dejoPechoMaterno: string;
    biberon: string;
    alimentoPorSiSoloCuchara: string;
    edadIntegroDietaFamiliar: string;
  };
  onChange: (field: string, value: any) => void;
}

const AlimentacionForm: React.FC<AlimentacionProps> = ({ data, onChange }) => {
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
      <div>
        <Label>Dejó Pecho Materno</Label>
        <Input
          value={data.dejoPechoMaterno}
          onChange={(e) => onChange("dejoPechoMaterno", e.target.value)}
          placeholder="ej: 12 meses"
        />
      </div>
      <div>
        <Label>Biberón</Label>
        <Input
          value={data.biberon}
          onChange={(e) => onChange("biberon", e.target.value)}
          placeholder="ej: Hasta los 2 años"
        />
      </div>
      <div>
        <Label>Alimento solo con cuchara</Label>
        <Input
          value={data.alimentoPorSiSoloCuchara}
          onChange={(e) => onChange("alimentoPorSiSoloCuchara", e.target.value)}
          placeholder="ej: 18 meses"
        />
      </div>
      <div>
        <Label>Edad Integró Dieta Familiar</Label>
        <Input
          value={data.edadIntegroDietaFamiliar}
          onChange={(e) => onChange("edadIntegroDietaFamiliar", e.target.value)}
          placeholder="ej: 1 año"
        />
      </div>
    </div>
  );
};

export default AlimentacionForm;
