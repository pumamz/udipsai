import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface HablaFormProps {
  data: {
    dificultadPronunciarPalabras: boolean;
    seTrabaCuandoHabla: boolean;
    seEntiendeLoQueDice: boolean;
    sabeComoLlamanObjetosEntorno: boolean;
    comprendeLoQueSeLeDice: boolean;
    reconoceFuenteSonora: boolean;
    comunicacionPreferentementeForma: string;
    trastornoEspecificoPronunciacion: boolean;
    trastornoLenguajeExpresivo: boolean;
    afasiaAdquiridaEpilepsia: boolean;
    otrosTrastornosDesarrolloHabla: boolean;
    trastornoDesarrolloHablaLenguaje: boolean;
    trastornoRecepcionLenguaje: boolean;
    alteracionesHabla: boolean;
    disfasiaAfasia: boolean;
    disartriaAnartria: boolean;
    otrasAlteracionesHabla: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const HablaForm: React.FC<HablaFormProps> = ({ data, onChange }) => {
  const optionsComunicacion = [
    { value: "VERBAL", label: "Verbal" },
    { value: "GESTUAL", label: "Gestual" },
    { value: "MIXTA", label: "Mixta" },
  ];

  const switchesHabilidades = [
    {
      id: "dificultadPronunciarPalabras",
      label: "Dificultad para pronunciar palabras",
    },
    { id: "seTrabaCuandoHabla", label: "Se traba cuando habla" },
    { id: "seEntiendeLoQueDice", label: "Se entiende lo que dice" },
    {
      id: "sabeComoLlamanObjetosEntorno",
      label: "Sabe cómo llaman objetos entorno",
    },
    { id: "comprendeLoQueSeLeDice", label: "Comprende lo que se le dice" },
    { id: "reconoceFuenteSonora", label: "Reconoce fuente sonora" },
  ];

  const switchesTrastornos = [
    {
      id: "trastornoEspecificoPronunciacion",
      label: "Trastorno específico pronunciación",
    },
    { id: "trastornoLenguajeExpresivo", label: "Trastorno lenguaje expresivo" },
    { id: "afasiaAdquiridaEpilepsia", label: "Afasia adquirida epilepsia" },
    {
      id: "otrosTrastornosDesarrolloHabla",
      label: "Otros trastornos desarrollo habla",
    },
    {
      id: "trastornoDesarrolloHablaLenguaje",
      label: "Trastorno desarrollo habla lenguaje",
    },
    { id: "trastornoRecepcionLenguaje", label: "Trastorno recepción lenguaje" },
  ];

  const switchesAlteraciones = [
    { id: "alteracionesHabla", label: "Alteraciones habla" },
    { id: "disfasiaAfasia", label: "Disfasia afasia" },
    { id: "disartriaAnartria", label: "Disartria anartria" },
    { id: "otrasAlteracionesHabla", label: "Otras alteraciones habla" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Habilidades y Comunicación
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {switchesHabilidades.map((sw) => (
            <Switch
              key={sw.id}
              label={sw.label}
              checked={data[sw.id as keyof typeof data] as boolean}
              onChange={(checked: boolean) => onChange(sw.id, checked)}
            />
          ))}
        </div>
        <div className="pt-6">
          <Label htmlFor="comunicacionPreferentementeForma">
            Comunicación preferentemente forma
          </Label>
            <Select
            className="max-w-xs"
              options={optionsComunicacion}
              value={data.comunicacionPreferentementeForma}
              onChange={(val: string) =>
                onChange("comunicacionPreferentementeForma", val)
              }
              placeholder="Seleccione..."
            />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Trastornos del Desarrollo
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {switchesTrastornos.map((sw) => (
            <Switch
              key={sw.id}
              label={sw.label}
              checked={data[sw.id as keyof typeof data] as boolean}
              onChange={(checked: boolean) => onChange(sw.id, checked)}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 dark:border-gray-800">
        <h4 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Otras Alteraciones
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {switchesAlteraciones.map((sw) => (
            <Switch
              key={sw.id}
              label={sw.label}
              checked={data[sw.id as keyof typeof data] as boolean}
              onChange={(checked: boolean) => onChange(sw.id, checked)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HablaForm;
