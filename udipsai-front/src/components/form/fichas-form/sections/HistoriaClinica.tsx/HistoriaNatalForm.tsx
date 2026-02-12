import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface HistoriaNatalProps {
  data: {
    dondeNacio: string;
    ciudadNacimiento: string;
    duracionEmbarazo: string;
    tipoParto: string;
    partoSegunElComienzo: string;
    partoSegunFinalizacion: string;
    lloroAlNacer: boolean;
    pesoAlNacer: string;
    tallaAlNacer: string;
    anoxiaAlNacer: boolean;
    hipoxiaAlNacer: boolean;
    ictericiaAlNacer: boolean;
    cianosisAlNacer: boolean;
    malformacionCongenita: string;
    problemasDeAlimentacion: string;
    complicacionesEnElParto: boolean;
    cualComplicacionParto: string;
    estuvoEnIncubadora: boolean;
    tiempoEnIncubadora: string;
    causaDeIncubadora: string;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaNatalForm: React.FC<HistoriaNatalProps> = ({
  data,
  onChange,
}) => {
  if (!data) return null;
  const optionsDondeNacio = [
    { value: "HOSPITAL", label: "Hospital" },
    { value: "CLINICA", label: "Clínica" },
    { value: "CASA", label: "Casa" },
    { value: "OTRO", label: "Otro" },
  ];

  const optionsDuracionEmbarazo = [
    { value: "PREMATURO", label: "Prematuro" },
    { value: "A_TERMINO", label: "A término" },
    { value: "POST_TERMINO", label: "Post-término" },
  ];

  const optionsTipoParto = [
    { value: "NATURAL", label: "Natural" },
    { value: "CESAREA", label: "Cesárea" },
    { value: "FORCEPS", label: "Fórceps" },
  ];

  const optionsComienzoParto = [
    { value: "ESPONTANEO", label: "Espontáneo" },
    { value: "INDUCIDO", label: "Inducido" },
  ];

  const optionsFinalizacionParto = [
    { value: "EUTOCICO", label: "Eutócico (Normal)" },
    { value: "DISTOCICO", label: "Distócico (Con complicaciones)" },
  ];

  return (
    <div className="space-y-8">
      {/* Lugar y Condiciones de Nacimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div>
          <Label>¿Dónde nació el niño?</Label>
          <Select
            options={optionsDondeNacio}
            value={data.dondeNacio}
            onChange={(val) => onChange("dondeNacio", val)}
          />
        </div>
        <div>
          <Label>Ciudad de Nacimiento</Label>
          <Input
            value={data.ciudadNacimiento}
            onChange={(e) => onChange("ciudadNacimiento", e.target.value)}
            placeholder="ej: Cuenca"
          />
        </div>
        <div>
          <Label>Duración del Embarazo</Label>
          <Select
            options={optionsDuracionEmbarazo}
            value={data.duracionEmbarazo}
            onChange={(val) => onChange("duracionEmbarazo", val)}
          />
        </div>
        <div>
          <Label>Tipo de Parto</Label>
          <Select
            options={optionsTipoParto}
            value={data.tipoParto}
            onChange={(val) => onChange("tipoParto", val)}
          />
        </div>
        <div>
          <Label>Parto según el Comienzo</Label>
          <Select
            options={optionsComienzoParto}
            value={data.partoSegunElComienzo}
            onChange={(val) => onChange("partoSegunElComienzo", val)}
          />
        </div>
        <div>
          <Label>Parto según la Finalización</Label>
          <Select
            options={optionsFinalizacionParto}
            value={data.partoSegunFinalizacion}
            onChange={(val) => onChange("partoSegunFinalizacion", val)}
          />
        </div>
      </div>

      {/* Datos del Recién Nacido */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <div>
          <Label>Peso (gr/kg)</Label>
          <Input
            value={data.pesoAlNacer}
            onChange={(e) => onChange("pesoAlNacer", e.target.value)}
            placeholder="ej: 3200g"
          />
        </div>
        <div>
          <Label>Talla (cm)</Label>
          <Input
            value={data.tallaAlNacer}
            onChange={(e) => onChange("tallaAlNacer", e.target.value)}
            placeholder="ej: 50cm"
          />
        </div>
        <div className="lg:col-span-2 flex items-center justify-around bg-white/50 dark:bg-gray-900/50 p-2 rounded-xl">
          <Switch
            label="¿Lloró al nacer?"
            checked={data.lloroAlNacer}
            onChange={(checked: boolean) => onChange("lloroAlNacer", checked)}
          />
        </div>
      </div>

      {/* Complicaciones al Nacer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
        <Label className="col-span-full font-bold">
          Signos de Alerta / Complicaciones
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <Switch
            label="Anoxia"
            checked={data.anoxiaAlNacer}
            onChange={(v) => onChange("anoxiaAlNacer", v)}
          />
          <Switch
            label="Hipoxia"
            checked={data.hipoxiaAlNacer}
            onChange={(v) => onChange("hipoxiaAlNacer", v)}
          />
          <Switch
            label="Ictericia"
            checked={data.ictericiaAlNacer}
            onChange={(v) => onChange("ictericiaAlNacer", v)}
          />
          <Switch
            label="Cianosis"
            checked={data.cianosisAlNacer}
            onChange={(v) => onChange("cianosisAlNacer", v)}
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label>Malformación Congénita</Label>
            <Input
              value={data.malformacionCongenita}
              onChange={(e) =>
                onChange("malformacionCongenita", e.target.value)
              }
              placeholder="Describa si aplica"
            />
          </div>
          <div>
            <Label>Problemas de Alimentación</Label>
            <Input
              value={data.problemasDeAlimentacion}
              onChange={(e) =>
                onChange("problemasDeAlimentacion", e.target.value)
              }
              placeholder="Describa si aplica"
            />
          </div>
        </div>
      </div>

      {/* Complicaciones y Otros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 space-y-4">
          <Switch
            label="¿Complicaciones en el parto?"
            checked={data.complicacionesEnElParto}
            onChange={(val) => onChange("complicacionesEnElParto", val)}
          />
          {data.complicacionesEnElParto && (
            <Input
              value={data.cualComplicacionParto}
              onChange={(e) =>
                onChange("cualComplicacionParto", e.target.value)
              }
              placeholder="¿Cuál complicación?"
            />
          )}
        </div>

        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 space-y-4">
          <Switch
            label="¿Estuvo en Incubadora?"
            checked={data.estuvoEnIncubadora}
            onChange={(val) => onChange("estuvoEnIncubadora", val)}
          />
          {data.estuvoEnIncubadora && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                value={data.tiempoEnIncubadora}
                onChange={(e) => onChange("tiempoEnIncubadora", e.target.value)}
                placeholder="Tiempo"
              />
              <Input
                value={data.causaDeIncubadora}
                onChange={(e) => onChange("causaDeIncubadora", e.target.value)}
                placeholder="Causa"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriaNatalForm;
