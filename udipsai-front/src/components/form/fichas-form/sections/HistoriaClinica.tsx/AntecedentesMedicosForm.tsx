import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";

interface AntecedentesMedicosProps {
  data: {
    enfermedadesConTratamiento: string;
    alergias: string;
    intervencionesQuirurgicas: string;
    medicamentosRequeridosOConsumo: string;
    enfermedadesDiscapacidadesFamiliares: string;
    trastornosPsicologicosFamiliares: string;
    problemasAprendizajeFamiliares: string;
  };
  onChange: (field: string, value: any) => void;
}

const AntecedentesMedicosForm: React.FC<AntecedentesMedicosProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  return (
    <div className="space-y-8">
      {/* Antecedentes Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <Label className="col-span-full font-bold">
          Antecedentes Personales
        </Label>
        <div>
          <Label>Enfermedades con Tratamiento</Label>
          <Input
            value={data.enfermedadesConTratamiento}
            onChange={(e) =>
              onChange("enfermedadesConTratamiento", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
        <div>
          <Label>Alergias</Label>
          <Input
            value={data.alergias}
            onChange={(e) => onChange("alergias", e.target.value)}
            placeholder="ej: Polen, Penicilina"
          />
        </div>
        <div>
          <Label>Intervenciones Quirúrgicas</Label>
          <Input
            value={data.intervencionesQuirurgicas}
            onChange={(e) =>
              onChange("intervencionesQuirurgicas", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
        <div>
          <Label>Medicamentos Requeridos / Consumo</Label>
          <Input
            value={data.medicamentosRequeridosOConsumo}
            onChange={(e) =>
              onChange("medicamentosRequeridosOConsumo", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
      </div>

      {/* Antecedentes Familiares */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <Label className="col-span-full font-bold">
          Antecedentes Familiares
        </Label>
        <div>
          <Label>Enfermedades / Discapacidades Familiares</Label>
          <Input
            value={data.enfermedadesDiscapacidadesFamiliares}
            onChange={(e) =>
              onChange("enfermedadesDiscapacidadesFamiliares", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
        <div>
          <Label>Trastornos Psicológicos Familiares</Label>
          <Input
            value={data.trastornosPsicologicosFamiliares}
            onChange={(e) =>
              onChange("trastornosPsicologicosFamiliares", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
        <div>
          <Label>Problemas de Aprendizaje Familiares</Label>
          <Input
            value={data.problemasAprendizajeFamiliares}
            onChange={(e) =>
              onChange("problemasAprendizajeFamiliares", e.target.value)
            }
            placeholder="Describa"
          />
        </div>
      </div>
    </div>
  );
};

export default AntecedentesMedicosForm;
