import React from "react";
import Label from "../../../Label";
import Switch from "../../../switch/Switch";
import Select from "../../../Select";
import Input from "../../../input/InputField";

interface HistoriaAuditivaFormProps {
  data: {
    otalgia: boolean;
    otalgiaUnilateral: boolean;
    otalgiaOidoDerecho: boolean;
    otalgiaOidoIzquierdo: boolean;
    otalgiaBilateral: boolean;
    permanenciaOtalgiaContinua: boolean;
    permanenciaOtalgiaIntermitente: boolean;
    gradoPermanenciaOtalgia: string;
    asociadaOtalgiaInfeccionRespiratoriaAlta: boolean;
    infeccionRespiratoriaPunzante: boolean;
    infeccionRespiratoriaPulsatil: boolean;
    infeccionRespiratoriaProgresivo: boolean;
    infeccionRespiratoriaOpresivo: boolean;
    pruriginoso: boolean;
    aumentaMasticar: boolean;
    disminuyeConCalorLocal: boolean;
    aumentaConCalorLocal: boolean;
    otorrea: boolean;
    otorreaUnilateral: boolean;
    otorreaOidoDerecho: boolean;
    otorreaOidoIzquierdo: boolean;
    otorreaBilateral: boolean;
    permanenciaOtorreaContinua: boolean;
    permanenciaOtorreaIntermitente: boolean;
    gradoPermanenciaOtorrea: string;
    aspectoClaroOtorrea: boolean;
    aspectoSerosoOtorrea: boolean;
    aspectoMucosoOtorrea: boolean;
    aspectoMucopurulentoOtorrea: boolean;
    aspectoPurulentoOtorrea: boolean;
    aspectoSanguinolentoOtorrea: boolean;
    asosiadaOtorreaInfeccionRespiratoriaAlta: boolean;
    asosiadaotorreaInfeccionAgudaOido: boolean;
    presentoOtalgia: boolean;
    presentoOtalgiaBilateral: boolean;
    presentoOtalgiaOidoDerecho: boolean;
    presentoOtalgiaOidoIzquierdo: boolean;
    presentoSensacionOidoTapado: boolean;
    presentoSensacionOidoTapadoBilateral: boolean;
    presentoSensacionOidoTapadoOidoDerecho: boolean;
    presentoSensacionOidoTapadoOidoIzquierdo: boolean;
    presentoAutofonia: boolean;
    presentoAutofoniaBilateral: boolean;
    presentoAutofoniaOidoDerecho: boolean;
    presentoAutofoniaOidoIzquierdo: boolean;
    presentoOtorrea: boolean;
    presentoOtorreaBilateral: boolean;
    presentoOtorreaOidoDerecho: boolean;
    presentoOtorreaOidoIzquierdo: boolean;
    aumentaVolumenTV: boolean;
    sensacionPercibirTinnitus: boolean;
    expuestoRuidosFuertes: boolean;
    dificultadOidVozBaja: boolean;
    hablaMasFuerteOMasDespacio: boolean;
    utilizaAyudaAuditiva: boolean;
    especficarAyudaAuditiva: string;
    percibeSonidoIgualAmbosOidos: boolean;
    conQueOidoEscuchaMejor: string;
    haceCuantoTiempoPresentaSintomasAuditivos: string;
  };
  onChange: (field: string, value: any) => void;
}

