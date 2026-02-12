import React from "react";
import Input from "../../../input/InputField";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";
import DatePicker from "../../../date-picker";

interface InformacionGeneralProps {
  fecha: string;
  data: {
    fuenteDeInformacion: string;
    motivoConsulta: string;
    parentesco: string;
    personaQueDeriva: string;
    viveCon: string;
    viveConOtro: string;
    vivenJuntos: boolean;
    otrosCompromisos: string;
    tipoFamilia: string;
    hijosOtrosFamiliaresVivenCasa: string;
    genogramaUrl: string;
  };
  onChange: (field: string, value: any) => void;
  onRootChange: (field: string, value: any) => void;
}

const InformacionGeneralForm: React.FC<InformacionGeneralProps> = ({
  fecha,
  data,
  onChange,
  onRootChange,
}) => {
  if (!data) return null;
  const optionsTipoFamilia = [
    { value: "NUCLEAR", label: "Nuclear" },
    { value: "EXTENSA", label: "Extensa" },
    { value: "MONOPARENTAL", label: "Monoparental" },
    { value: "RECONSTITUIDA", label: "Reconstituida" },
    { value: "OTRA", label: "Otra" },
  ];

  const optionsViveCon = [
    { value: "PADRE Y MADRE", label: "Padre y Madre" },
    { value: "MADRE", label: "Madre" },
    { value: "PADRE", label: "Padre" },
    { value: "ABUELOS", label: "Abuelos" },
    { value: "TUTORES", label: "Tutores" },
    { value: "OTRO", label: "Otro" },
  ];

  const handleDateChange = (name: string, dates: Date[]) => {
    if (dates.length > 0) {
      onRootChange(name, dates[0].toISOString());
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <DatePicker
          id="fecha_ficha"
          label="Fecha de la Ficha"
          defaultDate={fecha}
          onChange={(date) => handleDateChange("fecha", date)}
        />
      </div>
      <div>
        <Label>Fuente de Información</Label>
        <Input
          value={data.fuenteDeInformacion}
          onChange={(e) => onChange("fuenteDeInformacion", e.target.value)}
          placeholder="ej: Madre, Padre, Tutor"
        />
      </div>
      <div className="md:col-span-2">
        <Label>Motivo de Consulta</Label>
        <TextArea
          value={data.motivoConsulta}
          onChange={(val) => onChange("motivoConsulta", val)}
          placeholder="Describa el motivo de la consulta..."
        />
      </div>
      <div>
        <Label>Parentesco</Label>
        <Input
          value={data.parentesco}
          onChange={(e) => onChange("parentesco", e.target.value)}
          placeholder="Relación con el estudiante"
        />
      </div>
      <div>
        <Label>Persona que deriva</Label>
        <Input
          value={data.personaQueDeriva}
          onChange={(e) => onChange("personaQueDeriva", e.target.value)}
          placeholder="Nombre o institución"
        />
      </div>
      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>El paciente vive con</Label>
          <Select
            options={optionsViveCon}
            value={data.viveCon}
            onChange={(val: string) => onChange("viveCon", val)}
            placeholder="Seleccione con quien vive el paciente"
          />
        </div>
        {data.viveCon === "OTRO" && (
          <div>
            <Label>Especificar otro (Si aplica)</Label>
            <Input
              value={data.viveConOtro}
              onChange={(e) => onChange("viveConOtro", e.target.value)}
            placeholder="..."
          />
        </div>
      )}
      </div>

      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
        <Switch
          label="¿Los padres viven juntos?"
          checked={data.vivenJuntos}
          onChange={(checked: boolean) => onChange("vivenJuntos", checked)}
        />
      </div>

      <div>
        <Label>Tipo de Familia</Label>
        <Select
          options={optionsTipoFamilia}
          value={data.tipoFamilia}
          onChange={(val: string) => onChange("tipoFamilia", val)}
          placeholder="Seleccione el tipo de familia"
        />
      </div>

      <div className="md:col-span-2">
        <Label>Hijos u otros familiares que viven en casa</Label>
        <TextArea
          value={data.hijosOtrosFamiliaresVivenCasa}
          onChange={(val) => onChange("hijosOtrosFamiliaresVivenCasa", val)}
          placeholder="Liste a las personas que viven en casa..."
        />
      </div>

      <div className="md:col-span-2">
        <Label>Otros compromisos / Observaciones generales</Label>
        <TextArea
          value={data.otrosCompromisos}
          onChange={(val) => onChange("otrosCompromisos", val)}
          placeholder="..."
        />
      </div>
    </div>
  );
};

export default InformacionGeneralForm;
