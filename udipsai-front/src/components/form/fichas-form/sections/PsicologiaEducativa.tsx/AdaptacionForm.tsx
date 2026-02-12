import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface AdaptacionProps {
  data: {
    inclusionEducativa: boolean;
    causaInclusionEducativa: string;
    adaptacionesCurriculares: boolean;
    gradoAdaptacion: string;
    especifiqueAsignaturas: string;
    evaluacionPsicologicaUOtrosAnterior: boolean;
    causaEvaluacionPsicologicaUOtrosAnterior: string;
    recibeApoyo: boolean;
    causaLugarTiempoRecibeApoyo: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosAdaptacionForm: React.FC<AdaptacionProps> = ({ data, onChange }) => {
  const optionsGrado = [
    { value: "BUENO", label: "Bueno" },
    { value: "REGULAR", label: "Regular" },
    { value: "MALO", label: "Malo" },
    { value: "NEUTRO", label: "Neutro" },
  ];
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Switch
          label="¿Tiene inclusión educativa?"
          checked={data.inclusionEducativa}
          onChange={(checked: boolean) =>
            onChange("inclusionEducativa", checked)
          }
        />
      </div>
      {data.inclusionEducativa && (
        <>
          <div>
            <Label>Causa de porqué tiene inclusión educativa</Label>
            <Input
              value={data.causaInclusionEducativa}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("causaInclusionEducativa", e.target.value)
              }
              placeholder="Ingrese la causa de porqué tiene inclusión educativa"
            />
          </div>
          <div>
            <Switch
              label="¿Tiene adaptaciones curriculares?"
              checked={data.adaptacionesCurriculares}
              onChange={(checked: boolean) =>
                onChange("adaptacionesCurriculares", checked)
              }
            />
          </div>
          {data.adaptacionesCurriculares && (
            <>
              <div>
                <Label>Grado de adaptación</Label>
                <Select
                  options={optionsGrado}
                  value={data.gradoAdaptacion}
                  onChange={(val: string) => onChange("gradoAdaptacion", val)}
                  placeholder="Seleccione el grado de adaptación"
                />
              </div>
              <div>
                <Label>Especifique las asignaturas</Label>
                <Input
                  value={data.especifiqueAsignaturas}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange("especifiqueAsignaturas", e.target.value)
                  }
                  placeholder="Ingrese las asignaturas"
                />
              </div>
            </>
          )}
        </>
      )}

      <div>
        <Switch
          label="¿Tiene evaluación psicológica u otros anterior?"
          checked={data.evaluacionPsicologicaUOtrosAnterior}
          onChange={(checked: boolean) =>
            onChange("evaluacionPsicologicaUOtrosAnterior", checked)
          }
        />
      </div>
      {data.evaluacionPsicologicaUOtrosAnterior && (
        <div>
          <Label>Causa de la evaluación psicológica u otros anterior</Label>
          <Input
            value={data.causaEvaluacionPsicologicaUOtrosAnterior}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(
                "causaEvaluacionPsicologicaUOtrosAnterior",
                e.target.value,
              )
            }
            placeholder="Ingrese la causa de la evaluación psicológica u otros anterior"
          />
        </div>
      )}
      <div>
        <Switch
          label="¿Recibe apoyo?"
          checked={data.recibeApoyo}
          onChange={(checked: boolean) => onChange("recibeApoyo", checked)}
        />
      </div>
      {data.recibeApoyo && (
        <div>
          <Label>Causa del porqué recibe apoyo</Label>
          <Input
            value={data.causaLugarTiempoRecibeApoyo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange("causaLugarTiempoRecibeApoyo", e.target.value)
            }
            placeholder="Ingrese la causa del porqué recibe apoyo"
          />
        </div>
      )}
    </div>
  );
};

export default DatosAdaptacionForm;
