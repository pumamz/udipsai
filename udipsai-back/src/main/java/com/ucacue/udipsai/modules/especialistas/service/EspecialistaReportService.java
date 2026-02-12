package com.ucacue.udipsai.modules.especialistas.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaCriteriaDTO;
import com.ucacue.udipsai.modules.especialistas.dto.EspecialistaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class EspecialistaReportService {

    @Autowired
    private EspecialistaService especialistaService;

    public ByteArrayInputStream exportarExcel(EspecialistaCriteriaDTO criteria) throws IOException {
        List<EspecialistaDTO> especialistas = especialistaService.listarEspecialistasSinPaginacion(criteria);

        String[] headers = {"Cédula", "Nombres y Apellidos", "Especialidad", "Sede", "Activo"};

        return ExcelGenerator.generateExcel("Especialistas", headers, especialistas, (row, e) -> {
            row.createCell(0).setCellValue(e.getCedula());
            row.createCell(1).setCellValue(e.getNombresApellidos());
            row.createCell(2).setCellValue(e.getEspecialidad() != null ? e.getEspecialidad().getArea() : "N/A");
            row.createCell(3).setCellValue(e.getSede() != null ? e.getSede().getNombre() : "N/A");
            row.createCell(4).setCellValue(e.getActivo() ? "Sí" : "No");
        });
    }
}
