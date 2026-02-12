import React, { useState } from "react";

import { Calculator, Loader2, AlertCircle } from "lucide-react";

import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DatePicker from "../../components/form/date-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import WaisProfileChart from "./WaisProfileChart";

const getToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

type DatosGeneralesType = {
  nombresExaminador: string;
  nombresPaciente: string;
  fechaTest: Date;
  fechaNacimiento: Date | null;
  edadCronologica: string;
};

type SubtestsType = {
  [key: string]: number;
};

export default function Wais() {
  const [datosGenerales, setDatosGenerales] = useState<DatosGeneralesType>({
    nombresExaminador: "",
    nombresPaciente: "",
    fechaTest: getToday(),
    fechaNacimiento: null,
    edadCronologica: "",
  });

  const [subtests, setSubtests] = useState<SubtestsType>({
    C: 0,
    S: 0,
    D: 0,
    M: 0,
    V: 0,
    A: 0,
    BS: 0,
    PV: 0,
    I: 0,
    CN: 0,
  });

  const [edadMeses, setEdadMeses] = useState<number>(0);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const [mostrarPdf, setMostrarPdf] = useState(false);

  const validarFormulario = (): boolean => {
    const erroresTmp: string[] = [];

    if (!datosGenerales.nombresExaminador.trim()) {
      erroresTmp.push("El nombre del examinador es obligatorio.");
    }

    if (!datosGenerales.nombresPaciente.trim()) {
      erroresTmp.push("El nombre del paciente es obligatorio.");
    }

    if (!datosGenerales.fechaNacimiento) {
      erroresTmp.push("La fecha de nacimiento es obligatoria.");
    }

    if (!datosGenerales.edadCronologica || edadMeses <= 0) {
      erroresTmp.push("Debe calcular la edad cronológica antes de continuar.");
    }

    setErrores(erroresTmp);
    return erroresTmp.length === 0;
  };

  const calcularEdad = () => {
    setErrores([]);

    if (!datosGenerales.fechaNacimiento || !datosGenerales.fechaTest) {
      setErrores(["Por favor, complete todos los nombres y fechas."]);
      return;
    }

    const fechaTest = new Date(datosGenerales.fechaTest);
    const fechaNacimiento = new Date(datosGenerales.fechaNacimiento);

    fechaTest.setHours(0, 0, 0, 0);
    fechaNacimiento.setHours(0, 0, 0, 0);

    if (fechaNacimiento >= fechaTest) {
      setErrores([
        "La fecha de nacimiento no puede ser igual o posterior a la fecha del test.",
      ]);
      return;
    }

    let años = fechaTest.getFullYear() - fechaNacimiento.getFullYear();
    let meses = fechaTest.getMonth() - fechaNacimiento.getMonth();
    let dias = fechaTest.getDate() - fechaNacimiento.getDate();

    if (dias < 0) {
      meses--;
      const ultimoMes = new Date(
        fechaTest.getFullYear(),
        fechaTest.getMonth(),
        0
      );
      dias += ultimoMes.getDate();
    }

    if (meses < 0) {
      años--;
      meses += 12;
    }

    const totalMeses = años * 12 + meses;

    setEdadMeses(totalMeses);

    setDatosGenerales((prev) => ({
      ...prev,
      edadCronologica: `${años} años, ${meses} meses, ${dias} días`,
    }));
  };

  const handleSubtestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubtests((prev) => ({
      ...prev,
      [name]: Number(value) || 0,
    }));
  };

  const calcularResultados = async () => {
    setResultado(null);

    if (!validarFormulario()) return;

    const rangos: Record<string, [number, number]> = {
      C: [0, 66],
      S: [0, 36],
      D: [0, 48],
      M: [0, 26],
      V: [0, 57],
      A: [0, 22],
      BS: [0, 60],
      PV: [0, 26],
      I: [0, 26],
      CN: [0, 135],
    };

    const subtestsFiltrados: SubtestsType = {};
    let algunDato = false;

    for (const key of Object.keys(subtests)) {
      const val = subtests[key];
      if (val !== 0) {
        const [min, max] = rangos[key];
        if (val < min || val > max) {
          setErrores([
            `Error en ${key}: El valor debe estar entre ${min} y ${max}.`,
          ]);
          return;
        }
        subtestsFiltrados[key] = val;
        algunDato = true;
      }
    }

    if (!algunDato) {
      setErrores(["Ingrese al menos un puntaje directo para calcular."]);
      return;
    }

    setLoading(true);
    setErrores([]);

    try {
      const payload = {
        edad_cronologica: edadMeses,
        subtests_crudos: subtestsFiltrados,
      };

      const response = await fetch(
        "http://localhost:8000/api/wais/calcular-crudo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error del servidor");
      }

      const data = await response.json();
      setResultado(data);
      setMostrarPdf(true);
    } catch {
      setErrores([
        "No se pudo conectar con el backend. Verifique que el servidor esté encendido.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    if (!resultado) return;

    const doc = new jsPDF();

    const rojoUC: [number, number, number] = [135, 35, 35];
    const doradoUC: [number, number, number] = [201, 164, 76];
    const grisTexto: [number, number, number] = [60, 60, 60];
    doc.setFillColor(...rojoUC);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("UDIPSAI", 20, 18);

    doc.setFontSize(11);
    doc.text("Universidad Católica de Cuenca", 20, 25);

    doc.setFontSize(14);
    doc.text("INFORME PSICOMÉTRICO WAIS-IV", 190, 22, { align: "right" });

    doc.setDrawColor(...doradoUC);
    doc.setLineWidth(1.5);
    doc.line(0, 35, 210, 35);

    doc.setTextColor(...grisTexto);
    doc.setFontSize(10);

    let yDatos = 45;

    doc.text(`Paciente:`, 20, yDatos);
    doc.setFont("helvetica", "bold");
    doc.text(datosGenerales.nombresPaciente, 55, yDatos);
    doc.setFont("helvetica", "normal");

    yDatos += 6;
    doc.text(`Evaluador:`, 20, yDatos);
    doc.setFont("helvetica", "bold");
    doc.text(datosGenerales.nombresExaminador, 55, yDatos);
    doc.setFont("helvetica", "normal");

    yDatos += 6;
    doc.text(`Edad cronológica:`, 20, yDatos);
    doc.setFont("helvetica", "bold");
    doc.text(datosGenerales.edadCronologica, 55, yDatos);
    doc.setFont("helvetica", "normal");

    yDatos += 6;
    doc.text(`Fecha de evaluación:`, 20, yDatos);
    doc.setFont("helvetica", "bold");
    doc.text(datosGenerales.fechaTest.toLocaleDateString(), 55, yDatos);
    doc.setFont("helvetica", "normal");

    doc.setDrawColor(200);
    doc.line(20, yDatos + 4, 190, yDatos + 4);

    const body = [
      [
        "Comprensión Verbal (ICV)",
        resultado.resultados.icv.indice,
        resultado.resultados.icv.percentile,
        resultado.resultados.icv.ic95,
      ],
      [
        "Razonamiento Perceptual (IRP)",
        resultado.resultados.irp.indice,
        resultado.resultados.irp.percentile,
        resultado.resultados.irp.ic95,
      ],
      [
        "Memoria de Trabajo (IMT)",
        resultado.resultados.imt.indice,
        resultado.resultados.imt.percentile,
        resultado.resultados.imt.ic95,
      ],
      [
        "Velocidad de Procesamiento (IVP)",
        resultado.resultados.ivp.indice,
        resultado.resultados.ivp.percentile,
        resultado.resultados.ivp.ic95,
      ],
      [
        "CI TOTAL (CIT)",
        resultado.resultados.cit.indice,
        resultado.resultados.cit.percentile,
        resultado.resultados.cit.ic95,
      ],
    ];

    autoTable(doc, {
      startY: yDatos + 10,
      head: [["Índice Compuesto", "Puntuación", "Percentil", "IC 95%"]],
      body,
      styles: {
        fontSize: 10,
        textColor: grisTexto,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: rojoUC,
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
      },
    });
    let finalY = (doc as any).lastAutoTable.finalY + 12;
    /* ================== INTERPRETACIÓN CLÍNICA ================== 
        doc.setFontSize(13);
        doc.setTextColor(...rojoUC);
        doc.text('Interpretación Clínica', 20, finalY);

        doc.setFontSize(11);
        doc.setTextColor(...grisTexto);

        const cit = resultado.resultados.cit.indice;
        const rango =
            cit >= 130 ? 'Muy Superior' :
                cit >= 120 ? 'Superior' :
                    cit >= 110 ? 'Promedio Alto' :
                        cit >= 90 ? 'Promedio' :
                            cit >= 80 ? 'Promedio Bajo' :
                                cit >= 70 ? 'Limítrofe' :
                                    'Discapacidad Intelectual';

        const textoInterpretacion =
            `El rendimiento intelectual global del evaluado, expresado mediante el Cociente Intelectual Total (CIT = ${cit}), ` +
            `se ubica dentro del rango ${rango}. Este resultado debe ser interpretado considerando el contexto clínico, ` +
            `educativo y sociocultural del evaluado, así como la consistencia entre los distintos índices evaluados.`;

        doc.text(textoInterpretacion, 20, finalY + 8, {
            maxWidth: 170,
            align: 'justify'
        });
        */
    /* ================== PERFIL DE PUNTUACIONES COMPUESTAS ================== */
    finalY += 10;

    doc.setFontSize(13);
    doc.setTextColor(...rojoUC);
    doc.text("Perfil de Puntuaciones Compuestas", 20, finalY);

    finalY += 8;

    const indices = [
      { label: "ICV", value: resultado.resultados.icv.indice },
      { label: "IRP", value: resultado.resultados.irp.indice },
      { label: "IMT", value: resultado.resultados.imt.indice },
      { label: "IVP", value: resultado.resultados.ivp.indice },
      { label: "CIT", value: resultado.resultados.cit.indice },
    ];

    const chartX = 30;
    const chartY = finalY + 10;
    const chartWidth = 150;
    const chartHeight = 60;

    doc.setDrawColor(0);
    doc.rect(chartX, chartY, chartWidth, chartHeight);

    doc.setFontSize(8);
    doc.setTextColor(120);

    for (let i = 40; i <= 160; i += 10) {
      const y = chartY + chartHeight - ((i - 40) / 120) * chartHeight;

      doc.setDrawColor(220);
      doc.line(chartX, y, chartX + chartWidth, y);

      if (i % 20 === 0) {
        doc.text(String(i), chartX - 8, y + 2);
      }
    }

    const y100 = chartY + chartHeight - ((100 - 40) / 120) * chartHeight;
    doc.setDrawColor(...doradoUC);
    doc.setLineWidth(1);
    doc.line(chartX, y100, chartX + chartWidth, y100);

    doc.setDrawColor(...rojoUC);
    doc.setFillColor(...rojoUC);
    doc.setLineWidth(1);

    indices.forEach((item, index) => {
      const x = chartX + (index / (indices.length - 1)) * chartWidth;

      const y = chartY + chartHeight - ((item.value - 40) / 120) * chartHeight;

      doc.circle(x, y, 1.5, "F");

      if (index > 0) {
        const prev = indices[index - 1];
        const prevX =
          chartX + ((index - 1) / (indices.length - 1)) * chartWidth;
        const prevY =
          chartY + chartHeight - ((prev.value - 40) / 120) * chartHeight;

        doc.line(prevX, prevY, x, y);
      }

      doc.setFontSize(9);
      doc.text(item.label, x - 5, chartY + chartHeight + 6);
    });

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("UDIPSAI – Universidad Católica de Cuenca", 105, 290, {
      align: "center",
    });

    doc.save("Informe_WAIS_IV_UDIPSAI.pdf");
  };

  return (
    <>
      <PageMeta
        title="Evaluación WAIS-IV | UDIPSAI"
        description="Evaluación de inteligencia WAIS-IV"
      />
      <PageBreadcrumb pageTitle="Evaluación WAIS-IV" />

      {errores.length > 0 && (
        <ComponentCard title="Errores">
          <div className="space-y-2">
            {errores.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2 text-red-500">
                <AlertCircle size={18} />
                <span>{err}</span>
              </div>
            ))}
          </div>
        </ComponentCard>
      )}

      <br />

      <ComponentCard title="Datos Generales">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <Label>Examinador</Label>
            <Input
              placeholder="Nombre del examinador"
              value={datosGenerales.nombresExaminador}
              onChange={(e) =>
                setDatosGenerales((p) => ({
                  ...p,
                  nombresExaminador: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label>Paciente</Label>
            <Input
              placeholder="Nombre del paciente"
              value={datosGenerales.nombresPaciente}
              onChange={(e) =>
                setDatosGenerales((p) => ({
                  ...p,
                  nombresPaciente: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Label>Fecha del Test</Label>
            <DatePicker
              id="fecha-test"
              placeholder="Fecha del test"
              defaultDate={getToday()}
              onChange={(dates: Date[]) =>
                setDatosGenerales((p) => ({ ...p, fechaTest: dates[0] }))
              }
            />
          </div>

          <div>
            <Label>Fecha de Nacimiento</Label>
            <DatePicker
              id="fecha-nacimiento"
              placeholder="Fecha de nacimiento"
              onChange={(dates: Date[]) =>
                setDatosGenerales((p) => ({
                  ...p,
                  fechaNacimiento: dates[0] || null,
                  edadCronologica: "",
                }))
              }
            />
          </div>

          <div>
            <Label>Edad cronológica</Label>
            <Input
              placeholder="Años, meses y días"
              value={datosGenerales.edadCronologica}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={calcularEdad}>Calcular Edad</Button>
        </div>
      </ComponentCard>

      <br />
      <ComponentCard title="Subtests – Puntuación Directa">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.entries(subtests).map(([id, value]) => (
            <div key={id}>
              <Label>{id}</Label>
              <Input
                type="number"
                name={id}
                value={value}
                onChange={handleSubtestChange}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={calcularResultados} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Calculator />}
            <span className="ml-2">Calcular Resultados</span>
          </Button>
        </div>
      </ComponentCard>
      <br />
      {resultado && (
        <ComponentCard title="Resultados">
          <div className="flex justify-end mb-4">
            {mostrarPdf && (
              <Button onClick={generarPDF}>Descargar Informe PDF</Button>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3">
              Conversión de puntuaciones escalares a puntuaciones compuestas
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-white/[0.03]">
                  <tr>
                    {[
                      "Índice",
                      "Suma",
                      "Puntuación compuesta",
                      "Percentil",
                      "IC 90%",
                    ].map((head) => (
                      <th
                        key={head}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
                  {[
                    {
                      id: "ICV",
                      label: "ICV",
                      sum: resultado.sumas_escalas.ICV,
                      data: resultado.resultados.icv,
                    },
                    {
                      id: "IRP",
                      label: "IRP",
                      sum: resultado.sumas_escalas.IRP,
                      data: resultado.resultados.irp,
                    },
                    {
                      id: "IMT",
                      label: "IMT",
                      sum: resultado.sumas_escalas.IMT,
                      data: resultado.resultados.imt,
                    },
                    {
                      id: "IVP",
                      label: "IVP",
                      sum: resultado.sumas_escalas.IVP,
                      data: resultado.resultados.ivp,
                    },
                    {
                      id: "CIT",
                      label: "CIT",
                      sum: resultado.sumas_escalas.CIT,
                      data: resultado.resultados.cit,
                    },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.sum}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.data.indice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.data.percentile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {row.data.ic90}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-transparent">
            <WaisProfileChart
              icv={resultado.resultados.icv.indice}
              irp={resultado.resultados.irp.indice}
              imt={resultado.resultados.imt.indice}
              ivp={resultado.resultados.ivp.indice}
              cit={resultado.resultados.cit.indice}
            />
          </div>
        </ComponentCard>
      )}
    </>
  );
}