const HistoriaAuditivaForm: React.FC<HistoriaAuditivaFormProps> = ({
  data,
  onChange,
}) => {
  const optionsGradoPermanencia = [
    { value: "MEDIA", label: "Media" },
    { value: "AGUDA", label: "Aguda" },
    { value: "CRÓNICA", label: "Crónica" },
  ];

  const optionsOidoMejor = [
    { value: "AMBOS", label: "Ambos" },
    { value: "DERECHO", label: "Derecho" },
    { value: "IZQUIERDO", label: "Izquierdo" },
  ];

  const optionsTiempoSintomas = [
    { value: "DÍAS", label: "Días" },
    { value: "SEMANAS", label: "Semanas" },
    { value: "MESES", label: "Meses" },
    { value: "AÑOS", label: "Años" },
  ];

  return (
    <div className="space-y-6">
      {/* Otalgia Section */}
      <div>
        <div className="flex items-center mb-6 gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Otalgia (Dolor de oído)
          </h4>
          <Switch
            label=""
            checked={data.otalgia}
            onChange={(val: boolean) => onChange("otalgia", val)}
          />
        </div>
        {data.otalgia && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-xl dark:bg-gray-800/50 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Switch
                    label="Unilateral"
                    checked={data.otalgiaUnilateral}
                    onChange={(val: boolean) =>
                      onChange("otalgiaUnilateral", val)
                    }
                  />
                  <Switch
                    label="Bilateral"
                    checked={data.otalgiaBilateral}
                    onChange={(val: boolean) =>
                      onChange("otalgiaBilateral", val)
                    }
                  />
                  <Switch
                    label="Oido Derecho"
                    checked={data.otalgiaOidoDerecho}
                    onChange={(val: boolean) =>
                      onChange("otalgiaOidoDerecho", val)
                    }
                  />
                  <Switch
                    label="Oido Izquierdo"
                    checked={data.otalgiaOidoIzquierdo}
                    onChange={(val: boolean) =>
                      onChange("otalgiaOidoIzquierdo", val)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="gradoPermanenciaOtalgia">
                    Grado Permanencia
                  </Label>
                  <Select
                    options={optionsGradoPermanencia}
                    value={data.gradoPermanenciaOtalgia}
                    onChange={(val: string) =>
                      onChange("gradoPermanenciaOtalgia", val)
                    }
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <Switch
                    label="Continua"
                    checked={data.permanenciaOtalgiaContinua}
                    onChange={(val: boolean) =>
                      onChange("permanenciaOtalgiaContinua", val)
                    }
                  />
                  <Switch
                    label="Intermitente"
                    checked={data.permanenciaOtalgiaIntermitente}
                    onChange={(val: boolean) =>
                      onChange("permanenciaOtalgiaIntermitente", val)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Switch
                label="Asociada IRA"
                checked={data.asociadaOtalgiaInfeccionRespiratoriaAlta}
                onChange={(val: boolean) =>
                  onChange("asociadaOtalgiaInfeccionRespiratoriaAlta", val)
                }
              />
              <Switch
                label="Punzante"
                checked={data.infeccionRespiratoriaPunzante}
                onChange={(val: boolean) =>
                  onChange("infeccionRespiratoriaPunzante", val)
                }
              />
              <Switch
                label="Pulsátil"
                checked={data.infeccionRespiratoriaPulsatil}
                onChange={(val: boolean) =>
                  onChange("infeccionRespiratoriaPulsatil", val)
                }
              />
              <Switch
                label="Progresivo"
                checked={data.infeccionRespiratoriaProgresivo}
                onChange={(val: boolean) =>
                  onChange("infeccionRespiratoriaProgresivo", val)
                }
              />
              <Switch
                label="Opresivo"
                checked={data.infeccionRespiratoriaOpresivo}
                onChange={(val: boolean) =>
                  onChange("infeccionRespiratoriaOpresivo", val)
                }
              />
              <Switch
                label="Pruriginoso"
                checked={data.pruriginoso}
                onChange={(val: boolean) => onChange("pruriginoso", val)}
              />
              <Switch
                label="Aumenta al masticar"
                checked={data.aumentaMasticar}
                onChange={(val: boolean) => onChange("aumentaMasticar", val)}
              />
              <Switch
                label="Disminuye con calor"
                checked={data.disminuyeConCalorLocal}
                onChange={(val: boolean) =>
                  onChange("disminuyeConCalorLocal", val)
                }
              />
              <Switch
                label="Aumenta con calor"
                checked={data.aumentaConCalorLocal}
                onChange={(val: boolean) =>
                  onChange("aumentaConCalorLocal", val)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Otorrea Section */}
      <div>
        <div className="flex items-center mb-6 gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Otorrea (Supuración de oído)
          </h4>
          <Switch
            label=""
            checked={data.otorrea}
            onChange={(val: boolean) => onChange("otorrea", val)}
          />
        </div>
        {data.otorrea && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-xl dark:bg-gray-800/50 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Switch
                    label="Unilateral"
                    checked={data.otorreaUnilateral}
                    onChange={(val: boolean) =>
                      onChange("otorreaUnilateral", val)
                    }
                  />
                  <Switch
                    label="Bilateral"
                    checked={data.otorreaBilateral}
                    onChange={(val: boolean) =>
                      onChange("otorreaBilateral", val)
                    }
                  />
                  <Switch
                    label="Oido Derecho"
                    checked={data.otorreaOidoDerecho}
                    onChange={(val: boolean) =>
                      onChange("otorreaOidoDerecho", val)
                    }
                  />
                  <Switch
                    label="Oido Izquierdo"
                    checked={data.otorreaOidoIzquierdo}
                    onChange={(val: boolean) =>
                      onChange("otorreaOidoIzquierdo", val)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="gradoPermanenciaOtorrea">
                    Grado Permanencia
                  </Label>
                  <Select
                    options={optionsGradoPermanencia}
                    value={data.gradoPermanenciaOtorrea}
                    onChange={(val: string) =>
                      onChange("gradoPermanenciaOtorrea", val)
                    }
                  />
                </div>
                <div className="flex flex-col justify-center space-y-2">
                  <Switch
                    label="Continua"
                    checked={data.permanenciaOtorreaContinua}
                    onChange={(val: boolean) =>
                      onChange("permanenciaOtorreaContinua", val)
                    }
                  />
                  <Switch
                    label="Intermitente"
                    checked={data.permanenciaOtorreaIntermitente}
                    onChange={(val: boolean) =>
                      onChange("permanenciaOtorreaIntermitente", val)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Switch
                label="Aspecto Claro"
                checked={data.aspectoClaroOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoClaroOtorrea", val)
                }
              />
              <Switch
                label="Aspecto Seroso"
                checked={data.aspectoSerosoOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoSerosoOtorrea", val)
                }
              />
              <Switch
                label="Aspecto Mucoso"
                checked={data.aspectoMucosoOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoMucosoOtorrea", val)
                }
              />
              <Switch
                label="Aspecto Mucopurulento"
                checked={data.aspectoMucopurulentoOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoMucopurulentoOtorrea", val)
                }
              />
              <Switch
                label="Aspecto Purulento"
                checked={data.aspectoPurulentoOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoPurulentoOtorrea", val)
                }
              />
              <Switch
                label="Aspecto Sanguinolento"
                checked={data.aspectoSanguinolentoOtorrea}
                onChange={(val: boolean) =>
                  onChange("aspectoSanguinolentoOtorrea", val)
                }
              />
              <Switch
                label="Asociada IRA"
                checked={data.asosiadaOtorreaInfeccionRespiratoriaAlta}
                onChange={(val: boolean) =>
                  onChange("asosiadaOtorreaInfeccionRespiratoriaAlta", val)
                }
              />
              <Switch
                label="Infección Aguda Oído"
                checked={data.asosiadaotorreaInfeccionAgudaOido}
                onChange={(val: boolean) =>
                  onChange("asosiadaotorreaInfeccionAgudaOido", val)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Otros Síntomas Section */}
      <div>
        <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Otros Síntomas y Hábitos
        </h4>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-gray-50/50 p-4 rounded-xl dark:bg-gray-800/50 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Switch
                  label="Presentó Otalgia"
                  checked={data.presentoOtalgia}
                  onChange={(val: boolean) => onChange("presentoOtalgia", val)}
                />
                <Switch
                  label="Otalgia Bilateral"
                  checked={data.presentoOtalgiaBilateral}
                  onChange={(val: boolean) =>
                    onChange("presentoOtalgiaBilateral", val)
                  }
                />
                <Switch
                  label="Oido Tapado"
                  checked={data.presentoSensacionOidoTapado}
                  onChange={(val: boolean) =>
                    onChange("presentoSensacionOidoTapado", val)
                  }
                />
                <Switch
                  label="Autofonía"
                  checked={data.presentoAutofonia}
                  onChange={(val: boolean) =>
                    onChange("presentoAutofonia", val)
                  }
                />
                <Switch
                  label="Aumenta Vol. TV"
                  checked={data.aumentaVolumenTV}
                  onChange={(val: boolean) => onChange("aumentaVolumenTV", val)}
                />
                <Switch
                  label="Tinnitus"
                  checked={data.sensacionPercibirTinnitus}
                  onChange={(val: boolean) =>
                    onChange("sensacionPercibirTinnitus", val)
                  }
                />
                <Switch
                  label="Ruido Fuerte"
                  checked={data.expuestoRuidosFuertes}
                  onChange={(val: boolean) =>
                    onChange("expuestoRuidosFuertes", val)
                  }
                />
                <Switch
                  label="Voz Baja Dif."
                  checked={data.dificultadOidVozBaja}
                  onChange={(val: boolean) =>
                    onChange("dificultadOidVozBaja", val)
                  }
                />
                <Switch
                  label="Habla fuerte/despacio"
                  checked={data.hablaMasFuerteOMasDespacio}
                  onChange={(val: boolean) =>
                    onChange("hablaMasFuerteOMasDespacio", val)
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="conQueOidoEscuchaMejor">
                ¿Qué oído escucha mejor?
              </Label>
              <Select
                options={optionsOidoMejor}
                value={data.conQueOidoEscuchaMejor}
                onChange={(val: string) =>
                  onChange("conQueOidoEscuchaMejor", val)
                }
              />
            </div>
            <div>
              <Label htmlFor="haceCuantoTiempoPresentaSintomasAuditivos">
                Tiempo con síntomas
              </Label>
              <Select
                options={optionsTiempoSintomas}
                value={data.haceCuantoTiempoPresentaSintomasAuditivos}
                onChange={(val: string) =>
                  onChange("haceCuantoTiempoPresentaSintomasAuditivos", val)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex-shrink-0 pb-2">
                <Switch
                  label="Utiliza ayuda auditiva"
                  checked={data.utilizaAyudaAuditiva}
                  onChange={(val: boolean) =>
                    onChange("utilizaAyudaAuditiva", val)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="especficarAyudaAuditiva">
                  Especificar ayuda auditiva
                </Label>
                <Input
                  id="especficarAyudaAuditiva"
                  value={data.especficarAyudaAuditiva}
                  onChange={(e) =>
                    onChange("especficarAyudaAuditiva", e.target.value)
                  }
                  disabled={!data.utilizaAyudaAuditiva}
                  placeholder="Audífonos, implantes, etc."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriaAuditivaForm;
