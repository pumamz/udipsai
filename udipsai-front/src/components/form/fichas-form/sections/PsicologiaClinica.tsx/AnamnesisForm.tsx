import React from "react";
import TextArea from "../../../input/TextArea";
import Label from "../../../Label";

interface AnamnesisFormProps {
  data: {
    anamnesisFamiliar: string;
    personal: string;
    momentosEvolutivosEnElDesarrollo: string;
    habitosEnLaOralidad: string;
  };
  onChange: (field: string, value: any) => void;
}

const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label>Anamnesis Familiar</Label>
        <TextArea
          value={data.anamnesisFamiliar}
          onChange={(val: string) => onChange("anamnesisFamiliar", val)}
          placeholder="Describa antecedentes familiares..."
        />
      </div>
      <div>
        <Label>Anamnesis Personal</Label>
        <TextArea
          value={data.personal}
          onChange={(val: string) => onChange("personal", val)}
          placeholder="Describa antecedentes personales..."
        />
      </div>
      <div>
        <Label>Momentos evolutivos en el desarrollo</Label>
        <TextArea
          value={data.momentosEvolutivosEnElDesarrollo}
          onChange={(val: string) => onChange("momentosEvolutivosEnElDesarrollo", val)}
          placeholder="Describa los momentos evolutivos en el desarrollo..."
        />
      </div>
      <div>
        <Label>Hábitos en la oralidad</Label>
        <TextArea
          value={data.habitosEnLaOralidad}
          onChange={(val: string) => onChange("habitosEnLaOralidad", val)}
          placeholder="Describa los hábitos en la oralidad..."
        />
      </div>
    </div>
  );
};

export default AnamnesisForm;
