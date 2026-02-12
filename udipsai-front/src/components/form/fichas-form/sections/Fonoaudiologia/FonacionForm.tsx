import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Input from "../../../input/InputField";

interface FonacionFormProps {
  data: {
    creeTonoVozEstudianteApropiado: boolean;
    respiracionNormal: boolean;
    situacionesAlteraTonoVoz: string;
    desdeCuandoAlteracionesVoz: string;
    tonoDeVoz: string;
    respiracion: string;
    ronca: boolean;
    roncaDesdeCuando: string;
    juegoVocal: boolean;
    juegoVocalDesdeCuando: string;
    vocalizacion: boolean;
    vocalizacionDesdeCuando: string;
    balbuceo: boolean;
    balbuceoDesdeCuando: string;
    silabeo: boolean;
    silabeoDesdeCuando: string;
    primerasPalabras: boolean;
    primerasPalabrasDesdeCuando: string;
    oracionesDosPalabras: boolean;
    oracionesDosPalabrasDesdeCuando: string;
    oracionesTresPalabras: boolean;
    oracionesTresPalabrasDesdeCuando: string;
    formacionLinguisticaCompleta: boolean;
    formacionLinguisticaCompletaDesdeCuando: string;
    numeroTotalPalabras: number;
  };
  onChange: (field: string, value: any) => void;
}

const FonacionForm: React.FC<FonacionFormProps> = ({ data, onChange }) => {
  const switchesHitos = [
    { id: "ronca", label: "Ronca", detailId: "roncaDesdeCuando" },
    {
      id: "juegoVocal",
      label: "Juego vocal",
      detailId: "juegoVocalDesdeCuando",
    },
    {
      id: "vocalizacion",
      label: "Vocalización",
      detailId: "vocalizacionDesdeCuando",
    },
    { id: "balbuceo", label: "Balbuceo", detailId: "balbuceoDesdeCuando" },
    { id: "silabeo", label: "Silabeo", detailId: "silabeoDesdeCuando" },
    {
      id: "primerasPalabras",
      label: "Primeras palabras",
      detailId: "primerasPalabrasDesdeCuando",
    },
    {
      id: "oracionesDosPalabras",
      label: "Oraciones dos palabras",
      detailId: "oracionesDosPalabrasDesdeCuando",
    },
    {
      id: "oracionesTresPalabras",
      label: "Oraciones tres palabras",
      detailId: "oracionesTresPalabrasDesdeCuando",
    },
    {
      id: "formacionLinguisticaCompleta",
      label: "Formación lingüística completa",
      detailId: "formacionLinguisticaCompletaDesdeCuando",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Respiración y Tono de Voz
        </h4>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <Switch
            label="¿Cree que el tono de voz del estudiante es apropiado?"
            checked={data.creeTonoVozEstudianteApropiado}
            onChange={(val: boolean) =>
              onChange("creeTonoVozEstudianteApropiado", val)
            }
          />
          {data.creeTonoVozEstudianteApropiado && (
            <>
              <div>
                <Label htmlFor="situacionesAlteraTonoVoz">
                  Situaciones que alteran el tono
                </Label>
                <Input
                  id="situacionesAlteraTonoVoz"
                  value={data.situacionesAlteraTonoVoz}
                  onChange={(e) =>
                    onChange("situacionesAlteraTonoVoz", e.target.value)
                  }
                  placeholder="Especifique..."
                />
              </div>
              <div>
                <Label htmlFor="desdeCuandoAlteracionesVoz">
                  Desde cuándo hay alteraciones
                </Label>
                <Input
                  id="desdeCuandoAlteracionesVoz"
                  value={data.desdeCuandoAlteracionesVoz}
                  onChange={(e) =>
                    onChange("desdeCuandoAlteracionesVoz", e.target.value)
                  }
                  placeholder="Especifique..."
                />
              </div>
              <div>
                <Label htmlFor="tonoDeVoz">Tono de voz</Label>
                <Input
                  id="tonoDeVoz"
                  value={data.tonoDeVoz}
                  onChange={(e) => onChange("tonoDeVoz", e.target.value)}
                  placeholder="Normal, agudo, etc."
                />
              </div>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-4">
          <Switch
            label="Respiración normal"
            checked={data.respiracionNormal}
            onChange={(val: boolean) => onChange("respiracionNormal", val)}
          />
          <div>
            <Label htmlFor="respiracion">Respiración</Label>
            <Input
              id="respiracion"
              value={data.respiracion}
              onChange={(e) => onChange("respiracion", e.target.value)}
              placeholder="Nasal, bucal, etc."
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Hitos del Lenguaje / Fonación
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-2 items-center">
          {switchesHitos.map((sw) => (
            <React.Fragment key={sw.id}>
              <div className="py-2 flex items-center h-12">
                <Switch
                  label={sw.label}
                  checked={data[sw.id as keyof typeof data] as boolean}
                  onChange={(checked: boolean) => onChange(sw.id, checked)}
                />
              </div>
              <div className="h-12 flex items-center">
                {data[sw.id as keyof typeof data] && (
                  <div className="w-full animate-in fade-in slide-in-from-left-4 duration-300">
                    <Input
                      placeholder="¿Desde cuándo?"
                      value={
                        (data[sw.detailId as keyof typeof data] as string) || ""
                      }
                      onChange={(e) => onChange(sw.detailId, e.target.value)}
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}

          <div className="py-2 flex items-center h-12">
            <Label
              htmlFor="numeroTotalPalabras"
              className="text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Número total de palabras
            </Label>
          </div>
          <div className="h-12 flex items-center">
            <Input
              id="numeroTotalPalabras"
              type="number"
              value={data.numeroTotalPalabras}
              onChange={(e) =>
                onChange("numeroTotalPalabras", Number(e.target.value))
              }
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FonacionForm;
