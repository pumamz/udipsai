package com.ucacue.udipsai.modules.psicologiaeducativa.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.psicologiaeducativa.dto.PsicologiaEducativaDTO;
import com.ucacue.udipsai.modules.psicologiaeducativa.domain.components.*;

@Service
public class PsicologiaEducativaReportService {

    @Autowired
    private PsicologiaEducativaService psicologiaEducativaService;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    public ByteArrayInputStream exportarExcel(Integer pacienteId) throws IOException {
        List<PsicologiaEducativaDTO> fichas;
        if (pacienteId != null) {
            PsicologiaEducativaDTO ficha = psicologiaEducativaService.obtenerFichaPsicologiaEducativaPorPacienteId(pacienteId);
            fichas = ficha != null ? List.of(ficha) : List.of();
        } else {
            fichas = psicologiaEducativaService.listarFichasPsicologiaEducativa();
        }

        String[] headers = {
                // DATOS BÁSICOS
                "ID", "Paciente", "Cédula", "Estado",
                // HISTORIA ESCOLAR
                "ESCOLAR: Asignaturas gustan", "ESCOLAR: Asignaturas disgustan", "ESCOLAR: Relación docentes",
                "ESCOLAR: Causa relación docentes", "ESCOLAR: Gusta ir institución", "ESCOLAR: Causa gusta ir",
                "ESCOLAR: Relación con grupo", "ESCOLAR: Causa relación grupo",
                // DESARROLLO
                "DESARROLLO: CDI", "DESARROLLO: CDI Edad", "DESARROLLO: Inicial 1", "DESARROLLO: Inicial 1 Edad",
                "DESARROLLO: Inicial 2", "DESARROLLO: Inicial 2 Edad", "DESARROLLO: Primer EGB",
                "DESARROLLO: Edad 1ro EGB", "DESARROLLO: Pérdida año", "DESARROLLO: Grado/Causa pérdida",
                "DESARROLLO: Deserción escolar", "DESARROLLO: Grado/Causa deserción", "DESARROLLO: Cambio institución",
                "DESARROLLO: Grado/Causa cambio", "DESARROLLO: Problemas aprendizaje", "DESARROLLO: Especificar problemas",
                // ADAPTACIÓN
                "ADAPTACIÓN: Inclusión educativa", "ADAPTACIÓN: Causa inclusión", "ADAPTACIÓN: Adaptaciones curriculares",
                "ADAPTACIÓN: Grado adaptación", "ADAPTACIÓN: Especificar asignaturas", "ADAPTACIÓN: Evaluación previa",
                "ADAPTACIÓN: Causa evaluación previa", "ADAPTACIÓN: Recibe apoyo", "ADAPTACIÓN: Lugar/Tiempo apoyo",
                // ESTADO GENERAL
                "ESTADO: Aprovechamiento general", "ESTADO: Actividad escolar", "ESTADO: Observaciones"
        };

        return ExcelGenerator.generateExcel("Fichas Psicología Educativa", headers, fichas, (row, f) -> {
            int col = 0;
            // DATOS BÁSICOS
            row.createCell(col++).setCellValue(fmt(f.getId()));
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getNombresApellidos() : "N/A");
            row.createCell(col++).setCellValue(f.getPaciente() != null ? f.getPaciente().getCedula() : "N/A");
            row.createCell(col++).setCellValue(f.getActivo() != null && f.getActivo() ? "Activa" : "Inactiva");

            // HISTORIA ESCOLAR
            HistoriaEscolar he = f.getHistoriaEscolar();
            if (he != null) {
                row.createCell(col++).setCellValue(fmt(he.getAsignaturasGustan()));
                row.createCell(col++).setCellValue(fmt(he.getAsignaturasDisgustan()));
                row.createCell(col++).setCellValue(fmt(he.getRelacionDocentes()));
                row.createCell(col++).setCellValue(fmt(he.getCausaRelacionDocentes()));
                row.createCell(col++).setCellValue(fmt(he.getGustaIrInstitucion()));
                row.createCell(col++).setCellValue(fmt(he.getCausaGustaIrInstitucion()));
                row.createCell(col++).setCellValue(fmt(he.getRelacionConGrupo()));
                row.createCell(col++).setCellValue(fmt(he.getCausaRelacionConGrupo()));
            } else {
                col += 8;
            }

            // DESARROLLO
            Desarrollo d = f.getDesarrollo();
            if (d != null) {
                row.createCell(col++).setCellValue(fmt(d.getCdi()));
                row.createCell(col++).setCellValue(fmt(d.getCdiEdad()));
                row.createCell(col++).setCellValue(fmt(d.getInicial1()));
                row.createCell(col++).setCellValue(fmt(d.getInicial1Edad()));
                row.createCell(col++).setCellValue(fmt(d.getInicial2()));
                row.createCell(col++).setCellValue(fmt(d.getInicial2Edad()));
                row.createCell(col++).setCellValue(fmt(d.getPrimerEGB()));
                row.createCell(col++).setCellValue(fmt(d.getEdad1roEGB()));
                row.createCell(col++).setCellValue(fmt(d.getPerdidaAnio()));
                row.createCell(col++).setCellValue(fmt(d.getGradoCausaPerdidaAnio()));
                row.createCell(col++).setCellValue(fmt(d.getDesercionEscolar()));
                row.createCell(col++).setCellValue(fmt(d.getGradoCausaDesercionEscolar()));
                row.createCell(col++).setCellValue(fmt(d.getCambioInstitucion()));
                row.createCell(col++).setCellValue(fmt(d.getGradoCausaCambioInstitucion()));
                row.createCell(col++).setCellValue(fmt(d.getProblemasAprendizaje()));
                row.createCell(col++).setCellValue(fmt(d.getProblemasAprendizajeEspecificar()));
            } else {
                col += 16;
            }

            // ADAPTACIÓN
            Adaptacion a = f.getAdaptacion();
            if (a != null) {
                row.createCell(col++).setCellValue(fmt(a.getInclusionEducativa()));
                row.createCell(col++).setCellValue(fmt(a.getCausaInclusionEducativa()));
                row.createCell(col++).setCellValue(fmt(a.getAdaptacionesCurriculares()));
                row.createCell(col++).setCellValue(fmt(a.getGradoAdaptacion()));
                row.createCell(col++).setCellValue(fmt(a.getEspecifiqueAsignaturas()));
                row.createCell(col++).setCellValue(fmt(a.getEvaluacionPsicologicaUOtrosAnterior()));
                row.createCell(col++).setCellValue(fmt(a.getCausaEvaluacionPsicologicaUOtrosAnterior()));
                row.createCell(col++).setCellValue(fmt(a.getRecibeApoyo()));
                row.createCell(col++).setCellValue(fmt(a.getCausaLugarTiempoRecibeApoyo()));
            } else {
                col += 9;
            }

            // ESTADO GENERAL
            EstadoGeneral eg = f.getEstadoGeneral();
            if (eg != null) {
                row.createCell(col++).setCellValue(fmt(eg.getAprovechamientoGeneral()));
                row.createCell(col++).setCellValue(fmt(eg.getActividadEscolar()));
                row.createCell(col++).setCellValue(fmt(eg.getObservaciones()));
            } else {
                col += 3;
            }
        });
    }

    private String fmt(Object value) {
        if (value == null) return "N/A";
        if (value instanceof Boolean) return (Boolean) value ? "SÍ" : "NO";
        if (value instanceof java.util.Date) return dateFormat.format((java.util.Date) value);
        return value.toString();
    }
}
