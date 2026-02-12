package com.ucacue.udipsai.modules.pasante.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.common.report.PdfService;
import com.ucacue.udipsai.modules.pasante.dto.PasanteCriteriaDTO;
import com.ucacue.udipsai.modules.pasante.dto.PasanteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PasanteReportService {

    @Autowired
    private PasanteService pasanteService;

    @Autowired
    private PdfService pdfService;

    public ByteArrayInputStream exportarExcel(PasanteCriteriaDTO criteria) throws IOException {
        List<PasanteDTO> pasantes = pasanteService.listarPasantesSinPaginacion(criteria);

        String[] headers = {"Cédula", "Nombres y Apellidos", "Ciudad", "Email", "Inicio Pasantía", "Fin Pasantía", "Sede", "Especialidad", "Tutor"};

        return ExcelGenerator.generateExcel("Pasantes", headers, pasantes, (row, p) -> {
            row.createCell(0).setCellValue(p.getCedula());
            row.createCell(1).setCellValue(p.getNombresApellidos());
            row.createCell(2).setCellValue(p.getCiudad());
            row.createCell(3).setCellValue(p.getEmail());
            row.createCell(4).setCellValue(p.getInicioPasantia() != null ? p.getInicioPasantia().toString() : "");
            row.createCell(5).setCellValue(p.getFinPasantia() != null ? p.getFinPasantia().toString() : "");
            row.createCell(6).setCellValue(p.getSede() != null ? p.getSede().getNombre() : "N/A");
            row.createCell(7).setCellValue(p.getEspecialidad() != null ? p.getEspecialidad().getArea() : "N/A");
            row.createCell(8).setCellValue(p.getEspecialista() != null ? p.getEspecialista().getNombresApellidos() : "N/A");
        });
    }

    public byte[] exportarPdfDetalle(Integer id) throws Exception {
        PasanteDTO pasante = pasanteService.obtenerPasantePorId(id);
        Map<String, Object> data = new HashMap<>();
        data.put("p", pasante);
        
        return pdfService.generatePdfFromHtml("reportes/pasante-detalle", data);
    }
}
