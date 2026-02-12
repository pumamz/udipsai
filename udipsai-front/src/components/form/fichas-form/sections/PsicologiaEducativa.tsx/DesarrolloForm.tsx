import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";

interface DesarrolloProps {
  data: {
    cdi: boolean;
    cdiEdad: number;
    inicial1: boolean;
    inicial1Edad: number;
    inicial2: boolean;
    inicial2Edad: number;
    primerEGB: boolean;
    edad1roEGB: number;
    perdidaAnio: boolean;
    gradoCausaPerdidaAnio: string;
    desercionEscolar: boolean;
    gradoCausaDesercionEscolar: string;
    cambioInstitucion: boolean;
    gradoCausaCambioInstitucion: string;
    problemasAprendizaje: boolean;
    problemasAprendizajeEspecificar: string;
  };
  onChange: (field: string, value: any) => void;
}

const DatosDesarrolloForm: React.FC<DesarrolloProps> = ({ data, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
      <div className="flex items-center">
        <Switch
          label="CDI"
          checked={data.cdi}
          onChange={(checked: boolean) => onChange("cdi", checked)}
        />
      </div>
      <div>
        {data.cdi && (
          <>
            <Label>CDI Edad</Label>
            <Input
              type="number"
              value={data.cdiEdad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("cdiEdad", e.target.value)
              }
              placeholder="Ingrese CDI Edad"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Inicial 1"
          checked={data.inicial1}
          onChange={(checked: boolean) => onChange("inicial1", checked)}
        />
      </div>
      <div>
        {data.inicial1 && (
          <>
            <Label>Inicial 1 Edad</Label>
            <Input
              type="number"
              value={data.inicial1Edad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("inicial1Edad", e.target.value)
              }
              placeholder="Edad"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Inicial 2"
          checked={data.inicial2}
          onChange={(checked: boolean) => onChange("inicial2", checked)}
        />
      </div>
      <div>
        {data.inicial2 && (
          <>
            <Label>Inicial 2 Edad</Label>
            <Input
              type="number"
              value={data.inicial2Edad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("inicial2Edad", e.target.value)
              }
              placeholder="Edad"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Primer EGB"
          checked={data.primerEGB}
          onChange={(checked: boolean) => onChange("primerEGB", checked)}
        />
      </div>
      <div>
        {data.primerEGB && (
          <>
            <Label>Edad 1ro EGB</Label>
            <Input
              type="number"
              value={data.edad1roEGB}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("edad1roEGB", e.target.value)
              }
              placeholder="Edad"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Perdida de Anio"
          checked={data.perdidaAnio}
          onChange={(checked: boolean) => onChange("perdidaAnio", checked)}
        />
      </div>
      <div>
        {data.perdidaAnio && (
          <>
            <Label>Grado Causa Perdida de Anio</Label>
            <Input
              value={data.gradoCausaPerdidaAnio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("gradoCausaPerdidaAnio", e.target.value)
              }
              placeholder="Ingrese Grado Causa Perdida de Anio"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Desercion Escolar"
          checked={data.desercionEscolar}
          onChange={(checked: boolean) => onChange("desercionEscolar", checked)}
        />
      </div>
      <div>
        {data.desercionEscolar && (
          <>
            <Label>Grado Causa Desercion Escolar</Label>
            <Input
              value={data.gradoCausaDesercionEscolar}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("gradoCausaDesercionEscolar", e.target.value)
              }
              placeholder="Ingrese Grado Causa Desercion Escolar"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Cambio de Institucion"
          checked={data.cambioInstitucion}
          onChange={(checked: boolean) =>
            onChange("cambioInstitucion", checked)
          }
        />
      </div>
      <div>
        {data.cambioInstitucion && (
          <>
            <Label>Grado Causa Cambio de Institucion</Label>
            <Input
              value={data.gradoCausaCambioInstitucion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("gradoCausaCambioInstitucion", e.target.value)
              }
              placeholder="Ingrese Grado Causa Cambio de Institucion"
            />
          </>
        )}
      </div>
      <div className="flex items-center">
        <Switch
          label="Problemas de Aprendizaje"
          checked={data.problemasAprendizaje}
          onChange={(checked: boolean) =>
            onChange("problemasAprendizaje", checked)
          }
        />
      </div>
      <div>
        {data.problemasAprendizaje && (
          <>
            <Label>Especifique los problemas de aprendizaje</Label>
            <Input
              value={data.problemasAprendizajeEspecificar}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange("problemasAprendizajeEspecificar", e.target.value)
              }
              placeholder="Ingrese Problemas de Aprendizaje Especificar"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DatosDesarrolloForm;
