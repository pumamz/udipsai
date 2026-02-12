import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Select from "../../../Select";

interface DatosFamiliaresProps {
  data: {
    nombrePadre: string;
    edadPadre: string;
    ocupacionPadre: string;
    instruccionPadre: string;
    estadoCivilPadre: string;
    lugarResidenciaPadre: string;
    nombreMadre: string;
    edadMadre: string;
    ocupacionMadre: string;
    instruccionMadre: string;
    estadoCivilMadre: string;
    lugarResidenciaMadre: string;
    numeroHermanos: string;
    lugarQueOcupa: string;
    direccionDomiciliaria: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosFamiliaresForm: React.FC<DatosFamiliaresProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  const optionsEstadoCivil = [
    { value: "SOLTERO", label: "Soltero" },
    { value: "CASADO", label: "Casado" },
    { value: "DIVORCIADO", label: "Divorciado" },
    { value: "VIUDO", label: "Viudo" },
    { value: "OTRO", label: "Otro" },
  ];
  return (
    <div className="space-y-8">
      {/* Información del Padre */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div className="col-span-full">
          <h4 className="font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
            Información del Padre
          </h4>
        </div>
        <div>
          <Label>Nombre completo del Padre</Label>
          <Input
            value={data.nombrePadre}
            onChange={(e) => onChange("nombrePadre", e.target.value)}
            placeholder="Nombres y Apellidos"
          />
        </div>
        <div>
          <Label>Edad</Label>
          <Input
            type="number"
            value={data.edadPadre}
            onChange={(e) => onChange("edadPadre", e.target.value)}
            placeholder="Edad"
          />
        </div>
        <div>
          <Label>Ocupación</Label>
          <Input
            value={data.ocupacionPadre}
            onChange={(e) => onChange("ocupacionPadre", e.target.value)}
            placeholder="Ocupación"
          />
        </div>
        <div>
          <Label>Instrucción</Label>
          <Input
            value={data.instruccionPadre}
            onChange={(e) => onChange("instruccionPadre", e.target.value)}
            placeholder="Nivel de estudios"
          />
        </div>
        <div>
          <Label>Estado Civil</Label>
          <Select
            options={optionsEstadoCivil}
            value={data.estadoCivilPadre}
            onChange={(value: string) => onChange("estadoCivilPadre", value)}
            placeholder="Seleccione el estado civil del padre"
          />
        </div>
        <div>
          <Label>Lugar de Residencia</Label>
          <Input
            value={data.lugarResidenciaPadre}
            onChange={(e) => onChange("lugarResidenciaPadre", e.target.value)}
            placeholder="Ciudad/Provincia"
          />
        </div>
      </div>

      {/* Información de la Madre */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div className="col-span-full">
          <h4 className="font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
            Información de la Madre
          </h4>
        </div>
        <div>
          <Label>Nombre completo de la Madre</Label>
          <Input
            value={data.nombreMadre}
            onChange={(e) => onChange("nombreMadre", e.target.value)}
            placeholder="Nombres y Apellidos"
          />
        </div>
        <div>
          <Label>Edad</Label>
          <Input
            type="number"
            value={data.edadMadre}
            onChange={(e) => onChange("edadMadre", e.target.value)}
            placeholder="Edad"
          />
        </div>
        <div>
          <Label>Ocupación</Label>
          <Input
            value={data.ocupacionMadre}
            onChange={(e) => onChange("ocupacionMadre", e.target.value)}
            placeholder="Ocupación"
          />
        </div>
        <div>
          <Label>Instrucción</Label>
          <Input
            value={data.instruccionMadre}
            onChange={(e) => onChange("instruccionMadre", e.target.value)}
            placeholder="Nivel de estudios"
          />
        </div>
        <div>
          <Label>Estado Civil</Label>
          <Select
            options={optionsEstadoCivil}
            value={data.estadoCivilMadre}
            onChange={(value: string) => onChange("estadoCivilMadre", value)}
            placeholder="Seleccione el estado civil de la madre"
          />
        </div>
        <div>
          <Label>Lugar de Residencia</Label>
          <Input
            value={data.lugarResidenciaMadre}
            onChange={(e) => onChange("lugarResidenciaMadre", e.target.value)}
            placeholder="Ciudad/Provincia"
          />
        </div>
      </div>

      {/* Información del Hogar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div className="col-span-full">
          <h4 className="font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
            Composición Familiar
          </h4>
        </div>
        <div>
          <Label>Número de Hermanos</Label>
          <Input
            type="number"
            value={data.numeroHermanos}
            onChange={(e) => onChange("numeroHermanos", e.target.value)}
            placeholder="Cantidad"
          />
        </div>
        <div>
          <Label>Lugar que Ocupa</Label>
          <Input
            value={data.lugarQueOcupa}
            onChange={(e) => onChange("lugarQueOcupa", e.target.value)}
            placeholder="ej: Primero, Segundo"
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <Label>Dirección Domiciliaria</Label>
          <Input
            value={data.direccionDomiciliaria}
            onChange={(e) => onChange("direccionDomiciliaria", e.target.value)}
            placeholder="Dirección exacta"
          />
        </div>
      </div>
    </div>
  );
};

export default DatosFamiliaresForm;
