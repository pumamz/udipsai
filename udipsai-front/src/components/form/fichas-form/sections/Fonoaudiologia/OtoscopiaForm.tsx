import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface OtoscopiaFormProps {
  data: {
    palpacionPabellonOidoDerecho: string;
    palpacionMastoidesOidoDerecho: string;
    caeOidoDerecho: string;
    obstruccionOidoDerecho: string;
    aparienciaMenbranaTimpanicaOidoDerecho: string;
    perforacionOidoDerecho: boolean;
    burbujaOidoDerecho: boolean;
    coloracionOidoDerecho: string;
    palpacionPabellonOidoIzquierdo: string;
    palpacionMastoidesOidoIzquierdo: string;
    caeOidoIzquierdo: string;
    obstruccionOidoIzquierdo: string;
    aparienciaMenbranaTimpanicaOidoIzquierdo: string;
    perforacionOidoIzquierdo: boolean;
    burbujaOidoIzquierdo: boolean;
    coloracionOidoIzquierdo: string;
  };
  onChange: (field: string, value: any) => void;
}

const OtoscopiaForm: React.FC<OtoscopiaFormProps> = ({ data, onChange }) => {
  const optionsPalpacion = [
    { value: "NORMAL", label: "Normal" },
    { value: "DOLOR", label: "Dolor" },
    { value: "INFLAMADA", label: "Inflamada" },
  ];

  const optionsCAE = [
    { value: "NORMAL", label: "Normal" },
    { value: "IRRITADO", label: "Irritado" },
    { value: "SUPURACION", label: "Supuración" },
    { value: "INFLAMADO", label: "Inflamado" },
  ];

  const optionsObstruccion = [
    { value: "SI", label: "Sí" },
    { value: "NO", label: "No" },
    { value: "TOTAL", label: "Total" },
    { value: "PARCIAL", label: "Parcial" },
  ];

  const optionsApariencia = [
    { value: "NORMAL", label: "Normal" },
    { value: "IRRITADO", label: "Irritado" },
    { value: "SUPURACION", label: "Supuración" },
    { value: "INFLAMADA", label: "Inflamada" },
  ];

  const optionsColoracion = [
    { value: "NORMAL", label: "Normal" },
    { value: "AZUL", label: "Azul" },
    { value: "ERITEMATOSA", label: "Eritematosa" },
    { value: "OPACA", label: "Opaca" },
  ];

  const renderOido = (lado: "Derecho" | "Izquierdo") => {
    const isDerecho = lado === "Derecho";
    const prefix = isDerecho ? "Derecho" : "Izquierdo";

    return (
      <div className="space-y-6 bg-gray-50/30 p-6 rounded-2xl dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
        <h5 className="flex items-center gap-2 text-base font-bold text-gray-800 dark:text-white border-b pb-3 border-gray-200 dark:border-gray-700">
          <span className={`h-3 w-3 rounded-full ${isDerecho ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
          Oído {lado}
        </h5>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>
            <Label htmlFor={`palpacionPabellonOido${prefix}`}>Palpación Pabellón</Label>
            <Select 
              options={optionsPalpacion} 
              value={data[`palpacionPabellonOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`palpacionPabellonOido${prefix}`, val)} 
            />
          </div>
          <div>
            <Label htmlFor={`palpacionMastoidesOido${prefix}`}>Palpación Mastoides</Label>
            <Select 
              options={optionsPalpacion} 
              value={data[`palpacionMastoidesOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`palpacionMastoidesOido${prefix}`, val)} 
            />
          </div>
          <div>
            <Label htmlFor={`caeOido${prefix}`}>CAE</Label>
            <Select 
              options={optionsCAE} 
              value={data[`caeOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`caeOido${prefix}`, val)} 
            />
          </div>
          <div>
            <Label htmlFor={`obstruccionOido${prefix}`}>Obstrucción</Label>
            <Select 
              options={optionsObstruccion} 
              value={data[`obstruccionOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`obstruccionOido${prefix}`, val)} 
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Label htmlFor={`aparienciaMenbranaTimpanicaOido${prefix}`}>Apariencia Membrana Timpánica</Label>
            <Select 
              options={optionsApariencia} 
              value={data[`aparienciaMenbranaTimpanicaOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`aparienciaMenbranaTimpanicaOido${prefix}`, val)} 
            />
          </div>
          <div className="flex gap-4 sm:col-span-2 lg:col-span-1 xl:col-span-2 pt-2">
            <Switch 
              label="Perforación" 
              checked={data[`perforacionOido${prefix}` as keyof typeof data] as boolean} 
              onChange={(val: boolean) => onChange(`perforacionOido${prefix}`, val)} 
            />
            <Switch 
              label="Burbuja" 
              checked={data[`burbujaOido${prefix}` as keyof typeof data] as boolean} 
              onChange={(val: boolean) => onChange(`burbujaOido${prefix}`, val)} 
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Label htmlFor={`coloracionOido${prefix}`}>Coloración</Label>
            <Select 
              options={optionsColoracion} 
              value={data[`coloracionOido${prefix}` as keyof typeof data] as string} 
              onChange={(val: string) => onChange(`coloracionOido${prefix}`, val)} 
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {renderOido("Derecho")}
      {renderOido("Izquierdo")}
    </div>
  );
};

export default OtoscopiaForm;
