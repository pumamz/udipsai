import { useState } from "react";
import api from "../../api/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Search, Printer, FileText, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// Define interface based on Backend DTO
interface ReporteCitaDTO {
    fecha: string;
    hora: string;
    horaFin: string;
    profesional: string;
    especialidad: string;
    estado: string;
}

interface ReporteCitaRespuestaDTO {
    pacienteNombreCompleto: string;
    citas: ReporteCitaDTO[];
}

const ReporteCitas = () => {
    const [cedula, setCedula] = useState("");
    const [reporte, setReporte] = useState<ReporteCitaRespuestaDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [tipoReporte, setTipoReporte] = useState<"SECRETARIA" | "PADRES">("SECRETARIA");
    const [alcance, setAlcance] = useState<"RAPIDO" | "COMPLETO">("RAPIDO");

    const buscarReporte = async () => {
        if (!cedula.trim()) {
            toast.warning("Por favor ingrese un número de cédula");
            return;
        }
        setLoading(true);
        setReporte(null);
        try {
            const response = await api.get<ReporteCitaRespuestaDTO>(
                `/citas/reporte/cedula/${cedula}?tipo=${tipoReporte}&alcance=${alcance}`
            );
            setReporte(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
            toast.error("No se encontró información para la cédula ingresada o hubo un error.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!reporte) return;

        // Formato Media Carta (Half-Letter): 140mm x 216mm (approx 5.5 x 8.5 inches)
        const doc = new jsPDF({ format: [140, 216], unit: 'mm' });

        // Helper to load image
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
        };

        try {
            // Load Logo
            const logo = await loadImage("/images/logo/auth-logo.png");

            // Add Univ Logo (Left side)
            const logoWidth = 35;
            const logoHeight = (logo.height * logoWidth) / logo.width;
            doc.addImage(logo, "PNG", 10, 8, logoWidth, logoHeight);

            // Add 'UDIPSAI' text next to it
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(0, 0, 0); // Black
            // Logo ends at 10+35 = 45. Text starts at 50
            doc.text("UDIPSAI", 50, 20);

            let yPos = 8 + logoHeight + 4;

            // Just move down a bit to separate header from title
            yPos = Math.max(yPos, 28);

            // Institution Name (Restored)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(5); // Reduced from 7
            doc.setTextColor(50, 50, 50); // Dark Gray
            doc.text("UNIDAD DE DIAGNOSTICO, INVESTIGACION", 70, yPos, { align: "center" });
            yPos += 2.5;
            doc.text("PSICOPEDAGOGICA Y APOYO A LA", 70, yPos, { align: "center" });
            yPos += 2.5;
            doc.text("INCLUSION \"UDIPSAI\"", 70, yPos, { align: "center" });

            yPos += 6;

            // Title
            doc.setFontSize(10); // Reduced font
            doc.setTextColor(180, 0, 0); // Red
            doc.text("REPORTE DE HISTORIAL DE CITAS", 70, yPos, { align: "center" });
            // Underline title
            doc.setDrawColor(220, 220, 220); // Light gray
            doc.line(40, yPos + 1.5, 100, yPos + 1.5); // Centered on 70 (width 60)

            yPos += 6;

            // Patient Info Card
            doc.setFillColor(249, 250, 251); // Gray-50
            doc.setDrawColor(229, 231, 235); // Gray-200
            // Centered card: width 120mm (10mm margin each side)
            // x = 10
            doc.roundedRect(10, yPos, 120, 28, 2, 2, 'FD');

            yPos += 4;

            // Patient info labels
            doc.setFont("helvetica", "bold");
            doc.setFontSize(6); // Reduced from 7
            doc.setTextColor(107, 114, 128); // Gray-500
            doc.text("PACIENTE", 15, yPos);
            doc.text("CÉDULA", 95, yPos);

            yPos += 4;

            // Patient info values
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8); // Reduced from 9
            doc.setTextColor(17, 24, 39); // Gray-900
            doc.text(reporte.pacienteNombreCompleto.toUpperCase(), 15, yPos, { maxWidth: 75 });
            doc.text(cedula, 95, yPos);

            yPos += 12;

            // Divider line
            doc.setDrawColor(229, 231, 235);
            doc.line(15, yPos, 125, yPos);

            yPos += 4;

            // Emission Date
            doc.setFont("helvetica", "normal");
            doc.setFontSize(5); // Reduced from 6
            doc.setTextColor(156, 163, 175); // Gray-400
            doc.text(`FECHA DE EMISIÓN: ${new Date().toLocaleString()}`, 125, yPos, { align: "right" });

            // Table
            let tableColumn = ["FECHA", "HORA", "PROFESIONAL", "ÁREA"];
            if (tipoReporte === "SECRETARIA") {
                tableColumn.push("ESTADO");
            }

            const tableRows: any[] = [];

            reporte.citas.forEach((cita) => {
                const citaData = [
                    cita.fecha,
                    `${cita.hora} - ${cita.horaFin || "?"}`,
                    cita.profesional,
                    cita.especialidad,
                ];
                if (tipoReporte === "SECRETARIA") {
                    citaData.push(cita.estado || "PENDIENTE");
                }
                tableRows.push(citaData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: yPos + 8,
                theme: 'grid',
                headStyles: {
                    fillColor: [180, 0, 0], // Red header
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [250, 250, 250]
                },
                columnStyles: {
                    0: { halign: 'center' }, // Fecha
                    1: { halign: 'center' }, // Hora
                    4: { halign: 'center' }  // Estado
                },
                margin: { left: 10, right: 10 }, // 10mm margins
                didDrawPage: (data) => {
                    // Footer
                    doc.setFontSize(5); // Reduced from 6
                    doc.setTextColor(150, 150, 150);
                    // Half letter height 216mm.
                    doc.text(`Generado por Sistema UDIPSAI - ${new Date().getFullYear()}`, 70, 210, { align: "center" });
                    doc.text(`Página ${data.pageNumber}`, 130, 210, { align: "right" });
                }
            });

            doc.save(`Reporte_Citas_${cedula}.pdf`);

        } catch (err) {
            console.error("Error generating PDF", err);
            toast.error("Error al generar el PDF");
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Search Section (Left Column) */}
                <div className="w-full lg:w-1/3 xl:w-1/4 print:hidden sticky top-6">
                    <div className="bg-white shadow rounded-lg p-6 text-center border-t-4 border-red-600">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <FileText className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Generar Reporte</h2>
                        <p className="text-sm text-gray-500 mb-6">Ingrese la cédula para consultar</p>

                        <div className="space-y-4">
                            <div className="text-left bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Tipo de Reporte</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="SECRETARIA"
                                            checked={tipoReporte === "SECRETARIA"}
                                            onChange={() => setTipoReporte("SECRETARIA")}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">Secretaría (Completo)</span>
                                    </label>

                                    {/* Sub-options for Secretary */}
                                    {tipoReporte === "SECRETARIA" && (
                                        <div className="ml-6 flex flex-col gap-1 mt-1 border-l-2 border-red-100 pl-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="alcance"
                                                    value="RAPIDO"
                                                    checked={alcance === "RAPIDO"}
                                                    onChange={() => setAlcance("RAPIDO")}
                                                    className="w-3 h-3 text-red-500 focus:ring-red-400"
                                                />
                                                <span className="text-xs text-gray-600">Últimas 10 Citas (Rápido)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="alcance"
                                                    value="COMPLETO"
                                                    checked={alcance === "COMPLETO"}
                                                    onChange={() => setAlcance("COMPLETO")}
                                                    className="w-3 h-3 text-red-500 focus:ring-red-400"
                                                />
                                                <span className="text-xs text-gray-600">Todo el Historial</span>
                                            </label>
                                        </div>
                                    )}

                                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="PADRES"
                                            checked={tipoReporte === "PADRES"}
                                            onChange={() => setTipoReporte("PADRES")}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">Padres (Solo Pendientes)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-left">
                                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Cédula del Paciente</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={cedula}
                                        onChange={(e) => setCedula(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-gray-50"
                                        placeholder="0102030405"
                                    />
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>

                            <button
                                onClick={buscarReporte}
                                disabled={loading}
                                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-lg shadow transition duration-200 flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                Buscar
                            </button>

                            {reporte && (
                                <button
                                    onClick={handlePrint}
                                    className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg shadow-sm transition duration-200 flex items-center justify-center gap-2 text-sm"
                                >
                                    <Printer className="w-4 h-4" />
                                    Imprimir
                                </button>
                            )}
                        </div>
                        <div className="mt-6 text-[10px] text-gray-400">
                            Sistema UDIPSAI
                        </div>
                    </div>
                </div>

                {/* Report Display Section (Right Column) */}
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    <style>{`
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #printable-section, #printable-section * {
                                visibility: visible;
                            }
                            #printable-section {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                margin: 0;
                                padding: 0;
                                background: white;
                                z-index: 9999;
                                border: none;
                            }
                            /* Tamaño de letra reducido para impresión Media Carta */
                            #printable-section h3 { font-size: 12px !important; }
                            #printable-section h4 { font-size: 14px !important; }
                            #printable-section .text-lg { font-size: 11px !important; } /* Nombre paciente */
                            #printable-section .text-xs { font-size: 9px !important; } /* Etiquetas */
                            #printable-section table th { font-size: 10px !important; padding: 8px 5px !important; }
                            #printable-section table td { font-size: 10px !important; padding: 8px 5px !important; }
                            #printable-section table span { font-size: 6px !important; } /* Estado badge */
                            #printable-section .p-6 { padding: 0.5rem !important; } /* Reduce padding */
                            
                            @page {
                                size: 140mm 216mm; /* Media Carta */
                                margin: 10mm;
                            }
                        }
                    `}</style>
                    {reporte ? (
                        <div id="printable-section" className="bg-white shadow-lg rounded-xl p-10 print:shadow-none print:p-0 print:w-full font-sans min-h-[600px] flex flex-col">
                            {/* Header Logos */}
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <img src="/images/logo/auth-logo.png" alt="Universidad Católica de Cuenca" className="h-12 object-contain" />
                                <h1 className="text-2xl font-bold text-gray-900 tracking-wider">UDIPSAI</h1>
                            </div>

                            <div className="text-center mb-8">
                                <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">UNIDAD DE DIAGNOSTICO, INVESTIGACION PSICOPEDAGOGICA Y</h3>
                                <h3 className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">APOYO A LA INCLUSION "UDIPSAI"</h3>
                                <h4 className="text-red-700 font-bold uppercase mt-4 text-lg tracking-widest border-b border-red-200 inline-block pb-1">Reporte de Historial de Citas</h4>
                            </div>

                            {/* Patient Info Card */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-8 grid grid-cols-2 gap-y-4 gap-x-8 border border-gray-200 print:bg-transparent print:border-none">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Paciente</span>
                                    <span className="text-gray-900 font-bold text-lg uppercase">{reporte.pacienteNombreCompleto}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cédula</span>
                                    <span className="text-gray-900 font-bold text-lg">{cedula}</span>
                                </div>
                                <div className="col-span-2 text-right border-t border-gray-200 pt-3 mt-1">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Fecha de Emisión: {new Date().toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto rounded-lg border border-gray-200 mb-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-white uppercase bg-red-700">
                                        <tr>
                                            <th className="px-6 py-3 font-bold tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 font-bold tracking-wider">Hora</th>
                                            <th className="px-6 py-3 font-bold tracking-wider">Profesional</th>
                                            <th className="px-6 py-3 font-bold tracking-wider">Área</th>
                                            {tipoReporte === "SECRETARIA" && (
                                                <th className="px-6 py-3 font-bold tracking-wider text-center">Estado</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {reporte.citas.length > 0 ? (
                                            reporte.citas.map((cita, index) => (
                                                <tr key={index} className="hover:bg-red-50/30 transition-colors">
                                                    <td className="px-6 py-4 font-semibold text-gray-900">{cita.fecha}</td>
                                                    <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">{cita.hora} - {cita.horaFin || "?"}</td>
                                                    <td className="px-6 py-4 text-gray-700 uppercase font-medium text-xs">{cita.profesional}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-xs">{cita.especialidad}</td>
                                                    {tipoReporte === "SECRETARIA" && (
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${cita.estado === 'FINALIZADA' || cita.estado === 'ASISTIDO' ? 'bg-gray-100 text-gray-800 border-gray-300' :
                                                                'bg-white text-red-700 border-red-200'
                                                                }`}>
                                                                {cita.estado || "PENDIENTE"}
                                                            </span>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={tipoReporte === "SECRETARIA" ? 5 : 4} className="px-6 py-12 text-center text-gray-500 italic bg-gray-50">
                                                    No se encontraron citas registradas para este paciente en el historial que cumplan los criterios.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer for print */}
                            <div className="hidden print:block mt-12 text-center text-xs text-gray-400 border-t pt-4">
                                <p>Generado por Sistema UDIPSAI - {new Date().getFullYear()}</p>
                            </div>

                            {/* Print/Download Actions */}
                            <div className="mt-8 flex justify-end gap-4 print:hidden border-t pt-6">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="flex items-center gap-2 text-red-700 hover:text-red-800 font-bold text-sm transition-colors uppercase tracking-wide"
                                >
                                    <FileText className="w-4 h-4" />
                                    Descargar versión PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Empty State when no report is generated yet
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-gray-400">
                            <FileText className="w-16 h-16 mb-4 opacity-50" />
                            <p className="text-lg font-medium">Ingrese una cédula para ver el reporte</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReporteCitas;
