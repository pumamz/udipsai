import React from "react";
import Label from "../../../Label";
import TextArea from "../../../input/TextArea";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";

interface EvaluacionPensamientoProps {
  data: {
    incoherencia: string;
    bloqueos: string;
    preservacion: string;
    prolijidad: string;
    desgragacion: string;
    estereotipiasEstructuraDelPensamiento: string;
    neologismos: string;
    musitacion: string;
    retardo: boolean;
    aceleracion: boolean;
    fugaDeIdeas: boolean;
    mutismoCursoDelPensamiento: boolean;
    grandeza: boolean;
    suicidio: boolean;
    autocompasion: boolean;
    inferioridad: boolean;
    perdidaDeInteres: boolean;
    indecision: boolean;
    necesidadDeAyuda: boolean;
    fracaso: boolean;
    ruina: boolean;
    autoacusacion: boolean;
    resentimiento: boolean;
    muerte: boolean;
    danio: boolean;
    enfermedad: boolean;
    grave: boolean;
    hipocondrias: boolean;
    nihilistas: boolean;
    noTenerSentimientos: boolean;
    elMundoHaDejadoDeExistir: boolean;
    referencia: boolean;
    extravagantes: boolean;
    fobicas: boolean;
    compulsivas: boolean;
    obsesivas: boolean;
    desconfianzas: boolean;
    desRelacion: boolean;
    perdidaDeControl: boolean;
    serCalumniado: boolean;
    deliriosParanoides: boolean;
    depresivos: boolean;
    misticoReligioso: boolean;
    sexuales: boolean;
    difusos: boolean;
    otrosContenidoDelPensamiento: string;
    capacidadDeAutocritica: boolean;
    heterocritica: boolean;
    proyectosFuturos: boolean;
    concienciaDeLaEnfermedad: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const EvaluacionPensamientoForm: React.FC<EvaluacionPensamientoProps> = ({ data, onChange }) => {
  const optionsNivel = [
    { value: "AUSENTE", label: "Ausente" },
    { value: "LEVE", label: "Leve" },
    { value: "MODERADO", label: "Moderado" },
    { value: "GRAVE", label: "Grave" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Label className="mb-4 text-lg font-bold">Estructura del Pensamiento</Label>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <Label>Incoherencia</Label>
            <Select options={optionsNivel} value={data.incoherencia} onChange={(val) => onChange("incoherencia", val)} />
          </div>
          <div>
            <Label>Bloqueos</Label>
            <Select options={optionsNivel} value={data.bloqueos} onChange={(val) => onChange("bloqueos", val)} />
          </div>
          <div>
            <Label>Preservación</Label>
            <Select options={optionsNivel} value={data.preservacion} onChange={(val) => onChange("preservacion", val)} />
          </div>
          <div>
            <Label>Prolijidad</Label>
            <Select options={optionsNivel} value={data.prolijidad} onChange={(val) => onChange("prolijidad", val)} />
          </div>
          <div>
            <Label>Desgragación</Label>
            <Select options={optionsNivel} value={data.desgragacion} onChange={(val) => onChange("desgragacion", val)} />
          </div>
          <div>
            <Label>Estereotipias</Label>
            <Select options={optionsNivel} value={data.estereotipiasEstructuraDelPensamiento} onChange={(val) => onChange("estereotipiasEstructuraDelPensamiento", val)} />
          </div>
          <div>
            <Label>Neologismos</Label>
            <Select options={optionsNivel} value={data.neologismos} onChange={(val) => onChange("neologismos", val)} />
          </div>
          <div>
            <Label>Musitación</Label>
            <Select options={optionsNivel} value={data.musitacion} onChange={(val) => onChange("musitacion", val)} />
          </div>
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Curso del Pensamiento</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Retardo" checked={data.retardo} onChange={(val) => onChange("retardo", val)} />
          <Switch label="Aceleración" checked={data.aceleracion} onChange={(val) => onChange("aceleracion", val)} />
          <Switch label="Fuga de ideas" checked={data.fugaDeIdeas} onChange={(val) => onChange("fugaDeIdeas", val)} />
          <Switch label="Mutismo" checked={data.mutismoCursoDelPensamiento} onChange={(val) => onChange("mutismoCursoDelPensamiento", val)} />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Contenido del Pensamiento</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Grandeza" checked={data.grandeza} onChange={(val) => onChange("grandeza", val)} />
          <Switch label="Suicidio" checked={data.suicidio} onChange={(val) => onChange("suicidio", val)} />
          <Switch label="Autocompasión" checked={data.autocompasion} onChange={(val) => onChange("autocompasion", val)} />
          <Switch label="Inferioridad" checked={data.inferioridad} onChange={(val) => onChange("inferioridad", val)} />
          <Switch label="Pérdida de interés" checked={data.perdidaDeInteres} onChange={(val) => onChange("perdidaDeInteres", val)} />
          <Switch label="Indecisión" checked={data.indecision} onChange={(val) => onChange("indecision", val)} />
          <Switch label="Necesidad de ayuda" checked={data.necesidadDeAyuda} onChange={(val) => onChange("necesidadDeAyuda", val)} />
          <Switch label="Fracaso" checked={data.fracaso} onChange={(val) => onChange("fracaso", val)} />
          <Switch label="Ruina" checked={data.ruina} onChange={(val) => onChange("ruina", val)} />
          <Switch label="Autoacusación" checked={data.autoacusacion} onChange={(val) => onChange("autoacusacion", val)} />
          <Switch label="Resentimiento" checked={data.resentimiento} onChange={(val) => onChange("resentimiento", val)} />
          <Switch label="Muerte" checked={data.muerte} onChange={(val) => onChange("muerte", val)} />
          <Switch label="Daño" checked={data.danio} onChange={(val) => onChange("danio", val)} />
          <Switch label="Enfermedad" checked={data.enfermedad} onChange={(val) => onChange("enfermedad", val)} />
          <Switch label="Grave" checked={data.grave} onChange={(val) => onChange("grave", val)} />
          <Switch label="Hipocondrías" checked={data.hipocondrias} onChange={(val) => onChange("hipocondrias", val)} />
          <Switch label="Nihilistas" checked={data.nihilistas} onChange={(val) => onChange("nihilistas", val)} />
          <Switch label="No tener sentimientos" checked={data.noTenerSentimientos} onChange={(val) => onChange("noTenerSentimientos", val)} />
          <Switch label="El mundo ha dejado de existir" checked={data.elMundoHaDejadoDeExistir} onChange={(val) => onChange("elMundoHaDejadoDeExistir", val)} />
          <Switch label="Referencia" checked={data.referencia} onChange={(val) => onChange("referencia", val)} />
          <Switch label="Extravagantes" checked={data.extravagantes} onChange={(val) => onChange("extravagantes", val)} />
          <Switch label="Fóbicas" checked={data.fobicas} onChange={(val) => onChange("fobicas", val)} />
          <Switch label="Compulsivas" checked={data.compulsivas} onChange={(val) => onChange("compulsivas", val)} />
          <Switch label="Obsesivas" checked={data.obsesivas} onChange={(val) => onChange("obsesivas", val)} />
          <Switch label="Desconfianzas" checked={data.desconfianzas} onChange={(val) => onChange("desconfianzas", val)} />
          <Switch label="Des-relación" checked={data.desRelacion} onChange={(val) => onChange("desRelacion", val)} />
          <Switch label="Pérdida de control" checked={data.perdidaDeControl} onChange={(val) => onChange("perdidaDeControl", val)} />
          <Switch label="Ser calumniado" checked={data.serCalumniado} onChange={(val) => onChange("serCalumniado", val)} />
          <Switch label="Delirios paranoides" checked={data.deliriosParanoides} onChange={(val) => onChange("deliriosParanoides", val)} />
          <Switch label="Depresivos" checked={data.depresivos} onChange={(val) => onChange("depresivos", val)} />
          <Switch label="Místico religioso" checked={data.misticoReligioso} onChange={(val) => onChange("misticoReligioso", val)} />
          <Switch label="Sexuales" checked={data.sexuales} onChange={(val) => onChange("sexuales", val)} />
          <Switch label="Difusos" checked={data.difusos} onChange={(val) => onChange("difusos", val)} />
        </div>
        <div className="mt-4">
          <Label>Otros Contenido del Pensamiento</Label>
          <TextArea value={data.otrosContenidoDelPensamiento} onChange={(val) => onChange("otrosContenidoDelPensamiento", val)} placeholder="Describa otros contenido del pensamiento" />
        </div>
      </div>

      <div>
        <Label className="mb-4 text-lg font-bold">Otros Aspectos</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Switch label="Capacidad de autocrítica" checked={data.capacidadDeAutocritica} onChange={(val) => onChange("capacidadDeAutocritica", val)} />
          <Switch label="Heterocrítica" checked={data.heterocritica} onChange={(val) => onChange("heterocritica", val)} />
          <Switch label="Proyectos futuros" checked={data.proyectosFuturos} onChange={(val) => onChange("proyectosFuturos", val)} />
          <Switch label="Conciencia de la enfermedad" checked={data.concienciaDeLaEnfermedad} onChange={(val) => onChange("concienciaDeLaEnfermedad", val)} />
        </div>
      </div>
    </div>
  );
};

export default EvaluacionPensamientoForm;
