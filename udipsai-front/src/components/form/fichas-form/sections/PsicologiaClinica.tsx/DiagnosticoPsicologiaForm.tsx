import React from "react";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";

interface DiagnosticoPsicologiaProps {
  data: {
    impresionDiagnostica: string;
    derivacionInterconsulta: string;
    objetivoPlanTratamientoIndividual: string;
    estrategiaDeIntervencion: string;
    indicadorDeLogro: string;
    tiempoEstimado: string;
    evaluacion: string;
  };
  onChange: (field: string, value: any) => void;
}

const DiagnosticoPsicologiaForm: React.FC<DiagnosticoPsicologiaProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label>Impresión Diagnóstica (CIE 10 / CIE 11 / DSM 5)</Label>
        <TextArea
          value={data.impresionDiagnostica}
          onChange={(val: string) => onChange("impresionDiagnostica", val)}
          placeholder="Describa impresión diagnóstica"
        />
      </div>
      <div>
        <Label>Derivación / Interconsulta</Label>
        <TextArea
          value={data.derivacionInterconsulta}
          onChange={(val: string) => onChange("derivacionInterconsulta", val)}
          placeholder="Describa derivación / interconsulta"
        />
      </div>
      <div>
        <Label>Objetivo del plan de tratamiento individual</Label>
        <TextArea
          value={data.objetivoPlanTratamientoIndividual}
          onChange={(val: string) => onChange("objetivoPlanTratamientoIndividual", val)}
          placeholder="Describa objetivo del plan de tratamiento individual"
        />
      </div>
      <div>
        <Label>Estrategia de Intervención</Label>
        <TextArea
          value={data.estrategiaDeIntervencion}
          onChange={(val: string) => onChange("estrategiaDeIntervencion", val)}
          placeholder="Describa estrategia de intervención"
        />
      </div>
      <div>
        <Label>Indicador de Logro</Label>
        <TextArea
          value={data.indicadorDeLogro}
          onChange={(val: string) => onChange("indicadorDeLogro", val)}
          placeholder="Describa indicador de logro"
        />
      </div>
      <div>
        <Label>Tiempo Estimado</Label>
        <TextArea
          value={data.tiempoEstimado}
          onChange={(val: string) => onChange("tiempoEstimado", val)}
          placeholder="Describa tiempo estimado"
        />
      </div>
      <div>
        <Label>Evaluación</Label>
        <TextArea
          value={data.evaluacion}
          onChange={(val: string) => onChange("evaluacion", val)}
          placeholder="Describa evaluación"
        />
      </div>
    </div>
  );
};

export default DiagnosticoPsicologiaForm;
