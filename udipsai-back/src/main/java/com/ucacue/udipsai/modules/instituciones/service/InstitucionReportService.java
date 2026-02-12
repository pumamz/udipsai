package com.ucacue.udipsai.modules.instituciones.service;

import com.ucacue.udipsai.common.report.ExcelGenerator;
import com.ucacue.udipsai.modules.instituciones.domain.InstitucionEducativa;
import com.ucacue.udipsai.modules.instituciones.dto.InstitucionEducativaCriteriaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
public class InstitucionReportService {

    @Autowired
    private InstitucionEducativaService institucionService;

    public ByteArrayInputStream exportarExcel(InstitucionEducativaCriteriaDTO criteria) throws IOException {
        List<InstitucionEducativa> instituciones = institucionService.listarInstitucionesSinPaginacion(criteria);

        String[] headers = {"ID", "Nombre", "Dirección", "Tipo", "Activo"};

        return ExcelGenerator.generateExcel("Instituciones", headers, instituciones, (row, i) -> {
            row.createCell(0).setCellValue(i.getId());
            row.createCell(1).setCellValue(i.getNombre());
            row.createCell(2).setCellValue(i.getDireccion());
            row.createCell(3).setCellValue(i.getTipo());
            row.createCell(4).setCellValue(i.getActivo() ? "Sí" : "No");
        });
    }
}
