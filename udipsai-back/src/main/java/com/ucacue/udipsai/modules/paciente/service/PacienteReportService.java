package com.ucacue.udipsai.modules.paciente.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.common.report.PdfService;
import com.ucacue.udipsai.modules.paciente.dto.PacienteCriteriaDTO;
import com.ucacue.udipsai.modules.paciente.dto.PacienteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PacienteReportService {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private PdfService pdfService;

    public ByteArrayInputStream exportarExcel(PacienteCriteriaDTO criteria) throws IOException {
        List<PacienteDTO> pacientes = pacienteService.listarPacientesSinPaginacion(criteria);

        String[] headers = {"Cédula", "Nombres y Apellidos", "Ciudad", "Fecha Nacimiento", "Edad", "Institución", "Sede", "Activo"};

        return ExcelGenerator.generateExcel("Pacientes", headers, pacientes, (row, p) -> {
            row.createCell(0).setCellValue(p.getCedula());
            row.createCell(1).setCellValue(p.getNombresApellidos());
            row.createCell(2).setCellValue(p.getCiudad());
            row.createCell(3).setCellValue(p.getFechaNacimiento() != null ? p.getFechaNacimiento().toString() : "");
            row.createCell(4).setCellValue(p.getEdad());
            row.createCell(5).setCellValue(p.getInstitucionEducativa() != null ? p.getInstitucionEducativa().getNombre() : "N/A");
            row.createCell(6).setCellValue(p.getSede() != null ? p.getSede().getNombre() : "N/A");
            row.createCell(7).setCellValue(p.getActivo() ? "Sí" : "No");
        });
    }

    public byte[] exportarPdfDetalle(Integer id) throws Exception {
        PacienteDTO paciente = pacienteService.obtenerPacientePorId(id);
        Map<String, Object> data = new HashMap<>();
        data.put("p", paciente);
        
        return pdfService.generatePdfFromHtml("reportes/paciente-detalle", data);
    }
}
