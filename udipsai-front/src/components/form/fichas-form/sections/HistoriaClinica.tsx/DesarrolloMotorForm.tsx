import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Select from "../../../Select";

interface DesarrolloMotorProps {
  data: {
    controlCefalico: string;
    sedestacion: string;
    hipedestacion: string;
    caminaConApoyo: string;
    caminaSolo: string;
    subeEscaleras: string;
    controlEsfinteres: string;
    salta: string;
    corre: string;
    gateo: string;
    prefiereManoIzquierdaDerecha: string;
    caeOPerdeEquilibrioFacilmente: string;
  };
  onChange: (field: string, value: any) => void;
}

const DesarrolloMotorForm: React.FC<DesarrolloMotorProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  const optionsLateralidad = [
    { value: "DERECHA", label: "Derecha" },
    { value: "IZQUIERDA", label: "Izquierda" },
    { value: "AMBIDIESTRO", label: "Ambidiestro" },
    { value: "POR_DEFINIR", label: "Por definir" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <Label className="col-span-full font-bold">
          Hitos del Desarrollo (Indique edad / estado)
        </Label>
        <div>
          <Label>Control Cefálico</Label>
          <Input
            value={data.controlCefalico}
            onChange={(e) => onChange("controlCefalico", e.target.value)}
            placeholder="ej: 3 meses"
          />
        </div>
        <div>
          <Label>Sedestación (Sentado)</Label>
          <Input
            value={data.sedestacion}
            onChange={(e) => onChange("sedestacion", e.target.value)}
            placeholder="ej: 6 meses"
          />
        </div>
        <div>
          <Label>Hipedestación (De pie)</Label>
          <Input
            value={data.hipedestacion}
            onChange={(e) => onChange("hipedestacion", e.target.value)}
            placeholder="ej: 10 meses"
          />
        </div>
        <div>
          <Label>Gateo</Label>
          <Input
            value={data.gateo}
            onChange={(e) => onChange("gateo", e.target.value)}
            placeholder="ej: 8 meses"
          />
        </div>
        <div>
          <Label>Camina con Apoyo</Label>
          <Input
            value={data.caminaConApoyo}
            onChange={(e) => onChange("caminaConApoyo", e.target.value)}
            placeholder="ej: 11 meses"
          />
        </div>
        <div>
          <Label>Camina Solo</Label>
          <Input
            value={data.caminaSolo}
            onChange={(e) => onChange("caminaSolo", e.target.value)}
            placeholder="ej: 13 meses"
          />
        </div>
        <div>
          <Label>Control de Esfínteres</Label>
          <Input
            value={data.controlEsfinteres}
            onChange={(e) => onChange("controlEsfinteres", e.target.value)}
            placeholder="ej: 2 años"
          />
        </div>
        <div>
          <Label>Sube Escaleras</Label>
          <Input
            value={data.subeEscaleras}
            onChange={(e) => onChange("subeEscaleras", e.target.value)}
            placeholder="Edad"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div>
          <Label>Salta</Label>
          <Input
            value={data.salta}
            onChange={(e) => onChange("salta", e.target.value)}
            placeholder="Edad/Estado"
          />
        </div>
        <div>
          <Label>Corre</Label>
          <Input
            value={data.corre}
            onChange={(e) => onChange("corre", e.target.value)}
            placeholder="Edad/Estado"
          />
        </div>
        <div>
          <Label>Preferencia Manual</Label>
          <Select
            options={optionsLateralidad}
            value={data.prefiereManoIzquierdaDerecha}
            onChange={(val) => onChange("prefiereManoIzquierdaDerecha", val)}
          />
        </div>
        <div>
          <Label>¿Cae/Pierde equilibrio?</Label>
          <Input
            value={data.caeOPerdeEquilibrioFacilmente}
            onChange={(e) =>
              onChange("caeOPerdeEquilibrioFacilmente", e.target.value)
            }
            placeholder="Frecuencia/Causa"
          />
        </div>
      </div>
    </div>
  );
};

export default DesarrolloMotorForm;
