import React from "react";
import Switch from "../../../switch/Switch";

interface EvaluacionAfectivaProps {
  data: {
    altaSensibilidad: boolean;
    agresividadAfectividad: boolean;
    sumision: boolean;
    rabietas: boolean;
    solidaridad: boolean;
    generosidad: boolean;
    afectuoso: boolean;
    angustia: boolean;
    ansiedadSituacional: boolean;
    timidez: boolean;
    ansiedadExpectante: boolean;
    depresion: boolean;
    perdidaRecienteDeInteres: boolean;
    desesperacion: boolean;
    euforia: boolean;
    indiferencia: boolean;
    aplanamiento: boolean;
    ambivalencia: boolean;
    irritabilidadAfectividad: boolean;
    labilidad: boolean;
    tenacidad: boolean;
    incontinencia: boolean;
    sentimientosInadecuados: boolean;
    neotimia: boolean;
    disociacionIdeoAfectiva: boolean;
    anhedonia: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const EvaluacionAfectivaForm: React.FC<EvaluacionAfectivaProps> = ({ data, onChange }) => {
  const fields = [
    { id: "altaSensibilidad", label: "Alta sensibilidad" },
    { id: "agresividadAfectividad", label: "Agresividad" },
    { id: "sumision", label: "Sumisión" },
    { id: "rabietas", label: "Rabietas" },
    { id: "solidaridad", label: "Solidaridad" },
    { id: "generosidad", label: "Generosidad" },
    { id: "afectuoso", label: "Afectuoso" },
    { id: "angustia", label: "Angustia" },
    { id: "ansiedadSituacional", label: "Ansiedad situacional" },
    { id: "timidez", label: "Timidez" },
    { id: "ansiedadExpectante", label: "Ansiedad expectante" },
    { id: "depresion", label: "Depresión" },
    { id: "perdidaRecienteDeInteres", label: "Pérdida reciente de interés" },
    { id: "desesperacion", label: "Desesperación" },
    { id: "euforia", label: "Euforia" },
    { id: "indiferencia", label: "Indiferencia" },
    { id: "aplanamiento", label: "Aplanamiento" },
    { id: "ambivalencia", label: "Ambivalencia" },
    { id: "irritabilidadAfectividad", label: "Irritabilidad" },
    { id: "labilidad", label: "Labilidad" },
    { id: "tenacidad", label: "Tenacidad" },
    { id: "incontinencia", label: "Incontinencia" },
    { id: "sentimientosInadecuados", label: "Sentimientos inadecuados" },
    { id: "neotimia", label: "Neotimia" },
    { id: "disociacionIdeoAfectiva", label: "Disociación ideo-afectiva" },
    { id: "anhedonia", label: "Anhedonia" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {fields.map((field) => (
        <Switch
          key={field.id}
          label={field.label}
          checked={data[field.id as keyof typeof data]}
          onChange={(checked: boolean) => onChange(field.id, checked)}
        />
      ))}
    </div>
  );
};

export default EvaluacionAfectivaForm;
